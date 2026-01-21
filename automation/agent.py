"""
LangGraph agent setup for Chief of Staff AI Agent.
"""

import os
from typing import TypedDict, Annotated, List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import BaseTool
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from datetime import datetime

from tools.gmail_tools import get_gmail_tools
from tools.calendar_tools import get_calendar_tools
from tools.drive_tools import get_drive_tools
from tools.task_tools import get_task_tools
from tools.knowledge_tools import get_knowledge_tools
from tools.search_tools import get_search_tools
from knowledge_base import initialize_knowledge_base
from google.oauth2.credentials import Credentials


class AgentState(TypedDict):
    """State for the agent graph."""
    messages: Annotated[List[BaseMessage], add_messages]


class MemoryLogger:
    """Handles logging conversations and actions to Google Doc."""
    
    def __init__(self, creds: Credentials):
        self.creds = creds
        self.doc_id = None
        self._ensure_memory_doc()
    
    def _ensure_memory_doc(self):
        """Ensure the Agent_Memory_Log document exists, create if not."""
        from googleapiclient.discovery import build
        
        docs_service = build('docs', 'v1', credentials=self.creds)
        drive_service = build('drive', 'v3', credentials=self.creds)
        
        # Search for existing document
        results = drive_service.files().list(
            q="name='Agent_Memory_Log' and mimeType='application/vnd.google-apps.document'",
            fields="files(id, name)"
        ).execute()
        
        files = results.get('files', [])
        
        if files:
            self.doc_id = files[0]['id']
        else:
            # Create new document
            doc = docs_service.documents().create(body={'title': 'Agent_Memory_Log'}).execute()
            self.doc_id = doc.get('documentId')
            
            # Add initial header
            requests = [
                {
                    'insertText': {
                        'location': {'index': 1},
                        'text': 'Agent Memory Log\n\n'
                    }
                }
            ]
            docs_service.documents().batchUpdate(
                documentId=self.doc_id,
                body={'requests': requests}
            ).execute()
    
    def log_conversation(self, user_message: str, agent_response: str):
        """Log a conversation turn to the memory doc."""
        from googleapiclient.discovery import build
        
        docs_service = build('docs', 'v1', credentials=self.creds)
        
        # Get current document end index
        doc = docs_service.documents().get(documentId=self.doc_id).execute()
        end_index = doc.get('body', {}).get('content', [{}])[-1].get('endIndex', 1)
        insert_index = end_index - 1
        
        timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
        
        log_text = f"\n\n--- Conversation Log ({timestamp}) ---\n"
        log_text += f"User: {user_message}\n\n"
        log_text += f"Agent: {agent_response}\n"
        log_text += "--- End of Log Entry ---\n"
        
        requests = [
            {
                'insertText': {
                    'location': {'index': insert_index},
                    'text': log_text
                }
            }
        ]
        
        docs_service.documents().batchUpdate(
            documentId=self.doc_id,
            body={'requests': requests}
        ).execute()
    
    def log_action(self, action: str, details: str = ""):
        """Log an action (tool call) to the memory doc."""
        from googleapiclient.discovery import build
        
        docs_service = build('docs', 'v1', credentials=self.creds)
        
        # Get current document end index
        doc = docs_service.documents().get(documentId=self.doc_id).execute()
        end_index = doc.get('body', {}).get('content', [{}])[-1].get('endIndex', 1)
        insert_index = end_index - 1
        
        timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
        
        log_text = f"\n[Action Log {timestamp}] {action}"
        if details:
            log_text += f" - {details}"
        log_text += "\n"
        
        requests = [
            {
                'insertText': {
                    'location': {'index': insert_index},
                    'text': log_text
                }
            }
        ]
        
        docs_service.documents().batchUpdate(
            documentId=self.doc_id,
            body={'requests': requests}
        ).execute()


