#!/bin/bash
# Helper script to run the Chief of Staff AI Agent

# Add Python user bin to PATH if not already there
export PATH="$HOME/Library/Python/3.9/bin:$PATH"

# Check if GOOGLE_API_KEY is set
if [ -z "$GOOGLE_API_KEY" ]; then
    echo "⚠️  Warning: GOOGLE_API_KEY environment variable is not set."
    echo "   The app will run but Gemini API calls will fail without it."
    echo ""
    echo "   To set it, run:"
    echo "   export GOOGLE_API_KEY='your-api-key-here'"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run Streamlit
echo "🚀 Starting Chief of Staff AI Agent..."
echo ""
streamlit run app.py

