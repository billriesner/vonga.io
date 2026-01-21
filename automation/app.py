"""
Vonga OS - Multi-Agent Dashboard
Frontend for Chief of Staff and Head of Strategy agents.
"""

import streamlit as st
import os
import uuid
from datetime import datetime
from auth import get_credentials, get_user_email
from agents.chief_of_staff import create_chief_of_staff_agent, run_chief_of_staff
from agents.strategist import create_strategist_agent, run_strategist
from agents.prospector import create_prospector_agent, run_prospector
from agents.cmo import create_cmo_agent
from agents.sales import create_sales_agent, run_sales
from agents.microsite_builder import create_microsite_agent, run_microsite_builder
from agents.shared import run_agent

# Page config
st.set_page_config(
    page_title="Vonga OS",
    page_icon=None,
    layout="wide",
    initial_sidebar_state="expanded"
)

# Inject Vonga Branding CSS
st.markdown("""
<style>
    /* Vonga Brand Colors */
    :root {
        --vonga-aqua: #33BECC;
        --vonga-navy: #303E55;
        --vonga-coral: #FF7F50;
        --vonga-deep-navy: #0A1422;
        --vonga-gray: #9BA6B3;
    }
    
    /* Main Background - Deep Navy */
    .stApp {
        background: linear-gradient(135deg, #0A1422 0%, #1B1E25 100%);
        color: #FFFFFF;
    }
    
    /* Sidebar Styling */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #303E55 0%, #1B1E25 100%);
        border-right: 1px solid rgba(51, 190, 204, 0.2);
    }
    
    [data-testid="stSidebar"] .stMarkdown h1 {
        color: var(--vonga-aqua);
        font-weight: 700;
        font-size: 2rem;
        letter-spacing: -0.5px;
        margin-bottom: 0.25rem;
    }
    
    [data-testid="stSidebar"] .stMarkdown p {
        color: var(--vonga-gray);
        font-size: 0.875rem;
    }
    
    /* Vonga OS Title Glow */
    [data-testid="stSidebar"] h1::after {
        content: '';
        display: block;
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, var(--vonga-aqua), var(--vonga-coral));
        margin-top: 0.5rem;
        border-radius: 2px;
    }
    
    /* Success/Connected Status - Aqua */
    [data-testid="stSidebar"] .stSuccess {
        background-color: rgba(51, 190, 204, 0.15);
        border: 1px solid var(--vonga-aqua);
        border-radius: 6px;
        color: var(--vonga-aqua);
    }
    
    /* Central Hub Button - Make it stand out dramatically */
    button[kind="primary"][data-testid*="nav_central_hub"],
    button[kind="secondary"][data-testid*="nav_central_hub"] {
        background: linear-gradient(135deg, rgba(51, 190, 204, 0.25) 0%, rgba(51, 190, 204, 0.15) 100%) !important;
        border: 2px solid var(--vonga-aqua) !important;
        color: var(--vonga-aqua) !important;
        font-weight: 700 !important;
        font-size: 1rem !important;
        box-shadow: 0 4px 15px rgba(51, 190, 204, 0.4) !important;
        position: relative;
        overflow: visible;
    }
    
    button[kind="primary"][data-testid*="nav_central_hub"] {
        background: linear-gradient(135deg, rgba(51, 190, 204, 0.4) 0%, rgba(51, 190, 204, 0.25) 100%) !important;
        box-shadow: 0 0 25px rgba(51, 190, 204, 0.6), 0 4px 15px rgba(51, 190, 204, 0.4) !important;
        border-width: 3px !important;
    }
    
    
    button[kind="primary"][data-testid*="nav_central_hub"]:hover,
    button[kind="secondary"][data-testid*="nav_central_hub"]:hover {
        background: linear-gradient(135deg, rgba(51, 190, 204, 0.35) 0%, rgba(51, 190, 204, 0.2) 100%) !important;
        box-shadow: 0 0 30px rgba(51, 190, 204, 0.7) !important;
        transform: translateY(-2px);
    }
    
    /* Other nav buttons - subtle */
    button[data-testid*="nav_strategy"],
    button[data-testid*="nav_prospector"] {
        font-weight: 600 !important;
    }
    
    /* Global Design Rule: Hide all radio buttons - use buttons instead */
    .stRadio [role="radiogroup"] {
        display: none !important;
    }
    
    /* Buttons - Vonga Styling */
    .stButton > button {
        background-color: var(--vonga-navy);
        color: #FFFFFF;
        border: 1px solid rgba(51, 190, 204, 0.3);
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        background-color: rgba(51, 190, 204, 0.2);
        border-color: var(--vonga-aqua);
        box-shadow: 0 0 10px rgba(51, 190, 204, 0.3);
        transform: translateY(-1px);
    }
    
    .stButton > button[kind="primary"] {
        background: linear-gradient(135deg, var(--vonga-aqua) 0%, rgba(51, 190, 204, 0.8) 100%);
        border-color: var(--vonga-aqua);
        color: #FFFFFF;
        font-weight: 600;
    }
    
    .stButton > button[kind="primary"]:hover {
        box-shadow: 0 0 20px rgba(51, 190, 204, 0.6);
        transform: translateY(-2px);
    }
    
    /* Main Content Area */
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 1200px;
    }
    
    /* Central Hub Title - Special Styling */
    .central-hub-header {
        background: linear-gradient(135deg, rgba(51, 190, 204, 0.1) 0%, rgba(255, 127, 80, 0.05) 100%);
        border-left: 4px solid var(--vonga-aqua);
        padding: 1.5rem 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        box-shadow: 0 0 30px rgba(51, 190, 204, 0.15);
    }
    
    .central-hub-header h1 {
        color: var(--vonga-aqua);
        font-weight: 700;
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        letter-spacing: -0.5px;
    }
    
    .central-hub-header p {
        color: var(--vonga-gray);
        font-size: 1rem;
        margin: 0;
    }
    
    /* Other Agent Titles */
    .agent-header h1 {
        color: #FFFFFF;
        font-weight: 600;
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .agent-header p {
        color: var(--vonga-gray);
        font-size: 0.875rem;
    }
    
    /* Chat Messages */
    .stChatMessage {
        background-color: rgba(48, 62, 85, 0.5);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        border: 1px solid rgba(51, 190, 204, 0.1);
    }
    
    .stChatMessage[data-testid="user"] {
        background-color: rgba(51, 190, 204, 0.1);
        border-color: rgba(51, 190, 204, 0.3);
    }
    
    .stChatMessage[data-testid="assistant"] {
        background-color: rgba(48, 62, 85, 0.3);
        border-color: rgba(51, 190, 204, 0.2);
    }
    
    /* Dividers - Aqua Accent */
    hr {
        border-color: rgba(51, 190, 204, 0.2);
        margin: 1.5rem 0;
    }
    
    /* Input Fields */
    .stTextInput > label,
    .stTextArea > label {
        color: #FFFFFF !important;
        font-weight: 500;
    }
    
    .stTextInput > div > div > input,
    .stTextArea > div > div > textarea {
        background-color: rgba(48, 62, 85, 0.5);
        border: 1px solid rgba(51, 190, 204, 0.3);
        color: #FFFFFF;
        border-radius: 6px;
    }
    
    .stTextInput > div > div > input:focus,
    .stTextArea > div > div > textarea:focus {
        border-color: var(--vonga-aqua);
        box-shadow: 0 0 10px rgba(51, 190, 204, 0.3);
    }
    
    /* Info/Warning/Success Boxes */
    .stInfo {
        background-color: rgba(51, 190, 204, 0.1);
        border: 1px solid rgba(51, 190, 204, 0.3);
        border-left: 4px solid var(--vonga-aqua);
        border-radius: 6px;
    }
    
    .stSuccess {
        background-color: rgba(47, 181, 116, 0.1);
        border: 1px solid rgba(47, 181, 116, 0.3);
        border-left: 4px solid #2FB574;
        border-radius: 6px;
    }
    
    .stWarning {
        background-color: rgba(242, 169, 59, 0.1);
        border: 1px solid rgba(242, 169, 59, 0.3);
        border-left: 4px solid #F2A93B;
        border-radius: 6px;
    }
    
    .stError {
        background-color: rgba(208, 69, 59, 0.1);
        border: 1px solid rgba(208, 69, 59, 0.3);
        border-left: 4px solid #D0453B;
        border-radius: 6px;
    }
    
    /* Subheader Styling */
    [data-testid="stSidebar"] h3 {
        color: var(--vonga-aqua);
        font-weight: 600;
        font-size: 1.125rem;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
    }
    
    /* Caption Styling */
    .stCaption {
        color: var(--vonga-gray);
    }
    
    /* Scrollbar Styling */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: rgba(27, 30, 37, 0.5);
    }
    
    ::-webkit-scrollbar-thumb {
        background: rgba(51, 190, 204, 0.5);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: var(--vonga-aqua);
    }
</style>
""", unsafe_allow_html=True)