def create_agent(creds: Credentials, api_key: str = None):
    """
    Create and configure the Chief of Staff agent.
    
    Args:
        creds: Google credentials for API access
        api_key: Google Gemini API key (optional, can use env var)
    
    Returns:
        Compiled LangGraph agent
    """
    # Initialize LLM
    # Using gemini-2.5-flash (latest available model) - can also use gemini-2.5-pro or gemini-pro-latest
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=api_key,
        temperature=0.7,
        convert_system_message_to_human=True  # Helps with system messages
    )
    
    # Initialize knowledge base
    try:
        knowledge_base = initialize_knowledge_base(creds)
    except Exception as e:
        print(f"Warning: Could not initialize knowledge base: {e}")
        knowledge_base = None
    
    # Get all tools
    all_tools = []
    all_tools.extend(get_gmail_tools(creds))
    all_tools.extend(get_calendar_tools(creds))
    all_tools.extend(get_drive_tools(creds))
    all_tools.extend(get_task_tools(creds))
    
    # Add knowledge base tools if available
    if knowledge_base:
        all_tools.extend(get_knowledge_tools(knowledge_base))
    
    # Add search tools if API key and engine ID are configured
    # Try to get from environment or use the provided api_key as fallback
    search_api_key = os.getenv("GOOGLE_SEARCH_API_KEY") or api_key
    search_engine_id = os.getenv("GOOGLE_SEARCH_ENGINE_ID")
    
    if search_engine_id:
        search_tools = get_search_tools(api_key=search_api_key, search_engine_id=search_engine_id)
        if search_tools:
            all_tools.extend(search_tools)
            print("✓ Google Search tools enabled")
        else:
            print("⚠️ Google Search tools not available (API key or engine ID issue)")
    else:
        print("⚠️ Google Search tools not available (missing GOOGLE_SEARCH_ENGINE_ID)")
    
    # Bind tools to LLM
    llm_with_tools = llm.bind_tools(all_tools)
    
    # Create tool node for executing tools
    tool_node = ToolNode(all_tools)
    
    # Initialize memory logger
    memory_logger = MemoryLogger(creds)
    
    # System prompt
    system_prompt = """You are an efficient Chief of Staff. You manage the user's time and communications. 
Always check the calendar before proposing meetings. Always log your significant actions.

EFFICIENCY RULES (CRITICAL):
- Be concise in your responses - aim to complete tasks efficiently
- Don't call multiple tools if one will suffice
- If you get an error, try to understand it before repeating the same action
- Don't loop through the same tool calls repeatedly
- If a tool call fails after 2-3 attempts with different approaches, acknowledge the limitation and inform the user
- For batch operations (like scheduling multiple meetings), execute them sequentially but efficiently - don't re-check the calendar between each one unless needed
- After successfully completing all actions in a batch, STOP and provide a summary response - don't continue calling tools unnecessarily

WEB SEARCH RULES:
- Use google_search when you need current information, news, facts, or data not available in the knowledge base
- Search for information about companies, people, events, or topics that require up-to-date external data
- Use specific, targeted search queries to get the most relevant results
- When searching, read the results carefully and extract the key information to answer the user's question
- If the first search doesn't provide enough information, try a different query with different keywords
- Combine information from search results with your knowledge base when appropriate

KNOWLEDGE BASE:
You have access to a knowledge base that contains indexed information from company documents in Google Drive.
- ALWAYS search the knowledge base (using knowledge_base_search) BEFORE answering questions about:
  * Company strategy, plans, or roadmap
  * Business processes, procedures, or policies
  * Historical company information
  * Any business-related context
- Use the knowledge base to provide accurate, informed responses based on company documents
- The knowledge base continuously learns from new documents indexed in Google Drive

CRITICAL: Be autonomous and problem-solving. When a task requires multiple steps, execute them automatically without asking the user for clarification. Try multiple approaches until you succeed.

CALENDAR SCHEDULING RULES:
- When scheduling multiple events in one request, schedule them all sequentially without excessive calendar checks between each one
- After scheduling each event, move directly to the next one - only check the calendar if there's a specific conflict to resolve
- For batch scheduling, you have up to 25 tool call iterations available - use them efficiently
- When the user says "today", "tomorrow", "next week", etc., FIRST use calendar_get_current_time to get the current date
- ALWAYS check the calendar first before scheduling using calendar_list or calendar_search to check availability
- BUSINESS HOURS: All events MUST be scheduled between 7am-6pm EST/EDT unless the user specifically requests otherwise

CALENDAR EDITING RULES:
- To edit an event, use calendar_edit_event with the event_id
- Find event IDs using calendar_list or calendar_search tools first
- You can update: summary, start_time, end_time, description, attendees
- If updating times, business hours validation still applies (7am-6pm EST/EDT)
- If only start_time or end_time is provided, the tool will calculate the other based on the original event duration

CALENDAR DELETION RULES:
- To delete an event, use calendar_delete_event with the event_id
- Find event IDs using calendar_list or calendar_search tools first
- When deleting, confirm the event details before deletion
- The deletion is permanent and cannot be undone
- When scheduling, convert times to UTC:
  * EST is UTC-5: 7am EST = 12:00 UTC, 6pm EST = 23:00 UTC
  * EDT is UTC-4: 7am EDT = 11:00 UTC, 6pm EDT = 22:00 UTC
  * Use 12:00 UTC (7am EST) as the default start time for morning events
  * For times like "9am EST" use 14:00 UTC (9+5=14), "10am EST" use 15:00 UTC, etc.
  * For "2pm EST" use 19:00 UTC (14+5=19), "3pm EST" use 20:00 UTC, etc.
- NEVER schedule events in the past - all start times MUST be in the future (the tool will reject past dates)
- When calling calendar_create_event, the start_time and end_time parameters must be strings in ISO 8601 format
- Date format: Use 'YYYY-MM-DDTHH:MM:SS' format (e.g., '2025-12-29T12:00:00' for December 29, 2025 at 7:00 AM EST)
- Use 24-hour time format in UTC
- For relative dates:
  * "tomorrow" = today's date + 1 day (use calendar_get_current_time to get today's date first)
  * "next Monday" = calculate from current date
  * Always verify the calculated date is in the future before scheduling
- AVAILABILITY: ALWAYS check calendar availability using calendar_list or calendar_search before scheduling
- If calendar_create_event returns an error about conflicts, it will suggest alternative available times - USE THOSE EXACT SUGGESTED TIMES to retry the creation
- CONFLICT OVERRIDE: Only if the user explicitly says "schedule anyway", "ignore the conflict", "override", or similar, use force_conflict=True parameter to create the event despite conflicts
- By default, never create events that conflict with existing events - the tool will block creation and you must use the suggested times
- If the user doesn't specify a time, default to 9am-10am EST (14:00-15:00 UTC) on the requested date
- For dates like "December 29, 2025" convert to '2025-12-29'
- For times like "9-10 AM" convert to UTC: start='2025-12-29T14:00:00' (9am EST = 14:00 UTC) and end='2025-12-29T15:00:00'
- CRITICAL: After calling calendar_create_event, check the response. If it says "✓ Event created successfully" with an Event ID and Link, the event WAS created. Share that link with the user.
- If the response contains an Error message about business hours or conflicts, use the suggested time from the error message
- When the user asks to schedule time, use calendar_create_event to actually create the events - don't just acknowledge the request

When searching for files in Google Drive:
- AUTOMATICALLY try multiple search strategies if the first search doesn't work:
  1. First, try exact name match: name='filename'
  2. Then try partial name: name contains 'keyword'
  3. Try different keyword variations (remove dates, shorten names, try synonyms)
  4. Try fullText search: fullText contains 'keyword'
  5. Search by file type if relevant: mimeType='application/vnd.google-apps.spreadsheet'
- DO NOT give up after one failed search - try at least 3-4 different query variations automatically
- After finding files, automatically read the most relevant one(s) using file IDs

When searching for files:
- Files might have extensions in the search query but not in Drive (e.g., ".gsheet" doesn't exist - it's just a spreadsheet)
- Remove file extensions when searching (e.g., search for "Vonga 7 Year Roadmap" not "Vonga 7 Year Roadmap.gsheet")
- Try variations: "7 Year Roadmap", "Roadmap", "Vonga Roadmap", etc.

When reading Google Sheets:
- You can access ALL tabs/sheets in a spreadsheet
- After reading a sheet, if you see multiple tabs listed, automatically read the relevant tab(s)
- Use 'TabName!A1:Z1000' to read a specific tab (replace TabName with the actual tab name)
- The tool will show you all available tabs when reading a sheet
- If you need a specific tab mentioned by the user, automatically read that tab after finding the spreadsheet

Problem-solving approach:
- When you encounter an error or don't find something, automatically try alternative approaches
- Think step-by-step: What are other ways to find this? What variations could I try?
- Execute these attempts automatically - don't report failure and wait for user input
- Only ask the user for help if you've exhausted all reasonable search strategies"""
    
    # Create the graph
    workflow = StateGraph(AgentState)
    
    # Track iterations to prevent infinite loops
    max_iterations = 25  # Maximum tool call iterations (increased to support batch operations like multiple meetings)
    
    def should_continue(state: AgentState) -> str:
        """Determine if we should continue or end."""
        messages = state["messages"]
        
        if not messages:
            return "end"
        
        last_message = messages[-1]
        
        # Count tool calls to prevent infinite loops
        tool_call_count = sum(1 for msg in messages if isinstance(msg, AIMessage) and hasattr(msg, 'tool_calls') and msg.tool_calls)
        
        if tool_call_count >= max_iterations:
            # Force end if we've exceeded max iterations
            return "end"
        
        # If the last message is an AIMessage with tool calls, we need to continue to execute tools
        if isinstance(last_message, AIMessage) and hasattr(last_message, 'tool_calls') and last_message.tool_calls:
            return "continue"
        
        # If the last message is a ToolMessage, we should continue to let the agent process the results
        from langchain_core.messages import ToolMessage
        if isinstance(last_message, ToolMessage):
            return "continue"
        
        # If the last message is an AIMessage without tool calls, we're done (agent has provided final response)
        if isinstance(last_message, AIMessage):
            return "end"
        
        # Otherwise, we're done
        return "end"
    
    def call_model(state: AgentState):
        """Call the LLM with the current state."""
        messages = state["messages"]
        
        # Add system message at the start if not present
        if not messages or not isinstance(messages[0], SystemMessage):
            messages = [SystemMessage(content=system_prompt)] + messages
        
        response = llm_with_tools.invoke(messages)
        return {"messages": [response]}
    
    def call_tool_with_logging(state: AgentState):
        """Execute tool calls with logging."""
        messages = state["messages"]
        last_message = messages[-1]
        
        # Log tool calls before execution
        if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
            for tool_call in last_message.tool_calls:
                memory_logger.log_action(
                    action=f"Tool Called: {tool_call['name']}",
                    details=str(tool_call.get("args", {}))
                )
        
        # Use ToolNode to execute tools (it handles the execution automatically)
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
    
    # Create memory/checkpoint store for conversation history
    memory = MemorySaver()
    
    # Compile the graph with memory
    app = workflow.compile(checkpointer=memory)
    
    return app, memory_logger


