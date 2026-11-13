import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { attribute, find, renderAgentMarkdown, visit } from './lib/agent-markdown.mjs';
import { docsBase, mirrorAsset, pageLinks, rewriteForAgents } from '../src/lib/agent-links.mjs';
import { siteOrigin } from '../site.config.mjs';

const root = process.cwd();
const dist = path.join(root, 'dist');
const publicDir = path.join(root, 'public');
const update = process.argv.includes('--update');
const hash = (value) => createHash('sha256').update(value).digest('hex');
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? files(name) : [name];
  });
}
const sources = files(path.join(root, 'src/content/docs')).filter((name) => /\.mdx?$/.test(name) && !/\/404\.md$/.test(name));
const pages = sources.map((name) => {
  const slug = path.relative(path.join(root, 'src/content/docs'), name).replace(/\.mdx?$/, '').split(path.sep).join('/');
  const pathname = `${docsBase}${slug === 'index' ? '' : `${slug}/`}`;
  return { ...pageLinks(pathname), pathname, htmlFile: path.join(dist, slug === 'index' ? 'index.html' : `${slug}/index.html`) };
}).sort((a, b) => (a.slug === 'index' ? -1 : b.slug === 'index' ? 1 : a.slug.localeCompare(b.slug, 'en')));
const pagePaths = new Set(pages.map((page) => page.pathname));
const assets = new Set(files(publicDir).map((file) => path.relative(publicDir, file).split(path.sep).join('/')));
const outputs = new Map();
for (const page of pages) {
  page.html = readFileSync(page.htmlFile, 'utf8');
  Object.assign(page, renderAgentMarkdown(page.html, {
    canonical: page.canonical,
    rewriteUrl: (href) => rewriteForAgents(href, page.canonical, pagePaths, assets),
    diagramSource: (id) => readFileSync(path.join(root, 'src/diagrams', `${id}.mmd`), 'utf8'),
  }));
  page.digest = hash(page.markdown);
  outputs.set(page.asset, page.markdown);
}
const full = `# Martian Security — complete customer documentation\n\nGenerated from the rendered public guides. Per-page qualification notices, prerequisites and examples are retained.\n\n${pages.map((page) => page.markdown.trimEnd()).join('\n\n---\n\n')}\n`;
outputs.set('llms-full.txt', full);
const index = [
  '# Martian Security',
  '> Customer documentation for red teaming, Evals, the SDK and CI.',
  'These public Markdown documents require no login or JavaScript. Each guide retains its version, role prerequisites and qualification limits. A partly verified walkthrough is not a passed walkthrough.',
  '## Start here',
  ...['get-started/first-assessment', 'evals/first-run', 'sdk/install-and-configure', 'reference/verification'].map((slug) => {
    const page = pages.find((entry) => entry.slug === slug);
    return `- [${page.title}](${page.mirror}?v=${page.digest.slice(0, 12)}): ${page.description}`;
  }),
  '## Documentation',
  ...pages.map((page) => `- [${page.title}](${page.mirror}?v=${page.digest.slice(0, 12)}): ${page.description}`),
  '## Complete reference',
  `- [All documentation](${mirrorAsset('llms-full.txt')}?v=${hash(full).slice(0, 12)}): all ${pages.length} pages in one text file.`,
  `- [Website](${new URL(docsBase, siteOrigin).href}): the human-readable site. The Markdown mirror is an independent HTTPS access path.`,
].join('\n\n') + '\n';
outputs.set('llms.txt', index);
outputs.set('robots.txt', `User-agent: *\nAllow: ${docsBase}\n\nSitemap: ${new URL(`${docsBase}sitemap-index.xml`, siteOrigin).href}\n`);
const indexUrl = `${mirrorAsset('llms.txt')}?v=${hash(index).slice(0, 12)}`;
for (const page of pages) {
  const version = page.digest.slice(0, 12);
  const markdownUrl = `${page.mirror}?v=${version}`;
  const localUrl = `${page.local}?v=${version}`;
  const edits = [];
  const actions = find(page.document, (node) => node.tagName === 'docs-page-actions');
  if (!actions) throw new Error(`Missing Copy page controls: ${page.pathname}`);
  for (const [name, value] of [['data-markdown-url', localUrl], ['data-agent-url', markdownUrl]]) {
    const location = actions.sourceCodeLocation.attrs[name];
    edits.push({ start: location.startOffset, end: location.endOffset, value: `${name}="${value}"` });
  }
  visit(actions, (node) => {
    if (attribute(node, 'data-agent-markdown') !== undefined || attribute(node, 'data-agent-index') !== undefined) {
      const location = node.sourceCodeLocation.attrs.href;
      edits.push({ start: location.startOffset, end: location.endOffset, value: `href="${attribute(node, 'data-agent-index') !== undefined ? indexUrl : markdownUrl}"` });
    }
  });
  const discovery = `<link rel="alternate" type="text/markdown" title="Markdown for agents" href="${markdownUrl}"><link rel="alternate" type="text/markdown" title="Markdown on this site" href="${localUrl}"><link rel="help" type="text/plain" title="Agent documentation index" href="${indexUrl}">`;
  edits.push({ start: page.headOffset, end: page.headOffset, value: discovery });
  let html = page.html;
  for (const edit of edits.sort((a, b) => b.start - a.start)) html = html.slice(0, edit.start) + edit.value + html.slice(edit.end);
  writeFileSync(page.htmlFile, html);
}
const stale = [];
for (const [relative, content] of outputs) {
  const target = path.join(dist, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
  const source = path.join(publicDir, relative);
  if (!existsSync(source) || readFileSync(source, 'utf8') !== content) {
    stale.push(relative);
    if (update) { mkdirSync(path.dirname(source), { recursive: true }); writeFileSync(source, content); }
  }
}
for (const directory of [path.join(publicDir, 'markdown'), path.join(dist, 'markdown')]) {
  if (!existsSync(directory)) continue;
  for (const file of files(directory)) {
    const relative = `markdown/${path.relative(directory, file).split(path.sep).join('/')}`;
    if (outputs.has(relative)) continue;
    if (directory.startsWith(publicDir)) stale.push(relative);
    if (update || directory.startsWith(dist)) rmSync(file);
  }
}
console.log(JSON.stringify({ agentPages: pages.length, exactCodeBlocks: pages.reduce((sum, page) => sum + page.codeBlocks.length, 0), fullTextBytes: Buffer.byteLength(full), generatedAssets: outputs.size, updated: update, staleAssets: stale }, null, 2));
if (stale.length && !update) throw new Error('Agent exports are stale. Run npm run docs:sync and commit the generated public Markdown/text assets.');
