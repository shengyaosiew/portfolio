# Latest Portfolio Deployment Implementation Plan

> **For agentic workers:** Execute this focused deployment fix inline in the current session.

**Goal:** Publish the latest shengyao-v4 app at the existing GitHub Pages URL.

**Architecture:** GitHub Actions installs locked dependencies, builds the Vite app, and uploads only its dist directory. Preserve the existing public pages and asset URLs alongside the new app.

**Tech Stack:** GitHub Actions, Node.js 24, npm, TypeScript, Vite, GitHub Pages.

### Task 1: Fix and verify deployment

**Files:** Modify `.github/workflows/static.yml`.

- [x] Confirm the latest app builds with `npm.cmd run build` in `scrollcraft/builds/shengyao-v4`.
- [x] Add `actions/setup-node@v4` with Node.js 24 and npm caching using the app lockfile.
- [x] Replace the root-site assembly with `npm ci` and `npm run build` in the app directory.
- [x] Copy existing public pages and legacy assets into the build output, without replacing the generated index.
- [x] Set the Pages artifact path to `scrollcraft/builds/shengyao-v4/dist`.
- [x] Check `git diff --check` and the built HTML, JavaScript, and public assets. Production HTML uses relative asset paths, and the built resume PDF exists.
- [ ] Commit and push the fix to main, then inspect the deployment result.
