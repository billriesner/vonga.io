import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for hero animation to settle
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match hero section screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for animations
    await page.waitForTimeout(2000);
    
    // Screenshot hero section
    const hero = page.locator('section').first();
    await expect(hero).toHaveScreenshot('hero-section.png', {
      animations: 'disabled',
    });
  });

  test('should match form section screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to form
    await page.getByRole('textbox', { name: /name/i }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Screenshot form section
    const formSection = page.locator('section').filter({ has: page.getByRole('textbox', { name: /name/i }) });
    await expect(formSection).toHaveScreenshot('form-section.png');
  });
});
