import assert from 'node:assert/strict';
import test from 'node:test';
import { renderAgentMarkdown } from './lib/agent-markdown.mjs';
import { mirrorAsset, pageLinks, rewriteForAgents } from '../src/lib/agent-links.mjs';

const canonical = 'https://docs.martiansecurity.ai/sdk/install-and-configure/';
const paths = new Set(['/sdk/install-and-configure/', '/reference/verification/']);
const assets = new Set(['media/screenshots/example.png']);
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const render = (article) => renderAgentMarkdown(`<html><head><meta name="description" content="A guide."></head><body><nav>Navigation chrome</nav><h1>Example</h1><div class="sl-markdown-content">${article}</div></body></html>`, {
  canonical, rewriteUrl: (href) => rewriteForAgents(href, canonical, paths, assets), diagramSource: () => 'flowchart LR\n  A --> B\n',
});

test('rendered exports preserve exact executable code, including indentation and literal fences', () => {
  const code = 'import os\n  \nvalue = "```"\n  print(value)\n';
  const result = render(`<div class="expressive-code"><div class="frame"><div class="header">Python</div><pre data-language="python"><code>Highlighted DOM is deliberately different</code></pre><div class="copy"><button data-code="${escape(code.replaceAll('\n', '\u007f'))}">Copy</button></div></div></div>`);
  assert.deepEqual(result.codeBlocks, [{ language: 'python', code }]);
  assert.ok(result.markdown.includes('````python\n' + code + '\n````'));
  assert.ok(!result.markdown.includes('Highlighted DOM'));
  assert.ok(!result.markdown.includes('Navigation chrome'));
  assert.throws(() => render('<pre>Unrecoverable code</pre>'), /no exact copy payload/);
});

test('qualification limits, role, table, screenshot caption and accessible links survive conversion', () => {
  const result = render('<div class="guide-meta"><span>SDK 0.1.3</span><span aria-hidden="true">·</span><span>Owner</span><span>Walkthrough partly verified</span><a href="/reference/verification/">Verification details</a></div><aside class="qualification-note">Remote CI is not verified.</aside><table><thead><tr><th>Role</th><th>Access</th></tr></thead><tbody><tr><td>Owner</td><td>Configure</td></tr></tbody></table><figure><a href="/media/screenshots/example.png"><img src="/media/screenshots/example.png" alt="Actual settings"></a><figcaption>Real screenshot caption.<a class="visual-open" href="/media/screenshots/example.png">Open full size</a></figcaption></figure>');
  assert.match(result.markdown, /SDK 0\.1\.3 · Owner · Walkthrough partly verified/);
  assert.match(result.markdown, /> \*\*Walkthrough limits:\*\* Remote CI is not verified\./);
  assert.match(result.markdown, /\| Role \| Access \|/);
  assert.ok(result.markdown.includes(`![Actual settings](${mirrorAsset('media/screenshots/example.png')})`));
  assert.match(result.markdown, /Real screenshot caption\./);
  assert.ok(!result.markdown.includes('Open full size'));
  assert.ok(result.markdown.includes(pageLinks('/reference/verification/').mirror));
});

test('diagrams export readable Mermaid and links resolve to secure public files', () => {
  const result = render('<figure class="diagram"><picture><img src="/media/diagrams/workflow.svg?v=123" alt="Workflow"></picture><figcaption>Workflow steps.</figcaption></figure><p><a href="#configure">Current section</a> <a href="https://example.com/">External</a></p>');
  assert.match(result.markdown, /Workflow steps\.\n\n```mermaid\nflowchart LR\n  A --> B\n```/);
  assert.ok(result.markdown.includes(pageLinks('/sdk/install-and-configure/').mirror + '#configure'));
  assert.ok(result.markdown.includes('(https://example.com/)'));
  assert.equal(pageLinks('/').asset, 'markdown/index.md');
  assert.throws(() => pageLinks('/a/../b/'), /Invalid documentation path/);
});
