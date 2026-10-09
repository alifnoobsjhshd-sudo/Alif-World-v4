---
name: Vite watcher and Replit artifacts
description: Vite filesystem watching can fail on generated content in Replit's local skills directory.
---

If the Vite workflow starts and then exits with `EINVAL: invalid argument, watch` for a temporary path under `.local/skills`, treat it as a filesystem watcher issue rather than a port mismatch. Exclude generated skill artifact directories from Vite's watch list.

**Why:** Replit's skill tooling can create temporary directory trees that broad recursive filesystem watchers cannot monitor.

**How to apply:** Check workflow logs for a watch-related `EINVAL` failure, then ignore `**/.local/skills/**` while leaving application source directories watched.
