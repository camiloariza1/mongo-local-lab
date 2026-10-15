# MongoDB local lab plan

1. Define a local-only Atlas Local Compose service on `127.0.0.1:27018`, with persistent named data/config volumes and first-start seed scripts.
2. Seed deterministic, synthetic `users` and `orders` with BSON IDs, dates, realistic types, and a unique email index.
3. Expose start, shell, smoke-test, stop, and project-volume reset through a small Makefile; tests use a separate guarded database and shared seed logic.
4. Document prerequisites, exact commands, connection URIs, fixture schema, local security limits, reset behavior, Atlas Local limits, and the 2026-10-15 research date.
5. Validate configuration and JavaScript syntax, start Docker, and run the integration tests. Check host connectivity, the wrong-database guard, persistence after recreation, and a complete reset/reseed. Record actual results in README and leave the service running.