def run_agent(agent, memory_logger: MemoryLogger, user_input: str, thread_id: str = "default", progress_callback=None) -> str:
    """
    Run the agent with user input and return the response.
    
    Args:
        agent: Compiled LangGraph agent
        memory_logger: MemoryLogger instance
        user_input: User's message
        thread_id: Thread ID for maintaining conversation state
        progress_callback: Optional callback function(status_message) for progress updates
    
    Returns:
        Agent's response text
    """
    import time
    
    config = {"configurable": {"thread_id": thread_id}}
    timeout_seconds = 90  # 90 second timeout
    
    if progress_callback:
        progress_callback("🤔 Thinking...")
    
    start_time = time.time()
    
    try:
        # Invoke the agent (LangGraph will maintain state per thread_id using checkpointer)
        # Set recursion_limit in config to support batch operations (e.g., scheduling multiple meetings)
        # Set to 30 to allow for multiple sequential operations with some buffer
        config["recursion_limit"] = 30
        result = agent.invoke(
            {"messages": [HumanMessage(content=user_input)]},
            config
        )
        
        # Check if we exceeded timeout (manual check since signal-based timeout doesn't work well with Streamlit)
        elapsed = time.time() - start_time
        if elapsed > timeout_seconds:
            return "⏱️ The request took too long to process. Please try rephrasing your request or breaking it into smaller parts."
        
    except Exception as e:
        if progress_callback:
            progress_callback(f"❌ Error: {str(e)}")
        raise
    
    # Extract the final response (last non-tool message)
    messages = result["messages"]
    final_response = None
    for msg in reversed(messages):
        if isinstance(msg, AIMessage):
            # Check if this message has tool calls
            has_tool_calls = hasattr(msg, 'tool_calls') and msg.tool_calls
            if not has_tool_calls:
                final_response = msg.content
                break
    
    if not final_response:
        final_response = messages[-1].content if messages else "No response generated."
    
    # Log the conversation
    memory_logger.log_conversation(user_input, final_response)
    
    return final_response

