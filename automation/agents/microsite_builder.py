"""
Microsite Builder Agent for Vonga OS.
Takes a microsite spec and builds a complete, deployed microsite.
"""

import os
import re
from typing import TypedDict, Annotated, List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import BaseTool
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage, BaseMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph.message import add_messages
from google.oauth2.credentials import Credentials

from agents.shared import MemoryLogger, run_agent
from agents.model_config import get_model_name
from tools.drive_tools import read_google_doc_by_url, get_drive_tools
from tools.copywriter_tools import get_copywriter_tools
from tools.learning_tools import get_learning_tools, load_learned_facts


class MicrositeBuilderState(TypedDict):
    """State for the Microsite Builder agent graph."""
    messages: Annotated[List, add_messages]
    spec_content: str
    polished_copy: dict
    image_paths: dict
    file_structure: dict


def parse_microsite_spec(spec_content: str) -> dict:
    """
    Parse the microsite spec document to extract structured sections.
    
    Returns a dictionary with:
    - hero_headline, hero_subheadline, hero_image_suggestion
    - value_props (list of dicts with headline, copy, media_suggestion)
    - features_section
    - social_proof
    - cta_headline, cta_button_text, cta_subtext
    - design_notes
    - company_name
    """
    parsed = {
        'company_name': '',
        'hero_headline': '',
        'hero_subheadline': '',
        'hero_image_suggestion': '',
        'value_props': [],
        'features_section': '',
        'social_proof': '',
        'cta_headline': '',
        'cta_button_text': '',
        'cta_subtext': '',
        'design_notes': ''
    }
    
    # Extract company name from title
    title_match = re.search(r'Microsite Spec:\s*(.+)', spec_content, re.IGNORECASE)
    if title_match:
        company_name_val = title_match.group(1)
        parsed['company_name'] = company_name_val.strip() if isinstance(company_name_val, str) else str(company_name_val).strip()
    
    # Extract Hero Section
    hero_match = re.search(r'HERO SECTION\s*Headline:\s*(.+?)(?:\n|Subheadline:)', spec_content, re.IGNORECASE | re.DOTALL)
    if hero_match:
        headline_val = hero_match.group(1)
        parsed['hero_headline'] = headline_val.strip() if isinstance(headline_val, str) else str(headline_val).strip()
    
    subheadline_match = re.search(r'Subheadline:\s*(.+?)(?:\n|Image/Video)', spec_content, re.IGNORECASE | re.DOTALL)
    if subheadline_match:
        subheadline_val = subheadline_match.group(1)
        parsed['hero_subheadline'] = subheadline_val.strip() if isinstance(subheadline_val, str) else str(subheadline_val).strip()
    
    image_match = re.search(r'Image/Video Suggestion:\s*(.+?)(?:\n|VALUE PROPOSITIONS|$)', spec_content, re.IGNORECASE | re.DOTALL)
    if image_match:
        image_val = image_match.group(1)
        parsed['hero_image_suggestion'] = image_val.strip() if isinstance(image_val, str) else str(image_val).strip()
    
    # Extract Value Propositions
    vp_section = re.search(r'VALUE PROPOSITIONS\s*(.+?)(?:\nFEATURES|$)', spec_content, re.IGNORECASE | re.DOTALL)
    if vp_section:
        vp_text = vp_section.group(1)
        # Extract each value prop
        for i in range(1, 4):
            vp_match = re.search(rf'Value Prop {i}:\s*Headline:\s*(.+?)\s*Copy:\s*(.+?)\s*Media Suggestion:\s*(.+?)(?:\nValue Prop|$)', vp_text, re.IGNORECASE | re.DOTALL)
            if vp_match:
                headline_val = vp_match.group(1)
                copy_val = vp_match.group(2)
                media_val = vp_match.group(3)
                parsed['value_props'].append({
                    'headline': headline_val.strip() if isinstance(headline_val, str) else str(headline_val).strip(),
                    'copy': copy_val.strip() if isinstance(copy_val, str) else str(copy_val).strip(),
                    'media_suggestion': media_val.strip() if isinstance(media_val, str) else str(media_val).strip()
                })
    
    # Extract Features
    features_match = re.search(r'FEATURES & BENEFITS\s*(.+?)(?:\nSOCIAL PROOF|$)', spec_content, re.IGNORECASE | re.DOTALL)
    if features_match:
        features_val = features_match.group(1)
        parsed['features_section'] = features_val.strip() if isinstance(features_val, str) else str(features_val).strip()
    
    # Extract Social Proof
    social_match = re.search(r'SOCIAL PROOF\s*(.+?)(?:\nCALL TO ACTION|$)', spec_content, re.IGNORECASE | re.DOTALL)
    if social_match:
        social_val = social_match.group(1)
        parsed['social_proof'] = social_val.strip() if isinstance(social_val, str) else str(social_val).strip()
    
    # Extract CTA
    cta_headline_match = re.search(r'CALL TO ACTION\s*Headline:\s*(.+?)(?:\n|Button Text:)', spec_content, re.IGNORECASE | re.DOTALL)
    if cta_headline_match:
        cta_headline_val = cta_headline_match.group(1)
        parsed['cta_headline'] = cta_headline_val.strip() if isinstance(cta_headline_val, str) else str(cta_headline_val).strip()
    
    cta_button_match = re.search(r'Button Text:\s*(.+?)(?:\n|Supporting Text:)', spec_content, re.IGNORECASE | re.DOTALL)
    if cta_button_match:
        cta_button_val = cta_button_match.group(1)
        parsed['cta_button_text'] = cta_button_val.strip() if isinstance(cta_button_val, str) else str(cta_button_val).strip()
    
    cta_subtext_match = re.search(r'Supporting Text:\s*(.+?)(?:\nDESIGN NOTES|$)', spec_content, re.IGNORECASE | re.DOTALL)
    if cta_subtext_match:
        cta_subtext_val = cta_subtext_match.group(1)
        parsed['cta_subtext'] = cta_subtext_val.strip() if isinstance(cta_subtext_val, str) else str(cta_subtext_val).strip()
    
    # Extract Design Notes
    design_match = re.search(r'DESIGN NOTES\s*(.+?)$', spec_content, re.IGNORECASE | re.DOTALL)
    if design_match:
        design_val = design_match.group(1)
        parsed['design_notes'] = design_val.strip() if isinstance(design_val, str) else str(design_val).strip()
    
    return parsed


