"""
Web search tools for accessing external information via Google Search.
"""

from typing import List, Optional
from langchain.tools import BaseTool
from pydantic import BaseModel, Field
import requests
import os


class GoogleSearchTool(BaseTool):
    """Tool for searching the web using Google Custom Search API."""
    name: str = "google_search"
    description: str = """Search the internet using Google Search to find current information, news, facts, or any external data.
    Use this tool when you need:
    - Current events, news, or recent information
    - Facts or data not in the knowledge base
    - Information about companies, people, or topics
    - Real-time information that changes frequently
    
    REQUIRES: query (string) - the search query to execute.
    OPTIONAL: num_results (int, default=5) - number of results to return (1-10).
    
    Returns a list of search results with titles, snippets, and URLs."""
    
    # Store credentials as instance variables (not Pydantic fields)
    _api_key: str = None
    _search_engine_id: str = None
    
    def __init__(self, api_key: str = None, search_engine_id: str = None, **kwargs):
        super().__init__(**kwargs)
        self._api_key = api_key or os.getenv("GOOGLE_SEARCH_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self._search_engine_id = search_engine_id or os.getenv("GOOGLE_SEARCH_ENGINE_ID")
        
        if not self._api_key:
            raise ValueError("Google Search API key not found. Set GOOGLE_SEARCH_API_KEY or GOOGLE_API_KEY environment variable.")
        if not self._search_engine_id:
            raise ValueError("Google Search Engine ID not found. Set GOOGLE_SEARCH_ENGINE_ID environment variable.")
    
    def _run(self, query: str, num_results: int = 5) -> str:
        """Execute the search."""
        try:
            # Validate num_results
            num_results = max(1, min(10, int(num_results)))
            
            # Google Custom Search API endpoint
            url = "https://www.googleapis.com/customsearch/v1"
            
            params = {
                "key": self._api_key,
                "cx": self._search_engine_id,
                "q": query,
                "num": num_results
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Parse results
            items = data.get("items", [])
            
            if not items:
                return f"No results found for: {query}"
            
            results = []
            results.append(f"Found {len(items)} result(s) for: {query}\n")
            
            for i, item in enumerate(items, 1):
                title = item.get("title", "No title")
                snippet = item.get("snippet", "No description")
                link = item.get("link", "")
                
                results.append(f"\n--- Result {i} ---")
                results.append(f"Title: {title}")
                results.append(f"Description: {snippet}")
                results.append(f"URL: {link}")
            
            return "\n".join(results)
            
        except requests.exceptions.RequestException as e:
            return f"Error performing Google search: {str(e)}. Please check your API key and search engine ID."
        except Exception as e:
            return f"Error: {str(e)}"
    
    async def _arun(self, query: str, num_results: int = 5) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_search_tools(api_key: str = None, search_engine_id: str = None) -> List[BaseTool]:
    """Get all search tools."""
    try:
        return [
            GoogleSearchTool(api_key=api_key, search_engine_id=search_engine_id),
        ]
    except ValueError as e:
        # If API key or engine ID not configured, return empty list
        print(f"Warning: Search tools not available: {str(e)}")
        return []
