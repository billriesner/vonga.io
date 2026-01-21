"""
Google Tasks tools for listing and creating tasks.
"""

from typing import List, Dict, Any, Optional
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from langchain.tools import BaseTool
from pydantic import BaseModel, Field


class TaskListInput(BaseModel):
    """Input for listing tasks."""
    tasklist_id: Optional[str] = Field(default=None, description="Task list ID (default: '@default')")
    max_results: int = Field(default=10, description="Maximum number of tasks to return")
    show_completed: bool = Field(default=False, description="Whether to include completed tasks")


class TaskCreateInput(BaseModel):
    """Input for creating a task."""
    title: str = Field(description="Task title")
    notes: Optional[str] = Field(default=None, description="Task notes/description")
    due_date: Optional[str] = Field(default=None, description="Due date in RFC3339 format (e.g., '2024-01-15T00:00:00Z')")
    tasklist_id: Optional[str] = Field(default=None, description="Task list ID (default: '@default')")


def get_tasks_service(creds: Credentials):
    """Get Tasks API service."""
    return build('tasks', 'v1', credentials=creds)


class TaskListTool(BaseTool):
    """Tool for listing Google Tasks."""
    name: str = "tasks_list"
    description: str = "List tasks from a Google Tasks list. Defaults to the default task list."
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, tasklist_id: str = '@default', max_results: int = 10, show_completed: bool = False) -> str:
        """Execute the list."""
        try:
            service = get_tasks_service(self.creds)
            
            results = service.tasks().list(
                tasklist=tasklist_id,
                maxResults=max_results,
                showCompleted=show_completed
            ).execute()
            
            tasks = results.get('items', [])
            
            if not tasks:
                return f"No tasks found in list {tasklist_id}"
            
            output = []
            for task in tasks:
                title = task.get('title', 'Untitled')
                task_id = task.get('id')
                status = task.get('status', 'needsAction')
                due = task.get('due', 'No due date')
                notes = task.get('notes', '')
                
                output.append({
                    'id': task_id,
                    'title': title,
                    'status': status,
                    'due': due,
                    'notes': notes[:50] if notes else ''
                })
            
            return f"Found {len(output)} tasks:\n" + "\n".join([
                f"- {t['title']} (ID: {t['id']}, Status: {t['status']}, Due: {t['due']})"
                for t in output
            ])
        except Exception as e:
            return f"Error listing tasks: {str(e)}"
    
    async def _arun(self, tasklist_id: str = '@default', max_results: int = 10, show_completed: bool = False) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class TaskCreateTool(BaseTool):
    """Tool for creating a new Google Task."""
    name: str = "tasks_create"
    description: str = "Create a new task in Google Tasks. Requires a title."
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, title: str, notes: str = None, due_date: str = None, tasklist_id: str = '@default') -> str:
        """Execute the creation."""
        try:
            service = get_tasks_service(self.creds)
            
            task_body = {
                'title': title
            }
            
            if notes:
                task_body['notes'] = notes
            
            if due_date:
                task_body['due'] = due_date
            
            created_task = service.tasks().insert(
                tasklist=tasklist_id,
                body=task_body
            ).execute()
            
            task_id = created_task.get('id')
            return f"Task created successfully! Title: {title}, ID: {task_id}"
        except Exception as e:
            return f"Error creating task: {str(e)}"
    
    async def _arun(self, title: str, notes: str = None, due_date: str = None, tasklist_id: str = '@default') -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_task_tools(creds: Credentials) -> List[BaseTool]:
    """Get all Tasks tools."""
    return [
        TaskListTool(creds=creds),
        TaskCreateTool(creds=creds),
    ]

