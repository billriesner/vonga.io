# Problem Section Image - Generation Guide

**Section:** "The Dormant Asset Problem"  
**Purpose:** Visualize the engagement-revenue gap  
**Date:** January 19, 2026

---

## Option 1: Use Repo's Image Generator (Easiest)

Run the provided Python script:

```bash
python generate_problem_image.py
```

**Requirements:**
- `google-genai` package installed: `pip install google-genai`
- `GOOGLE_API_KEY` set in environment or `.streamlit/secrets.toml`

**Output:**
- Image saved to: `generated_assets/problem_section_engagement_gap.png`
- Size: 1024x1024 pixels
- Format: PNG

---

## Option 2: Use External Tool (Midjourney, DALL-E, etc.)

Use this prompt:

### Image Prompt

```
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
```

### Recommended Tools

**Midjourney:**
- Add style parameters: `--ar 16:9 --style raw --v 6`
- May need to simplify prompt for best results

**DALL-E 3 (ChatGPT Plus):**
- Use prompt as-is
- Request size: 1792x1024 (landscape)

**Adobe Firefly:**
- Use prompt with "Vector art" style preset

**Canva AI:**
- Use prompt, select "Illustration" style

---

## Design Specifications

### Visual Concept
**Core Message:** Fans engage 100+ times per year, revenue happens 3-5 times

### Layout
- **Left Third:** High-frequency engagement (dense, busy)
- **Middle Third:** Gap/disconnect (empty, broken)
- **Right Third:** Low-frequency revenue (sparse, minimal)

### Color Usage
- **Deep Navy (#0A1422):** Background or primary elements
- **Aqua (#33BECC):** Engagement side (active, frequent)
- **Coral (#FF6B6B):** Revenue side (sparse, infrequent)
- **Gray (#E5E7EB):** Gap/disconnect

### Style Guidelines
- ✅ Modern, clean, professional
- ✅ Tech/SaaS aesthetic (think: Stripe, Notion, Linear)
- ✅ Data visualization inspired
- ✅ Minimal, not cluttered
- ❌ No stock photos of people
- ❌ No cheesy clipart
- ❌ No text overlays

---

## Alternative Visual Concepts

### Concept 2: Timeline Visualization
- Horizontal timeline showing 365 days
- Many small "engagement dots" throughout the year
- Only 3-5 large "revenue moments" clustered at events
- Shows temporal mismatch

### Concept 3: Funnel/Pipeline
- Wide funnel at top (100+ engagement touchpoints flowing in)
- Narrow bottleneck at bottom (only 3-5 revenue moments flowing out)
- Shows conversion gap

### Concept 4: Graph/Chart
- Bar chart comparing engagement frequency vs revenue frequency
- Tall bar: "Fan Engagement: 100+ times"
- Short bar: "Revenue Capture: 3-5 events"
- Clean, data-driven aesthetic

---

## Implementation After Generation

Once you have the image:

### 1. Save to Public Directory
```bash
# If using repo generator:
cp generated_assets/problem_section_engagement_gap.png public/images/sections/

# If using external tool:
# Save downloaded image as: public/images/sections/problem-gap.png
```

### 2. Update ProblemSection Component

Edit: `components/sections/ProblemSection.tsx`

Add image import:
```typescript
import Image from 'next/image';
```

Add image to layout:
```tsx
<div className="grid md:grid-cols-2 gap-12 items-center">
  {/* Text column */}
  <div>
    <h2>{headline}</h2>
    <p>{description}</p>
    <p>{statement}</p>
  </div>
  
  {/* Image column */}
  <div className="relative h-96">
    <Image
      src="/images/sections/problem-gap.png"
      alt="Engagement-Revenue Gap Visualization"
      fill
      className="object-contain"
    />
  </div>
</div>
```

### 3. Optimize Image (Optional)

Compress for web:
```bash
# Using ImageOptim (Mac)
# or
npx @squoosh/cli --webp problem-gap.png
```

---

## Quality Checklist

Before finalizing, ensure:
- ✅ Aligns with Vonga brand colors
- ✅ Professional, not cartoony
- ✅ Clear visual hierarchy
- ✅ Readable at different sizes
- ✅ Works on light/dark backgrounds
- ✅ No text that would need translation
- ✅ Conveys "gap" concept intuitively

---

## Next Steps

1. **Generate image** (Option 1 or 2)
2. **Review for brand fit**
3. **Save to `public/images/sections/`**
4. **Update ProblemSection component**
5. **Test responsiveness** (mobile, tablet, desktop)
6. **Optimize file size** if needed

**Need help with implementation? Let me know!**
