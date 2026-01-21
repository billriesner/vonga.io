import { test, expect } from '@playwright/test';

test.describe('Copy Quality Checks', () => {
  test('should not contain em dashes in visible text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all text content from the page
    const bodyText = await page.locator('body').textContent();
    
    // Check for em dashes (—)
    const hasEmDash = bodyText?.includes('—');
    
    if (hasEmDash) {
      // Find specific elements with em dashes for better error reporting
      const elementsWithEmDash = await page.locator('*').evaluateAll(elements => {
        return elements
          .filter(el => el.textContent?.includes('—'))
          .map(el => ({
            tag: el.tagName,
            text: el.textContent?.slice(0, 100),
            selector: el.className || el.id || el.tagName
          }))
          .slice(0, 5); // Limit to first 5 instances
      });
      
      console.log('Found em dashes in:', elementsWithEmDash);
    }
    
    expect(hasEmDash).toBe(false);
  });

  test('should use approved CTAs only', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for "Let's Connect" (approved)
    const letsConnectButtons = await page.getByText("Let's Connect").count();
    expect(letsConnectButtons).toBeGreaterThan(0);
    
    // Check form submit button says "Submit"
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeVisible();
    
    // Verify no "Book a Demo" or "Request Pricing" (not approved)
    await expect(page.getByText(/book a demo/i)).not.toBeVisible();
    await expect(page.getByText(/request pricing/i)).not.toBeVisible();
  });

  test('should use brand voice correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const bodyText = (await page.locator('body').textContent()) || '';
    
    // Check for approved language (should exist)
    const hasApprovedTerms = 
      bodyText.includes('connection') ||
      bodyText.includes('revenue per fan') ||
      bodyText.includes('continuity');
    expect(hasApprovedTerms).toBe(true);
    
    // Check for banned buzzwords (should not exist)
    expect(bodyText.toLowerCase()).not.toContain('revolutionary');
    expect(bodyText.toLowerCase()).not.toContain('cutting-edge');
    expect(bodyText.toLowerCase()).not.toContain('ecosystem');
  });
});
