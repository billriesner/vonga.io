"""
Knowledge base tools for the agent to search and retrieve business information.
"""

from typing import List, Optional
from langchain.tools import BaseTool
from pydantic import BaseModel, Field
from google.oauth2.credentials import Credentials
from knowledge_base import KnowledgeBase, initialize_knowledge_base


class KnowledgeSearchInput(BaseModel):
    """Input for searching the knowledge base."""
    query: str = Field(description="Search query to find relevant business information")
    n_results: int = Field(default=5, description="Number of results to return (default: 5)")


class KnowledgeSearchTool(BaseTool):
    """Tool for searching the business knowledge base."""
    name: str = "knowledge_base_search"
    description: str = """Search the business knowledge base for information about Vonga.
    This knowledge base contains indexed information from Google Drive documents.
    Use this tool when you need to find information about:
    - Company strategy, roadmap, or plans
    - Business processes or procedures
    - Historical information or context
    - Any business-related information that might be in company documents
    
    The tool will return relevant excerpts from indexed documents. Use this information
    to provide accurate, context-aware responses."""
    knowledge_base: KnowledgeBase = Field(exclude=True)
    
    def __init__(self, knowledge_base: KnowledgeBase, **kwargs):
        super().__init__(knowledge_base=knowledge_base, **kwargs)
    
    def _run(self, query: str, n_results: int = 5) -> str:
        """Execute the search."""
        try:
            results = self.knowledge_base.search(query, n_results=n_results)
            
            if not results:
                return f"No relevant information found for: {query}"
            
            output = [f"Found {len(results)} relevant result(s) for: {query}\n"]
            
            for i, result in enumerate(results, 1):
                output.append(f"\n--- Result {i} (from: {result['file_name']}) ---")
                output.append(result['content'])
                output.append(f"[Source: {result['file_name']}, File ID: {result['file_id']}]")
            
            return "\n".join(output)
        except Exception as e:
            return f"Error searching knowledge base: {str(e)}"
    
    async def _arun(self, query: str, n_results: int = 5) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_knowledge_tools(knowledge_base: KnowledgeBase) -> List[BaseTool]:
    """Get all knowledge base tools."""
    return [
        KnowledgeSearchTool(knowledge_base=knowledge_base),
    ]

