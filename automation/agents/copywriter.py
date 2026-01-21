"""
Copywriter Agent for Vonga OS.
Refines copy based on brand voice guidelines and channel requirements.
"""

import os
from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from google.oauth2.credentials import Credentials

from agents.model_config import get_model_name
from tools.drive_tools import read_google_doc_by_name


def load_brand_voice(creds: Credentials) -> str:
    """
    Load 01_Brand_Voice_Guidelines from Google Drive.
    Returns the content to inject into system prompt.
    """
    try:
        content = read_google_doc_by_name(creds, "01_Brand_Voice_Guidelines")
        if content.startswith("Error:"):
            return "[BRAND VOICE GUIDELINES NOT FOUND - Please ensure 01_Brand_Voice_Guidelines exists in Google Drive]"
        return content
    except Exception as e:
        return f"[ERROR LOADING BRAND VOICE: {str(e)}]"


def refine_copy(draft_text: str, channel: str, target_audience: str, creds: Credentials, api_key: str = None) -> str:
    """
    Refine copy based on brand voice guidelines and channel requirements.
    
    Args:
        draft_text: The raw draft text to refine
        channel: The channel (e.g., "Website", "Email", "Social", "Microsite")
        target_audience: Description of the target audience
        creds: Google credentials for API access
        api_key: Google Gemini API key (optional)
    
    Returns:
        Refined copy text
    """
    # Load brand voice guidelines
    brand_voice = load_brand_voice(creds)
    
    # Initialize LLM
    llm = ChatGoogleGenerativeAI(
        model=get_model_name("copywriter"),
        google_api_key=api_key,
        temperature=0.7,  # Balanced for creative but consistent output
        convert_system_message_to_human=True
    )
    
    # Build system prompt
    system_prompt = f"""You are the Voice of Vonga. You take raw information and transform it into sharp, compelling copy.

BRAND VOICE GUIDELINES:
{brand_voice}

CHANNEL SPECIFICS:
- If 'Website' or 'Microsite': Short, punchy, benefit-driven headers. Clear value propositions. Action-oriented CTAs.
- If 'Email': Personal, conversational, clear CTA. Build connection, then ask for action.
- If 'Social': Concise, engaging, shareable. Use hooks and emotional triggers.
- If 'Ad': Attention-grabbing headline, clear benefit, strong CTA.

TARGET AUDIENCE: {target_audience}

YOUR JOB:
Rewrite the input text to be perfect for the specified channel and audience. 
- Maintain Vonga's brand voice from the guidelines
- Optimize for the channel's format and best practices
- Keep it compelling and action-oriented
- Return ONLY the rewritten text, no explanations or meta-commentary

CRITICAL: Your output must be the refined copy ONLY. Do not include any preamble, explanations, or formatting markers."""
    
    # Build user prompt
    user_prompt = f"""Channel: {channel}
Target Audience: {target_audience}

Draft Text to Refine:
{draft_text}

Please refine this copy for the {channel} channel, targeting {target_audience}, following Vonga's brand voice guidelines. Return ONLY the refined copy."""
    
    try:
        # Get response
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]
        response = llm.invoke(messages)
        
        # Extract the refined copy
        refined_copy = response.content.strip()
        
        # Clean up any markdown formatting or explanations
        if refined_copy.startswith("```"):
            # Remove markdown code blocks
            lines = refined_copy.split('\n')
            refined_copy = '\n'.join([line for line in lines if not line.strip().startswith('```')])
        
        # Remove any "Refined copy:" or similar prefixes
        prefixes = ["Refined copy:", "Refined:", "Here's the refined copy:", "Copy:"]
        for prefix in prefixes:
            if refined_copy.startswith(prefix):
                refined_copy = refined_copy[len(prefix):].strip()
        
        return refined_copy
        
    except Exception as e:
        return f"Error refining copy: {str(e)}. Original text: {draft_text}"




