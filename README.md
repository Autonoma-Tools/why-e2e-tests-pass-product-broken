# Why Your E2E Tests Pass but Your Product Is Broken

Companion code for the Autonoma blog post [**Why Your E2E Tests Pass but Your Product Is Broken**](https://getautonoma.com/blog/why-e2e-tests-pass-product-broken).

The blog argues that most E2E test suites run against empty databases with a single hardcoded user, producing green-CI false confidence. This repo pairs the blog's two test examples (before: unrealistic; after: seeded with a trial-expired-multi-org scenario) with the seed endpoint that makes the "after" test actually work.

Clone and run `npx playwright test --list` to inspect the tests. They require a running app that exposes the seed endpoint -- they are primarily illustrative, not self-contained end-to-end.

> Companion code for the Autonoma blog post: **[Why Your E2E Tests Pass but Your Product Is Broken](https://getautonoma.com/blog/why-e2e-tests-pass-product-broken)**

## Requirements

- Node.js 20+
- A running application server (the tests hit `http://localhost:3000`)

## Quickstart

```bash
git clone https://github.com/Autonoma-Tools/why-e2e-tests-pass-product-broken.git
cd why-e2e-tests-pass-product-broken
npm install
npx playwright test --list    # see available tests
```

To actually execute the tests, you need a running application server that exposes `/api/test/seed/:scenario`:

```bash
# In one terminal -- start your app
npm run dev

# In another terminal -- run the tests
npx playwright test
```

## File map

| File | Purpose |
|---|---|
| `before/empty-data.test.ts` | The "coverage illusion" -- a Playwright test against an empty DB with one fake user |
| `after/realistic-seed.test.ts` | The "realistic seed" counterexample -- same flow but against a trial-expired, multi-org scenario |
| `src/seed-endpoint.ts` | Express route handler that populates the DB with named scenarios before each test |
| `playwright.config.ts` | Minimal Playwright config pointing at `localhost:3000` |
| `examples/run-tests.sh` | Shell script that installs deps, lists tests, and prints run instructions |

## Project structure

```
.
├── before/
│   └── empty-data.test.ts
├── after/
│   └── realistic-seed.test.ts
├── src/
│   └── seed-endpoint.ts
├── examples/
│   └── run-tests.sh
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── LICENSE
└── README.md
```

- `before/` -- the "bad" test: empty database, single hardcoded user.
- `after/` -- the "good" test: realistic seed data with multi-org, expired trial, and real volumes.
- `src/` -- the seed endpoint that makes the "after" test work.
- `examples/` -- runnable helper scripts.

## About

This repository is maintained by [Autonoma](https://getautonoma.com) as reference material for the linked blog post. Autonoma builds autonomous AI agents that plan, execute, and maintain end-to-end tests directly from your codebase.

If something here is wrong, out of date, or unclear, please [open an issue](https://github.com/Autonoma-Tools/why-e2e-tests-pass-product-broken/issues/new).

## License

Released under the [MIT License](./LICENSE) &copy; 2026 Autonoma Labs.
