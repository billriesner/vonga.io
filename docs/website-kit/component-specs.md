# Component Specifications — Technical Reference

## Component Architecture

**Pattern:** Composition-based components following shadcn/ui conventions  
**Styling:** Tailwind CSS with design tokens from `/styles/tokens.json`  
**State:** React 19 hooks, React Hook Form for forms  
**Validation:** Zod schemas  
**Animations:** Framer Motion (subtle, brand-aligned)

---

## UI Primitives (components/ui/)

### Button
**File:** `components/ui/button.tsx`

**Variants:**
- `primary` - Aqua background, white text (main CTAs)
- `secondary` - Navy background, white text
- `outline` - Transparent with aqua border
- `ghost` - Transparent with hover state

**Sizes:**
- `sm` - 36px height, 16px padding
- `md` - 44px height, 24px padding (default)
- `lg` - 52px height, 32px padding

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}
```

**Usage:**
```tsx
<Button variant="primary" size="lg">Let's Connect</Button>
```

---

### Card
**File:** `components/ui/card.tsx`

**Structure:**
- Card (container)
- CardHeader
- CardTitle
- CardDescription
- CardContent
- CardFooter

**Styling:**
- White background
- Subtle shadow
- 16px border radius
- 24px padding (default)

**Props:**
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated'
}
```

---

### Input
**File:** `components/ui/input.tsx`

**Types:** text, email, tel, url  
**States:** default, focus, error, disabled

**Props:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string
}
```

**Styling:**
- 44px height
- Navy border (focus: aqua)
- Error state: red border
- Disabled: gray background

---

### Textarea
**File:** `components/ui/textarea.tsx`

**Props:**
```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  errorMessage?: string
}
```

**Styling:**
- Minimum 120px height
- Resizable vertically
- Same border/focus states as Input

---

### Badge
**File:** `components/ui/badge.tsx`

**Variants:**
- `default` - Aqua background
- `secondary` - Gray background
- `success` - Green background
- `outline` - Transparent with border

**Usage:** Trust statement checkmarks, feature tags

---

## Layout Components (components/layout/)

### Header
**File:** `components/layout/Header.tsx`

**Structure:**
- Logo (left)
- Navigation (center) - Optional for v1
- CTA Button (right) - "Let's Connect"

**Behavior:**
- Sticky on scroll
- Transparent → white background on scroll
- 72px height

**Props:**
```typescript
interface HeaderProps {
  transparent?: boolean
  ctaHref?: string
  ctaText?: string
}
```

**Default CTA:** "Let's Connect" → scrolls to form

---

### Footer
**File:** `components/layout/Footer.tsx`

**Structure:**
- Logo
- Copyright
- Minimal navigation (Legal, Privacy)

**Styling:**
- Navy background
- White text
- 120px padding vertical

---

### CTAButton
**File:** `components/layout/CTAButton.tsx`

**Purpose:** Reusable "Let's Connect" button with consistent styling

**Props:**
```typescript
interface CTAButtonProps {
  text?: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}
```

**Default text:** "Let's Connect"  
**Default behavior:** Scroll to form section

---

## Section Components (components/sections/)

### Hero
**File:** `components/sections/Hero.tsx`

**Required elements:**
- Background (video or image)
- Dark overlay (0.4-0.6 opacity)
- Headline (48-64px, white)
- Subhead (20-24px, white/80%)
- Dual CTAs (primary + secondary)

**Props:**
```typescript
interface HeroProps {
  headline: string
  subhead: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  backgroundVideo?: string
  backgroundImage?: string
}
```

**Layout:**
- Full viewport height (100vh) or 80vh
- Centered content
- Max width 800px for text

---

### ProblemSection
**File:** `components/sections/ProblemSection.tsx`

**Required elements:**
- Headline
- Problem statement
- Optional: Split imagery showing contrast

**Props:**
```typescript
interface ProblemSectionProps {
  headline: string
  description: string
  image?: string
}
```

**Layout:**
- 2-column on desktop (text left, image right)
- Stacked on mobile
- Max width 1280px

---

### ContrastTable
**File:** `components/sections/ContrastTable.tsx`

**Required elements:**
- Two-column comparison table
- Left: "Everyone Else"
- Right: "Vonga"
- 4-6 comparison rows

**Props:**
```typescript
interface ContrastTableProps {
  leftColumn: {
    title: string
    items: string[]
  }
  rightColumn: {
    title: string
    items: string[]
  }
}
```

**Styling:**
- Cards for each column
- Left: subtle gray
- Right: aqua accent
- Icons: X for left, checkmark for right

---

### CategoryDefinition
**File:** `components/sections/CategoryDefinition.tsx`

**Required elements:**
- Category name
- Plain-English translation
- One-sentence explanation
- Proof mechanism

**Props:**
```typescript
interface CategoryDefinitionProps {
  categoryName: string
  translation: string
  explanation: string
  proofMechanism: string
}
```

**Layout:**
- Centered text
- Max width 800px
- Highlighted quote styling for key statements

---

### VideoDemo
**File:** `components/sections/VideoDemo.tsx`

**Required elements:**
- Video player (native HTML5)
- Placeholder state (gray box + play icon + text)
- Optional caption

**Props:**
```typescript
interface VideoDemoProps {
  videoUrl?: string
  placeholderText?: string
  thumbnailImage?: string
  caption?: string
}
```

**Behavior:**
- Click to play
- Pause on scroll out of view (optional)
- Track play/completion analytics

---

### ExperienceTypes
**File:** `components/sections/ExperienceTypes.tsx`

**Required elements:**
- 5 experience type cards
- Icon, title, description per card

**Props:**
```typescript
interface ExperienceType {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  examples: string
}

