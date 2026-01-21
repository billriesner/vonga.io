"""
Head of Strategy Agent for Vonga OS.
This agent loads strategic context documents and provides strategic guidance.
"""

import os
from typing import List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import BaseTool
from langchain_core.messages import AIMessage, SystemMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from google.oauth2.credentials import Credentials

from agents.shared import AgentState, MemoryLogger, run_agent
from agents.model_config import get_model_name
from tools.drive_tools import get_drive_service, get_docs_service, get_sheets_service, get_drive_tools
from tools.learning_tools import get_learning_tools, load_learned_facts


def load_strategy_context(creds: Credentials) -> str:
    """
    Load the three strategic context documents from Google Drive.
    Returns a formatted string with all context to inject into system prompt.
    """
    required_files = [
        "00_Strategy_Prime",
        "03_Product_Specs", 
        "04_Customer_Data"
    ]
    
    context_parts = []
    drive_service = get_drive_service(creds)
    docs_service = get_docs_service(creds)
    sheets_service = get_sheets_service(creds)
    
    for file_name in required_files:
        try:
            # Search for the file - try multiple variations
            search_queries = [
                f"name='{file_name}'",
                f"name contains '{file_name}'",
                f"fullText contains '{file_name}'"
            ]
            
            file_id = None
            file_type = None
            
            for query in search_queries:
                results = drive_service.files().list(
                    q=query,
                    pageSize=5,
                    fields="files(id, name, mimeType)"
                ).execute()
                
                files = results.get('files', [])
                if files:
                    # Prefer exact match
                    exact_match = [f for f in files if f.get('name') == file_name]
                    if exact_match:
                        file_id = exact_match[0]['id']
                        file_type = exact_match[0].get('mimeType', '')
                        break
                    else:
                        file_id = files[0]['id']
                        file_type = files[0].get('mimeType', '')
                        break
            
            if not file_id:
                context_parts.append(f"\n--- {file_name} ---\n[FILE NOT FOUND - Please ensure this file exists in Google Drive]")
                continue
            
            # Read content based on file type
            content = ""
            if 'document' in file_type:
                # Google Doc
                doc = docs_service.documents().get(documentId=file_id).execute()
                title = doc.get('title', file_name)
                body_content = doc.get('body', {}).get('content', [])
                
                # Extract text from document elements
                for element in body_content:
                    if 'paragraph' in element:
                        para = element['paragraph']
                        for elem in para.get('elements', []):
                            if 'textRun' in elem:
                                content += elem['textRun'].get('content', '')
                    elif 'table' in element:
                        # Handle tables
                        for row in element['table'].get('tableRows', []):
                            row_text = []
                            for cell in row.get('tableCells', []):
                                cell_content = cell.get('content', [])
                                cell_text = ""
                                for cell_elem in cell_content:
                                    if 'paragraph' in cell_elem:
                                        for para_elem in cell_elem['paragraph'].get('elements', []):
                                            if 'textRun' in para_elem:
                                                cell_text += para_elem['textRun'].get('content', '')
                                row_text.append(cell_text)
                            content += ' | '.join(row_text) + '\n'
                
                context_parts.append(f"\n--- {title} ---\n{content}")
                
            elif 'spreadsheet' in file_type:
                # Google Sheet - read first tab
                try:
                    spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=file_id).execute()
                    sheet_names = [s.get('properties', {}).get('title', 'Sheet1') for s in spreadsheet.get('sheets', [])]
                    first_sheet = sheet_names[0] if sheet_names else 'Sheet1'
                    
                    result = sheets_service.spreadsheets().values().get(
                        spreadsheetId=file_id,
                        range=f"{first_sheet}!A1:Z1000"
                    ).execute()
                    
                    values = result.get('values', [])
                    if values:
                        # Format as table
                        content = '\n'.join([' | '.join(str(cell) for cell in row) for row in values])
                        context_parts.append(f"\n--- {file_name} ({first_sheet}) ---\n{content}")
                    else:
                        context_parts.append(f"\n--- {file_name} ---\n[Sheet is empty]")
                except Exception as sheet_error:
                    context_parts.append(f"\n--- {file_name} ---\n[ERROR READING SHEET: {str(sheet_error)}]")
            else:
                context_parts.append(f"\n--- {file_name} ---\n[Unsupported file type: {file_type}]")
                
        except Exception as e:
            context_parts.append(f"\n--- {file_name} ---\n[ERROR LOADING: {str(e)}]")
    
    return "\n".join(context_parts)


