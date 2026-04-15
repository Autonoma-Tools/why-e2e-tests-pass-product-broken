import { test, expect } from '@playwright/test';

// The 'coverage illusion' example from the blog.
// A single admin user, empty database. Every assertion passes but the test
// proves nothing about how the dashboard behaves with realistic data volumes,
// multi-tenant boundaries, or users in non-happy-path states.

test('user can view dashboard (empty data)', async ({ page, request }) => {
  // Create the one user the test relies on via a test-only seed endpoint.
  await request.post('/api/test/seed/empty', {
    data: {
      user: { email: 'test@example.com', name: 'Test User', password: 'password123' },
    },
  });

  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="submit"]');

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('.dashboard')).toBeVisible();
});
