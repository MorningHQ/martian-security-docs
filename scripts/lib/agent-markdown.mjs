import { parse, serialize } from 'parse5';
import TurndownService from 'turndown';
import gfmPlugin from 'turndown-plugin-gfm';

export const attribute = (node, name) => node.attrs?.find((attr) => attr.name === name)?.value;
export const hasClass = (node, name) => attribute(node, 'class')?.split(/\s+/).includes(name) ?? false;
export const text = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
export function find(node, predicate) {
  if (predicate(node)) return node;
  for (const child of node.childNodes ?? []) {
    const match = find(child, predicate);
    if (match) return match;
  }
}
export function visit(node, callback) {
  callback(node);
  for (const child of node.childNodes ?? []) visit(child, callback);
}
function prune(node, predicate) {
  if (!node.childNodes) return;
  node.childNodes = node.childNodes.filter((child) => !predicate(child));
  for (const child of node.childNodes) prune(child, predicate);
}
function fenced(code, language) {
  const runs = [...code.matchAll(/`{3,}/g)].map((match) => match[0].length);
  const fence = '`'.repeat(Math.max(3, ...runs.map((length) => length + 1)));
  return `\n\n${fence}${language}\n${code}\n${fence}\n\n`;
}
function cleanBlankLines(markdown) {
  let fence;
  return markdown.split('\n').map((line) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = undefined;
      return line;
    }
    if (marker) fence = marker[1];
    return line.trim() ? line : '';
  }).join('\n');
}

// Convert only the public, rendered article. MDX imports and site chrome never enter the export.
export function renderAgentMarkdown(html, { canonical, rewriteUrl, diagramSource }) {
  const document = parse(html, { sourceCodeLocationInfo: true });
  const article = find(document, (node) => hasClass(node, 'sl-markdown-content'));
  const heading = find(document, (node) => node.tagName === 'h1');
  const description = find(document, (node) => node.tagName === 'meta' && attribute(node, 'name') === 'description');
  const head = find(document, (node) => node.tagName === 'head');
  if (!article || !heading || !head?.sourceCodeLocation?.endTag) throw new Error(`Missing rendered article: ${canonical}`);
  const title = text(heading).trim();
  const summary = attribute(description, 'content') ?? '';
  const codeBlocks = [];
  visit(article, (node) => {
    if (node.tagName === 'pre') {
      const button = find(node.parentNode, (child) => child.tagName === 'button' && attribute(child, 'data-code') !== undefined);
      const payload = attribute(button ?? {}, 'data-code');
      if (payload === undefined) throw new Error(`Code block has no exact copy payload: ${canonical}`);
      const code = payload.replaceAll('\u007f', '\n');
      const language = attribute(node, 'data-language') ?? 'text';
      codeBlocks.push({ language, code });
      node.attrs.push({ name: 'data-agent-code', value: Buffer.from(code).toString('base64') });
    }
    for (const attr of node.attrs ?? []) {
      if (attr.name === 'href' || attr.name === 'src') attr.value = rewriteUrl(attr.value);
    }
  });
  prune(article, (node) =>
    ['script', 'style', 'button', 'noscript'].includes(node.tagName) ||
    hasClass(node, 'sl-anchor-link') || hasClass(node, 'copy') || hasClass(node, 'visual-open') ||
    (hasClass(node, 'header') && hasClass(node.parentNode ?? {}, 'frame')),
  );
  const service = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-', preformattedCode: true });
  service.use([gfmPlugin.tables, gfmPlugin.strikethrough]);
  service.addRule('exact-code', {
    filter: 'pre',
    replacement: (_content, node) => fenced(Buffer.from(node.getAttribute('data-agent-code'), 'base64').toString(), node.getAttribute('data-language') || 'text'),
  });
  service.addRule('qualification', {
    filter: (node) => node.classList?.contains('guide-meta'),
    replacement: (_content, node) => {
      const parts = Array.from(node.children).filter((child) => child.getAttribute('aria-hidden') !== 'true' && child.tagName !== 'A').map((child) => child.textContent.trim());
      const link = node.querySelector('a');
      return `\n\n> **Page qualification:** ${parts.join(' · ')}.${link ? ` [Verification details](${link.getAttribute('href')}).` : ''}\n\n`;
    },
  });
  service.addRule('qualification-limit', {
    filter: (node) => node.classList?.contains('qualification-note'),
    replacement: (content) => `\n\n> **Walkthrough limits:** ${content.trim()}\n\n`,
  });
  service.addRule('image-link', {
    filter: (node) => node.nodeName === 'A' && node.children.length === 1 && node.children[0].nodeName === 'IMG',
    replacement: (content) => content,
  });
  service.addRule('caption', { filter: 'figcaption', replacement: (content) => `\n\n${content.trim()}\n\n` });
  service.addRule('definition-term', { filter: 'dt', replacement: (content) => `\n\n**${content.trim()}**\n\n` });
  service.addRule('definition', { filter: 'dd', replacement: (content) => `\n\n${content.trim()}\n\n` });
  service.addRule('start-path', {
    filter: (node) => node.classList?.contains('start-path'),
    replacement: (_content, node) => `\n\n- [${node.querySelector('strong').textContent.trim()}](${node.getAttribute('href')}): ${node.querySelector('.path-description').textContent.trim()}\n\n`,
  });
  service.addRule('diagram', {
    filter: (node) => node.classList?.contains('diagram') && node.nodeName === 'FIGURE',
    replacement: (_content, node) => {
      const img = node.querySelector('img');
      const id = new URL(img.getAttribute('src')).pathname.match(/\/media\/diagrams\/([a-z0-9-]+)\.svg$/)?.[1];
      if (!id) throw new Error(`Unknown diagram: ${canonical}`);
      const caption = node.querySelector('figcaption')?.textContent.trim() ?? img.getAttribute('alt');
      return `\n\n${caption}${fenced(diagramSource(id).trimEnd(), 'mermaid')}`;
    },
  });
  const body = cleanBlankLines(service.turndown(serialize(article)));
  return {
    title, description: summary, codeBlocks, document,
    headOffset: head.sourceCodeLocation.endTag.startOffset,
    markdown: `# ${title}\n\n${summary ? `> ${summary}\n\n` : ''}Source: [Web version](${canonical})\n\n${body}\n`,
  };
}
