import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';
import { attribute, find, hasClass, text, visit } from './lib/agent-markdown.mjs';
import { docsBase, mirrorAsset, pageLinks } from '../src/lib/agent-links.mjs';

const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
const sources = walk('src/content/docs').filter((file) => /\.mdx?$/.test(file) && !/\/404\.md$/.test(file));
const read = (file) => readFileSync(file, 'utf8');
const digest = (value) => createHash('sha256').update(value).digest('hex').slice(0, 12);
const plainMarkdown = (value) => value.replace(/\\([\\`*_{}\[\]()#+\-.!|>])/g, '$1');
const index = read('public/llms.txt');
const full = read('public/llms-full.txt');
let exactCodeBlocks = 0;
let screenshotCaptions = 0;
for (const source of sources) {
  const slug = source.replace(/^src\/content\/docs\//, '').replace(/\.mdx?$/, '');
  const links = pageLinks(`${docsBase}${slug === 'index' ? '' : `${slug}/`}`);
  const markdown = read(`public/${links.asset}`);
  assert.equal(read(`dist/${links.asset}`), markdown, `${slug}: deployment and secure mirror differ`);
  assert.ok(full.includes(markdown.trimEnd()), `${slug}: missing from full reference`);
  assert.ok(index.includes(`${links.mirror}?v=${digest(markdown)}`), `${slug}: missing versioned index link`);
  assert.ok(!/^import .+ from |<(?:GuideMeta|Screenshot|Diagram)\b/m.test(markdown), `${slug}: unrendered MDX`);
  const document = parse(read(`dist/${slug === 'index' ? '' : `${slug}/`}index.html`));
  const actions = find(document, (node) => node.tagName === 'docs-page-actions');
  assert.equal(attribute(actions, 'data-markdown-url'), `${links.local}?v=${digest(markdown)}`);
  assert.equal(attribute(actions, 'data-agent-url'), `${links.mirror}?v=${digest(markdown)}`);
  const alternate = find(document, (node) => node.tagName === 'link' && attribute(node, 'type') === 'text/markdown');
  assert.equal(attribute(alternate, 'href'), `${links.mirror}?v=${digest(markdown)}`);
  const article = find(document, (node) => hasClass(node, 'sl-markdown-content'));
  visit(article, (node) => {
    if (node.tagName === 'button' && attribute(node, 'data-code') !== undefined) {
      const code = attribute(node, 'data-code').replaceAll('\u007f', '\n');
      assert.ok(markdown.includes(`\n${code}\n`), `${slug}: code bytes changed`);
      exactCodeBlocks++;
    }
    if (hasClass(node, 'guide-meta')) {
      for (const child of node.childNodes.filter((child) => child.tagName === 'span' && attribute(child, 'aria-hidden') !== 'true')) {
        assert.ok(markdown.includes(text(child).trim()), `${slug}: qualification or role lost`);
      }
    }
    if (hasClass(node, 'qualification-note')) assert.ok(markdown.includes(text(node).trim()), `${slug}: qualification limits lost`);
    if (node.tagName === 'figure' && hasClass(node, 'screenshot')) {
      const caption = find(node, (child) => child.tagName === 'figcaption');
      const plain = caption.childNodes.filter((child) => child.nodeName === '#text').map(text).join('').trim();
      assert.ok(plainMarkdown(markdown).includes(plain), `${slug}: screenshot caption lost`);
      const img = find(node, (child) => child.tagName === 'img');
      const asset = attribute(img, 'src').slice(docsBase.length);
      assert.ok(markdown.includes(mirrorAsset(asset)), `${slug}: screenshot has no secure link`);
      screenshotCaptions++;
    }
  });
  // Every link to the mirror must have a real public artifact (no authenticated app routes).
  for (const match of markdown.matchAll(/https:\/\/raw\.githubusercontent\.com\/MorningHQ\/martian-security-docs\/main\/public\/([^\s)"?#]+)/g)) {
    assert.ok(existsSync(path.join('public', decodeURIComponent(match[1]))), `${slug}: missing mirrored artifact ${match[1]}`);
  }
}
for (const file of ['llms.txt', 'llms-full.txt', 'robots.txt']) assert.equal(read(`dist/${file}`), read(`public/${file}`));
assert.equal(walk('public/markdown').filter((file) => file.endsWith('.md')).length, sources.length, 'Orphaned Markdown export');
console.log(JSON.stringify({ agentPages: sources.length, exactCodeBlocks, screenshotCaptions, secureMirror: true }, null, 2));