def create_microsite_agent(creds: Credentials, api_key: str = None):
    """
    Create and configure the Microsite Builder agent.
    
    Args:
        creds: Google credentials for API access
        api_key: Google Gemini API key
    
    Returns:
        Compiled LangGraph agent and MemoryLogger
    """
    # Initialize LLM
    llm = ChatGoogleGenerativeAI(
        model=get_model_name("microsite_builder"),
        google_api_key=api_key,
        temperature=0.8,  # Creative but structured
        convert_system_message_to_human=True
    )
    
    # Get tools
    all_tools = []
    all_tools.extend(get_drive_tools(creds))  # Includes create_microsite_build_prompt
    all_tools.extend(get_copywriter_tools(creds, api_key))  # For refine_copy
    # Add learning tools
    all_tools.extend(get_learning_tools(creds))
    
    # Debug: Print tool names
    tool_names = [tool.name for tool in all_tools]
    print(f"✓ Microsite Builder tools enabled: {', '.join(tool_names)}")
    
    # Bind tools to LLM
    llm_with_tools = llm.bind_tools(all_tools)
    
    # Create tool node
    tool_node = ToolNode(all_tools)
    
    # Initialize memory logger
    memory_logger = MemoryLogger(creds, doc_name="Microsite_Builder_Memory_Log")
    
    # Load learned facts, preferences, and insights
    learned_context = load_learned_facts(creds)
    
    # System prompt
    learned_section = ""
    if learned_context:
        # Escape any curly braces in learned_context to prevent f-string format errors
        safe_learned_context = str(learned_context).replace("{", "{{").replace("}", "}}")
        learned_section = f"""
LEARNED INFORMATION (Remember these across all conversations):
{safe_learned_context}

IMPORTANT: Always follow user preferences and remember learned facts. Use store_fact, store_preference, or store_insight tools when the user asks you to remember something.
"""
    
    system_prompt = """You are the Vonga Microsite Architect.
""" + learned_section + """
You take a raw sales spec and create a comprehensive build prompt document with detailed instructions for image generation (NanoBanana) and microsite building (Cursor).

MANDATORY WORKFLOW - YOU MUST EXECUTE ALL STEPS USING TOOLS:

1. **Read Spec:**
   - IMMEDIATELY use `read_google_doc_by_url` tool to read the Microsite Spec document
   - Parse the spec to extract: Hero section, Value Props, Features, CTA, Design Notes

2. **Draft Copy (MANDATORY):**
   - For EVERY section (Hero Headline, Hero Subheadline, Value Prop headlines/copy, CTA headline/button), you MUST use the `refine_copy` tool
   - Channel: "Microsite" for all sections
   - Target Audience: Extract from the spec or use "B2B decision makers"
   - DO NOT skip this step - always refine copy through the tool

3. **Create Image Generation Prompt (MANDATORY):**
   - Based on the hero_image_suggestion from the spec, create a DETAILED, SPECIFIC prompt for NanoBanana (Google Gemini 2.5 Flash Image)
   - The prompt should be highly detailed, including:
     * Specific visual style (moody, cinematic, professional)
     * Color palette (deep navy #0A1422 background, aqua #33BECC and coral #FF7F50 accents)
     * Composition and layout details
     * Mood and atmosphere
     * Any specific elements or imagery mentioned in the spec
   - Example: "A moody, cinematic hero background image with deep navy (#0A1422) base, featuring elegant aqua (#33BECC) and coral (#FF7F50) energy light strands. Professional B2B aesthetic, slightly abstract, suitable for overlay text. Resolution: 1920x1080, high quality, subtle depth of field."
   - Make the prompt specific enough that it requires minimal editing

4. **Create HTML Structure Description:**
   - Describe the HTML structure and layout in detail:
     * Overall page layout (single-page scroll, sections, etc.)
     * Hero section structure (full-width, image background, overlay text positioning)
     * Value propositions layout (grid, cards, spacing)
     * Features section layout
     * CTA section design
     * Responsive breakpoints and mobile behavior
   - Be specific about Tailwind CSS classes, component structure, and responsive design approach

5. **Create Build Prompt Document (MANDATORY - FINAL STEP):**
   - Use the `create_microsite_build_prompt` tool with ALL polished content:
     * company_name: From the spec
     * hero_headline: Polished headline from refine_copy
     * hero_subheadline: Polished subheadline from refine_copy
     * hero_image_prompt: The detailed NanoBanana prompt you created in step 3
     * value_prop_1_headline, value_prop_1_copy: Polished from refine_copy
     * value_prop_2_headline, value_prop_2_copy: Polished from refine_copy
     * value_prop_3_headline, value_prop_3_copy: Polished from refine_copy
     * features_section: From spec (can be enhanced)
     * social_proof: From spec
     * cta_headline, cta_button_text, cta_subtext: All polished from refine_copy
     * design_notes: From spec + Vonga brand guidelines
     * html_structure_description: Your detailed structure description from step 4
   - The tool will create a formatted Google Doc with:
     * Image generation prompts for NanoBanana
     * Complete microsite build instructions for Cursor
   - Return the document URL as your final output

ABSOLUTE REQUIREMENTS - NO EXCEPTIONS:
- **Always polish copy first** - Never use raw spec copy, always refine it through `refine_copy` tool
- **Create highly detailed prompts** - Image prompts and build instructions must be specific enough to require minimal rework
- **Use the create_microsite_build_prompt tool** - This is your final output, create it with all polished content
- **Be specific and detailed** - The prompts should be production-ready with minimal editing needed

YOUR AVAILABLE TOOLS:
- `read_google_doc_by_url`: Read the microsite spec
- `refine_copy`: Polish all copy sections (MANDATORY - use for all headlines and copy)
- `create_microsite_build_prompt`: Create the final build prompt document (MANDATORY - final step)

EXAMPLE WORKFLOW:
1. User: "Build microsite from spec: https://docs.google.com/document/d/..."
2. You: [IMMEDIATELY] Use `read_google_doc_by_url` tool to read the spec
3. You: [IMMEDIATELY] Use `refine_copy` tool for each copy section (hero headline, hero subheadline, all value prop headlines/copy, CTA headline/button)
4. You: Create a detailed NanoBanana image generation prompt based on hero_image_suggestion
5. You: Create a detailed HTML structure description
6. You: [IMMEDIATELY] Use `create_microsite_build_prompt` tool with all polished content, detailed image prompt, and HTML structure description
7. You: Return the document URL: "✅ Build Prompt Document Created: [URL]"

YOUR OUTPUT: The Google Doc URL containing detailed prompts for image generation and microsite building.
"""
    
    # Create the graph
    workflow = StateGraph(MicrositeBuilderState)
    
    # Define nodes
    def should_continue(state: MicrositeBuilderState):
        """Determine if we should continue or end."""
        messages = state["messages"]
        last_message = messages[-1]
        
        # If the last message is from the AI and has no tool calls, we're done
        if isinstance(last_message, AIMessage):
            if not hasattr(last_message, 'tool_calls') or not last_message.tool_calls:
                return END
        
        # Otherwise, use tools
        return "tools"
    
    def call_model(state: MicrositeBuilderState):
        """Call the LLM with tools."""
        messages = state["messages"]
        response = llm_with_tools.invoke(messages)
        return {"messages": [response]}
    
    # Add nodes
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", tool_node)
    
    # Set entry point
    workflow.set_entry_point("agent")
    
    # Add conditional edges
    workflow.add_conditional_edges(
        "agent",
        should_continue,
        {
            "tools": "tools",
            END: END
        }
    )
    
    # Add edge from tools back to agent
    workflow.add_edge("tools", "agent")
    
    # Compile with memory
    checkpointer = MemorySaver()
    compiled_agent = workflow.compile(checkpointer=checkpointer)
    
    return compiled_agent, memory_logger