def create_strategist_agent(creds: Credentials, api_key: str = None):
    """
    Create and configure the Head of Strategy agent.
    
    Args:
        creds: Google credentials for API access
        api_key: Google Gemini API key
        strategist_agent_instance: Optional pre-created strategist agent (for consultation)
    
    Returns:
        Compiled LangGraph agent and MemoryLogger
    """
    # Load strategic context documents
    print("Loading strategic context documents...")
    strategy_context = load_strategy_context(creds)
    print(f"✓ Loaded {len(strategy_context)} characters of strategic context")
    
    # Initialize LLM with model from centralized config
    llm = ChatGoogleGenerativeAI(
        model=get_model_name("strategist"),
        google_api_key=api_key,
        temperature=0.9,  # Increased for more analytical and critical thinking
        convert_system_message_to_human=True
    )
    
    # Head of Strategy tools - primarily Drive tools for accessing documents
    from tools.search_tools import get_search_tools
    
    all_tools = []
    all_tools.extend(get_drive_tools(creds))
    # Add learning tools
    all_tools.extend(get_learning_tools(creds))
    
    # Add search tools if available
    search_api_key = os.getenv("GOOGLE_SEARCH_API_KEY") or api_key
    search_engine_id = os.getenv("GOOGLE_SEARCH_ENGINE_ID")
    if search_engine_id:
        search_tools = get_search_tools(api_key=search_api_key, search_engine_id=search_engine_id)
        if search_tools:
            all_tools.extend(search_tools)
    
    # Bind tools to LLM
    llm_with_tools = llm.bind_tools(all_tools)
    
    # Create tool node
    tool_node = ToolNode(all_tools)
    
    # Initialize memory logger
    memory_logger = MemoryLogger(creds, doc_name="Strategist_Memory_Log")
    
    # Load learned facts, preferences, and insights
    learned_context = load_learned_facts(creds)
    
    # System prompt with injected context
    learned_section = ""
    if learned_context:
        learned_section = f"""
LEARNED INFORMATION (Remember these across all conversations):
{learned_context}

IMPORTANT: Always follow user preferences and remember learned facts. Use store_fact, store_preference, or store_insight tools when the user asks you to remember something.
"""
    system_prompt = f"""You are the Chief Strategy Officer (CSO) for Vonga. You are NOT an assistant; you are a co-founder.

CORE DIRECTIVE:
Always audit the user's request against the context provided from Strategy Prime, Product Specs, and Customer Data.

STRATEGIC CONTEXT (LOADED FROM DRIVE):
{strategy_context}

BEHAVIOR & TONE:
- Authoritative & Critical: Use active, decisive language ("We should do X").
- Data-Driven: Cite specific documents when making recommendations.
- Voice: Professional, direct, slightly witty.

STANDARD OPERATING PROCEDURES:
1. The "Idea Audit": When the user proposes a new idea, check it against the loaded context docs. Provide a DEEP analysis:
   - **Green Light / Red Light verdict** with multi-paragraph explanation
   - **Strategic alignment analysis:** How does this align with Strategy Prime, Product Specs, and Customer Data?
   - **Risk assessment:** What are the potential pitfalls, competitive concerns, resource requirements?
   - **Execution considerations:** What dependencies exist? What needs to happen first?
   - **Alternative perspectives:** What are other ways to achieve the same goal?
2. The "Strategic Plan": Provide comprehensive, detailed plans:
   - **Multi-phase execution roadmap** with specific steps, timelines, dependencies
   - **Owner assignment** with rationale for why each owner is appropriate
   - **Risk identification** with mitigation strategies for each risk
   - **Success metrics** and how to measure progress
   - **Resource requirements** (people, time, budget, tools)
3. The "Devil's Advocate": If asked "What am I missing?", provide RELENTLESS, DEEP critique:
   - **Multiple angles of criticism:** Market, competitive, execution, resource, timing perspectives
   - **Specific examples** of similar initiatives that failed and why
   - **Hidden assumptions** that might be wrong
   - **Blind spots** the user might not see
   - **Alternative scenarios** that could derail the plan

DEPTH REQUIREMENTS:
- Never provide surface-level analysis. Every response should demonstrate deep strategic thinking.
- Use the loaded context documents extensively - cite specific sections, data points, strategic principles.
- Synthesize information from multiple sources to provide comprehensive insights.
- Think critically: question assumptions, identify gaps, explore edge cases.
- Provide actionable, specific recommendations - not generic business advice.

NEVER:
- Hallucinate data.
- Give generic "business school" advice.
- Be sycophantic.

When referencing the strategic context, cite which document you're drawing from (Strategy Prime, Product Specs, or Customer Data)."""
    
    # Create the graph
    workflow = StateGraph(AgentState)
    
    max_iterations = 25
    
    def should_continue(state: AgentState) -> str:
        """Determine if we should continue or end."""
        messages = state["messages"]
        
        if not messages:
            return "end"
        
        last_message = messages[-1]
        
        # Count tool calls to prevent infinite loops
        tool_call_count = sum(1 for msg in messages if isinstance(msg, AIMessage) and hasattr(msg, 'tool_calls') and msg.tool_calls)
        
        if tool_call_count >= max_iterations:
            return "end"
        
        if isinstance(last_message, AIMessage) and hasattr(last_message, 'tool_calls') and last_message.tool_calls:
            return "continue"
        
        if isinstance(last_message, ToolMessage):
            return "continue"
        
        if isinstance(last_message, AIMessage):
            return "end"
        
        return "end"
    
    def call_model(state: AgentState):
        """Call the LLM with the current state."""
        messages = state["messages"]
        
        if not messages or not isinstance(messages[0], SystemMessage):
            messages = [SystemMessage(content=system_prompt)] + messages
        
        response = llm_with_tools.invoke(messages)
        return {"messages": [response]}
    
    def call_tool_with_logging(state: AgentState):
        """Execute tool calls with logging."""
        messages = state["messages"]
        last_message = messages[-1]
        
        if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
            for tool_call in last_message.tool_calls:
                memory_logger.log_action(
                    action=f"Tool Called: {tool_call['name']}",
                    details=str(tool_call.get("args", {})),
                    agent_name="Head of Strategy"
                )
        
        return tool_node.invoke(state)
    
    # Add nodes
    workflow.add_node("agent", call_model)
    workflow.add_node("action", call_tool_with_logging)
    
    # Set entry point
    workflow.set_entry_point("agent")
    
    # Add conditional edges
    workflow.add_conditional_edges(
        "agent",
        should_continue,
        {
            "continue": "action",
            "end": END
        }
    )
    
    workflow.add_edge("action", "agent")
    
    # Create memory/checkpoint store
    memory = MemorySaver()
    
    # Compile the graph
    app = workflow.compile(checkpointer=memory)
    
    return app, memory_logger


def run_strategist(agent, memory_logger: MemoryLogger, user_input: str, thread_id: str = "strategist_default", 
                   progress_callback=None) -> str:
    """Run the strategist agent."""
    return run_agent(agent, memory_logger, user_input, thread_id, progress_callback, agent_name="Head of Strategy")
