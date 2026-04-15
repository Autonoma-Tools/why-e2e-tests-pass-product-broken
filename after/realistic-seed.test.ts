import { test, expect } from '@playwright/test';

// The 'realistic seed' counterexample from the blog.
// The `trial-expired-multi-org` scenario creates:
//   - 2 orgs (one on expired trial, one paid)
//   - a user belonging to both with different roles
//   - 47 projects in the trial org
//   - 12 team members
//   - 30 days of activity history
// The assertions below exercise UI states that the empty-DB test can never reach.

test('trial-expired user sees upgrade prompt on dashboard', async ({ page, request }) => {
  await request.post('/api/test/seed/trial-expired-multi-org');

  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'sarah@acme.co');
  await page.fill('[data-testid="password"]', 'seeded-password');
  await page.click('[data-testid="submit"]');

  await expect(page).toHaveURL(/\/dashboard/);

  // Expired-trial org should surface the upgrade prompt.
  await expect(page.locator('[data-testid="upgrade-prompt"]')).toBeVisible();

  // Realistic volume: the seeded trial org has exactly 47 projects.
  await expect(page.locator('.project-list .project-card')).toHaveCount(47);
});
