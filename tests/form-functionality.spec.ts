import { test, expect } from '@playwright/test';

test.describe('Lead Form Functionality', () => {
  test('should validate required fields', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to form
    await page.getByRole('textbox', { name: /name/i }).scrollIntoViewIfNeeded();
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show validation errors
    await expect(page.getByText(/name.*required/i)).toBeVisible();
    await expect(page.getByText(/email.*required/i)).toBeVisible();
  });

  test('should accept valid form submission', async ({ page }) => {
    await page.goto('/');
    
    // Fill out form
    await page.getByRole('textbox', { name: /name/i }).fill('John Doe');
    await page.getByRole('textbox', { name: /email/i }).fill('john@example.com');
    await page.getByRole('textbox', { name: /organization/i }).fill('Test Team FC');
    await page.getByRole('textbox', { name: /role/i }).fill('President');
    
    // Submit form
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for success message
    await expect(page.getByText(/success/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/be in touch/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to form
    await page.getByRole('textbox', { name: /name/i }).scrollIntoViewIfNeeded();
    
    // Fill with invalid email
    await page.getByRole('textbox', { name: /name/i }).fill('John Doe');
    await page.getByRole('textbox', { name: /email/i }).fill('invalid-email');
    await page.getByRole('textbox', { name: /organization/i }).fill('Test Team');
    
    // Try to submit
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show email validation error
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });
});
