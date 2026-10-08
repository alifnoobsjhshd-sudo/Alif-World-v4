---
name: External deployment lockfiles
description: Keep Replit-only package firewall URLs out of dependency locks used by external builders.
---

Replit package installation can rewrite a Bun lockfile to include `package-firewall.replit.internal` tarball URLs. External builders such as Render cannot resolve those Replit-only URLs.

**Why:** Render failed to resolve packages after the lockfile was generated through Replit's package tooling.

**How to apply:** Before deploying outside Replit, inspect lockfile tarball origins. Keep the external build on its own public package registry, or remove a Replit-only lockfile when the deployment explicitly uses npm.
