"""
Prospector Agent for Vonga OS.
Customer research and prospecting agent with live strategy reference.
"""

import os
from typing import List, TypedDict, Annotated
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import BaseTool
from langchain_core.messages import AIMessage, SystemMessage, ToolMessage, HumanMessage, BaseMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph.message import add_messages
from google.oauth2.credentials import Credentials

from agents.shared import MemoryLogger, run_agent
from agents.model_config import get_model_name
from tools.sheet_tools import get_sheet_tools
from tools.drive_tools import read_google_doc_by_name
from tools.learning_tools import get_learning_tools, load_learned_facts
try:
    # Try langchain_community first (more common)
    from langchain_community.tools.tavily_search import TavilySearchResults
except ImportError:
    try:
        # Fallback to langchain_tavily (uses TavilySearch)
        from langchain_tavily import TavilySearch
        TavilySearchResults = TavilySearch  # Alias for compatibility
    except ImportError:
        TavilySearchResults = None


class ProspectorState(TypedDict):
    """State for the Prospector agent graph with ICP context."""
    messages: Annotated[List, add_messages]
    icp_context: str  # Live strategy context loaded from Google Drive


def create_prospector_agent(creds: Credentials, api_key: str = None, tavily_api_key: str = None):
    """
    Create and configure the Prospector agent with live strategy reference.
    
    Args:
        creds: Google credentials for API access
        api_key: Google Gemini API key
        tavily_api_key: Tavily API key (optional, can use env var)
    
    Returns:
        Compiled LangGraph agent and MemoryLogger
    """
    # Initialize LLM with model from centralized config
    llm = ChatGoogleGenerativeAI(
        model=get_model_name("prospector"),
        google_api_key=api_key,
        temperature=0.9,  # Increased for more analytical and creative thinking
        convert_system_message_to_human=True
    )
    
    # Get Tavily API key
    tavily_key = tavily_api_key or os.getenv("TAVILY_API_KEY")
    if not tavily_key:
        print("Warning: TAVILY_API_KEY not found. Tavily search will not be available.")
        tavily_key = None
    
    # Initialize tools
    all_tools = []
    
    # Add Tavily search tool if API key is available
    if tavily_key and TavilySearchResults:
        try:
            tavily_tool = TavilySearchResults(
                api_key=tavily_key,
                max_results=5,
                description="Search the web for companies, their websites, About Us pages, and strategy information. Use this to find companies matching the user's criteria and to research their websites."
            )
            all_tools.append(tavily_tool)
            print("✓ Tavily search tool enabled")
        except Exception as e:
            print(f"⚠️ Tavily search tool not available: {str(e)}")
    else:
        if not tavily_key:
            print("⚠️ Tavily search tool not available (missing TAVILY_API_KEY)")
        else:
            print("⚠️ Tavily search tool not available (TavilySearchResults not found)")
    
    # Add sheet tools for saving prospects
    all_tools.extend(get_sheet_tools(creds))
    # Add learning tools
    all_tools.extend(get_learning_tools(creds))
    print("✓ Sheet tools and learning tools enabled")
    
    # Bind tools to LLM
    llm_with_tools = llm.bind_tools(all_tools)
    
    # Create tool node
    tool_node = ToolNode(all_tools)
    
    # Initialize memory logger
    memory_logger = MemoryLogger(creds, doc_name="Prospector_Memory_Log")
    
    # Load learned facts, preferences, and insights
    learned_context = load_learned_facts(creds)
    
    # Base system prompt (will be enhanced with ICP context)
    learned_section = ""
    if learned_context:
        learned_section = f"""
LEARNED INFORMATION (Remember these across all conversations):
{learned_context}

IMPORTANT: Always follow user preferences and remember learned facts. Use store_fact, store_preference, or store_insight tools when the user asks you to remember something.
"""
    
    base_system_prompt = f"""You are the Vonga Prospector. You are an expert hunter of business opportunities.
{learned_section}

YOUR GOAL:
Research companies (either found through search or provided by the user), conduct deep research, and save them to the database.

TWO MODES OF OPERATION:
1. **SEARCH MODE:** When the user provides search criteria (e.g., "sustainable fashion brands in Austin"):
   - Use Tavily to find companies matching the criteria (limit to 3-5 most promising)
   - Check the database ONCE (using read_customer_db, rows 1-100) to avoid duplicates
   - Research each promising target (2-3 companies maximum)
   - Save them to the database ONE BY ONE
   - **STOP after saving 2-3 companies** - provide summary and end

2. **RESEARCH MODE:** When the user provides specific company names or a list:
   - Check the database ONCE (using read_customer_db, rows 1-100) to see if companies already exist
   - Research each company by name using Tavily (one at a time)
   - Find their website, About Us page, team page
   - Conduct deep research on each one
   - If company exists in database, update the record with new information (using update_customer_db), then move to next
   - If company doesn't exist, save them to the database (using save_prospect_to_db), then move to next
   - **STOP after processing all requested companies** - provide summary and end

3. **DATABASE MANAGEMENT:** You can also read and update existing records:
   - Use read_customer_db to view existing prospects
   - Use update_customer_db to update existing records with new information
   - Always check if a company exists before adding to avoid duplicates

PROCESS (for both modes):
1. **Identify Targets:** Either search for companies OR use the provided company names.
2. **Deep Research Phase:** For each target, conduct MULTI-LAYERED research:
   - **Layer 1 - Company Overview:** Search for "[Company] about us", "[Company] company", "[Company] mission"
   - **Layer 2 - Strategy & News:** Search for "[Company] strategy", "[Company] news 2024", "[Company] expansion", "[Company] rebrand"
   - **Layer 3 - Leadership:** Search for "[Company] leadership", "[Company] team", "[Company] executives", "[Company] founders"
   - **Layer 4 - Contact & Partnerships:** Search for "[Company] contact", "[Company] partnerships", "[Company] press"
   - **Layer 5 - Industry Context:** Search for "[Company] industry", "[Company] competitors", "[Company] market position"
3. **Deep Analysis Phase:** After gathering information, ANALYZE and SYNTHESIZE:
   - **Strategic Fit Analysis:** How does this company align with Vonga's value proposition? What specific pain points does Vonga solve for them?
   - **Timing Analysis:** Are they in a growth phase, rebranding, expanding? What signals indicate they need Vonga NOW?
   - **Decision Maker Mapping:** Who are the key stakeholders? What are their roles and likely priorities?
   - **Competitive Context:** How does this company compare to others in their space? What makes them unique?
   - **Risk Assessment:** What are potential challenges or objections? What would make this a difficult sale?
4. **Synthesis & Insight Generation:** Before saving, compile comprehensive information:
   - **Description (Column C):** 2-3 sentence overview of what they do, who they serve, stage/scale
   - **Industry/Sector (Column D):** Primary industry or market sector
   - **Company Stage (Column E):** Growth stage, funding, employee count
   - **Strategic Angle (Column F):** Specific, detailed narrative - NOT generic. Must include: specific customer segment, specific use case/initiative, specific pain point Vonga addresses
   - **Market Position (Column I):** Competitive context, unique positioning, how they compare
   - **Recent Signals (Column J):** Growth signals, strategic moves, timing indicators that make them relevant NOW
   - **Notes (Column L):** Additional insights, risks, opportunities, potential objections
5. **Database Check & Save/Update:** 
   - FIRST: Use `read_customer_db` to check if the company already exists in the database (only check once, read first 50-100 rows)
   - If company exists: Use `update_customer_db` with the row number. Provide ALL 12 fields (A-L). Use existing values for fields that don't change, new values for updates. After successful update, STOP and move to next company or provide summary.
   - If company doesn't exist: Use `save_prospect_to_db` to add them. Provide ALL 12 fields:
     * company_name, website, description, industry_sector, company_stage, strategy_angle
     * key_contact_name, contact_info, market_position, recent_signals, research_date (YYYY-MM-DD), notes
   - **AFTER EACH SUCCESSFUL SAVE/UPDATE: Check your count. If you've saved 2-3 companies (search mode) or all requested companies (research mode), provide a summary and STOP immediately.**
   - ONE BY ONE, process each company. Don't re-read the database multiple times - check once, then save.

CRITICAL - DEPTH REQUIREMENTS:
- **NO SURFACE-LEVEL RESEARCH:** You must conduct multi-layered research. Don't just read one page and save. Gather information from multiple sources and perspectives.
- **SYNTHESIS REQUIRED:** Before saving, synthesize all findings into a coherent analysis. Don't just list facts - provide insights, connections, and strategic implications.
- **SPECIFICITY MANDATORY:** Generic descriptions like "tech company" or "fashion brand" are NOT acceptable. Provide specific details: what they do, who they serve, their unique positioning, recent moves, market position.
- **STRATEGIC ANGLE DEPTH:** The "strategy_angle" field must be specific and insightful. Not "Vonga helps with branding" but "Vonga enables [Company] to create tangible connection experiences for their [specific customer segment] during their [specific initiative/expansion], addressing their need to [specific pain point]."
- **CONTEXT-RICH DESCRIPTIONS:** The description field should be 2-3 sentences that paint a complete picture: what they do, who they serve, their stage/scale, and what makes them interesting as a prospect.
- **DECISION MAKER RESEARCH:** Don't just guess titles. Research actual people: search for "[Company] CMO", "[Company] brand director", "[Company] marketing team". Find names, LinkedIn profiles, or at minimum specific roles.
- **CONTACT RESEARCH:** Try multiple approaches: "[Company] contact", "[Company] press email", "[Company] marketing contact", "[Company] LinkedIn". If you can't find direct contact, provide the most relevant contact method you found.

EFFICIENCY & STOPPING CONDITIONS:
- **CRITICAL: Stop immediately after successfully saving each company.** Once you receive a "Successfully saved" message, move to the next company or stop.
- In search mode: After saving 2-3 good prospects, provide a summary and STOP. Do not continue searching indefinitely.
- When given specific company names: Research and save each one, then STOP. Don't keep researching after all companies are saved.
- If you hit a recursion limit, it means you're looping. Stop and summarize what was accomplished.
- Quality over quantity: Better to deeply research and save 2-3 companies than to loop endlessly.
- **After each successful save, check if you've reached your goal (2-3 companies in search mode, all companies in research mode). If yes, provide a summary and STOP.**

ANALYSIS FRAMEWORK (use this for each company):
1. **What they do:** Specific business model, products/services, target market
2. **Why they're interesting:** Growth signals, strategic moves, market position, unique factors
3. **Vonga fit:** Specific use case, pain point Vonga solves, timing relevance
4. **Decision makers:** Actual people/roles, their likely priorities, how to reach them
5. **Strategic angle:** Compelling narrative for why this partnership makes sense

DATABASE STRUCTURE (12 Columns - A through L):
The database has 12 columns in this exact order:
- Column A: Company Name
- Column B: Website
- Column C: Description (2-3 sentences: what they do, who they serve, stage/scale)
- Column D: Industry/Sector
- Column E: Company Stage (growth stage, size)
- Column F: Strategic Angle (specific, detailed - NOT generic)
- Column G: Key Contact Name (name with title)
- Column H: Contact Info (email, LinkedIn, etc.)
- Column I: Market Position (competitive context, unique positioning)
- Column J: Recent Signals (growth signals, strategic moves, timing indicators)
- Column K: Research Date (YYYY-MM-DD format)
- Column L: Notes (additional insights, risks, opportunities)

DATABASE MANAGEMENT:
- Always check the database (read_customer_db) before adding new prospects to avoid duplicates
- If a company exists but you have new/better information, update the record rather than creating a duplicate
- When saving or updating, provide ALL 12 fields in the correct order
- Use the row number from read_customer_db when updating records
- Keep the database clean and accurate by updating existing records when you learn new information
- Set research_date to today's date (YYYY-MM-DD format) when saving or updating"""
    
    # Create the graph
    workflow = StateGraph(ProspectorState)
    
    max_iterations = 40  # Increased for research tasks (search, analyze, save)
    
    def load_criteria(state: ProspectorState) -> ProspectorState:
        """Load ICP criteria from Google Drive document."""
        try:
            # Read the customer data document
            icp_content = read_google_doc_by_name(creds, "04_Customer_Data")
            
            # If not found, try Strategy Prime as fallback
            if icp_content.startswith("Error:"):
                icp_content = read_google_doc_by_name(creds, "00_Strategy_Prime")
            
            # Store in state
            state["icp_context"] = icp_content
            
            # Log the loading
            memory_logger.log_action(
                action="Loaded ICP Context",
                details=f"Loaded from Google Drive: {'04_Customer_Data' if not icp_content.startswith('Error:') else '00_Strategy_Prime (fallback)'}",
                agent_name="Prospector"
            )
            
            return state
        except Exception as e:
            # If loading fails, set empty context
            state["icp_context"] = f"Error loading ICP context: {str(e)}"
            return state
    
    def should_continue(state: ProspectorState) -> str:
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
    
    def call_model(state: ProspectorState):
        """Call the LLM with the current state, including ICP context."""
        messages = state["messages"]
        icp_context = state.get("icp_context", "")
        
        # Build enhanced system prompt with ICP context
        if icp_context and not icp_context.startswith("Error"):
            enhanced_prompt = f"""{base_system_prompt}

LIVE STRATEGY CONTEXT (CRITICAL - MUST PRIORITIZE):
You must strictly prioritize companies that match the criteria defined in the following LIVE CONTEXT from the user's strategy documents:

{icp_context}

This context is loaded directly from Google Drive and represents the current Ideal Customer Profile. Use this as your primary filter when searching and evaluating prospects. Only save companies that align with these criteria.

DEEP ANALYSIS MANDATE:
When researching companies, you must provide analysis that matches or exceeds the depth you would get from a senior business analyst or consultant. This means:
- Multi-source research (don't rely on a single search result)
- Synthesis of information into coherent insights
- Strategic thinking about fit, timing, and opportunity
- Specific, actionable details rather than generic descriptions
- Critical evaluation of each prospect's potential value

Your output should demonstrate that you've done comprehensive research and deep thinking, not just surface-level information gathering."""
        else:
            enhanced_prompt = base_system_prompt
            if icp_context.startswith("Error"):
                enhanced_prompt += f"\n\nNote: Could not load ICP context from Google Drive: {icp_context}"
        
        if not messages or not isinstance(messages[0], SystemMessage):
            messages = [SystemMessage(content=enhanced_prompt)] + messages
        else:
            # Replace existing system message with enhanced one
            messages = [SystemMessage(content=enhanced_prompt)] + [msg for msg in messages if not isinstance(msg, SystemMessage)]
        
        response = llm_with_tools.invoke(messages)
        return {"messages": [response]}
    
    def call_tool_with_logging(state: ProspectorState):
        """Execute tool calls with logging."""
        messages = state["messages"]
        last_message = messages[-1]
        
        if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
            for tool_call in last_message.tool_calls:
                tool_name = tool_call.get('name', 'unknown')
                tool_args = tool_call.get("args", {})
                memory_logger.log_action(
                    action=f"Tool Called: {tool_name}",
                    details=str(tool_args),
                    agent_name="Prospector"
                )
                # Log specifically for save operations to help debug
                if tool_name == "save_prospect_to_db":
                    print(f"🔍 DEBUG: save_prospect_to_db called with args: {tool_args}")
                    # Check if all required fields are present
                    required_fields = ['company_name', 'website', 'description', 'industry_sector', 
                                     'company_stage', 'strategy_angle', 'key_contact_name', 'contact_info',
                                     'market_position', 'recent_signals', 'research_date', 'notes']
                    missing_fields = [field for field in required_fields if field not in tool_args or not tool_args.get(field)]
                    if missing_fields:
                        print(f"⚠️ WARNING: Missing fields in save_prospect_to_db: {missing_fields}")
        
        result = tool_node.invoke(state)
        
        # Check tool results for errors
        if isinstance(result, dict) and "messages" in result:
            for msg in result["messages"]:
                if isinstance(msg, ToolMessage):
                    content = msg.content if hasattr(msg, 'content') else str(msg)
                    # Check for error indicators
                    if "Error" in content or "❌" in content:
                        print(f"⚠️ TOOL ERROR: {msg.name if hasattr(msg, 'name') else 'unknown'}: {content[:200]}")
        
        return result
    
    # Add nodes
    workflow.add_node("load_criteria", load_criteria)
    workflow.add_node("agent", call_model)
    workflow.add_node("action", call_tool_with_logging)
    
    # Set entry point
    workflow.set_entry_point("load_criteria")
    
    # After loading criteria, go to agent
    workflow.add_edge("load_criteria", "agent")
    
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


