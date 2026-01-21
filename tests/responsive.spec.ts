import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'wide', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`should render correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check hero is visible
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      
      // Check CTA is accessible
      await expect(page.getByRole('link', { name: "Let's Connect" }).first()).toBeVisible();
      
      // Take screenshot
      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }

  test('should have working mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Header should be visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Logo should be visible
    await expect(page.getByText('VONGA').first()).toBeVisible();
  });
});
