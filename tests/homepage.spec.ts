import { test, expect } from '@playwright/test';

test.describe('Homepage Structure', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Vonga/);
  });

  test('should render all 10 homepage sections', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for key elements from each section
    
    // 1. Hero
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // 2. Problem Section
    await expect(page.getByText('Continuity Problem')).toBeVisible();
    
    // 3. Contrast Table
    await expect(page.getByText('Clothes vs Connection')).toBeVisible();
    
    // 4. Category Definition
    await expect(page.getByText('Living Engagement Infrastructure')).toBeVisible();
    
    // 5. Video Demo
    await expect(page.getByText('See It In Action')).toBeVisible();
    
    // 6. Experience Types
    await expect(page.getByText('Geofenced Experiences')).toBeVisible();
    await expect(page.getByText('Time-Bound Experiences')).toBeVisible();
    
    // 7. Partnership
    await expect(page.getByText('White-Glove Partnership')).toBeVisible();
    
    // 8. Trust Section
    await expect(page.getByText('No personal data collected')).toBeVisible();
    await expect(page.getByText('No app required')).toBeVisible();
    
    // 9. Lead Form
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    
    // 10. Footer CTA
    await expect(page.getByText(/most valuable channel/i)).toBeVisible();
  });

  test('should have working CTAs', async ({ page }) => {
    await page.goto('/');
    
    // Check primary CTA exists
    const primaryCTA = page.getByRole('link', { name: "Let's Connect" }).first();
    await expect(primaryCTA).toBeVisible();
    
    // Click should scroll to contact form
    await primaryCTA.click();
    await page.waitForTimeout(1000); // Wait for smooth scroll
    
    // Verify form is in viewport
    const form = page.getByRole('textbox', { name: /name/i });
    await expect(form).toBeInViewport();
  });
});