# Security check - hardcoded email
ALLOWED_EMAIL = "bill@vonga.io"

# Initialize session state
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False
if "creds" not in st.session_state:
    st.session_state.creds = None
if "cos_agent" not in st.session_state:
    st.session_state.cos_agent = None
if "cos_memory_logger" not in st.session_state:
    st.session_state.cos_memory_logger = None
if "strategist_agent" not in st.session_state:
    st.session_state.strategist_agent = None
if "strategist_memory_logger" not in st.session_state:
    st.session_state.strategist_memory_logger = None
if "prospector_agent" not in st.session_state:
    st.session_state.prospector_agent = None
if "prospector_memory_logger" not in st.session_state:
    st.session_state.prospector_memory_logger = None
if "cmo_agent" not in st.session_state:
    st.session_state.cmo_agent = None
if "cmo_memory_logger" not in st.session_state:
    st.session_state.cmo_memory_logger = None
if "cmo_messages" not in st.session_state:
    st.session_state.cmo_messages = []
if "cmo_thread_id" not in st.session_state:
    st.session_state.cmo_thread_id = f"cmo_{uuid.uuid4().hex[:8]}"
if "cmo_chat_history" not in st.session_state:
    st.session_state.cmo_chat_history = {}  # {thread_id: {"title": str, "messages": list, "created": datetime}}
if "current_cmo_thread" not in st.session_state:
    st.session_state.current_cmo_thread = None
if "cmo_suggested_prompt" not in st.session_state:
    st.session_state.cmo_suggested_prompt = None
if "sales_agent" not in st.session_state:
    st.session_state.sales_agent = None
if "sales_memory_logger" not in st.session_state:
    st.session_state.sales_memory_logger = None
if "sales_messages" not in st.session_state:
    st.session_state.sales_messages = []
if "sales_thread_id" not in st.session_state:
    st.session_state.sales_thread_id = f"sales_{uuid.uuid4().hex[:8]}"
if "sales_chat_history" not in st.session_state:
    st.session_state.sales_chat_history = {}
if "current_sales_thread" not in st.session_state:
    st.session_state.current_sales_thread = None
if "sales_deal_cycle_running" not in st.session_state:
    st.session_state.sales_deal_cycle_running = False
if "sales_status_log" not in st.session_state:
    st.session_state.sales_status_log = []
if "microsite_builder_agent" not in st.session_state:
    st.session_state.microsite_builder_agent = None
if "microsite_builder_memory_logger" not in st.session_state:
    st.session_state.microsite_builder_memory_logger = None
if "microsite_builder_status" not in st.session_state:
    st.session_state.microsite_builder_status = ""
if "microsite_builder_running" not in st.session_state:
    st.session_state.microsite_builder_running = False
if "current_mode" not in st.session_state:
    st.session_state.current_mode = "Central Hub"
if "cos_messages" not in st.session_state:
    st.session_state.cos_messages = []
if "strategist_messages" not in st.session_state:
    st.session_state.strategist_messages = []
if "cos_thread_id" not in st.session_state:
    st.session_state.cos_thread_id = f"cos_{uuid.uuid4().hex[:8]}"
if "strategist_thread_id" not in st.session_state:
    st.session_state.strategist_thread_id = f"strategist_{uuid.uuid4().hex[:8]}"
if "cos_chat_history" not in st.session_state:
    st.session_state.cos_chat_history = {}  # {thread_id: {"title": str, "messages": list, "created": datetime}}
if "strategist_chat_history" not in st.session_state:
    st.session_state.strategist_chat_history = {}  # {thread_id: {"title": str, "messages": list, "created": datetime}}
if "prospector_messages" not in st.session_state:
    st.session_state.prospector_messages = []
if "prospector_thread_id" not in st.session_state:
    st.session_state.prospector_thread_id = f"prospector_{uuid.uuid4().hex[:8]}"
if "prospector_log" not in st.session_state:
    st.session_state.prospector_log = []  # Live log of actions
if "prospector_research_running" not in st.session_state:
    st.session_state.prospector_research_running = False
if "current_cos_thread" not in st.session_state:
    st.session_state.current_cos_thread = None
if "current_strategist_thread" not in st.session_state:
    st.session_state.current_strategist_thread = None


def save_chat_to_history(mode: str, thread_id: str, messages: list):
    """Save current chat to history."""
    if mode == "Central Hub":
        if thread_id not in st.session_state.cos_chat_history:
            # Generate title from first user message
            title = "New Chat"
            for msg in messages:
                if msg.get("role") == "user":
                    title = msg.get("content", "New Chat")[:50]
                    if len(msg.get("content", "")) > 50:
                        title += "..."
                    break
            
            st.session_state.cos_chat_history[thread_id] = {
                "title": title,
                "messages": messages.copy(),
                "created": datetime.now(),
                "updated": datetime.now()
            }
        else:
            # Update existing chat
            st.session_state.cos_chat_history[thread_id]["messages"] = messages.copy()
            st.session_state.cos_chat_history[thread_id]["updated"] = datetime.now()
    elif mode == "Strategy Room":
        if thread_id not in st.session_state.strategist_chat_history:
            title = "New Chat"
            for msg in messages:
                if msg.get("role") == "user":
                    title = msg.get("content", "New Chat")[:50]
                    if len(msg.get("content", "")) > 50:
                        title += "..."
                    break
            
            st.session_state.strategist_chat_history[thread_id] = {
                "title": title,
                "messages": messages.copy(),
                "created": datetime.now(),
                "updated": datetime.now()
            }
        else:
            st.session_state.strategist_chat_history[thread_id]["messages"] = messages.copy()
            st.session_state.strategist_chat_history[thread_id]["updated"] = datetime.now()
    elif mode == "Marketing War Room":
        if thread_id not in st.session_state.cmo_chat_history:
            title = "New Chat"
            for msg in messages:
                if msg.get("role") == "user":
                    title = msg.get("content", "New Chat")[:50]
                    if len(msg.get("content", "")) > 50:
                        title += "..."
                    break
            
            st.session_state.cmo_chat_history[thread_id] = {
                "title": title,
                "messages": messages.copy(),
                "created": datetime.now(),
                "updated": datetime.now()
            }
        else:
            st.session_state.cmo_chat_history[thread_id]["messages"] = messages.copy()
            st.session_state.cmo_chat_history[thread_id]["updated"] = datetime.now()
    elif mode == "Sales Command Center":
        if thread_id not in st.session_state.sales_chat_history:
            title = "New Chat"
            for msg in messages:
                if msg.get("role") == "user":
                    title = msg.get("content", "New Chat")[:50]
                    if len(msg.get("content", "")) > 50:
                        title += "..."
                    break
            
            st.session_state.sales_chat_history[thread_id] = {
                "title": title,
                "messages": messages.copy(),
                "created": datetime.now(),
                "updated": datetime.now()
            }
        else:
            st.session_state.sales_chat_history[thread_id]["messages"] = messages.copy()
            st.session_state.sales_chat_history[thread_id]["updated"] = datetime.now()


def load_chat_from_history(mode: str, thread_id: str):
    """Load a chat from history."""
    if mode == "Central Hub":
        if thread_id in st.session_state.cos_chat_history:
            st.session_state.cos_messages = st.session_state.cos_chat_history[thread_id]["messages"].copy()
            st.session_state.cos_thread_id = thread_id
            st.session_state.current_cos_thread = thread_id
    elif mode == "Strategy Room":
        if thread_id in st.session_state.strategist_chat_history:
            st.session_state.strategist_messages = st.session_state.strategist_chat_history[thread_id]["messages"].copy()
            st.session_state.strategist_thread_id = thread_id
            st.session_state.current_strategist_thread = thread_id
    elif mode == "Marketing War Room":
        if thread_id in st.session_state.cmo_chat_history:
            st.session_state.cmo_messages = st.session_state.cmo_chat_history[thread_id]["messages"].copy()
            st.session_state.cmo_thread_id = thread_id
            st.session_state.current_cmo_thread = thread_id
    elif mode == "Sales Command Center":
        if thread_id in st.session_state.sales_chat_history:
            st.session_state.sales_messages = st.session_state.sales_chat_history[thread_id]["messages"].copy()
            st.session_state.sales_thread_id = thread_id
            st.session_state.current_sales_thread = thread_id


