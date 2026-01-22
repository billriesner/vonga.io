# Remotion Troubleshooting Guide

## Issue: Images Not Loading

### Error:
```
Error loading image with src: http://localhost:3001/images/sections/Vonga%20-%20Group.png
```

### Solution:

**1. Configure Remotion to use public folder**

I've already added this to `remotion.config.ts`:
```typescript
Config.setPublicDir("./public");
```

**2. Restart Remotion Studio**

After changing the config, you need to restart:
```bash
# Stop current Remotion Studio (Ctrl+C)
# Then restart:
npm run remotion:studio
```

### Alternative: Use Absolute Paths

If the public folder approach doesn't work, you can use absolute file paths:

```tsx
// Instead of:
<Img src="/images/sections/Vonga - Group.png" />

// Use:
<Img src={require("./path/to/image.png")} />
```

But this requires copying images to a Remotion-specific folder.

---

## File Types

**PNG Files (Work fine):**
- ✅ `Vonga - Group.png`
- ✅ `Vonga - Tap.png`

**SVG Files (Also work fine):**
- ✅ `Mobile 1.svg`, `Mobile 2.svg`, `Mobile 3.svg`
- ✅ `Dashboard 1.svg` through `Dashboard 6.svg`

Both PNG and SVG work with Remotion. The issue was just the public folder configuration.

---

## Next Steps

1. **Restart Remotion Studio** (most important!)
2. **Refresh browser** at http://localhost:3001
3. **Check console** for any remaining errors

If it still doesn't work after restarting, let me know and we can try alternative approaches!
