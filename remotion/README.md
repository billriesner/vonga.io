# Vonga Demo Video - Remotion

This directory contains the Remotion project for generating the Vonga product demo video.

## 🎬 Video Structure

**Duration:** 30 seconds (900 frames @ 30fps)  
**Resolution:** 1920x1080 (Full HD)

### Scenes:

1. **Scene 1: Problem Hook** (0-5s)
   - Highlight the engagement-revenue gap
   - Navy background with aqua/coral stats

2. **Scene 2: Apparel Transition** (5-9s)
   - Show apparel transforming into a channel
   - White background with brand colors

3. **Scene 3: Engagement Dashboard** (9-14s)
   - Mock dashboard showing real-time metrics
   - Professional data visualization

4. **Scene 4: Experience Types** (14-20s)
   - Four revenue-driving capabilities
   - Grid layout with icons

5. **Scene 5: Revenue Growth** (20-26s)
   - Proven results: 2.8× and 4.3× stats
   - Gradient background (Navy to Aqua)

6. **Scene 6: CTA** (26-30s)
   - Final call-to-action
   - Schedule a Call button

## 🚀 Commands

### Preview in Remotion Studio (Interactive)
```bash
npm run remotion:studio
```

This opens an interactive browser-based editor where you can:
- See all scenes in timeline
- Adjust timing and animations
- Preview in real-time
- Export individual frames

### Render Final Video
```bash
npm run remotion:render
```

This generates the final MP4 file at `output/demo-video.mp4`.

**Rendering options:**
```bash
# Render with higher quality
npx remotion render remotion/index.ts DemoVideo output/demo-video.mp4 --quality=100

# Render specific frame range (e.g., just Scene 1)
npx remotion render remotion/index.ts DemoVideo output/scene1.mp4 --frames=0-150

# Render as GIF
npx remotion render remotion/index.ts DemoVideo output/demo.gif
```

## 🎨 Customization

### Update Brand Colors
Edit `remotion/theme.ts` to adjust colors, spacing, typography.

### Adjust Scene Timing
Edit `remotion/DemoVideo.tsx` to change scene durations:

```tsx
const scenes = {
  scene1: { start: 0, duration: 150 }, // Change duration here
  // ...
};
```

### Replace Placeholder Content
- **Apparel images:** Add real product images to `/public/images/` and import in `Scene2_AppearanceTransition.tsx`
- **Dashboard mockup:** Replace the mock dashboard in `Scene3_EngagementDashboard.tsx` with an actual screenshot
- **Logo:** Replace "VONGA" text in `Scene6_CTA.tsx` with the actual SVG logo

### Add Your Mockups

To use your existing mockups:

1. **Place images in `/public/images/mockups/`**
   ```
   /public/images/mockups/
   ├── dashboard.png
   ├── phone-app.png
   └── jersey.png
   ```

2. **Import in scenes:**
   ```tsx
   import { Img } from "remotion";
   
   <Img src="/images/mockups/dashboard.png" />
   ```

## 🎯 Next Steps

1. **Review in Studio:** Run `npm run remotion:studio` to see the full video
2. **Customize content:** Replace placeholder text/images with your actual mockups
3. **Adjust animations:** Tweak timing and transitions to match your vision
4. **Render final video:** Run `npm run remotion:render` when ready

## 📐 Technical Details

- **FPS:** 30 (standard for web video)
- **Resolution:** 1920x1080 (Full HD)
- **Codec:** H.264 (MP4)
- **Brand colors:** Navy (#303E55), Aqua (#33BECC), Coral (#F5856E)

## 🔧 Troubleshooting

**Issue:** "Cannot find module 'remotion'"  
**Fix:** Run `npm install`

**Issue:** Render is slow  
**Fix:** Add `--concurrency=8` flag or adjust in `remotion.config.ts`

**Issue:** Video quality is poor  
**Fix:** Add `--quality=100` flag when rendering

---

**Questions?** Check [Remotion docs](https://remotion.dev) or modify scenes directly in `remotion/scenes/`.
