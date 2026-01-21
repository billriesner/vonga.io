"""
Head of Sales Agent for Vonga OS.
Handles the entire sales lifecycle: Research -> Pitch -> Admin.
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
from tools.drive_tools import read_google_doc_by_name, get_drive_tools
from tools.gmail_tools import get_gmail_tools
from tools.calendar_tools import get_calendar_tools
from tools.task_tools import get_task_tools
from tools.crm_tools import get_crm_tools
from tools.sheet_tools import get_sheet_tools
from tools.learning_tools import get_learning_tools, load_learned_facts

try:
    from langchain_community.tools.tavily_search import TavilySearchResults
except ImportError:
    try:
        from langchain_tavily import TavilySearch
        TavilySearchResults = TavilySearch
    except ImportError:
        TavilySearchResults = None


class SalesState(TypedDict):
    """State for the Sales agent graph."""
    messages: Annotated[List, add_messages]
    product_context: str  # Product specs context loaded from Google Drive


def load_vonga_context(creds: Credentials) -> str:
    """
    Load all internal Vonga documentation from Google Drive.
    Returns combined content to inject into system prompt.
    """
    context_parts = []
    
    # Load Strategy Prime
    try:
        strategy_content = read_google_doc_by_name(creds, "00_Strategy_Prime")
        if not strategy_content.startswith("Error:"):
            context_parts.append("=== STRATEGY PRIME ===\n" + strategy_content + "\n\n")
        else:
            context_parts.append("[STRATEGY PRIME NOT FOUND]\n\n")
    except Exception as e:
        context_parts.append(f"[ERROR LOADING STRATEGY PRIME: {str(e)}]\n\n")
    
    # Load Brand Voice Guidelines
    try:
        brand_content = read_google_doc_by_name(creds, "01_Brand_Voice_Guidelines")
        if not brand_content.startswith("Error:"):
            context_parts.append("=== BRAND VOICE GUIDELINES ===\n" + brand_content + "\n\n")
        else:
            context_parts.append("[BRAND VOICE GUIDELINES NOT FOUND]\n\n")
    except Exception as e:
        context_parts.append(f"[ERROR LOADING BRAND VOICE: {str(e)}]\n\n")
    
    # Load Product Specs
    try:
        product_content = read_google_doc_by_name(creds, "03_Product_Specs")
        if not product_content.startswith("Error:"):
            context_parts.append("=== PRODUCT SPECS ===\n" + product_content + "\n\n")
        else:
            context_parts.append("[PRODUCT SPECS NOT FOUND - Please ensure 03_Product_Specs exists in Google Drive]\n\n")
    except Exception as e:
        context_parts.append(f"[ERROR LOADING PRODUCT SPECS: {str(e)}]\n\n")
    
    return "".join(context_parts)


def create_sales_agent(creds: Credentials, api_key: str = None, tavily_api_key: str = None):
    """
    Create and configure the Sales agent.
    
    Args:
        creds: Google credentials for API access
        api_key: Google Gemini API key
        tavily_api_key: Tavily API key (optional, can use env var)
    
    Returns:
        Compiled LangGraph agent and MemoryLogger
    """
    # Initialize LLM with model from centralized config
    llm = ChatGoogleGenerativeAI(
        model=get_model_name("sales"),
        google_api_key=api_key,
        temperature=0.85,
        convert_system_message_to_human=True
    )
    
    # Get Tavily API key
    tavily_key = tavily_api_key or os.getenv("TAVILY_API_KEY")
    if not tavily_key:
        print("Warning: TAVILY_API_KEY not found. Tavily search will not be available.")
        tavily_key = None
    
    # Initialize tools
    all_tools = []
    
    # Add Tavily search tool
    if tavily_key and TavilySearchResults:
        try:
            tavily_tool = TavilySearchResults(
                api_key=tavily_key,
                max_results=10,
                description="Search the web for companies, their websites, About Us pages, news, pain points, and strategy information. Use this for deep research on target companies."
            )
            all_tools.append(tavily_tool)
            print("✓ Tavily search tool enabled")
        except Exception as e:
            print(f"⚠️ Tavily search tool not available: {str(e)}")
    
    # Add all other tools
    all_tools.extend(get_drive_tools(creds))
    all_tools.extend(get_gmail_tools(creds))
    all_tools.extend(get_calendar_tools(creds))
    all_tools.extend(get_task_tools(creds))
    all_tools.extend(get_crm_tools(creds))
    # Add customer database tools (from Prospector) so Sales can access existing leads
    all_tools.extend(get_sheet_tools(creds))
    # Add learning tools
    all_tools.extend(get_learning_tools(creds))
    
    print("✓ All sales tools enabled (including customer database access and learning)")
    
    # Bind tools to LLM
    llm_with_tools = llm.bind_tools(all_tools)
    
    # Create tool node
    tool_node = ToolNode(all_tools)
    
    # Initialize memory logger
    memory_logger = MemoryLogger(creds, doc_name="Sales_Memory_Log")
    
    # Load Vonga context (Strategy, Brand Voice, Product Specs)
    vonga_context = load_vonga_context(creds)
    
    # Load learned facts, preferences, and insights
    learned_context = load_learned_facts(creds)
    
    # System prompt with Vonga context and learned information
    learned_section = ""
    if learned_context:
        learned_section = f"""
