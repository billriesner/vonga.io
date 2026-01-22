# Remotion Video Setup - Complete Guide

## ✅ Installation Complete!

Remotion is now installed and configured in your project. The demo video structure is ready.

## 🎬 What You Have Now

### 6 Animated Scenes (30 seconds total):

1. **Problem Hook** (5s) - "100+ Fan Touchpoints vs. 3-5 Revenue Events"
2. **Apparel Transition** (4s) - "Vonga transforms apparel into an owned channel"
3. **Engagement Dashboard** (5s) - Mock analytics dashboard
4. **Experience Types** (6s) - 4 ways to drive revenue (grid layout)
5. **Revenue Growth** (6s) - 2.8× Shopping Frequency, 4.3× Revenue per Fan
6. **CTA** (4s) - "Ready to increase revenue per fan? Schedule a Call"

## 🚀 How to Use

### Preview in Remotion Studio (Recommended First Step)

```bash
npm run remotion:studio
```

This opens **http://localhost:3000** with:
- ✅ Interactive timeline
- ✅ Real-time preview
- ✅ Scrub through scenes
- ✅ Test animations
- ✅ Export frames

**Currently running at:** http://localhost:3000

### Render Final Video

```bash
npm run remotion:render
```

Output: `output/demo-video.mp4` (30 seconds, 1920x1080, 30fps)

## 🎨 Next Steps: Customization

### 1. Replace Placeholder Content

**Current placeholders to replace:**

#### Scene 2: Apparel Items
- Currently: Emoji placeholders (🏈 ⚽ 🏀)
- Replace with: Your actual product images

**How to add:**
```tsx
// In remotion/scenes/Scene2_AppearanceTransition.tsx
import { Img } from "remotion";

// Replace emoji div with:
<Img 
  src="/images/mockups/jersey-1.png" 
  style={{ width: 200, height: 240, borderRadius: 16 }}
/>
```

#### Scene 3: Dashboard Mockup
- Currently: Built-in HTML/CSS mock dashboard
- Option: Replace with actual dashboard screenshot

**How to add:**
```tsx
// In remotion/scenes/Scene3_EngagementDashboard.tsx
import { Img } from "remotion";

<Img 
  src="/images/mockups/dashboard.png"
  style={{ width: 1200, borderRadius: 16 }}
/>
```

#### Scene 6: Logo
- Currently: "VONGA" text
- Replace with: Actual SVG logo

**How to add:**
```tsx
// In remotion/scenes/Scene6_CTA.tsx
import { Img } from "remotion";

<Img 
  src="/images/logos/logo.svg"
  style={{ width: 400 }}
/>
```

### 2. Add Your Mockups

**Recommended folder structure:**
```
/public/images/mockups/
├── dashboard.png          (Scene 3)
├── phone-app.png          (optional)
├── jersey-navy.png        (Scene 2)
├── jersey-aqua.png        (Scene 2)
└── jersey-coral.png       (Scene 2)
```

### 3. Adjust Animations

**Example: Change scene duration**
```tsx
// In remotion/DemoVideo.tsx
const scenes = {
  scene1: { start: 0, duration: 180 }, // Changed from 150 to 180 (6s instead of 5s)
  // Adjust other scenes accordingly
};
```

**Example: Adjust animation speed**
```tsx
// In any scene file
const headlineOpacity = interpolate(frame, [0, 45], [0, 1]); // Slower (was [0, 30])
```

### 4. Customize Text

**All text is in:** `remotion/scenes/*.tsx`

Example changes:
- Scene 1 headline: "Your fans engage 100+ times per year"
- Scene 6 CTA: "Ready to increase revenue per fan?"

Just edit the strings directly in the TSX files.

## 🎯 Rendering Options

### High-Quality Render
```bash
npx remotion render remotion/index.ts DemoVideo output/demo-video.mp4 --quality=100
```

### Render Specific Scene Only
```bash
# Just Scene 1 (frames 0-150)
npx remotion render remotion/index.ts DemoVideo output/scene1.mp4 --frames=0-150
```

### Export as GIF
```bash
npx remotion render remotion/index.ts DemoVideo output/demo.gif
```

### Faster Rendering (more CPU cores)
```bash
npx remotion render remotion/index.ts DemoVideo output/demo-video.mp4 --concurrency=8
```

## 🎨 Brand Consistency

All brand colors are defined in `remotion/theme.ts`:
- **Navy:** #303E55
- **Aqua:** #33BECC  
- **Coral:** #F5856E

These match your `styles/tokens.json` exactly.

## 📊 Video Specs

- **Resolution:** 1920x1080 (Full HD)
- **FPS:** 30
- **Duration:** 30 seconds (900 frames)
- **Codec:** H.264 (MP4)
- **File size (estimated):** 10-15 MB

## 🔧 Workflow Recommendations

### Option A: Quick Start (Use as-is)
1. ✅ Open Remotion Studio: `npm run remotion:studio`
2. ✅ Review all 6 scenes
3. ✅ Render: `npm run remotion:render`
4. ✅ Use `output/demo-video.mp4` on website

**Time:** 15 minutes

### Option B: Full Customization
1. ✅ Add your mockups to `/public/images/mockups/`
2. ✅ Replace placeholders in `remotion/scenes/*.tsx`
3. ✅ Adjust text to match your exact messaging
4. ✅ Preview in Studio
5. ✅ Render final video

**Time:** 2-3 hours

### Option C: Hybrid Approach (Recommended)
1. ✅ Render current version first (see how it looks)
2. ✅ Identify what needs changing
3. ✅ Replace 2-3 key elements (logo, dashboard, jerseys)
4. ✅ Render updated version

**Time:** 1 hour

## 💡 Advantages Over Canva/AI

| Feature | Remotion | Canva | AI Video |
|---------|----------|-------|----------|
| **Brand accuracy** | Perfect | Good | Variable |
| **Your mockups** | Direct import | Upload | Can't use |
| **Exact colors** | #33BECC exact | Close | Approximate |
| **Reusability** | Update & re-render | Manual redo | Regenerate |
| **Version control** | Git tracked | Manual export | N/A |
| **Team edits** | Code review | Share link | N/A |
| **Automation** | CI/CD possible | Manual | Manual |

## 🚨 Common Issues

### "Port 3000 already in use"
Your Next.js dev server is running. Either:
- Stop Next.js: Find terminal running `npm run dev` and stop it
- Use different port: `npx remotion studio remotion/index.ts --port=3001`

### "Module not found"
Run: `npm install`

### Render is slow
Add: `--concurrency=8` to render command

### Video quality is poor
Add: `--quality=100` to render command

## 📚 Resources

- **Remotion Docs:** https://remotion.dev
- **Your project:** `remotion/` folder
- **Scene files:** `remotion/scenes/`
- **Config:** `remotion.config.ts`

---

## 🎬 Ready to Start?

**Right now:**
1. Open http://localhost:3000 in your browser
2. See the full 30-second video
3. Scrub through timeline
4. Identify what to customize

**Then:**
1. Add your mockups
2. Update text if needed
3. Render final video
4. Place in `/public/videos/demo-video.mp4`
5. It'll automatically show on your website!

---

**Questions or need help customizing?** Just ask!
