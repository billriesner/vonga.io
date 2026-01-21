# Trust Section - 3rd Row Centered

**Date:** January 19, 2026  
**Section:** Built on Trust  
**Issue:** 7th item (last row) was left-aligned, looked unbalanced

---

## ✅ Solution

Updated `TrustSection.tsx` to center the last item in the grid.

### Grid Layout:

**Small screens (sm):** 2 columns
- Row 1: Items 1-2
- Row 2: Items 3-4
- Row 3: Items 5-6
- Row 4: Item 7 (spans 2 columns, centered)

**Large screens (lg):** 3 columns
- Row 1: Items 1-3
- Row 2: Items 4-6
- Row 3: Item 7 (starts in column 2, centered)

---

## 🎨 CSS Classes Applied to Last Item:

```tsx
className={`flex flex-col items-center text-center p-6 ${
  isLastItem ? 'sm:col-span-2 sm:mx-auto sm:max-w-sm lg:col-span-1 lg:col-start-2' : ''
}`}
```

**Breakdown:**
- `sm:col-span-2` - On tablet, span across both columns
- `sm:mx-auto` - Center horizontally when spanning
- `sm:max-w-sm` - Constrain width so it doesn't stretch too wide
- `lg:col-span-1` - On desktop, return to single column
- `lg:col-start-2` - On desktop, start in column 2 (middle column)

---

## 📊 Visual Before/After

### Before (Large Screens):
```
┌─────┬─────┬─────┐
│  1  │  2  │  3  │
├─────┼─────┼─────┤
│  4  │  5  │  6  │
├─────┼─────┼─────┤
│  7  │     │     │  ← Left-aligned (unbalanced)
└─────┴─────┴─────┘
```

### After (Large Screens):
```
┌─────┬─────┬─────┐
│  1  │  2  │  3  │
├─────┼─────┼─────┤
│  4  │  5  │  6  │
├─────┼─────┼─────┤
│     │  7  │     │  ← Centered (balanced)
└─────┴─────┴─────┘
```

---

## ✅ Result

The 7th trust statement ("Your domain or ours") now centers in the 3rd row on large screens, creating a cleaner, more balanced visual layout.