LEARNED INFORMATION (Remember these across all conversations):
{learned_context}

IMPORTANT: Always follow user preferences and remember learned facts. Use store_fact, store_preference, or store_insight tools when the user asks you to remember something.
"""
    
    system_prompt = f"""You are the Vonga Head of Sales. You are strategic, persuasive, and highly organized.
{learned_section}

YOUR KNOWLEDGE BASE - INTERNAL VONGA DOCUMENTATION:
- You MUST reference the following internal documents for ALL information about Vonga:
  * 00_Strategy_Prime: Vonga's strategic direction and positioning
  * 01_Brand_Voice_Guidelines: How Vonga communicates (tone, voice, messaging)
  * 03_Product_Specs: Vonga's actual capabilities and features
  
- CRITICAL: NEVER promise features, capabilities, or positioning that is NOT in these documents
- ALWAYS ground your pitches in the actual Vonga strategy, brand voice, and product capabilities
- Use specific language and messaging from the Brand Voice Guidelines
- Reference actual capabilities from Product Specs, not generic claims

VONGA INTERNAL DOCUMENTATION:
{vonga_context}

CUSTOMER DATABASE ACCESS:
- You have access to the Vonga Customer Database (via read_customer_db, save_prospect_to_db, update_customer_db tools)
- Before starting research on a new company, ALWAYS check the database first using read_customer_db to see if the company already exists
- If the company exists in the database, use that information to inform your research and pitch
- You can update existing records with new information using update_customer_db
- This database contains leads that have already been researched by the Prospector agent

YOUR TOOLS - YOU HAVE INTERNET ACCESS:
- **TavilySearchResults** (tavily_search): You have full internet search capabilities via Tavily. Use this tool to search the web for companies, their websites, About Us pages, news, pain points, strategy information, leadership, and contact details.
- **IMPORTANT:** When researching companies, you MUST use the tavily_search tool to conduct web searches. You DO have internet access - use it!

YOUR WORKFLOW (The "Deal Cycle"):

