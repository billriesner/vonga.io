# How to Update VongaOS to Use the Latest LLM Model

VongaOS now uses a centralized model configuration system, making it easy to update to the latest Gemini model.

## Quick Update

1. **Edit `/agents/model_config.py`**
2. **Change the `DEFAULT_MODEL` variable** to the latest model name

```python
# Current (as of setup)
DEFAULT_MODEL = "gemini-2.5-flash"

# To use latest stable automatically:
DEFAULT_MODEL = "gemini-pro-latest"

# Or specify a specific model:
DEFAULT_MODEL = "gemini-2.5-pro"  # For more capable reasoning
```

3. **Restart VongaOS** - The change will apply to all agents automatically

## Finding the Latest Models

### Method 1: Google AI Studio
1. Visit: https://aistudio.google.com/
2. Check the model dropdown in the interface
3. Look for the latest "gemini-2.x" models

### Method 2: Google AI Documentation
1. Visit: https://ai.google.dev/models/gemini
2. Check the "Available Models" section
3. Look for the latest model names

### Method 3: Use "gemini-pro-latest"
- This automatically uses the latest stable model
- No manual updates needed
- Set: `DEFAULT_MODEL = "gemini-pro-latest"`

## Available Models (as of 2024-2025)

- **gemini-2.5-flash**: Fast, efficient, good for most tasks (current default)
- **gemini-2.5-pro**: More capable, better for complex reasoning
- **gemini-2.0-flash-exp**: Experimental latest model (may not always be available)
- **gemini-pro**: Stable production model
- **gemini-pro-latest**: Always uses the latest stable version (recommended for auto-updates)

## Per-Agent Model Configuration

If you want different models for different agents, edit `get_model_name()` in `model_config.py`:

```python
def get_model_name(agent_type: str = "default") -> str:
    if agent_type == "strategist":
        return "gemini-2.5-pro"  # Use Pro for strategic thinking
    elif agent_type == "cmo":
        return "gemini-2.5-pro"  # Use Pro for marketing strategy
    else:
        return DEFAULT_MODEL  # Use default for others
```

## Verification

After updating, check the console output when VongaOS starts. You should see the model being used in the initialization messages.

## Notes

- All agents automatically use the model from `model_config.py`
- No need to edit individual agent files
- Changes take effect after restart
- Using "gemini-pro-latest" ensures you're always on the latest stable model




