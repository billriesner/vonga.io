"""
Copywriter tools for Vonga OS.
Tools that agents can use to refine copy.
"""

from typing import Optional
from langchain.tools import BaseTool
from pydantic import Field
from google.oauth2.credentials import Credentials

from agents.copywriter import refine_copy


class RefineCopyTool(BaseTool):
    """Tool for refining copy based on brand voice and channel."""
    name: str = "refine_copy"
    description: str = """Refine copy text to match Vonga's brand voice and optimize for a specific channel.
    
    REQUIRES:
    - draft_text (string): The raw draft text to refine
    - channel (string): The channel (e.g., "Website", "Email", "Social", "Microsite")
    - target_audience (string): Description of the target audience (e.g., "B2B decision makers", "Marketing directors")
    
    Returns the refined copy text optimized for the channel and audience."""
    
    creds: Credentials = Field(exclude=True)
    api_key: Optional[str] = Field(default=None, exclude=True)
    
    def __init__(self, creds: Credentials, api_key: str = None, **kwargs):
        super().__init__(creds=creds, api_key=api_key, **kwargs)
    
    def _run(self, draft_text: str, channel: str, target_audience: str) -> str:
        """Execute the copy refinement."""
        return refine_copy(draft_text, channel, target_audience, self.creds, self.api_key)
    
    async def _arun(self, draft_text: str, channel: str, target_audience: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_copywriter_tools(creds: Credentials, api_key: str = None) -> list:
    """Get copywriter tools."""
    return [RefineCopyTool(creds=creds, api_key=api_key)]