1. **Database Check & Deep Research Phase:**
   - FIRST: Use `read_customer_db` to check if the company already exists in the customer database
   - If found: Review existing information (website, description, contacts, strategy angle) and use it to inform your research
   - If not found: Proceed with full research
   
   When given a target company (name and/or website), conduct MULTI-LAYERED research using tavily_search:
   - **Layer 1 - Company Overview:** Use tavily_search for "[Company] about us", "[Company] company", "[Company] mission"
   - **Layer 2 - Pain Points & News:** Use tavily_search for "[Company] challenges", "[Company] problems", "[Company] news 2024", "[Company] expansion", "[Company] rebrand"
   - **Layer 3 - Leadership & Contacts:** Use tavily_search for "[Company] leadership", "[Company] CMO", "[Company] marketing director", "[Company] brand director", "[Company] contact"
   - **Layer 4 - Industry Context:** Use tavily_search for "[Company] industry", "[Company] competitors", "[Company] market position"
   
   Extract SPECIFIC insights:
   - What are their current pain points? (Be specific - not generic)
   - What recent moves/initiatives indicate they need Vonga NOW?
   - Who is the key decision maker? (Name, title, email if possible)
   - What makes them a good fit for Vonga?

2. **The "Bridge" (Mental Check):**
   - How does Vonga (from internal documentation: Strategy Prime, Product Specs, Brand Voice) solve their SPECIFIC pain points?
   - This becomes your "Pitch Angle" - the compelling narrative connecting their need to Vonga's solution
   - Be specific: Not "Vonga helps with branding" but "Vonga enables [Company] to [specific use case] by [specific capability from Product Specs], addressing their need to [specific pain point]"
   - Use language and messaging from Brand Voice Guidelines
   - Ground all claims in actual Vonga capabilities from Product Specs

3. **Asset Generation Phase:**

   A. **Microsite Spec Creation (Pitch Deck Format):**
      - IMPORTANT: The microsite spec is a PROMOTIONAL PITCH DECK, not the actual Vonga product
      - It's a custom landing page designed to convert this specific prospect
      - Use `create_microsite_spec` tool to create a structured "pitch deck" document
      - The spec must be formatted so another agent can build the complete microsite (copy, images, videos) with minimal human interaction
      
      - Required sections in the spec:
        * **Hero Section:** Headline (personalized to their pain point), subheadline, hero image/video suggestions
        * **Value Propositions:** 3-5 key value props (each with: headline, body copy, suggested image/video)
        * **Features/Benefits:** Specific Vonga capabilities mapped to their needs (with copy and media suggestions)
        * **Social Proof:** Testimonials, case studies, or proof points (if applicable)
        * **Call to Action:** Primary CTA copy, button text, and suggested design direction
        * **Design Notes:** Color scheme, tone, visual style recommendations
      
      - All copy must align with Vonga's Brand Voice Guidelines
      - All capabilities must be from Product Specs (never invent features)
      - **CRITICAL:** After creating the spec, extract the URL from the creation response (format: "URL: https://docs.google.com/document/d/...")
      - **CRITICAL:** Use `update_microsite_spec_link` to save the URL to the Pipeline tab in Vonga_CRM
      - **CRITICAL:** Also use `add_new_lead` or ensure the company exists in CRM with the microsite spec link - this catalogs it for the Production Studio

   B. **Email Draft Creation:**
      - Use `gmail_draft` to create a personalized email to the Key Contact
      - Subject: Compelling, specific to their situation
      - Body: Reference the SPECIFIC insight you found in research. Make it personal, not generic.
      - Include the microsite spec link in the email

4. **Admin Phase (CRITICAL - Do not skip):**
   - Use `log_sales_activity` to log: company_name, action="Pitch Drafted", notes="[summary of what was created]"
   - Use `update_deal_stage` to set stage to "Pitch Drafted" (or use `add_new_lead` if new)
   - Use `tasks_create` to create a task: title="Review & Send [Company] Pitch", due_date=[24 hours from now in RFC3339 format]
   - If you created a microsite spec, ensure the link is saved to CRM using `update_microsite_spec_link`

