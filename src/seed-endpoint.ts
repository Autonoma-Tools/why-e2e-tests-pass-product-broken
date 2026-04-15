import type { Express, Request, Response } from 'express';

// Example seed endpoint. Disabled in production.
// Your test suite calls POST /api/test/seed/:scenario before each test.
// The scenario name selects a setup function that uses your real ORM models
// (injected here as `ctx`) so the data respects every constraint and
// relationship in your schema.

type Context = {
  createOrg: (input: {
    name: string;
    plan: 'trial' | 'free' | 'pro' | 'enterprise';
    trialEndsAt?: Date;
  }) => Promise<{ id: string; name: string }>;
  createUser: (input: {
    email: string;
    orgs: Array<{ org: { id: string }; role: 'admin' | 'member' }>;
  }) => Promise<{ id: string; email: string }>;
  createProjects: (org: { id: string }, count: number) => Promise<void>;
  createTeamMembers: (org: { id: string }, count: number) => Promise<void>;
  createActivityHistory: (
    user: { id: string },
    opts: { days: number }
  ) => Promise<void>;
  resetDatabase: () => Promise<void>;
};

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

export function registerSeedRoutes(app: Express, ctx: Context): void {
  app.post('/api/test/seed/:scenario', async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      return res
        .status(403)
        .json({ error: 'Seed endpoints are disabled in production' });
    }

    const scenarios: Record<string, () => Promise<unknown>> = {
      'trial-expired-multi-org': async () => {
        const org1 = await ctx.createOrg({
          name: 'Acme Corp',
          plan: 'trial',
          trialEndsAt: daysAgo(2),
        });
        const org2 = await ctx.createOrg({ name: 'Beta Inc', plan: 'pro' });
        const user = await ctx.createUser({
          email: 'sarah@acme.co',
          orgs: [
            { org: org1, role: 'admin' },
            { org: org2, role: 'member' },
          ],
        });
        await ctx.createProjects(org1, 47);
        await ctx.createTeamMembers(org1, 12);
        await ctx.createActivityHistory(user, { days: 30 });
        return { user, orgs: [org1, org2] };
      },
      'new-user-mid-onboarding': async () => {
        const org = await ctx.createOrg({ name: 'Solo Co', plan: 'free' });
        const user = await ctx.createUser({
          email: 'new@solo.co',
          orgs: [{ org, role: 'admin' }],
        });
        return { user, orgs: [org] };
      },
    };

    const seed = scenarios[req.params.scenario];
    if (!seed) {
      return res
        .status(404)
        .json({ error: `Unknown scenario: ${req.params.scenario}` });
    }

    await ctx.resetDatabase();
    const result = await seed();
    return res.json(result);
  });
}