def run_microsite_builder(agent, memory_logger: MemoryLogger, spec_url: str, creds: Credentials, api_key: str = None,
                          thread_id: str = "microsite_default", progress_callback=None) -> str:
    """Run the microsite builder agent with a spec URL."""
    import time
    from langchain_core.messages import HumanMessage
    
    config = {"configurable": {"thread_id": thread_id}}
    timeout_seconds = 300  # 5 minutes for full build process
    
    if progress_callback:
        progress_callback("Initializing microsite builder...")
    
    start_time = time.time()
    
    try:
        # Build the prompt
        user_input = f"""Create a comprehensive build prompt document for this microsite spec: {spec_url}

MANDATORY STEPS - USE YOUR TOOLS:
1. Use `read_google_doc_by_url` to read the spec document
2. Use `refine_copy` tool for ALL copy sections:
   - Hero headline
   - Hero subheadline
   - All three value proposition headlines
   - All three value proposition copy sections
   - CTA headline
   - CTA button text
   - CTA supporting text
3. Create a DETAILED image generation prompt for NanoBanana:
   - Based on the hero_image_suggestion from the spec
   - Include specific style (moody, cinematic), colors (deep navy #0A1422, aqua #33BECC, coral #FF7F50), composition, mood
   - Make it production-ready with minimal editing needed
4. Create a DETAILED HTML structure description:
   - Layout, sections, responsive design approach
   - Tailwind CSS structure, component organization
   - Mobile behavior and breakpoints
5. Use `create_microsite_build_prompt` tool with:
   - All polished copy from step 2
   - Your detailed image prompt from step 3
   - Your HTML structure description from step 4
   - All other content from the spec (features, social proof, design notes)
6. Return the Google Doc URL from the tool response

The document will contain detailed prompts for:
- Image generation (NanoBanana)
- Microsite building (Cursor)

All prompts must be specific and production-ready."""
        
        # Initialize state
        initial_state = {
            "messages": [HumanMessage(content=user_input)],
            "spec_content": "",
            "polished_copy": {},
            "image_paths": {},
            "file_structure": {}
        }
        
        # Invoke the agent
        config["recursion_limit"] = 60  # Higher limit for complex workflow
        result = agent.invoke(initial_state, config)
        
        # Check if we exceeded timeout
        elapsed = time.time() - start_time
        if elapsed > timeout_seconds:
            return "⏱️ The request took too long to process. Please try again or check the spec URL."
        
    except Exception as e:
        if progress_callback:
            progress_callback(f"❌ Error: {str(e)}")
        raise
    
    # Extract the final response
    messages = result.get("messages", [])
    final_response = None
    
    if progress_callback:
        progress_callback(f"Processing {len(messages)} messages to extract response...")
    
    # Find the final AI response (prefer one without tool calls)
    for msg in reversed(messages):
        if isinstance(msg, AIMessage):
            has_tool_calls = hasattr(msg, 'tool_calls') and msg.tool_calls
            if not has_tool_calls and msg.content:
                final_response = msg.content
                if progress_callback:
                    progress_callback(f"Found final response: {final_response[:100]}...")
                break
    
    # If no final response without tool calls, get the last message
    if not final_response:
        if messages:
            last_msg = messages[-1]
            if hasattr(last_msg, 'content') and last_msg.content:
                final_response = last_msg.content
            else:
                final_response = str(last_msg)
        else:
            final_response = "No response generated. Please check the logs for details."
    
    # If response is still empty or very short, provide a summary
    final_response_str = str(final_response) if final_response else ""
    if not final_response_str or len(final_response_str.strip()) < 10:
        # Check if there were any tool calls that might indicate progress
        tool_calls_made = []
        for msg in messages:
            if hasattr(msg, 'tool_calls') and msg.tool_calls:
                for tool_call in msg.tool_calls:
                    tool_calls_made.append(tool_call.get('name', 'unknown'))
        
        if tool_calls_made:
            final_response = f"Microsite build process completed. Tools used: {', '.join(set(tool_calls_made))}. However, no final response was generated. Please check if the GitHub repository was created successfully."
        else:
            final_response = "Microsite build process completed, but no response was generated. The agent may have encountered an issue. Please try again or check the logs."
    
    if progress_callback:
        progress_callback(f"Final response: {final_response[:200]}...")
    
    # Log to memory
    try:
        memory_logger.log_interaction(f"Build microsite from: {spec_url}", final_response)
    except Exception as e:
        print(f"Warning: Could not log to memory: {str(e)}")
    
    return final_response




