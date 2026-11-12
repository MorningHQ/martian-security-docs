# Martian Security customer documentation

Implementation follows `PLAN_MARTIAN_SECURITY_DOCS.md` in the project vault and the current coverage matrix in quality/. Keep customer task guides accurate against the recorded product source revisions and observed real application behavior.

- Use the existing Hermes Astro/Starlight branding and native navigation/search/themes.
- Configure the Pages base only through site.config.mjs. Preserve strict local-link and sensitive-content checks.
- Every task guide needs its role/prerequisites, exact numbered UI steps, real relevant screenshots, expected results, failure/recovery limits and next links.
- Capture actual application states against a real backend. Do not fabricate screenshots, alter the DOM to invent features or intercept the behavior being verified.
- Never commit credentials, cookies, customer data, private deployment inventories or once-shown API tokens. Use synthetic fixtures and keep private evidence outside this repository.
- Update quality/coverage.json, quality/screenshots.json and quality/validation.json with honest provenance. Pending qualification is not complete.
- Run npm run build and npm run check. Run npm run check:release before declaring the end-to-end task complete.
- Actions remain SHA-pinned. PRs are ready for review. Product runtime changes belong in separate repositories.