interface ExperienceTypesProps {
  experiences: ExperienceType[]
}
```

**Layout:**
- Grid: 2 columns on tablet, 3 columns on desktop
- Equal height cards
- Hover effect: subtle lift + shadow

**Content source:** `/content/experience-types.ts`

---

### Partnership
**File:** `components/sections/Partnership.tsx`

**Required elements:**
- Headline
- Key partnership points (bullets or cards)
- Optional: Team collaboration image

**Props:**
```typescript
interface PartnershipProps {
  headline: string
  points: string[]
  image?: string
}
```

**Layout:**
- 2-column: points left, image right
- Checkmark icons for each point

---

### TrustSection
**File:** `components/sections/TrustSection.tsx`

**Required elements:**
- All 7 trust statements (from messaging-framework.md)
- Checkmark icon per statement

**Props:**
```typescript
interface TrustStatement {
  id: string
  text: string
  description?: string
}

interface TrustSectionProps {
  statements: TrustStatement[]
}
```

**Layout:**
- Grid: 2 columns on tablet, 3 columns on desktop
- Icon + text per cell
- Green checkmarks

**Content source:** `/content/trust-statements.ts`

---

### LeadForm
**File:** `components/sections/LeadForm.tsx`

**Required elements:**
- Form headline (value-focused)
- Form fields:
  - Name (required)
  - Email (required)
  - Team/Organization (required)
  - Role (optional dropdown)
  - Message (optional textarea)
- Submit button: "Submit" (not "Let's Connect")
- Privacy note
- Success/error states

**Props:**
```typescript
interface LeadFormProps {
  headline?: string
  onSubmit: (data: FormData) => Promise<void>
}

interface FormData {
  name: string
  email: string
  organization: string
  role?: string
  message?: string
}
```

**Validation (Zod schema):**
```typescript
const leadFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  organization: z.string().min(2, "Organization is required"),
  role: z.string().optional(),
  message: z.string().optional(),
})
```

**Behavior:**
- Client-side validation with react-hook-form
- API call to `/api/contact`
- Success: Show confirmation message
- Error: Show error message, keep form filled

---

### FooterCTA
**File:** `components/sections/FooterCTA.tsx`

**Required elements:**
- Gradient background (aqua → coral)
- Concise headline
- "Let's Connect" button

**Props:**
```typescript
interface FooterCTAProps {
  headline: string
  ctaText?: string
  ctaHref?: string
}
```

**Styling:**
- Full-width gradient
- 160px padding vertical
- Centered content
- White text

---

## Form Components (components/forms/)

### ContactForm
**File:** `components/forms/ContactForm.tsx`

**Purpose:** Reusable form logic (used in LeadForm section)

**Features:**
- React Hook Form integration
- Zod validation
- Error handling
- Success states
- API integration

**Props:**
```typescript
interface ContactFormProps {
  onSuccess?: (data: FormData) => void
  submitButtonText?: string
}
```

---

## Animation Patterns

### Scroll Reveal (Framer Motion)
**Pattern:** Fade up on scroll into view

```typescript
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1.0] // brand cubic-bezier
    }
  }
}
```

**Usage:** Apply to section containers, not individual elements

### Hover Effects
**Button hover:** Scale 1.02, brightness 110%  
**Card hover:** Lift 4px, shadow increase  
**Link hover:** Aqua underline

---

## Responsive Breakpoints

**Tailwind defaults:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Usage priorities:**
- Mobile-first design
- 2-column grid on `md`
- 3-column grid on `lg`
- Max width containers at `xl` (1280px)

---

## Accessibility Requirements

**All interactive elements:**
- Keyboard focusable
- Focus visible (aqua outline)
- ARIA labels where needed

**Color contrast:**
- Body text: 4.5:1 minimum
- Large text: 3:1 minimum

**Forms:**
- Labels for all inputs
- Error messages linked via aria-describedby
- Required fields indicated visually and semantically

**Images:**
- Alt text emphasizes emotion ("fans celebrating together")
- Decorative images: empty alt

---

## File Organization Example

```
components/
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── badge.tsx
│   └── select.tsx
│
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── CTAButton.tsx
│
├── sections/
│   ├── Hero.tsx
│   ├── ProblemSection.tsx
│   ├── ContrastTable.tsx
│   ├── CategoryDefinition.tsx
│   ├── VideoDemo.tsx
│   ├── ExperienceTypes.tsx
│   ├── Partnership.tsx
│   ├── TrustSection.tsx
│   ├── LeadForm.tsx
│   └── FooterCTA.tsx
│
└── forms/
    └── ContactForm.tsx
```

---

## Content Files (Separation of Content from Components)

### /content/homepage.ts
Exports all homepage copy as structured data

### /content/experience-types.ts
Exports 5 experience types with icons, titles, descriptions

### /content/trust-statements.ts
Exports 7 trust statements

**Pattern:**
```typescript
// content/experience-types.ts
export const experienceTypes = [
  {
    id: 'geofenced',
    title: 'Geofenced Experiences',
    description: 'Turn any place into a team activation.',
    examples: 'Scavenger hunts at games/races. Watch parties worldwide.',
    icon: 'MapPin' // Lucide icon name
  },
  // ... more
]
```

---

## Design Token Usage

**Import pattern:**
```typescript
import tokens from '@/styles/tokens.json'
```

**Token structure:**
```json
{
  "colors": {
    "brand": {
      "navy": "#303E55",
      "aqua": "#33BECC",
      "coral": "#F5856E"
    }
  },
  "spacing": {
    "xs": "8px",
    "sm": "16px",
    "md": "24px",
    "lg": "32px"
  }
}
```

**Tailwind config:** Extend with token values

---