def create_new_chat(mode: str):
    """Create a new chat session."""
    if mode == "Central Hub":
        # Save current chat before creating new one
        if st.session_state.cos_messages:
            save_chat_to_history("Central Hub", st.session_state.cos_thread_id, st.session_state.cos_messages)
        
        # Create new chat
        st.session_state.cos_thread_id = f"cos_{uuid.uuid4().hex[:8]}"
        st.session_state.cos_messages = []
        st.session_state.current_cos_thread = None
    elif mode == "Strategy Room":
        if st.session_state.strategist_messages:
            save_chat_to_history("Strategy Room", st.session_state.strategist_thread_id, st.session_state.strategist_messages)
        
        st.session_state.strategist_thread_id = f"strategist_{uuid.uuid4().hex[:8]}"
        st.session_state.strategist_messages = []
        st.session_state.current_strategist_thread = None
    elif mode == "Marketing War Room":
        if st.session_state.cmo_messages:
            save_chat_to_history("Marketing War Room", st.session_state.cmo_thread_id, st.session_state.cmo_messages)
        
        st.session_state.cmo_thread_id = f"cmo_{uuid.uuid4().hex[:8]}"
        st.session_state.cmo_messages = []
        st.session_state.current_cmo_thread = None
    elif mode == "Sales Command Center":
        if st.session_state.sales_messages:
            save_chat_to_history("Sales Command Center", st.session_state.sales_thread_id, st.session_state.sales_messages)
        
        st.session_state.sales_thread_id = f"sales_{uuid.uuid4().hex[:8]}"
        st.session_state.sales_messages = []
        st.session_state.current_sales_thread = None


def check_authentication():
    """Handle authentication and security check."""
    if not st.session_state.authenticated:
        try:
            st.info("Authenticating with Google... Please complete the OAuth flow if prompted.")
            creds = get_credentials()
            user_email = get_user_email(creds)
            
            # Security check
            if user_email != ALLOWED_EMAIL:
                st.error(f"Access Denied. This application is restricted to {ALLOWED_EMAIL}")
                st.error(f"You are authenticated as: {user_email}")
                st.stop()
            
            # Store credentials
            st.session_state.creds = creds
            st.session_state.authenticated = True
            st.session_state.user_email = user_email
            
            # Initialize agents
            try:
                # Get API key from environment or Streamlit secrets
                api_key = os.getenv("GOOGLE_API_KEY") or st.secrets.get("GOOGLE_API_KEY", None)
                if not api_key:
                    st.warning("GOOGLE_API_KEY not found. Please set it as an environment variable or in Streamlit secrets.")
                    st.info("The agents will still initialize, but Gemini API calls will fail without the key.")
                
                # Get search API credentials from Streamlit secrets and set as environment variables
                search_api_key = st.secrets.get("GOOGLE_SEARCH_API_KEY", None) or os.getenv("GOOGLE_SEARCH_API_KEY")
                search_engine_id = st.secrets.get("GOOGLE_SEARCH_ENGINE_ID", None) or os.getenv("GOOGLE_SEARCH_ENGINE_ID")
                
                if search_api_key:
                    os.environ["GOOGLE_SEARCH_API_KEY"] = search_api_key
                if search_engine_id:
                    os.environ["GOOGLE_SEARCH_ENGINE_ID"] = search_engine_id
                
                # Initialize Head of Strategy first (needed for Chief of Staff consultation tool)
                with st.spinner("Initializing Head of Strategy..."):
                    strategist_agent, strategist_memory_logger = create_strategist_agent(creds, api_key)
                    st.session_state.strategist_agent = strategist_agent
                    st.session_state.strategist_memory_logger = strategist_memory_logger
                
                # Initialize Chief of Staff (with strategist reference for consultation)
                with st.spinner("Initializing Chief of Staff..."):
                    cos_agent, cos_memory_logger = create_chief_of_staff_agent(
                        creds, 
                        api_key,
                        strategist_agent=strategist_agent,
                        strategist_memory_logger=strategist_memory_logger
                    )
                    st.session_state.cos_agent = cos_agent
                    st.session_state.cos_memory_logger = cos_memory_logger
                
                # Initialize Prospector
                tavily_api_key = st.secrets.get("TAVILY_API_KEY", None) or os.getenv("TAVILY_API_KEY")
                with st.spinner("Initializing Prospector..."):
                    prospector_agent, prospector_memory_logger = create_prospector_agent(
                        creds,
                        api_key,
                        tavily_api_key=tavily_api_key
                    )
                    st.session_state.prospector_agent = prospector_agent
                    st.session_state.prospector_memory_logger = prospector_memory_logger
                
                # Initialize CMO
                with st.spinner("Initializing CMO..."):
                    cmo_agent, cmo_memory_logger = create_cmo_agent(
                        creds,
                        api_key,
                        tavily_api_key=tavily_api_key
                    )
                    st.session_state.cmo_agent = cmo_agent
                    st.session_state.cmo_memory_logger = cmo_memory_logger
                
                # Initialize Sales Agent
                with st.spinner("Initializing Head of Sales..."):
                    sales_agent, sales_memory_logger = create_sales_agent(
                        creds,
                        api_key,
                        tavily_api_key=tavily_api_key
                    )
                    st.session_state.sales_agent = sales_agent
                    st.session_state.sales_memory_logger = sales_memory_logger
                
                # Initialize Microsite Builder Agent
                with st.spinner("Initializing Microsite Builder..."):
                    microsite_agent, microsite_memory_logger = create_microsite_agent(
                        creds,
                        api_key
                    )
                    st.session_state.microsite_builder_agent = microsite_agent
                    st.session_state.microsite_builder_memory_logger = microsite_memory_logger
                
                st.success("Vonga OS initialized successfully!")
                
            except Exception as e:
                st.error(f"Error initializing agents: {str(e)}")
                import traceback
                st.code(traceback.format_exc())
                st.stop()
                
        except FileNotFoundError as e:
            st.error(f"{str(e)}")
            st.info("Please download credentials.json from Google Cloud Console and place it in the project root.")
            st.stop()
        except Exception as e:
            st.error(f"Authentication error: {str(e)}")
            st.stop()


