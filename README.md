# Vonga Website

Official website for Vonga - The official kit provider for sports teams.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000

## Repository Structure

### **New Website (Root Directory)** ✨
The new conversion-focused website is complete and ready to deploy.

**Key directories:**
- `app/` - Next.js 15 App Router pages
- `components/` - Reusable React components
- `content/` - Copy and messaging (single source of truth)
- `docs/website-kit/` - Strategic documentation and specs
- `styles/` - Design tokens and global styles

**Technology:**
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 4 with brand design system
- Framer Motion for animations
- React Hook Form + Zod validation

**Documentation:**
- See `docs/website-kit/BUILD_SUMMARY.md` for complete build overview
- See `docs/website-kit/homepage-blueprint.md` for page structure
- See `docs/website-kit/messaging-framework.md` for copy guidelines

### `archive/v1-current-site/`
Previous production website (Next.js). Currently deployed until new site is ready.

**To run archived site:**
```bash
cd archive/v1-current-site
npm install
npm run dev
```

### `automation/`
Python agents and automation tools (separate from website project).

**Includes:**
- AI agents (Chief of Staff, CMO, Strategist, etc.)
- Marketing and CRM tools
- Knowledge base and learning systems

## Website Overview

### Purpose
Conversion-focused website to generate qualified leads from sports team operators.

### Target Audience
- Presidents / General Managers
- CRO / Revenue Leaders
- Partnerships / Sponsorship Leaders
- Merch / E-commerce Leaders
- Athletic Directors

### Core Message
"Turn team apparel into your most valuable channel."

Vonga sells connection, not just clothes. Living engagement infrastructure delivered through premium kits.

### Homepage Structure (10 Sections)
1. **Hero** - Hook + positioning + CTA
2. **Problem** - Continuity problem (merch ends at checkout)
3. **Contrast** - Clothes vs Connection comparison
4. **Category** - What Vonga is (plain English)
5. **Video** - Demo placeholder
6. **Experiences** - 5 platform capabilities
7. **Partnership** - White-glove service
8. **Trust** - Risk removal statements
9. **Form** - Lead capture
10. **Footer CTA** - Final conversion

## Content Management

All copy lives in `/content/` directory:

```bash
content/
├── homepage.ts           # Homepage copy
├── experience-types.ts   # 5 experience cards
└── trust-statements.ts   # Trust statements
```

**To update copy:** Edit these files directly. No need to touch component code.

## Brand System

**Colors:**
- Navy: #303E55 (primary text, headlines)
- Aqua: #33BECC (primary CTAs, accents)
- Coral: #F5856E (secondary CTAs, emphasis)

**Primary CTA:** "Let's Connect" (everywhere except form submit)  
**Form Submit:** "Submit"

**Voice:** Direct, category-defining, operator language. No buzzwords.

## Development

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## Email Integration

Form submissions are handled in `app/api/contact/route.ts`.

**To enable email:**
1. Uncomment Resend integration in the API route
2. Add `RESEND_API_KEY` to `.env.local`
3. Or integrate with your preferred email service

## Deployment

### Current Deployment
Vercel deploys from `archive/v1-current-site/` (see `vercel.json`)

### Deploy New Site
1. Test thoroughly locally
2. Update `vercel.json` to remove archive configuration
3. Deploy from root directory
4. Archive becomes historical reference

## Documentation

**Website Kit (Strategic Docs):**
- `docs/website-kit/BUILD_SUMMARY.md` - Complete build overview
- `docs/website-kit/conversion-strategy.md` - Conversion goals and strategy
- `docs/website-kit/homepage-blueprint.md` - 10-section blueprint
- `docs/website-kit/messaging-framework.md` - Voice, messaging, copy rules
- `docs/website-kit/component-specs.md` - Technical component specs

**Brand Docs:**
- `docs/brand-system.md` - Brand essence and positioning
- `docs/web-style-guide.md` - Web design guidelines
- `docs/phrasing-rules.md` - Language and copy rules
- `docs/visual-style-guide.md` - Visual design standards

## Success Metrics

**Primary:** Form submissions (qualified leads)  
**Target:** 5-8% conversion rate  
**Secondary:** Time on page, scroll depth, video engagement

---

**Status:** New website complete and ready to deploy  
**Last Updated:** January 2026
