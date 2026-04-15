#!/usr/bin/env bash
# run-tests.sh — install dependencies, list available Playwright tests,
# and print instructions for running them against a local server.

set -euo pipefail

echo "==> Installing dependencies..."
npm install

echo ""
echo "==> Installing Playwright browsers..."
npx playwright install chromium

echo ""
echo "==> Available tests:"
npx playwright test --list

echo ""
echo "-------------------------------------------------------"
echo "To actually run the tests you need a local server on"
echo "http://localhost:3000 that exposes:"
echo ""
echo "  POST /api/test/seed/:scenario"
echo ""
echo "See src/seed-endpoint.ts for the reference implementation."
echo ""
echo "Once your server is running:"
echo "  npx playwright test"
echo "-------------------------------------------------------"
