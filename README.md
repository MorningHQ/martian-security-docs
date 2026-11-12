# Martian Security documentation

Customer guides for red teaming, Evals, the Python SDK and CI, published at https://morninghq.github.io/martian-security-docs/.

Built with the actual Martian Hermes Astro/Starlight foundation and Martian brand assets. The authenticated product and its private implementation repositories remain independent of this static site.

## Develop and verify

Use Node 26, then `npm ci`, `npm run dev`, `npm run build` and `npm run check`. Run `npm run check:release` to audit end-to-end guide qualification. The source records in `quality/` distinguish source review, live execution and remaining gaps.

Edit MDX under `src/content/docs/`. Screenshot assets live in `public/media/screenshots/`, with capture provenance in `quality/screenshots.json`. Do not put credentials, customer data or private runtime inventories here.

GitHub Actions builds/checks PRs and deploys successful main builds through the github-pages environment. Settings → Pages must use GitHub Actions. The Pages origin and project base are defined once in `site.config.mjs`.

The site reuses the branding, typography, spacing, code wrapping, local font and build-time diagram renderer from [Martian Hermes docs](https://github.com/MorningHQ/martian-hermes-docs), baseline 3593a4bae03e96cf6c7597ececf99fbfc32997ae. Inter's OFL license is retained under public/brand/.
