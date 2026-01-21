# Testing Documentation

## Automated Testing with Playwright

The Vonga website uses Playwright for automated browser testing, visual regression testing, and quality assurance.

---

## Test Suites

### 1. Homepage Structure (`homepage.spec.ts`)
**What it tests:**
- Homepage loads correctly
- All 10 sections render properly
- CTAs work and scroll to correct sections

**Key checks:**
- Hero section visible
- Problem, Contrast, Category sections present
- Video demo placeholder shows
- All 5 experience types render
- Partnership and Trust sections visible
- Lead form is functional
- Footer CTA displays

---

### 2. Copy Quality (`copy-quality.spec.ts`)
**What it tests:**
- ✅ **No em dashes (—) in any visible text**
- Approved CTAs only ("Let's Connect", "Submit")
- Brand voice compliance
- No banned buzzwords

**Key checks:**
- Scans entire page for em dashes
- Reports exact location if found
- Verifies "Let's Connect" is used
- Checks for banned words: "revolutionary", "cutting-edge", "ecosystem"
- Confirms approved language: "connection", "revenue per fan", "continuity"

---

### 3. Visual Regression (`visual-regression.spec.ts`)
**What it tests:**
- Full homepage screenshot
- Individual section screenshots
- Visual consistency over time

**Baseline screenshots:**
- `homepage-full.png` - Full page
- `hero-section.png` - Hero only
- `form-section.png` - Lead form

*First run creates baselines. Subsequent runs compare against baselines.*

---

### 4. Responsive Design (`responsive.spec.ts`)
**What it tests:**
- Mobile (375x667)
- Tablet (768x1024)
- Desktop (1280x720)
- Wide (1920x1080)

**Key checks:**
- Page renders at all breakpoints
- CTAs are accessible
- Mobile navigation works
- Screenshots for each viewport

---

### 5. Form Functionality (`form-functionality.spec.ts`)
**What it tests:**
- Required field validation
- Email format validation
- Successful form submission
- Success message displays

**Key checks:**
- Empty form shows errors
- Invalid email rejected
- Valid submission shows success
- Form data handled correctly

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
# Copy quality only (em dash check)
npm run test:copy

# Visual regression only
npm run test:visual

# Run with UI (interactive mode)
npm run test:ui

# Run with browser visible (headed mode)
npm run test:headed
```

### View Test Report
```bash
npm run test:report
```

---

## Test Results

After running tests, you'll see:
```
Running 15 tests using 1 worker

  ✓ Homepage Structure › should load the homepage (2s)
  ✓ Copy Quality Checks › should not contain em dashes (1s)
  ✓ Visual Regression Tests › should match homepage screenshot (3s)
  ...

15 passed (25s)
```

**If a test fails:**
1. Check the error message
2. View screenshots in `test-results/`
3. Run `npm run test:report` for detailed HTML report

---

## Continuous Integration

Tests automatically run on:
- Pull requests
- Pre-deployment
- After content updates

**CI Configuration:**
- Retries failed tests 2x
- Runs in headless mode
- Generates HTML report
- Fails build if tests fail

---

## Copy Quality Enforcement

The **em dash test** is your safety net:

```typescript
// This test scans the entire page
test('should not contain em dashes', async ({ page }) => {
  const bodyText = await page.locator('body').textContent();
  const hasEmDash = bodyText?.includes('—');
  expect(hasEmDash).toBe(false);
});
```

**If em dashes are found:**
- Test fails immediately
- Console shows which elements contain them
- You can fix before deploying

---

## Visual Regression Workflow

### First Time Setup
```bash
npm test visual-regression
```
This creates baseline screenshots.

### After Changes
```bash
npm test visual-regression
```
Compares new screenshots to baselines.

**If visual changes detected:**
1. Review diff in test report
2. If intentional: Update baselines
3. If bug: Fix and rerun

### Update Baselines
```bash
npm test visual-regression -- --update-snapshots
```

---

## Best Practices

### Before Committing
```bash
npm run test:copy  # Quick copy check
```

### Before Deploying
```bash
npm test  # Full test suite
```

### After Content Updates
```bash
npm run test:copy      # Check for em dashes
npm run test:visual    # Check visual changes
```

### Debugging Failed Tests
```bash
npm run test:ui        # Interactive mode
npm run test:headed    # Watch browser
```

---

## Test Configuration

Located in `playwright.config.ts`:

```typescript
{
  testDir: './tests',
  baseURL: 'http://localhost:3000',
  reporter: 'html',
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  }
}
```

**Key settings:**
- Auto-starts dev server
- Takes screenshots on failure
- Retries flaky tests
- Generates HTML report

---

## Adding New Tests

### 1. Create Test File
```bash
touch tests/my-new-test.spec.ts
```

### 2. Write Test
```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    // Your test here
  });
});
```

### 3. Run Test
```bash
npm test my-new-test
```

---

## Common Test Patterns

### Check for Text
```typescript
await expect(page.getByText('Your text')).toBeVisible();
```

### Click Button
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
```

### Fill Form
```typescript
await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
```

### Take Screenshot
```typescript
await expect(page).toHaveScreenshot('my-screenshot.png');
```

### Scan for Content
```typescript
const text = await page.locator('body').textContent();
expect(text).toContain('expected content');
```

---

## Troubleshooting

### Tests Timeout
- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Look for slow animations

### Screenshots Don't Match
- Disable animations: `animations: 'disabled'`
- Wait for network: `waitForLoadState('networkidle')`
- Update baselines if intentional

### Form Tests Fail
- Check API route is working
- Verify validation schema matches
- Check for console errors

---

## Quick Reference

```bash
# Run all tests
npm test

# Copy quality check (em dashes)
npm run test:copy

# Visual regression
npm run test:visual

# Interactive UI
npm run test:ui

# View report
npm run test:report

# Update screenshots
npm test -- --update-snapshots
```

---

**Status:** ✅ Fully configured and ready to use  
**Coverage:** Homepage, copy quality, visuals, responsive, forms  
**Automation:** Runs on every test command
