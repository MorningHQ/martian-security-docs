# Martian Security documentation

Customer guides for red teaming, Evals, the Python SDK and CI, published at https://docs.martiansecurity.ai/.

Built with the actual Martian Hermes Astro/Starlight foundation and Martian brand assets. The authenticated product and its private implementation repositories remain independent of this static site.

## Develop and verify

Use Node 26, then `npm ci`, `npm run dev`, `npm run build` and `npm run check`. Run `npm run check:release` to audit end-to-end guide qualification. The source records in `quality/` distinguish source review, live execution and remaining gaps.

Edit MDX under `src/content/docs/`. Screenshot assets live in `public/media/screenshots/`, with capture provenance in `quality/screenshots.json`. Do not put credentials, customer data or private runtime inventories here.

After changing a guide, rendered component, qualification record or site URL, run `npm run docs:sync` and include the generated `public/markdown/`, `public/llms.txt`, `public/llms-full.txt` and `public/robots.txt` changes. Then run the normal build and checks. CI fails if these committed exports differ from the rendered articles, so the secure GitHub mirror and Pages output stay aligned.

Each page offers **Copy page**, **Copy agent link**, **View Markdown** and an **Agent index**. The exports come from rendered HTML, retain qualification notices and exact code-copy payloads, resolve links to public HTTPS assets, and expose Mermaid source. HTML advertises Markdown alternatives; raw files require no JavaScript or login. The copy controls use the Clipboard API with a synchronous fallback for HTTP contexts. The mirror is a separate access path while custom-domain certificate issuance is incomplete; it does not repair that certificate.

GitHub Actions builds/checks PRs and deploys successful main builds through the github-pages environment. Settings → Pages must use GitHub Actions, with `docs.martiansecurity.ai` as the custom domain and Enforce HTTPS enabled. Its Squarespace DNS `docs` CNAME points to `morninghq.github.io`. The Pages origin and root base are defined once in `site.config.mjs`.

The site reuses the branding, typography, spacing, code wrapping, local font and build-time diagram renderer from [Martian Hermes docs](https://github.com/MorningHQ/martian-hermes-docs), baseline 3593a4bae03e96cf6c7597ececf99fbfc32997ae. Inter's OFL license is retained under public/brand/.
