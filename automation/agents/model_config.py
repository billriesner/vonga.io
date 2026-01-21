"""
Centralized LLM model configuration for Vonga OS.
Update this file to use the latest available Gemini model.
"""

# Current model configuration
# Available models (as of 2024):
# - "gemini-2.5-flash" - Fast, efficient, good for most tasks
# - "gemini-2.5-pro" - More capable, better for complex reasoning
# - "gemini-2.0-flash-exp" - Experimental latest model (if available)
# - "gemini-pro" - Stable production model
# - "gemini-pro-latest" - Always uses the latest stable version

# Primary model for all agents
# Update this to use the latest model when available
# Options: "gemini-2.5-flash", "gemini-2.5-pro", "gemini-pro-latest"
DEFAULT_MODEL = "gemini-2.5-flash"

# To always use the latest stable model automatically, uncomment:
# DEFAULT_MODEL = "gemini-pro-latest"

# Alternative: Use the latest stable model automatically
# DEFAULT_MODEL = "gemini-pro-latest"

# Model-specific configurations
MODEL_CONFIGS = {
    "gemini-2.5-flash": {
        "description": "Fast and efficient, good for most operational tasks",
        "recommended_for": ["Chief of Staff", "Sales", "Prospector"]
    },
    "gemini-2.5-pro": {
        "description": "More capable, better for complex reasoning and analysis",
        "recommended_for": ["Head of Strategy", "CMO"]
    },
    "gemini-pro-latest": {
        "description": "Always uses the latest stable Gemini model",
        "recommended_for": ["All agents - ensures you're always on the latest"]
    }
}


def get_model_name(agent_type: str = "default") -> str:
    """
    Get the model name for a specific agent type.
    
    Args:
        agent_type: Type of agent ("chief_of_staff", "strategist", "cmo", "sales", "prospector", "default")
    
    Returns:
        Model name string
    """
    # You can customize model per agent type here if needed
    # For example:
    # if agent_type == "strategist":
    #     return "gemini-2.5-pro"  # Use Pro for strategic thinking
    
    return DEFAULT_MODEL


def get_available_models() -> list:
    """
    Get list of available Gemini models.
    Check Google's documentation for the latest: https://ai.google.dev/models/gemini
    """
    return [
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash-exp",  # Experimental - may not always be available
        "gemini-pro",
        "gemini-pro-latest"  # Always uses latest stable
    ]


def update_to_latest_model():
    """
    Helper function to check and update to the latest model.
    Update DEFAULT_MODEL in this file when new models are released.
    
    To find the latest models:
    1. Check Google AI Studio: https://aistudio.google.com/
    2. Check Gemini API docs: https://ai.google.dev/models/gemini
    3. Use "gemini-pro-latest" for automatic latest stable version
    """
    # This is a placeholder - update DEFAULT_MODEL manually when new models are released
    # Or use "gemini-pro-latest" for automatic updates
    return DEFAULT_MODEL




