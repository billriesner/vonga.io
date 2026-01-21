#!/usr/bin/env python3
"""
Generate image for Problem Section using Google's NanoBanana (Gemini 2.5 Flash Image)
"""

import sys
import os

# Add automation directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'automation'))

from tools.dev_tools import GenerateImageTool

def main():
    # Image prompt for "The Dormant Asset Problem" section
    prompt = """
    Create a professional, modern illustration for a B2B sports technology website.
    
    Concept: "The Engagement-Revenue Gap"
    
    Visual elements:
    - Split composition showing contrast between high engagement vs low revenue capture
    - Left side: Multiple touchpoints/interactions (icons representing: mobile notifications, live games, social media, merchandise) arranged in a circular pattern, showing frequency (100+ interactions)
    - Right side: Only 3-5 calendar event markers or transaction icons, sparse and minimal
    - Large visual gap or disconnect in the middle (perhaps a broken connection line or fading gradient)
    - Clean, minimal design with a tech/data visualization aesthetic
    - Color palette: Deep navy (#0A1422), aqua blue (#33BECC), coral accents (#FF6B6B)
    - Modern, professional style suitable for B2B SaaS website
    - No text overlays (will be added in web design)
    - Horizontal orientation (16:9 or similar)
    - Conveys: "lots of engagement, minimal revenue capture" problem
    
    Style: Modern tech illustration, clean lines, professional, data visualization inspired
    """
    
    print("Generating image for Problem Section...")
    print("\nPrompt:")
    print("-" * 80)
    print(prompt)
    print("-" * 80)
    print("\nGenerating with Google NanoBanana (Gemini 2.5 Flash Image)...")
    
    # Initialize the tool
    tool = GenerateImageTool()
    
    # Generate the image
    result = tool._run(
        prompt=prompt,
        image_name="problem_section_engagement_gap"
    )
    
    print("\n" + result)
    
    if "successfully" in result.lower():
        print("\n✅ Image ready! You can now use it in the Problem Section component.")
        print("📁 Location: generated_assets/problem_section_engagement_gap.png")
        print("\n💡 Next step: Update the ProblemSection component to display this image.")
    else:
        print("\n⚠️  Image generation issue. You may need to:")
        print("1. Install google-genai: pip install google-genai")
        print("2. Ensure GOOGLE_API_KEY is set in environment or .streamlit/secrets.toml")
        print("\nAlternatively, use the prompt above with Midjourney, DALL-E, or another tool.")

if __name__ == "__main__":
    main()