CRITICAL REQUIREMENTS:
- **ALWAYS reference internal Vonga documentation** - Never promise features, capabilities, or positioning not in Strategy Prime, Brand Voice Guidelines, or Product Specs
- **Use Brand Voice** - All copy must align with Vonga's Brand Voice Guidelines (tone, messaging, language)
- **Ground in Product Specs** - All capabilities mentioned must be from Product Specs, not generic claims
- **Be specific** - Generic pitches fail. Use specific insights, pain points, and use cases
- **Microsite Spec Format** - The spec is a PROMOTIONAL PITCH DECK (not product docs) formatted for another agent to build a complete microsite
- **Complete the full cycle** - Research -> Assets -> Admin. Don't skip steps
- **Extract URLs properly** - When creating docs, extract the URL from the response and save it to CRM
- **Personalize everything** - Emails, microsite specs, and pitches must be tailored to the specific company

EFFICIENCY:
- Conduct research efficiently but thoroughly - aim for 3-5 search queries per company
- After creating assets and logging admin, STOP and provide a summary
- Don't loop - complete the cycle once per company

EXAMPLE WORKFLOW:
1. User: "Run deal cycle for Acme Corp, website: acme.com"
2. You: Research Acme Corp (multiple searches, check customer database first)
3. You: Reference internal Vonga docs (Strategy, Brand Voice, Product Specs) to craft accurate pitch
4. You: Use `create_microsite_spec` to create structured pitch deck with all sections (hero, value props, features, CTA, design notes)
5. You: Extract URL from microsite spec response, save to CRM using `update_microsite_spec_link`
6. You: Draft email to key contact using Brand Voice Guidelines, reference specific insights
7. You: Log activity, update stage, create follow-up task
8. You: Summary: "Deal cycle complete for Acme Corp. Microsite spec (pitch deck) created, email drafted, CRM updated."
"""
    
    # Create the graph
    workflow = StateGraph(SalesState)
    
    # Define nodes
    def should_continue(state: SalesState):
        """Determine if we should continue or end."""
        messages = state["messages"]
        last_message = messages[-1]
        
        # If the last message is from the AI and has no tool calls, we're done
        if isinstance(last_message, AIMessage):
            if not hasattr(last_message, 'tool_calls') or not last_message.tool_calls:
                return END
        
        # Otherwise, use tools
        return "tools"
    
    def call_model(state: SalesState):
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


def run_sales(agent, memory_logger: MemoryLogger, user_input: str, thread_id: str = "sales_default", 
              progress_callback=None) -> str:
    """Run the sales agent with initial state."""
    import time
    from langchain_core.messages import HumanMessage
    
    config = {"configurable": {"thread_id": thread_id}}
    timeout_seconds = 180  # Longer timeout for full deal cycle
    
    if progress_callback:
        progress_callback("Initializing sales agent...")
    
    start_time = time.time()
    
    try:
        # Initialize state
        initial_state = {
            "messages": [HumanMessage(content=user_input)],
            "product_context": ""
        }
        
        # Invoke the agent
        config["recursion_limit"] = 50
        result = agent.invoke(initial_state, config)
        
        # Check if we exceeded timeout
        elapsed = time.time() - start_time
        if elapsed > timeout_seconds:
            return "⏱️ The request took too long to process. Please try rephrasing your request or breaking it into smaller parts."
        
    except Exception as e:
        if progress_callback:
            progress_callback(f"❌ Error: {str(e)}")
        raise
    
    # Extract the final response
    messages = result.get("messages", [])
    final_response = None
    
    # Find the final AI response
    for msg in reversed(messages):
        if isinstance(msg, AIMessage):
            has_tool_calls = hasattr(msg, 'tool_calls') and msg.tool_calls
            if not has_tool_calls and msg.content:
                final_response = msg.content
                break
    
    if not final_response:
        if messages:
            last_msg = messages[-1]
            if hasattr(last_msg, 'content'):
                final_response = last_msg.content
            else:
                final_response = str(last_msg)
        else:
            final_response = "No response generated. Please check the logs for details."
    
    # Log to memory
    try:
        memory_logger.log_interaction(user_input, final_response)
    except Exception as e:
        print(f"Warning: Could not log to memory: {str(e)}")
    
    return final_response




