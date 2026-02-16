# Blog CSS Audit Against Design Principles

## Current Issues Found

### ❌ Typography Hierarchy (Too Many Font Sizes)
**Principle:** Never more than 3 font sizes on one screen  
**Current:** 12, 14, 15, 16, 17, 18, 20, 24, 26, 28, 32, 36, 40, 48, 64px (15 different sizes!)  
**Target:** 3 sizes max:
- **Display (Headers):** 32px (desktop), 28px (mobile)
- **Body (Content):** 17px
- **Caption (Meta):** 14px

### ❌ Font Size Too Small
**Principle:** Never smaller than 15px  
**Current Issues:**
- `.tag`: 12px → Should be 13px minimum
- `.blog-card-content p`: 15px → Borderline, should be 16-17px

### ✅ Generous Whitespace (Mostly Good)
- 24px minimum padding: ✅ Met
- 48-64px between sections: ✅ Met (60-80px used)

### ❌ Inconsistent Corner Radius
**Principle:** Consistent corner radius signals polish  
**Current:**
- Featured article: 16px
- Blog cards: 12px
- Input fields: 8px
- Callouts: 8px
**Target:** Pick one system:
- Buttons/inputs: 8px
- Cards/images: 12px
- Modals/featured: 16px (use sparingly)

### ⚠️  Color Contrast (Need to Verify)
**Principle:** 4.5:1 minimum contrast  
**Concerns:**
- `var(--gray-500)` for read-time might be too light
- `var(--gray-600)` for body text needs verification
- Check against white backgrounds

### ❌ No Retina Image Handling
**Principle:** Images must be crisp (2x for retina)  
**Current:** No srcset or image-set directives

### ⚠️  Not Enough Restraint
- Too many font sizes = feels busy
- Inconsistent spacing in some areas
- Could simplify further

---

## Recommended Fixes

### 1. Simplify Typography Scale
```css
/* ONLY 3 SIZES */
--font-display: 32px;     /* H1, H2 headers */
--font-body: 17px;        /* All body text, lists */
--font-caption: 14px;     /* Dates, tags, meta */
```

### 2. Standardize Corner Radius
```css
--radius-sm: 8px;   /* Buttons, inputs */
--radius-md: 12px;  /* Cards, images */
--radius-lg: 16px;  /* Featured elements only */
```

### 3. Increase Minimum Whitespace
- Bump article content padding to 64px (desktop), 48px (mobile)
- Ensure 64px between major sections

### 4. Fix Small Text
- Tags: 12px → 14px
- Card excerpts: 15px → 17px

### 5. Add Retina Image Support
- Use srcset in HTML
- Or CSS image-set for backgrounds