def main():
    """Main application."""
    check_authentication()
    
    # Sidebar Navigation
    with st.sidebar:
        st.markdown("### Vonga OS")
        st.caption("From Moment to Memory")
        
        # Status
        if st.session_state.authenticated:
            st.success("Connected")
            st.caption(f"Authenticated as: {st.session_state.user_email}")
        else:
            st.error("Disconnected")
        
        st.divider()
        
        # Mode Selection - Button-based with Central Hub prominence
        st.markdown("#### Navigation")
        
        # Central Hub - Standalone, prominent button
        if st.button("CENTRAL HUB", key="nav_central_hub", use_container_width=True, 
                    type="primary" if st.session_state.current_mode == "Central Hub" else "secondary"):
            st.session_state.current_mode = "Central Hub"
            st.rerun()
        
        st.markdown("<div style='height: 0.5rem;'></div>", unsafe_allow_html=True)
        
        # Strategy Room, Marketing War Room, and Sales - Two column layout
        col1, col2 = st.columns(2)
        with col1:
            if st.button("Strategy", key="nav_strategy", use_container_width=True,
                        type="primary" if st.session_state.current_mode == "Strategy Room" else "secondary"):
                st.session_state.current_mode = "Strategy Room"
                st.rerun()
        with col2:
            if st.button("Marketing", key="nav_marketing", use_container_width=True,
                        type="primary" if st.session_state.current_mode == "Marketing War Room" else "secondary"):
                st.session_state.current_mode = "Marketing War Room"
                st.rerun()
        
        # Sales and Production Studio in second row, two columns
        col5, col6 = st.columns(2)
        with col5:
            if st.button("Sales", key="nav_sales", use_container_width=True,
                        type="primary" if st.session_state.current_mode == "Sales Command Center" else "secondary"):
                st.session_state.current_mode = "Sales Command Center"
                st.rerun()
        with col6:
            if st.button("Production", key="nav_production", use_container_width=True,
                        type="primary" if st.session_state.current_mode == "Production Studio" else "secondary"):
                st.session_state.current_mode = "Production Studio"
                st.rerun()
        
        # Use current_mode from session state (set by buttons above)
        mode = st.session_state.current_mode
        
        st.divider()
        
        # Chat History Section
        st.markdown("#### Recent Chats")
        
        # Get appropriate history based on mode
        if mode == "Central Hub":
            chat_history = st.session_state.cos_chat_history
            current_thread = st.session_state.current_cos_thread
        elif mode == "Strategy Room":
            chat_history = st.session_state.strategist_chat_history
            current_thread = st.session_state.current_strategist_thread
        elif mode == "Marketing War Room":
            chat_history = st.session_state.cmo_chat_history
            current_thread = st.session_state.current_cmo_thread
        elif mode == "Sales Command Center":
            chat_history = st.session_state.sales_chat_history
            current_thread = st.session_state.current_sales_thread
        elif mode == "Production Studio":
            chat_history = {}  # Production Studio doesn't use chat history
            current_thread = None
        else:
            chat_history = {}
            current_thread = None
        
        # New Chat button
        if st.button("New Chat", use_container_width=True):
            create_new_chat(mode)
            st.rerun()
        
        # Display saved chats
        if chat_history:
            if chat_history:
                st.markdown("#### Recent Chats")
                # Sort by updated date (most recently active first), fallback to created
                sorted_chats = sorted(
                    chat_history.items(),
                    key=lambda x: x[1].get("updated", x[1].get("created", datetime.now())),
                    reverse=True
                )
            
                for thread_id, chat_data in sorted_chats:
                    title = chat_data["title"]
                    updated = chat_data.get("updated", chat_data.get("created", datetime.now()))
                    time_str = updated.strftime("%m/%d %H:%M")
                    is_active = (current_thread == thread_id) or (
                        mode == "Central Hub" and thread_id == st.session_state.cos_thread_id and not current_thread
                    ) or (
                        mode == "Strategy Room" and thread_id == st.session_state.strategist_thread_id and not current_thread
                    ) or (
                        mode == "Marketing War Room" and thread_id == st.session_state.cmo_thread_id and not current_thread
                    ) or (
                        mode == "Sales Command Center" and thread_id == st.session_state.sales_thread_id and not current_thread
                    )
                    
                    # Display chat with active indicator
                    button_style = "primary" if is_active else "secondary"
                    button_label = f"{title}"
                    if st.button(
                        button_label,
                        key=f"chat_{thread_id}",
                        use_container_width=True,
                        type=button_style
                    ):
                        load_chat_from_history(mode, thread_id)
                        st.rerun()
                    
                    # Show timestamp
                    st.caption(f"  {time_str}", help=f"Thread ID: {thread_id}")
            else:
                st.caption("No saved chats yet")
        
        st.divider()
        
        # Mode-specific instructions
        if st.session_state.current_mode == "Central Hub":
            st.subheader("Chief of Staff")
            st.markdown("""
            **Operational Assistant**
            
            Handles:
            - Email management
            - Calendar & scheduling
            - Document management
            - Task management
            - Web search
            - Strategic consultation
            """)
        elif st.session_state.current_mode == "Strategy Room":
            st.markdown("#### Head of Strategy")
            st.markdown("""
            <div style='background: rgba(48, 62, 85, 0.5); padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem;'>
            <strong style='color: #FFFFFF;'>Strategic Advisor</strong>
            </div>
            """, unsafe_allow_html=True)
            st.markdown("""
            **Provides:**
            - Strategic audits (Green Light/Red Light)
            - Strategic planning
            - Critical analysis
            - Data-driven recommendations
            
            *Loaded with Strategy Prime, Product Specs, and Customer Data*
            """)
        elif st.session_state.current_mode == "Marketing War Room":
            st.markdown("#### CMO")
            st.markdown("""
            <div style='background: rgba(48, 62, 85, 0.5); padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem;'>
            <strong style='color: #FFFFFF;'>Chief Marketing Officer</strong>
            </div>
            """, unsafe_allow_html=True)
            st.markdown("""
            **Provides:**
            - Strategic marketing research
            - Campaign briefs
            - Competitive analysis
            - Market insights
            
            *Combines internal strategy with external market research*
            """)
    
    # Initialize stop flags if not present
    if "stop_requested" not in st.session_state:
        st.session_state.stop_requested = False
    if "processing_mode" not in st.session_state:
        st.session_state.processing_mode = None
    
    # Main content area
    if st.session_state.current_mode == "Central Hub":
        # Chief of Staff Interface - Enhanced Header
        st.markdown("""
        <div class="central-hub-header">
            <h1>Central Hub</h1>
            <p>Chief of Staff · Your primary operational assistant</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Quick Actions Dashboard
        st.markdown("#### Quick Actions Dashboard")
        row1_col1, row1_col2, row1_col3 = st.columns(3)
        
        with row1_col1:
            if st.button("Start My Day", use_container_width=True, key="daily_briefing"):
                if st.session_state.cos_agent:
                    with st.spinner("Chief of Staff is working..."):
                        from agents.chief_of_staff import generate_daily_briefing
                        from auth import get_credentials
                        creds = get_credentials()
                        briefing = generate_daily_briefing(creds)
                        st.info(briefing)
                else:
                    st.warning("Chief of Staff agent not initialized. Please refresh the page.")
        
        with row1_col2:
            if st.button("Block Focus Time", use_container_width=True, key="block_focus"):
                if st.session_state.cos_agent:
                    with st.spinner("Chief of Staff is working..."):
                        from agents.chief_of_staff import find_and_block_focus_time
                        from auth import get_credentials
                        creds = get_credentials()
                        result = find_and_block_focus_time(creds)
                        st.success(result)
                else:
                    st.warning("Chief of Staff agent not initialized. Please refresh the page.")
        
        with row1_col3:
            if st.button("Prep for Next Meeting", use_container_width=True, key="meeting_prep"):
                if st.session_state.cos_agent:
                    with st.spinner("Chief of Staff is working..."):
                        from agents.chief_of_staff import generate_meeting_prep
                        from auth import get_credentials
                        creds = get_credentials()
                        prep = generate_meeting_prep(creds)
                        with st.expander("Meeting Cheat Sheet", expanded=True):
                            st.text(prep)
                else:
                    st.warning("Chief of Staff agent not initialized. Please refresh the page.")
        
        # Row 2: Inbox Triage
        row2_col1, row2_col2, row2_col3 = st.columns(3)
        with row2_col1:
            if st.button("Inbox Triage", use_container_width=True, key="inbox_triage"):
                if st.session_state.cos_agent:
                    with st.spinner("Chief of Staff is working..."):
                        from agents.chief_of_staff import inbox_triage
                        from auth import get_credentials
                        import pandas as pd
                        creds = get_credentials()
                        triage_data = inbox_triage(creds)
                        if triage_data:
                            df = pd.DataFrame(triage_data)
                            st.dataframe(df, use_container_width=True, hide_index=True)
                        else:
                            st.info("No unread emails found.")
                else:
                    st.warning("Chief of Staff agent not initialized. Please refresh the page.")
        
        st.divider()
        
        # Display chat messages
        for message in st.session_state.cos_messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        # Chat input
        if prompt := st.chat_input("Ask the Chief of Staff..."):
            # Add user message to chat
            st.session_state.cos_messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)
            
            # Check if stop was requested before processing
            if st.session_state.stop_requested and st.session_state.processing_mode == "Central Hub":
                # Stop was requested - remove the last user message and reset
                st.session_state.cos_messages.pop()
                st.session_state.stop_requested = False
                st.session_state.processing_mode = None
                st.warning("Processing stopped.")
                st.rerun()
            
            # Get agent response
            with st.chat_message("assistant"):
                status_col1, status_col2 = st.columns([4, 1])
                with status_col1:
                    status_container = st.empty()
                    status_container.info("Thinking...")
                with status_col2:
                    if st.button("Stop", key="stop_cos", use_container_width=True):
                        st.session_state.stop_requested = True
                        st.session_state.processing_mode = "Central Hub"
                        st.rerun()
                
                # Set processing mode
                st.session_state.processing_mode = "Central Hub"
                st.session_state.stop_requested = False
                
                try:
                    def update_status(message):
                        if st.session_state.stop_requested:
                            raise InterruptedError("Stop requested by user")
                        status_container.info(message)
                    
                    response = run_chief_of_staff(
                        st.session_state.cos_agent,
                        st.session_state.cos_memory_logger,
                        prompt,
                        thread_id=st.session_state.cos_thread_id,
                        progress_callback=update_status
                    )
                    
                    status_container.empty()
                    st.markdown(response)
                    st.session_state.cos_messages.append({"role": "assistant", "content": response})
                    st.session_state.processing_mode = None
                    
                    # Save chat to history after each exchange
                    save_chat_to_history("Central Hub", st.session_state.cos_thread_id, st.session_state.cos_messages)
                    if not st.session_state.current_cos_thread:
                        st.session_state.current_cos_thread = st.session_state.cos_thread_id
                    
                except InterruptedError:
                    # Stop was requested - remove the last user message
                    status_container.empty()
                    if st.session_state.cos_messages and st.session_state.cos_messages[-1].get("role") == "user":
                        st.session_state.cos_messages.pop()
                    st.session_state.processing_mode = None
                    st.session_state.stop_requested = False
                    st.warning("Processing stopped.")
                except Exception as e:
                    status_container.empty()
                    error_msg = f"Error: {str(e)}"
                    st.error(error_msg)
                    st.session_state.cos_messages.append({"role": "assistant", "content": error_msg})
                    st.session_state.processing_mode = None
    
    elif st.session_state.current_mode == "Strategy Room":
        # Head of Strategy Interface
        st.markdown("""
        <div class="agent-header">
            <h1>Strategy Room</h1>
            <p>Head of Strategy · Your strategic advisor</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Display chat messages
        for message in st.session_state.strategist_messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        # Chat input
        if prompt := st.chat_input("Ask the Head of Strategy..."):
            # Add user message to chat
            st.session_state.strategist_messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)
            
            # Check if stop was requested before processing
            if st.session_state.stop_requested and st.session_state.processing_mode == "Strategy Room":
                # Stop was requested - remove the last user message and reset
                st.session_state.strategist_messages.pop()
                st.session_state.stop_requested = False
                st.session_state.processing_mode = None
                st.warning("Processing stopped.")
                st.rerun()
            
            # Get agent response
            with st.chat_message("assistant"):
                status_col1, status_col2 = st.columns([4, 1])
                with status_col1:
                    status_container = st.empty()
                    status_container.info("Analyzing...")
                with status_col2:
                    if st.button("Stop", key="stop_strategist", use_container_width=True):
                        st.session_state.stop_requested = True
                        st.session_state.processing_mode = "Strategy Room"
                        st.rerun()
                
                # Set processing mode
                st.session_state.processing_mode = "Strategy Room"
                st.session_state.stop_requested = False
                
                try:
                    def update_status(message):
                        if st.session_state.stop_requested:
                            raise InterruptedError("Stop requested by user")
                        status_container.info(message)
                    
                    response = run_strategist(
                        st.session_state.strategist_agent,
                        st.session_state.strategist_memory_logger,
                        prompt,
                        thread_id=st.session_state.strategist_thread_id,
                        progress_callback=update_status
                    )
                    
                    status_container.empty()
                    st.markdown(response)
                    st.session_state.strategist_messages.append({"role": "assistant", "content": response})
                    st.session_state.processing_mode = None
                    
                    # Save chat to history after each exchange
                    save_chat_to_history("Strategy Room", st.session_state.strategist_thread_id, st.session_state.strategist_messages)
                    if not st.session_state.current_strategist_thread:
                        st.session_state.current_strategist_thread = st.session_state.strategist_thread_id
                    
                except InterruptedError:
                    # Stop was requested - remove the last user message
                    status_container.empty()
                    if st.session_state.strategist_messages and st.session_state.strategist_messages[-1].get("role") == "user":
                        st.session_state.strategist_messages.pop()
                    st.session_state.processing_mode = None
                    st.session_state.stop_requested = False
                    st.warning("Processing stopped.")
                except Exception as e:
                    status_container.empty()
                    error_msg = f"Error: {str(e)}"
                    st.error(error_msg)
                    st.session_state.strategist_messages.append({"role": "assistant", "content": error_msg})
                    st.session_state.processing_mode = None
    
    elif st.session_state.current_mode == "Marketing War Room":
        # CMO Interface
        st.markdown("""
        <div class="agent-header">
            <h1>Marketing War Room</h1>
            <p>CMO · Strategic Marketing Research & Campaign Briefs</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Quick Actions
        st.markdown("#### Quick Actions")
        col1, col2, col3 = st.columns(3)
        with col1:
            if st.button("Analyze Competitor", use_container_width=True, key="cmo_prompt_1"):
                st.session_state.cmo_suggested_prompt = "competitor"
                st.rerun()
        with col2:
            if st.button("Campaign Brief", use_container_width=True, key="cmo_prompt_2"):
                st.session_state.cmo_suggested_prompt = "brief"
                st.rerun()
        with col3:
            if st.button("Industry Trends", use_container_width=True, key="cmo_prompt_3"):
                st.session_state.cmo_suggested_prompt = "trends"
                st.rerun()
        
        # Second row of Quick Actions
        col4, col5 = st.columns(2)
        with col4:
            if st.button("Performance Metrics", use_container_width=True, key="cmo_prompt_4"):
                st.session_state.cmo_suggested_prompt = "metrics"
                st.rerun()
        with col5:
            if st.button("Brand Audit", use_container_width=True, key="cmo_prompt_5"):
                st.session_state.cmo_suggested_prompt = "brand_audit"
                st.rerun()
        
        # Handle suggested prompts with input
        if st.session_state.get("cmo_suggested_prompt") == "competitor":
            competitor_name = st.text_input("Competitor name:", key="competitor_input", placeholder="e.g., Apple")
            if competitor_name:
                prompt = f"Analyze competitor {competitor_name}'s recent ads and marketing campaigns."
                st.session_state.cmo_messages.append({"role": "user", "content": prompt})
                st.session_state.cmo_suggested_prompt = None
                st.rerun()
        elif st.session_state.get("cmo_suggested_prompt") == "metrics":
            if st.button("View Performance Metrics", type="primary", use_container_width=True, key="metrics_submit"):
                prompt = "How are we doing? Analyze our marketing performance metrics."
                st.session_state.cmo_messages.append({"role": "user", "content": prompt})
                st.session_state.cmo_suggested_prompt = None
                st.rerun()
            if st.button("Cancel", use_container_width=True, key="metrics_cancel"):
                st.session_state.cmo_suggested_prompt = None
                st.rerun()
        elif st.session_state.get("cmo_suggested_prompt") == "brand_audit":
            st.markdown("**Brand Audit: Paste Draft Here**")
            brand_audit_text = st.text_area(
                "Paste the text you want to audit against Vonga's brand voice guidelines:",
                key="brand_audit_input",
                placeholder="Paste your draft email, post, or marketing copy here...",
                height=150,
                label_visibility="collapsed"
            )
            
            col_submit, col_cancel = st.columns(2)
            with col_submit:
                if st.button("Audit Brand Voice", type="primary", use_container_width=True, key="brand_audit_submit"):
                    if brand_audit_text and brand_audit_text.strip():
                        prompt = f"Review this text for brand voice compliance:\n\n{brand_audit_text}"
                        st.session_state.cmo_messages.append({"role": "user", "content": prompt})
                        st.session_state.cmo_suggested_prompt = None
                        st.rerun()
                    else:
                        st.warning("Please paste some text to audit.")
            with col_cancel:
                if st.button("Cancel", use_container_width=True, key="brand_audit_cancel"):
                    st.session_state.cmo_suggested_prompt = None
                    st.rerun()
        elif st.session_state.get("cmo_suggested_prompt") == "brief":
            st.markdown("**Campaign Brief Details**")
            campaign_type = st.selectbox(
                "Campaign Type:",
                ["Brand Awareness", "Lead Generation", "Conversion", "Retention", "Product Launch", "Other"],
                key="brief_type"
            )
            brand_focus = st.selectbox(
                "Brand Focus:",
                ["Vonga Brand", "Client Campaign"],
                key="brief_brand"
            )
            timeframe = st.text_input("Timeframe:", key="brief_timeframe", placeholder="e.g., Q3 2024, Q4 2024, etc.")
            objectives = st.text_area(
                "Campaign Objectives & Specific Requirements:",
                key="brief_objectives",
                placeholder="e.g., Increase brand awareness among enterprise customers, launch new product feature, etc. Be specific about what you want to achieve.",
                height=100
            )
            
            col_submit, col_cancel = st.columns(2)
            with col_submit:
                if st.button("Create Brief", type="primary", use_container_width=True, key="brief_submit"):
                    if objectives.strip():
                        # Build comprehensive prompt
                        prompt_parts = [f"Create a detailed campaign brief for a {campaign_type} campaign"]
                        if brand_focus == "Vonga Brand":
                            prompt_parts.append("for the Vonga brand")
                        else:
                            prompt_parts.append("for a client campaign")
                        if timeframe.strip():
                            prompt_parts.append(f"with timeframe: {timeframe}")
                        prompt_parts.append(f"\n\nSpecific Objectives & Requirements:\n{objectives}")
                        prompt_parts.append("\n\nPlease conduct comprehensive research combining internal Vonga strategy documents with external market research to create a detailed, actionable campaign brief.")
                        
                        prompt = " ".join(prompt_parts)
                        st.session_state.cmo_messages.append({"role": "user", "content": prompt})
                        st.session_state.cmo_suggested_prompt = None
                        st.rerun()
                    else:
                        st.warning("Please provide campaign objectives and requirements.")
            with col_cancel:
                if st.button("Cancel", use_container_width=True, key="brief_cancel"):
                    st.session_state.cmo_suggested_prompt = None
                    st.rerun()
        elif st.session_state.get("cmo_suggested_prompt") == "trends":
            industry = st.text_input("Industry:", key="industry_input", placeholder="e.g., SaaS")
            if industry:
                prompt = f"Find top 3 trends in {industry} for 2024."
                st.session_state.cmo_messages.append({"role": "user", "content": prompt})
                st.session_state.cmo_suggested_prompt = None
                st.rerun()
        
        if st.session_state.get("cmo_suggested_prompt"):
            st.divider()
        
        # Display chat messages
        for message in st.session_state.cmo_messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        # Process any pending user messages (from suggested prompts)
        if st.session_state.cmo_messages:
            last_message = st.session_state.cmo_messages[-1]
            if last_message.get("role") == "user":
                # Check if we need to process this message
                needs_response = (
                    len(st.session_state.cmo_messages) == 1 or 
                    st.session_state.cmo_messages[-2].get("role") != "assistant"
                )
                
                if needs_response:
                    prompt = last_message.get("content", "")
                    
                    # Check if stop was requested before processing
                    if st.session_state.stop_requested and st.session_state.processing_mode == "Marketing War Room":
                        # Stop was requested - remove the last user message and reset
                        st.session_state.cmo_messages.pop()
                        st.session_state.stop_requested = False
                        st.session_state.processing_mode = None
                        st.warning("Processing stopped.")
                        st.rerun()
                    
                    # Get agent response
                    with st.chat_message("assistant"):
                        status_col1, status_col2 = st.columns([4, 1])
                        with status_col1:
                            status_container = st.empty()
                            status_container.info("Researching and strategizing...")
                        with status_col2:
                            if st.button("Stop", key="stop_cmo_1", use_container_width=True):
                                st.session_state.stop_requested = True
                                st.session_state.processing_mode = "Marketing War Room"
                                st.rerun()
                        
                        # Set processing mode
                        st.session_state.processing_mode = "Marketing War Room"
                        st.session_state.stop_requested = False
                        
                        try:
                            def update_status(message):
                                if st.session_state.stop_requested:
                                    raise InterruptedError("Stop requested by user")
                                status_container.info(message)
                            
                            response = run_agent(
                                st.session_state.cmo_agent,
                                st.session_state.cmo_memory_logger,
                                prompt,
                                thread_id=st.session_state.cmo_thread_id,
                                progress_callback=update_status,
                                agent_name="CMO"
                            )
                            
                            status_container.empty()
                            st.markdown(response)
                            st.session_state.cmo_messages.append({"role": "assistant", "content": response})
                            st.session_state.processing_mode = None
                            
                            # Save chat to history after each exchange
                            save_chat_to_history("Marketing War Room", st.session_state.cmo_thread_id, st.session_state.cmo_messages)
                            if not st.session_state.current_cmo_thread:
                                st.session_state.current_cmo_thread = st.session_state.cmo_thread_id
                            
                            st.rerun()
                        except InterruptedError:
                            # Stop was requested - remove the last user message
                            status_container.empty()
                            if st.session_state.cmo_messages and st.session_state.cmo_messages[-1].get("role") == "user":
                                st.session_state.cmo_messages.pop()
                            st.session_state.processing_mode = None
                            st.session_state.stop_requested = False
                            st.warning("Processing stopped.")
                        except Exception as e:
                            status_container.empty()
                            error_msg = f"Error: {str(e)}"
                            st.error(error_msg)
                            st.session_state.cmo_messages.append({"role": "assistant", "content": error_msg})
                            st.session_state.processing_mode = None
        
        # Chat input
        if prompt := st.chat_input("Ask the CMO..."):
            # Add user message to chat
            st.session_state.cmo_messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)
            
            # Clear suggested prompt state
            st.session_state.cmo_suggested_prompt = None
            
            # Check if stop was requested before processing
            if st.session_state.stop_requested and st.session_state.processing_mode == "Marketing War Room":
                # Stop was requested - remove the last user message and reset
                st.session_state.cmo_messages.pop()
                st.session_state.stop_requested = False
                st.session_state.processing_mode = None
                st.warning("Processing stopped.")
                st.rerun()
            
            # Get agent response
            with st.chat_message("assistant"):
                status_col1, status_col2 = st.columns([4, 1])
                with status_col1:
                    status_container = st.empty()
                    status_container.info("Researching and strategizing...")
                with status_col2:
                    if st.button("Stop", key="stop_cmo_2", use_container_width=True):
                        st.session_state.stop_requested = True
                        st.session_state.processing_mode = "Marketing War Room"
                        st.rerun()
                
                # Set processing mode
                st.session_state.processing_mode = "Marketing War Room"
                st.session_state.stop_requested = False
                
                try:
                    def update_status(message):
                        if st.session_state.stop_requested:
                            raise InterruptedError("Stop requested by user")
                        status_container.info(message)
                    
                    response = run_agent(
                        st.session_state.cmo_agent,
                        st.session_state.cmo_memory_logger,
                        prompt,
                        thread_id=st.session_state.cmo_thread_id,
                        progress_callback=update_status,
                        agent_name="CMO"
                    )
                    
                    status_container.empty()
                    st.markdown(response)
                    st.session_state.cmo_messages.append({"role": "assistant", "content": response})
                    st.session_state.processing_mode = None
                    
                    # Save chat to history after each exchange
                    save_chat_to_history("Marketing War Room", st.session_state.cmo_thread_id, st.session_state.cmo_messages)
                    if not st.session_state.current_cmo_thread:
                        st.session_state.current_cmo_thread = st.session_state.cmo_thread_id
                    
                except InterruptedError:
                    # Stop was requested - remove the last user message
                    status_container.empty()
                    if st.session_state.cmo_messages and st.session_state.cmo_messages[-1].get("role") == "user":
                        st.session_state.cmo_messages.pop()
                    st.session_state.processing_mode = None
                    st.session_state.stop_requested = False
                    st.warning("Processing stopped.")
                except Exception as e:
                    status_container.empty()
                    error_msg = f"Error: {str(e)}"
                    st.error(error_msg)
                    st.session_state.cmo_messages.append({"role": "assistant", "content": error_msg})
                    st.session_state.processing_mode = None
    
    elif st.session_state.current_mode == "Sales Command Center":
        # Sales Command Center Interface
        st.markdown("""
        <div class="agent-header">
            <h1>Sales Command Center</h1>
            <p>Head of Sales · Research → Pitch → Admin</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Internal Documentation Status Indicators
        if st.session_state.sales_agent:
            st.info("Internal Vonga Documentation Loaded: 00_Strategy_Prime, 01_Brand_Voice_Guidelines, 03_Product_Specs (loaded dynamically from Google Drive)")
            st.info("Customer Database Access: Can read and update Vonga_Customer_DB (includes Prospector's research)")
        
        # Prospector Functionality (Nested under Sales)
        st.markdown("#### Research Companies")
        st.caption("Use Prospector functionality to find and research new leads. Results are saved to the customer database.")
        
        # Research Mode Selection - Using buttons instead of radio
        if "sales_prospector_mode" not in st.session_state:
            st.session_state.sales_prospector_mode = "Search for Companies"
        
        prospector_col1, prospector_col2 = st.columns(2)
        with prospector_col1:
            if st.button(
                "Search for Companies",
                key="sales_prospector_mode_search",
                use_container_width=True,
                type="primary" if st.session_state.sales_prospector_mode == "Search for Companies" else "secondary"
            ):
                st.session_state.sales_prospector_mode = "Search for Companies"
                st.rerun()
        with prospector_col2:
            if st.button(
                "Research Specific Companies",
                key="sales_prospector_mode_research",
                use_container_width=True,
                type="primary" if st.session_state.sales_prospector_mode == "Research Specific Companies" else "secondary"
            ):
                st.session_state.sales_prospector_mode = "Research Specific Companies"
                st.rerun()
        
        prospector_mode = st.session_state.sales_prospector_mode
        
        if prospector_mode == "Search for Companies":
            prospector_criteria = st.text_area(
                "Enter your Ideal Customer Profile criteria:",
                placeholder="e.g., Sustainable fashion brands in Austin, Tech companies with brand partnerships",
                height=80,
                key="sales_prospector_criteria"
            )
            prospector_companies = None
        else:
            prospector_companies = st.text_area(
                "Enter company names (one per line or comma-separated):",
                placeholder="e.g.,\nAcme Corp\nTechStart Inc\nBrandCo",
                height=100,
                key="sales_prospector_companies"
            )
            prospector_criteria = None
        
        if st.button("Start Research", type="secondary", disabled=st.session_state.sales_deal_cycle_running, use_container_width=True):
            if (prospector_mode == "Search for Companies" and prospector_criteria) or (prospector_mode == "Research Specific Companies" and prospector_companies):
                # Build prospector prompt
                if prospector_mode == "Search for Companies":
                    research_prompt = f"Find and research companies matching these criteria: {prospector_criteria}. Research each company deeply, find their strategy angle, decision makers, and contact information. Save each prospect to the customer database as you find them."
                else:
                    # Parse company names
                    companies_list = []
                    for line in prospector_companies.split('\n'):
                        line = line.strip()
                        if ',' in line:
                            companies_list.extend([c.strip() for c in line.split(',') if c.strip()])
                        elif line:
                            companies_list.append(line)
                    companies_text = ', '.join(companies_list) if companies_list else prospector_companies
                    research_prompt = f"Research the following specific companies and save them to the customer database: {companies_text}. For each company, conduct deep research to find: their website, current strategy, how Vonga can help them (strategy angle), decision makers (CMO, Brand Director, Founders, etc.), and contact information. Save each company to the customer database as you complete research on them."
                
                # Add to messages and run
                st.session_state.sales_messages.append({"role": "user", "content": research_prompt})
                
                # Add to status log
                if "sales_status_log" not in st.session_state:
                    st.session_state.sales_status_log = []
                st.session_state.sales_status_log.append({
                    "timestamp": datetime.now(),
                    "message": f"Starting research: {prospector_criteria if prospector_criteria else prospector_companies[:50]}...",
                    "type": "info"
                })
                
                # Run sales agent with research prompt
                try:
                    def update_sales_status(message):
                        if "sales_status_log" not in st.session_state:
                            st.session_state.sales_status_log = []
                        st.session_state.sales_status_log.append({
                            "timestamp": datetime.now(),
                            "message": message[:100] if len(message) > 100 else message,
                            "type": "info"
                        })
                    
                    response = run_sales(
                        st.session_state.sales_agent,
                        st.session_state.sales_memory_logger,
                        research_prompt,
                        thread_id=st.session_state.sales_thread_id,
                        progress_callback=update_sales_status
                    )
                    
                    st.session_state.sales_messages.append({
                        "role": "assistant",
                        "content": response
                    })
                    
                    st.session_state.sales_status_log.append({
                        "timestamp": datetime.now(),
                        "message": "Research complete!",
                        "type": "success"
                    })
                    
                    save_chat_to_history("Sales Command Center", st.session_state.sales_thread_id, st.session_state.sales_messages)
                    st.rerun()
                    
                except Exception as e:
                    st.error(f"Error during research: {str(e)}")
                    st.session_state.sales_messages.append({
                        "role": "assistant",
                        "content": f"Error: {str(e)}"
                    })
            else:
                st.warning("Please enter criteria or company names")
        
        st.markdown("---")
        
        # Run Deal Cycle Feature
        st.markdown("#### Run Deal Cycle")
        st.caption("Select a company from the database or enter a new one to run the full sales cycle: Research → Microsite Spec → Email Draft → CRM Update")
        
        # Get company names and data from database
        try:
            from tools.sheet_tools import get_company_names_from_db, get_company_data_from_db
            company_names = get_company_names_from_db(st.session_state.creds)
            company_data = get_company_data_from_db(st.session_state.creds)  # Dict: {company_name: website}
            # Add "Enter new company..." option
            company_options = ["Enter new company..."] + (company_names if company_names else [])
        except Exception as e:
            company_options = ["Enter new company..."]
            company_names = []
            company_data = {}
        
        col_company, col_website = st.columns(2)
        with col_company:
            # Use selectbox for searchable dropdown
            selected_option = st.selectbox(
                "Company Name",
                options=company_options,
                key="sales_company_select",
                index=0
            )
            
            # If "Enter new company..." is selected, show text input
            if selected_option == "Enter new company...":
                target_company = st.text_input(
                    "Enter Company Name",
                    placeholder="e.g., Acme Corp",
                    key="sales_company_name_new"
                )
            else:
                target_company = selected_option
        
        with col_website:
            # Get website from database if company is selected, otherwise allow manual entry
            if selected_option != "Enter new company..." and selected_option in company_data:
                target_website = st.text_input(
                    "Website",
                    value=company_data.get(selected_option, ""),
                    key="sales_website"
                )
            else:
                target_website = st.text_input(
                    "Website (optional)",
                    placeholder="e.g., acme.com",
                    key="sales_website"
                )
        
        # Run Deal Cycle Button
        if st.button("Run Deal Cycle", type="primary", disabled=st.session_state.sales_deal_cycle_running, use_container_width=True):
            # Get the actual company name (from selectbox or text input)
            if selected_option == "Enter new company...":
                actual_company = st.session_state.get("sales_company_name_new", "").strip()
            else:
                actual_company = selected_option
            
            if actual_company:
                st.session_state.sales_deal_cycle_running = True
                st.session_state.sales_status_log = []
                st.session_state.sales_thread_id = f"sales_{uuid.uuid4().hex[:8]}"
                st.session_state.sales_messages = []
                
                # Add initial log entry
                st.session_state.sales_status_log.append({
                    "timestamp": datetime.now(),
                    "message": f"Starting deal cycle for: {actual_company}",
                    "type": "info"
                })
                st.rerun()
            else:
                st.warning("Please enter a company name")
        
        # Status Log Display
        if st.session_state.sales_status_log:
            st.markdown("#### Status")
            log_container = st.container()
            with log_container:
                for log_entry in st.session_state.sales_status_log:
                    timestamp_str = log_entry["timestamp"].strftime("%H:%M:%S")
                    log_type = log_entry["type"]
                    message = log_entry["message"]
                    
                    if log_type == "info":
                        st.info(f"[{timestamp_str}] {message}")
                    elif log_type == "success":
                        st.success(f"[{timestamp_str}] {message}")
                    elif log_type == "warning":
                        st.warning(f"[{timestamp_str}] {message}")
                    elif log_type == "error":
                        st.error(f"[{timestamp_str}] {message}")
                    else:
                        st.text(f"[{timestamp_str}] {message}")
        
        # Display chat messages
        if st.session_state.sales_messages:
            st.markdown("#### Deal Cycle Output")
            for message in st.session_state.sales_messages:
                with st.chat_message(message["role"]):
                    st.markdown(message["content"])
        
        # Run deal cycle if triggered
        if st.session_state.sales_deal_cycle_running:
            has_assistant_response = any(
                msg.get("role") == "assistant" 
                for msg in st.session_state.sales_messages
            )
            
            if not has_assistant_response:
                # Build the prompt - get company from selectbox or text input
                selected_opt = st.session_state.get("sales_company_select", "Enter new company...")
                if selected_opt == "Enter new company...":
                    company_name = st.session_state.get("sales_company_name_new", "").strip()
                else:
                    company_name = selected_opt
                website = st.session_state.get("sales_website", "")
                
                if company_name:
                    if website:
                        deal_cycle_prompt = f"Run the full deal cycle for {company_name} (website: {website}). Research the company deeply, create a microsite spec, draft a personalized email, and update CRM."
                    else:
                        deal_cycle_prompt = f"Run the full deal cycle for {company_name}. Research the company deeply, create a microsite spec, draft a personalized email, and update CRM."
                    
                    # Add to status log
                    if not any(log.get("message", "").startswith("Researching") for log in st.session_state.sales_status_log):
                        st.session_state.sales_status_log.append({
                            "timestamp": datetime.now(),
                            "message": "Researching company...",
                            "type": "info"
                        })
                    
                    # Run the sales agent
                    try:
                        def update_sales_status(message):
                            """Update the sales status log with progress messages."""
                            # Extract key status updates
                            if "Researching" in message or "research" in message.lower():
                                status_msg = "Researching company..."
                            elif "Microsite" in message or "Spec" in message:
                                status_msg = "Creating microsite spec..."
                            elif "Email" in message or "Draft" in message:
                                status_msg = "Drafting email..."
                            elif "CRM" in message or "Activity" in message:
                                status_msg = "Updating CRM..."
                            elif "Task" in message:
                                status_msg = "Creating follow-up task..."
                            else:
                                status_msg = message[:100] if len(message) > 100 else message
                            
                            st.session_state.sales_status_log.append({
                                "timestamp": datetime.now(),
                                "message": status_msg,
                                "type": "info"
                            })
                        
                        response = run_sales(
                            st.session_state.sales_agent,
                            st.session_state.sales_memory_logger,
                            deal_cycle_prompt,
                            thread_id=st.session_state.sales_thread_id,
                            progress_callback=update_sales_status
                        )
                        
                        # Add response to messages
                        st.session_state.sales_messages.append({
                            "role": "assistant",
                            "content": response
                        })
                        
                        # Add success status
                        st.session_state.sales_status_log.append({
                            "timestamp": datetime.now(),
                            "message": "Deal cycle complete!",
                            "type": "success"
                        })
                        
                        # Save chat to history
                        save_chat_to_history("Sales Command Center", st.session_state.sales_thread_id, st.session_state.sales_messages)
                        if not st.session_state.current_sales_thread:
                            st.session_state.current_sales_thread = st.session_state.sales_thread_id
                        
                        st.session_state.sales_deal_cycle_running = False
                        st.rerun()
                        
                    except Exception as e:
                        import traceback
                        error_msg = f"Error during deal cycle: {str(e)}"
                        error_details = traceback.format_exc()
                        st.session_state.sales_status_log.append({
                            "timestamp": datetime.now(),
                            "message": error_msg,
                            "type": "error"
                        })
                        st.session_state.sales_messages.append({
                            "role": "assistant",
                            "content": f"Error: {error_msg}\n\nDetails: {error_details[-500:]}"
                        })
                        st.session_state.sales_deal_cycle_running = False
                        st.rerun()
        
        # Chat interface for additional interactions
        st.markdown("---")
        st.markdown("#### Chat with Head of Sales")
        
        # Display existing messages
        for message in st.session_state.sales_messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        # Chat input
        if prompt := st.chat_input("Ask the Head of Sales..."):
            st.session_state.sales_messages.append({"role": "user", "content": prompt})
            
            with st.chat_message("assistant"):
                status_col1, status_col2 = st.columns([4, 1])
                with status_col1:
                    status_container = st.empty()
                    status_container.info("Processing...")
                with status_col2:
                    if st.button("Stop", key="stop_sales", use_container_width=True):
                        st.session_state.stop_requested = True
                        st.session_state.processing_mode = "Sales Command Center"
                        st.rerun()
                
                st.session_state.processing_mode = "Sales Command Center"
                st.session_state.stop_requested = False
                
                try:
                    def update_status(message):
                        if st.session_state.stop_requested:
                            raise InterruptedError("Stop requested by user")
                        status_container.info(message)
                    
                    response = run_sales(
                        st.session_state.sales_agent,
                        st.session_state.sales_memory_logger,
                        prompt,
                        thread_id=st.session_state.sales_thread_id,
                        progress_callback=update_status
                    )
                    
                    status_container.empty()
                    st.markdown(response)
                    st.session_state.sales_messages.append({"role": "assistant", "content": response})
                    st.session_state.processing_mode = None
                    
                    # Save chat to history
                    save_chat_to_history("Sales Command Center", st.session_state.sales_thread_id, st.session_state.sales_messages)
                    if not st.session_state.current_sales_thread:
                        st.session_state.current_sales_thread = st.session_state.sales_thread_id
                    
                except InterruptedError:
                    status_container.empty()
                    if st.session_state.sales_messages and st.session_state.sales_messages[-1].get("role") == "user":
                        st.session_state.sales_messages.pop()
                    st.session_state.processing_mode = None
                    st.session_state.stop_requested = False
                    st.warning("Processing stopped.")
                except Exception as e:
                    status_container.empty()
                    error_msg = f"Error: {str(e)}"
                    st.error(error_msg)
                    st.session_state.sales_messages.append({"role": "assistant", "content": error_msg})
                    st.session_state.processing_mode = None
    
    elif st.session_state.current_mode == "Production Studio":
        # Production Studio Interface
        st.markdown("""
        <div class="agent-header">
            <h1>Production Studio</h1>
            <p>Marketing Production Team · Copywriter & Microsite Builder</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("#### Build Microsite")
        st.caption("Select a microsite spec from existing deals or paste a new spec URL to build and deploy a complete microsite.")
        
        # Get microsite specs from CRM
        try:
            from tools.microsite_tools import get_microsite_specs_list
            microsite_specs = get_microsite_specs_list(st.session_state.creds)
        except Exception as e:
            microsite_specs = []
            st.warning(f"Could not load microsite specs from CRM: {str(e)}")
        
        # Dropdown for existing specs
        if microsite_specs:
            spec_options = ["Select a microsite spec..."] + [f"{spec['company_name']} - {spec['spec_url'][:50]}..." for spec in microsite_specs]
            selected_spec = st.selectbox(
                "Select Microsite Spec from CRM",
                options=spec_options,
                key="microsite_spec_select",
                index=0
            )
            
            if selected_spec != "Select a microsite spec...":
                # Extract URL from selected option
                selected_idx = spec_options.index(selected_spec) - 1
                spec_url = microsite_specs[selected_idx]['spec_url']
                st.info(f"Selected: **{microsite_specs[selected_idx]['company_name']}**")
            else:
                spec_url = None
        else:
            spec_url = None
            st.info("No microsite specs found in CRM. You can paste a spec URL below.")
        
        # Option to paste new URL
        st.markdown("---")
        st.caption("Or paste a new Microsite Spec Link:")
        manual_url = st.text_input(
            "Microsite Spec Link (Google Doc URL)",
            placeholder="https://docs.google.com/document/d/...",
            key="microsite_spec_url_manual"
        )
        
        # Use manual URL if provided, otherwise use selected
        if manual_url:
            spec_url = manual_url
        elif not spec_url:
            spec_url = None
        
        # Build Microsite Button
        if st.button("Build Microsite", type="primary", disabled=st.session_state.microsite_builder_running, use_container_width=True):
            if spec_url:
                st.session_state.microsite_builder_running = True
                st.session_state.microsite_builder_status = f"Starting microsite build from spec..."
                st.rerun()
            else:
                st.warning("Please select a microsite spec from the dropdown or paste a spec URL")
        
        # Status Display
        if st.session_state.microsite_builder_status:
            st.markdown("#### Status")
            if "✅" in st.session_state.microsite_builder_status or "successfully" in st.session_state.microsite_builder_status.lower():
                st.success(st.session_state.microsite_builder_status)
            elif "Error" in st.session_state.microsite_builder_status or "❌" in st.session_state.microsite_builder_status:
                st.error(st.session_state.microsite_builder_status)
            else:
                st.info(st.session_state.microsite_builder_status)
        
        # Run microsite builder if triggered
        if st.session_state.microsite_builder_running:
            try:
                def update_status(message):
                    st.session_state.microsite_builder_status = message
                
                response = run_microsite_builder(
                    st.session_state.microsite_builder_agent,
                    st.session_state.microsite_builder_memory_logger,
                    spec_url,
                    st.session_state.creds,
                    api_key=st.secrets.get("GOOGLE_API_KEY") or os.getenv("GOOGLE_API_KEY"),
                    thread_id=f"microsite_{uuid.uuid4().hex[:8]}",
                    progress_callback=update_status
                )
                
                # Ensure we have a response
                if not response or len(response.strip()) == 0:
                    response = "Build process completed, but no response was returned. Please check if the repository was created."
                
                # Extract GitHub URL from response
                if "github.com" in response.lower() or "Repository URL:" in response or "Site Code Pushed" in response:
                    # Try to extract URL
                    import re
                    url_match = re.search(r'https?://[^\s]+github[^\s]+', response)
                    if url_match:
                        github_url = url_match.group(0)
                        st.session_state.microsite_builder_status = f"✅ Site Code Pushed: {github_url}"
                    else:
                        st.session_state.microsite_builder_status = f"✅ {response}"
                elif "Error" in response or "error" in response.lower() or "❌" in response:
                    st.session_state.microsite_builder_status = f"❌ {response}"
                else:
                    # Always set status, even if it's just informational
                    st.session_state.microsite_builder_status = f"ℹ️ {response}"
                
                st.session_state.microsite_builder_running = False
                st.rerun()
                
            except Exception as e:
                import traceback
                error_traceback = traceback.format_exc()
                error_msg = f"❌ Error building microsite: {str(e)}\n\nTraceback:\n{error_traceback}"
                st.session_state.microsite_builder_status = error_msg
                print(f"Microsite Builder Error: {error_traceback}")  # Also print to console
                st.session_state.microsite_builder_running = False
                st.rerun()


if __name__ == "__main__":
    main()