def run_prospector(agent, memory_logger: MemoryLogger, user_input: str, thread_id: str = "prospector_default", 
                   progress_callback=None) -> str:
    """Run the prospector agent with initial state."""
    import time
    from langchain_core.messages import HumanMessage
    
    config = {"configurable": {"thread_id": thread_id}}
    timeout_seconds = 120  # Longer timeout for research tasks
    
    if progress_callback:
        progress_callback("Loading ICP criteria from Google Drive...")
    
    start_time = time.time()
    
    try:
        # Initialize state with empty ICP context (will be loaded by load_criteria node)
        initial_state = {
            "messages": [HumanMessage(content=user_input)],
            "icp_context": ""
        }
        
        # Invoke the agent (LangGraph will maintain state per thread_id using checkpointer)
        config["recursion_limit"] = 60  # Increased slightly but with better stopping conditions in prompt
        result = agent.invoke(initial_state, config)
        
        # Check if we exceeded timeout
        elapsed = time.time() - start_time
        if elapsed > timeout_seconds:
            return "⏱️ The request took too long to process. Please try rephrasing your request or breaking it into smaller parts."
        
    except Exception as e:
        if progress_callback:
            progress_callback(f"❌ Error: {str(e)}")
        raise
    
    # Extract the final response and tool messages
    messages = result.get("messages", [])
    final_response = None
    
    # Collect only save operation confirmations (not full database reads)
    save_confirmations = []
    
    # Collect tool messages - only save operations, filter out database reads
    for msg in messages:
        if isinstance(msg, ToolMessage):
            tool_content = msg.content if hasattr(msg, 'content') else str(msg)
            # Only include save/update operations, not read operations
            if 'Successfully saved' in tool_content or '✅' in tool_content:
                # Extract just the key info: company name and row number
                save_confirmations.append(tool_content)
            elif 'Successfully updated' in tool_content:
                save_confirmations.append(tool_content)
            elif 'Error saving' in tool_content or '❌' in tool_content or 'Error:' in tool_content:
                save_confirmations.append(tool_content)
            # Explicitly skip database read operations - don't include them
    
    # Find the final AI response (last non-tool-call message)
    for msg in reversed(messages):
        if isinstance(msg, AIMessage):
            has_tool_calls = hasattr(msg, 'tool_calls') and msg.tool_calls
            if not has_tool_calls and msg.content:
                final_response = msg.content
                break
    
    if not final_response:
        # If no final response, use the last message content
        if messages:
            last_msg = messages[-1]
            if hasattr(last_msg, 'content'):
                final_response = last_msg.content
            else:
                final_response = str(last_msg)
        else:
            final_response = "No response generated. Please check the logs for details."
    
    # Add save confirmations only if there are any, and keep it concise
    if save_confirmations:
        # Create a brief summary of saves
        saves_summary = "\n".join(save_confirmations)
        # If we have a good final response, just add saves at the end
        if final_response and final_response.strip():
            combined_response = f"{final_response}\n\n**Recent Changes:**\n{saves_summary}"
        else:
            combined_response = f"**Recent Changes:**\n{saves_summary}"
    else:
        combined_response = final_response
    
    # Log the conversation (full details for logging, but user sees concise version)
    memory_logger.log_conversation(user_input, combined_response, agent_name="Prospector")
    
    return combined_response
