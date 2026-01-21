"""
Shared utilities for Vonga OS agents.
"""

from typing import TypedDict, Annotated, List
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from datetime import datetime
from google.oauth2.credentials import Credentials


class AgentState(TypedDict):
    """State for agent graphs."""
    messages: Annotated[List[BaseMessage], add_messages]


class MemoryLogger:
    """Handles logging conversations and actions to Google Doc."""
    
    def __init__(self, creds: Credentials, doc_name: str = "Agent_Memory_Log"):
        self.creds = creds
        self.doc_id = None
        self.doc_name = doc_name
        self._ensure_memory_doc()
    
    def _ensure_memory_doc(self):
        """Ensure the memory document exists, create if not."""
        from googleapiclient.discovery import build
        
        docs_service = build('docs', 'v1', credentials=self.creds)
        drive_service = build('drive', 'v3', credentials=self.creds)
        
        # Search for existing document
        results = drive_service.files().list(
            q=f"name='{self.doc_name}' and mimeType='application/vnd.google-apps.document'",
            fields="files(id, name)"
        ).execute()
        
        files = results.get('files', [])
        
        if files:
            self.doc_id = files[0]['id']
        else:
            # Create new document
            doc = docs_service.documents().create(body={'title': self.doc_name}).execute()
            self.doc_id = doc.get('documentId')
            
            # Add initial header
            requests = [
                {
                    'insertText': {
                        'location': {'index': 1},
                        'text': f'{self.doc_name}\n\n'
                    }
                }
            ]
            docs_service.documents().batchUpdate(
                documentId=self.doc_id,
                body={'requests': requests}
            ).execute()
    
    def log_conversation(self, user_message: str, agent_response: str, agent_name: str = "Agent"):
        """Log a conversation turn to the memory doc."""
        from googleapiclient.discovery import build
        
        docs_service = build('docs', 'v1', credentials=self.creds)
        
        # Get current document end index
        doc = docs_service.documents().get(documentId=self.doc_id).execute()
        end_index = doc.get('body', {}).get('content', [{}])[-1].get('endIndex', 1)
        insert_index = end_index - 1
        
        timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
        
        log_text = f"\n\n--- {agent_name} Conversation Log ({timestamp}) ---\n"
        log_text += f"User: {user_message}\n\n"
        log_text += f"{agent_name}: {agent_response}\n"
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
    
    def log_action(self, action: str, details: str = "", agent_name: str = "Agent"):
        """Log an action (tool call) to the memory doc."""
        from googleapiclient.discovery import build
        
        docs_service = build('docs', 'v1', credentials=self.creds)
        
        # Get current document end index
        doc = docs_service.documents().get(documentId=self.doc_id).execute()
        end_index = doc.get('body', {}).get('content', [{}])[-1].get('endIndex', 1)
        insert_index = end_index - 1
        
        timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
        
        log_text = f"\n[{agent_name} Action Log {timestamp}] {action}"
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


def run_agent(agent, memory_logger: MemoryLogger, user_input: str, thread_id: str = "default", 
              progress_callback=None, agent_name: str = "Agent") -> str:
    """
    Run an agent with user input and return the response.
    
    Args:
        agent: Compiled LangGraph agent
        memory_logger: MemoryLogger instance
        user_input: User's message
        thread_id: Thread ID for maintaining conversation state
        progress_callback: Optional callback function(status_message) for progress updates
        agent_name: Name of the agent for logging
    
    Returns:
        Agent's response text
    """
    import time
    from langchain_core.messages import HumanMessage
    
    config = {"configurable": {"thread_id": thread_id}}
    timeout_seconds = 90  # 90 second timeout
    
    if progress_callback:
        progress_callback("🤔 Thinking...")
    
    start_time = time.time()
    
    try:
        # Invoke the agent (LangGraph will maintain state per thread_id using checkpointer)
        # Set recursion_limit in config to support batch operations
        config["recursion_limit"] = 30
        result = agent.invoke(
            {"messages": [HumanMessage(content=user_input)]},
            config
        )
        
        # Check if we exceeded timeout
        elapsed = time.time() - start_time
        if elapsed > timeout_seconds:
            return "⏱️ The request took too long to process. Please try rephrasing your request or breaking it into smaller parts."
        
    except Exception as e:
        if progress_callback:
            progress_callback(f"❌ Error: {str(e)}")
        raise
    
    # Extract the final response (last non-tool message)
    from langchain_core.messages import AIMessage
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
    memory_logger.log_conversation(user_input, final_response, agent_name=agent_name)
    
    return final_response
