"""
Chief of Staff Agent for Vonga OS.
Handles operational tasks: calendar, email, tasks, and can consult the Strategist.
"""

import os
from typing import List, Optional, Dict
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import BaseTool
from langchain_core.messages import AIMessage, SystemMessage, ToolMessage
from pydantic import Field
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from google.oauth2.credentials import Credentials

from agents.shared import AgentState, MemoryLogger, run_agent
from agents.model_config import get_model_name
from tools.gmail_tools import get_gmail_tools
from tools.calendar_tools import get_calendar_tools
from tools.drive_tools import get_drive_tools
from tools.task_tools import get_task_tools
from tools.knowledge_tools import get_knowledge_tools
from tools.search_tools import get_search_tools
from tools.learning_tools import get_learning_tools, load_learned_facts
from knowledge_base import initialize_knowledge_base


class ConsultStrategistTool(BaseTool):
    """Tool for Chief of Staff to consult the Head of Strategy."""
    name: str = "consult_head_of_strategy"
    description: str = """Consult the Head of Strategy (CSO) for strategic questions, idea audits, or strategic planning.
    Use this when the user asks:
    - Strategic questions about company direction, product decisions, or business strategy
    - "Should we do X?" or "Is this a good idea?"
    - "What am I missing?" or "Critique this plan"
    - "Ask Strategy about..." or similar requests to consult strategy
    
    REQUIRES: question (string) - the strategic question or idea to present to the Head of Strategy.
    
    The Head of Strategy will provide a "Green Light / Red Light" verdict or strategic guidance based on the company's strategic documents."""
    
    strategist_agent: Optional[object] = Field(default=None, exclude=True)
    strategist_memory_logger: Optional[MemoryLogger] = Field(default=None, exclude=True)
    
    def __init__(self, strategist_agent=None, strategist_memory_logger=None, **kwargs):
        super().__init__(**kwargs)
        self.strategist_agent = strategist_agent
        self.strategist_memory_logger = strategist_memory_logger
    
    def _run(self, question: str) -> str:
        """Execute the consultation."""
        if not self.strategist_agent or not self.strategist_memory_logger:
            return "Error: Head of Strategy is not available. Please ensure the strategist agent is initialized."
        
        try:
            # Use a unique thread ID for this consultation
            import uuid
            consultation_thread = f"consultation_{uuid.uuid4().hex[:8]}"
            
            # Run the strategist agent with the question
            response = run_agent(
                self.strategist_agent,
                self.strategist_memory_logger,
                question,
                thread_id=consultation_thread,
                agent_name="Head of Strategy"
            )
            
            return f"Head of Strategy Response:\n{response}"
        except Exception as e:
            return f"Error consulting Head of Strategy: {str(e)}"
    
    async def _arun(self, question: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def create_chief_of_staff_agent(creds: Credentials, api_key: str = None, strategist_agent=None, strategist_memory_logger=None):
    """
    Create and configure the Chief of Staff agent.
    
    Args:
        creds: Google credentials for API access
        api_key: Google Gemini API key (optional, can use env var)
        strategist_agent: Optional strategist agent instance for consultation
        strategist_memory_logger: Optional strategist memory logger
    
    Returns:
        Compiled LangGraph agent and MemoryLogger
    """
    # Initialize LLM with model from centralized config
    llm = ChatGoogleGenerativeAI(
        model=get_model_name("chief_of_staff"),
        google_api_key=api_key,
        temperature=0.85,  # Increased for more analytical thinking while maintaining efficiency
        convert_system_message_to_human=True
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
    search_api_key = os.getenv("GOOGLE_SEARCH_API_KEY") or api_key
    search_engine_id = os.getenv("GOOGLE_SEARCH_ENGINE_ID")
    
    if search_engine_id:
        search_tools = get_search_tools(api_key=search_api_key, search_engine_id=search_engine_id)
        if search_tools:
            all_tools.extend(search_tools)
            print("✓ Google Search tools enabled")
    
    # Add consultation tool if strategist is available
    if strategist_agent and strategist_memory_logger:
        consult_tool = ConsultStrategistTool(
            strategist_agent=strategist_agent,
            strategist_memory_logger=strategist_memory_logger
        )
        all_tools.append(consult_tool)
        print("✓ Strategist consultation tool enabled")
    
    # Add learning tools
    all_tools.extend(get_learning_tools(creds))
    print("✓ Learning tools enabled")
    
    # Load learned facts, preferences, and insights
    learned_context = load_learned_facts(creds)
    
    # Bind tools to LLM
    llm_with_tools = llm.bind_tools(all_tools)
    
    # Create tool node for executing tools
    tool_node = ToolNode(all_tools)
    
    # Initialize memory logger
    memory_logger = MemoryLogger(creds, doc_name="Chief_of_Staff_Memory_Log")
    
    # System prompt with learned context
    learned_section = ""
    if learned_context:
        learned_section = f"""
LEARNED INFORMATION (Remember these across all conversations):
{learned_context}

IMPORTANT: Always follow user preferences and remember learned facts. Use store_fact, store_preference, or store_insight tools when the user asks you to remember something.
"""
    
    system_prompt = f"""You are an efficient Chief of Staff. You manage the user's time and communications. 
Always check the calendar before proposing meetings. Always log your significant actions.
{learned_section}

ANALYSIS DEPTH REQUIREMENTS:
- When providing information or recommendations, go beyond surface-level responses
- Synthesize information from multiple sources (calendar, emails, documents, knowledge base)
- Provide context-rich answers that connect dots and show understanding
- When analyzing situations, consider multiple perspectives and implications
- Think critically: what are the underlying factors? What might be missing? What are the second-order effects?

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

STRATEGIC CONSULTATION:
- When the user asks strategic questions (e.g., "Should we do X?", "Is this a good idea?", "What am I missing?"), use consult_head_of_strategy to get the Head of Strategy's input
- The Head of Strategy will provide Green Light/Red Light verdicts and strategic guidance
- Present the Strategist's response clearly to the user

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
                    agent_name="Chief of Staff"
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
    
    # Create memory/checkpoint store for conversation history
    memory = MemorySaver()
    
    # Compile the graph with memory
    app = workflow.compile(checkpointer=memory)
    
    return app, memory_logger


def run_chief_of_staff(agent, memory_logger: MemoryLogger, user_input: str, thread_id: str = "cos_default", 
                       progress_callback=None) -> str:
    """Run the Chief of Staff agent."""
    return run_agent(agent, memory_logger, user_input, thread_id, progress_callback, agent_name="Chief of Staff")


# Quick Actions Workflow Functions

def generate_daily_briefing(creds: Credentials) -> str:
    """
    Generate a daily briefing with today's calendar, high priority emails, and due tasks.
    Returns a formatted string.
    """
    from tools.calendar_tools import get_calendar_service
    from tools.gmail_tools import get_gmail_service
    from googleapiclient.discovery import build
    from datetime import datetime, timedelta
    import base64
    
    briefing_parts = []
    briefing_parts.append("=" * 60)
    briefing_parts.append("DAILY BRIEFING")
    briefing_parts.append("=" * 60)
    briefing_parts.append("")
    
    # Get today's date
    today = datetime.now()
    today_start = today.replace(hour=0, minute=0, second=0, microsecond=0).isoformat() + 'Z'
    today_end = today.replace(hour=23, minute=59, second=59, microsecond=0).isoformat() + 'Z'
    
    # 1. Today's Calendar
    try:
        calendar_service = get_calendar_service(creds)
        events_result = calendar_service.events().list(
            calendarId='primary',
            timeMin=today_start,
            timeMax=today_end,
            maxResults=20,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        
        events = events_result.get('items', [])
        briefing_parts.append("TODAY'S CALENDAR")
        if events:
            for event in events:
                start = event['start'].get('dateTime', event['start'].get('date'))
                summary = event.get('summary', 'No Title')
                # Parse and format time
                try:
                    if 'T' in start:
                        dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
                        time_str = dt.strftime('%I:%M %p')
                    else:
                        time_str = "All Day"
                    briefing_parts.append(f"  • {time_str}: {summary}")
                except:
                    briefing_parts.append(f"  • {summary}")
        else:
            briefing_parts.append("  No events scheduled for today.")
        briefing_parts.append("")
    except Exception as e:
        briefing_parts.append("TODAY'S CALENDAR")
        briefing_parts.append(f"  Error retrieving calendar: {str(e)}")
        briefing_parts.append("")
    
    # 2. High Priority Emails (unread, important)
    try:
        gmail_service = get_gmail_service(creds)
        # Search for unread important emails
        results = gmail_service.users().messages().list(
            userId='me',
            q='is:unread is:important',
            maxResults=5
        ).execute()
        
        messages = results.get('messages', [])
        briefing_parts.append("HIGH PRIORITY EMAILS")
        if messages:
            for msg in messages[:5]:  # Top 5
                msg_detail = gmail_service.users().messages().get(userId='me', id=msg['id']).execute()
                payload = msg_detail['payload']
                headers = payload.get('headers', [])
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
                sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
                # Extract email from sender (may include name)
                sender_email = sender.split('<')[-1].replace('>', '').strip() if '<' in sender else sender
                briefing_parts.append(f"  • From: {sender_email}")
                briefing_parts.append(f"    Subject: {subject}")
        else:
            briefing_parts.append("  No unread important emails.")
        briefing_parts.append("")
    except Exception as e:
        briefing_parts.append("HIGH PRIORITY EMAILS")
        briefing_parts.append(f"  Error retrieving emails: {str(e)}")
        briefing_parts.append("")
    
    # 3. Due Tasks
    try:
        tasks_service = build('tasks', 'v1', credentials=creds)
        tasklists = tasks_service.tasklists().list(maxResults=10).execute()
        tasklist_items = tasklists.get('items', [])
        
        briefing_parts.append("DUE TASKS")
        found_tasks = False
        
        # Check default task list first, then others
        default_list_id = None
        for tasklist in tasklist_items:
            if tasklist.get('id') == '@default':
                default_list_id = tasklist['id']
                break
        
        if default_list_id:
            tasks = tasks_service.tasks().list(tasklist=default_list_id, showCompleted=False, maxResults=10).execute()
            task_items = tasks.get('items', [])
            
            for task in task_items:
                title = task.get('title', 'Untitled')
                due = task.get('due')
                if due:
                    try:
                        due_date = datetime.fromisoformat(due.replace('Z', '+00:00'))
                        if due_date.date() <= today.date():
                            briefing_parts.append(f"  • {title}")
                            found_tasks = True
                    except:
                        # If date parsing fails, include the task anyway
                        briefing_parts.append(f"  • {title}")
                        found_tasks = True
        
        if not found_tasks:
            briefing_parts.append("  No overdue tasks found.")
        briefing_parts.append("")
    except Exception as e:
        briefing_parts.append("DUE TASKS")
        briefing_parts.append(f"  Error retrieving tasks: {str(e)}")
        briefing_parts.append("")
    
    briefing_parts.append("=" * 60)
    
    return "\n".join(briefing_parts)


def find_and_block_focus_time(creds: Credentials) -> str:
    """
    Find the next 2-hour gap in the next 3 days and block it as "Deep Work".
    Returns the time blocked or error message.
    """
    from tools.calendar_tools import get_calendar_service
    from datetime import datetime, timedelta
    from dateutil import tz
    
    try:
        calendar_service = get_calendar_service(creds)
        
        # Get current time
        now = datetime.now(tz.tzlocal())
        end_search = now + timedelta(days=3)
        
        # Get all events in the next 3 days
        events_result = calendar_service.events().list(
            calendarId='primary',
            timeMin=now.isoformat(),
            timeMax=end_search.isoformat(),
            maxResults=250,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        
        events = events_result.get('items', [])
        
        # Convert to local timezone and sort by start time
        event_times = []
        for event in events:
            start = event['start'].get('dateTime')
            end = event['end'].get('dateTime')
            if start and end:
                try:
                    start_dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
                    end_dt = datetime.fromisoformat(end.replace('Z', '+00:00'))
                    # Convert to local timezone
                    start_local = start_dt.astimezone(tz.tzlocal())
                    end_local = end_dt.astimezone(tz.tzlocal())
                    event_times.append((start_local, end_local))
                except:
                    continue
        
        # Sort by start time
        event_times.sort(key=lambda x: x[0])
        
        # Business hours: 7am-6pm EST/EDT
        business_start = 7
        business_end = 18
        
        # Find a 2-hour gap
        current_time = now
        if current_time.hour < business_start:
            current_time = current_time.replace(hour=business_start, minute=0, second=0, microsecond=0)
        
        # Check gaps between events
        for start_event, end_event in event_times:
            # Check if there's a gap before this event
            if start_event > current_time:
                gap_duration = (start_event - current_time).total_seconds() / 3600  # hours
                # Check if gap is at least 2 hours and within business hours
                if gap_duration >= 2 and current_time.hour >= business_start and start_event.hour < business_end:
                    # Found a gap - block it
                    focus_start = current_time
                    focus_end = focus_start + timedelta(hours=2)
                    
                    # Convert to UTC for Google Calendar API
                    focus_start_utc = focus_start.astimezone(tz.UTC)
                    focus_end_utc = focus_end.astimezone(tz.UTC)
                    
                    # Create the event
                    event = {
                        'summary': 'Deep Work',
                        'description': 'Focus time blocked by Chief of Staff',
                        'start': {
                            'dateTime': focus_start_utc.strftime('%Y-%m-%dT%H:%M:%S') + 'Z',
                            'timeZone': 'UTC'
                        },
                        'end': {
                            'dateTime': focus_end_utc.strftime('%Y-%m-%dT%H:%M:%S') + 'Z',
                            'timeZone': 'UTC'
                        }
                    }
                    
                    created_event = calendar_service.events().insert(calendarId='primary', body=event).execute()
                    
                    start_str = focus_start.strftime('%A, %B %d at %I:%M %p')
                    return f"Blocked 2-hour focus time: {start_str} - {focus_end.strftime('%I:%M %p')}"
            
            # Update current_time to after this event
            if end_event > current_time:
                current_time = end_event
                # Move to next business hour if needed
                if current_time.hour >= business_end:
                    # Move to next day at 7am
                    current_time = current_time + timedelta(days=1)
                    current_time = current_time.replace(hour=business_start, minute=0, second=0, microsecond=0)
        
        # Check if there's a gap at the end of the search window
        if current_time < end_search:
            gap_duration = (end_search - current_time).total_seconds() / 3600
            if gap_duration >= 2 and current_time.hour >= business_start:
                focus_start = current_time
                focus_end = focus_start + timedelta(hours=2)
                
                # Convert to UTC for Google Calendar API
                focus_start_utc = focus_start.astimezone(tz.UTC)
                focus_end_utc = focus_end.astimezone(tz.UTC)
                
                event = {
                    'summary': 'Deep Work',
                    'description': 'Focus time blocked by Chief of Staff',
                    'start': {
                        'dateTime': focus_start_utc.strftime('%Y-%m-%dT%H:%M:%S') + 'Z',
                        'timeZone': 'UTC'
                    },
                    'end': {
                        'dateTime': focus_end_utc.strftime('%Y-%m-%dT%H:%M:%S') + 'Z',
                        'timeZone': 'UTC'
                    }
                }
                
                created_event = calendar_service.events().insert(calendarId='primary', body=event).execute()
                
                start_str = focus_start.strftime('%A, %B %d at %I:%M %p')
                return f"Blocked 2-hour focus time: {start_str} - {focus_end.strftime('%I:%M %p')}"
        
        return "No 2-hour gap found in the next 3 days during business hours (7am-6pm)."
        
    except Exception as e:
        import traceback
        return f"Error blocking focus time: {str(e)}\n{traceback.format_exc()[-500:]}"


def generate_meeting_prep(creds: Credentials) -> str:
    """
    Identify the next event, search Gmail/Drive for context on attendees, and return a summary.
    """
    from tools.calendar_tools import get_calendar_service
    from tools.gmail_tools import get_gmail_service
    from tools.drive_tools import get_drive_service, get_docs_service
    from datetime import datetime, timedelta
    from dateutil import tz
    
    try:
        calendar_service = get_calendar_service(creds)
        
        # Get next event
        now = datetime.now(tz.tzlocal())
        events_result = calendar_service.events().list(
            calendarId='primary',
            timeMin=now.isoformat(),
            maxResults=1,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        
        events = events_result.get('items', [])
        if not events:
            return "No upcoming events found."
        
        event = events[0]
        summary = event.get('summary', 'Untitled Event')
        start = event['start'].get('dateTime', event['start'].get('date'))
        description = event.get('description', '')
        attendees = event.get('attendees', [])
        
        # Parse start time
        try:
            if 'T' in start:
                start_dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
                start_local = start_dt.astimezone(tz.tzlocal())
                time_str = start_local.strftime('%A, %B %d at %I:%M %p')
            else:
                time_str = start
        except:
            time_str = start
        
        prep_parts = []
        prep_parts.append("=" * 60)
        prep_parts.append("MEETING PREP: " + summary)
        prep_parts.append("=" * 60)
        prep_parts.append(f"\nWhen: {time_str}")
        prep_parts.append("")
        
        # Get attendee emails
        attendee_emails = []
        attendee_names = []
        for attendee in attendees:
            email = attendee.get('email', '')
            name = attendee.get('displayName', email)
            if email:
                attendee_emails.append(email)
                attendee_names.append(name)
        
        if attendee_emails:
            prep_parts.append("Attendees:")
            for name in attendee_names:
                prep_parts.append(f"  • {name}")
            prep_parts.append("")
        
        if description:
            prep_parts.append("Description:")
            prep_parts.append(description)
            prep_parts.append("")
        
        # Search Gmail for recent emails with attendees
        context_parts = []
        if attendee_emails:
            try:
                gmail_service = get_gmail_service(creds)
                # Search for emails from/to attendees in last 30 days
                search_query = f"({' OR '.join([f'from:{email} OR to:{email}' for email in attendee_emails[:3]])}) newer_than:30d"
                results = gmail_service.users().messages().list(
                    userId='me',
                    q=search_query,
                    maxResults=5
                ).execute()
                
                messages = results.get('messages', [])
                if messages:
                    context_parts.append("Recent Email Context:")
                    for msg in messages[:3]:  # Top 3
                        msg_detail = gmail_service.users().messages().get(userId='me', id=msg['id']).execute()
                        payload = msg_detail['payload']
                        headers = payload.get('headers', [])
                        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
                        sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
                        context_parts.append(f"  • {subject} (from {sender})")
                    context_parts.append("")
            except Exception as e:
                context_parts.append(f"Note: Could not retrieve email context: {str(e)}")
        
        # Search Drive for relevant documents (search for attendee names or event summary)
        try:
            drive_service = get_drive_service(creds)
            # Search for documents mentioning the event summary or attendee names
            search_terms = [summary] + attendee_names[:2]
            for term in search_terms:
                if term and len(term) > 3:
                    results = drive_service.files().list(
                        q=f"fullText contains '{term}' and mimeType='application/vnd.google-apps.document'",
                        pageSize=3,
                        fields="files(id, name)"
                    ).execute()
                    files = results.get('files', [])
                    if files:
                        context_parts.append(f"Related Documents (mentioning '{term}'):")
                        for file in files[:2]:
                            context_parts.append(f"  • {file['name']}")
                        context_parts.append("")
                        break  # Only show results from first match
        except Exception as e:
            pass  # Silently fail on Drive search
        
        if context_parts:
            prep_parts.extend(context_parts)
        
        prep_parts.append("=" * 60)
        
        return "\n".join(prep_parts)
        
    except Exception as e:
        import traceback
        return f"Error generating meeting prep: {str(e)}\n{traceback.format_exc()[-500:]}"


def inbox_triage(creds: Credentials) -> List[Dict[str, str]]:
    """
    Read top 10 unread emails and return a list of dicts with: sender, subject, summary, suggested_action.
    For now, summary and suggested_action will be basic - can be enhanced with LLM later.
    """
    from tools.gmail_tools import get_gmail_service
    import base64
    
    try:
        gmail_service = get_gmail_service(creds)
        
        # Get top 10 unread emails
        results = gmail_service.users().messages().list(
            userId='me',
            q='is:unread',
            maxResults=10
        ).execute()
        
        messages = results.get('messages', [])
        if not messages:
            return []
        
        triage_list = []
        
        for msg in messages[:10]:
            try:
                msg_detail = gmail_service.users().messages().get(userId='me', id=msg['id']).execute()
                payload = msg_detail['payload']
                headers = payload.get('headers', [])
                
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
                sender_header = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
                # Extract email from sender
                sender = sender_header.split('<')[-1].replace('>', '').strip() if '<' in sender_header else sender_header
                
                # Get body for summary (first 200 chars)
                body = ""
                try:
                    if 'parts' in payload:
                        for part in payload['parts']:
                            if part['mimeType'] == 'text/plain':
                                data = part['body']['data']
                                body = base64.urlsafe_b64decode(data).decode('utf-8')
                                break
                    else:
                        if payload['mimeType'] == 'text/plain':
                            data = payload['body']['data']
                            body = base64.urlsafe_b64decode(data).decode('utf-8')
                except:
                    body = ""
                
                summary = body[:200].replace('\n', ' ').strip() if body else "No preview available"
                if len(summary) == 200:
                    summary += "..."
                
                # Basic suggested action (can be enhanced)
                suggested_action = "Review"
                if any(keyword in subject.lower() for keyword in ['urgent', 'asap', 'important']):
                    suggested_action = "Action Required"
                elif any(keyword in subject.lower() for keyword in ['meeting', 'calendar', 'schedule']):
                    suggested_action = "Check Calendar"
                
                triage_list.append({
                    'Sender': sender,
                    'Subject': subject,
                    'Summary': summary,
                    'Suggested Action': suggested_action
                })
            except Exception as e:
                # Skip this message if there's an error
                continue
        
        return triage_list
        
    except Exception as e:
        import traceback
        return [{'Sender': 'Error', 'Subject': 'Error retrieving emails', 'Summary': str(e), 'Suggested Action': 'Retry'}]
