# Hero Video

## Setup Instructions

To add the hero background video:

1. **Locate the video file** from the previous site repository
2. **Copy the video** to this directory: `public/videos/hero-video.mp4`
3. **Update the homepage** to reference it:

```typescript
// In app/page.tsx, update the Hero component:
<Hero
  headline={homepage.hero.headline}
  subhead={homepage.hero.subhead}
  primaryCTA={homepage.hero.primaryCTA}
  secondaryCTA={homepage.hero.secondaryCTA}
  backgroundVideo="/videos/hero-video.mp4"  // Add this line
/>
```

## Video Requirements

- **Format:** MP4 (H.264 codec recommended)
- **Duration:** 8-15 seconds (looping)
- **Resolution:** 1920x1080 minimum
- **File size:** Under 5MB for optimal loading
- **Aspect ratio:** 16:9

## Alternative

If the video file cannot be located, the Hero component will fall back to a gradient background (currently active).

To use a static image instead:
1. Place image in `public/images/`
2. Use `backgroundImage="/images/hero-background.jpg"` prop

---

**Status:** Waiting for video file from previous repository
