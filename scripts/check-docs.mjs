import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { siteOrigin, siteBase } from '../site.config.mjs';

const base = `${siteBase}/`;
const origin = siteOrigin;
const root = path.resolve('dist');
const failures = [];
function files(directory, extension) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? files(name, extension) : name.endsWith(extension) ? [name] : [];
  });
}
const source = [...files('src/content/docs', '.md'), ...files('src/content/docs', '.mdx')];
const diagramSources = files('src/diagrams', '.mmd');
const prohibited = [
  /\b(?:i|vol|snap)-[0-9a-f]{8,17}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bsk-[a-zA-Z0-9_-]{20,}/,
  /\bgh[pousr]_[a-zA-Z0-9]{20,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /arn:aws:[^\s]+:\d{12}:/,
  /eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{10,}/,
];
for (const file of [...source, ...diagramSources]) {
  const text = readFileSync(file, 'utf8');
  const metadata = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
  if (!file.endsWith('.mmd') && (!/^title: .+$/m.test(metadata) || !/^description: .+$/m.test(metadata))) failures.push(`${file}: missing metadata`);
  if (prohibited.some(pattern => pattern.test(text))) failures.push(`${file}: possible private identifier or credential`);
}
if (!existsSync(path.join(root, 'index.html'))) throw new Error('Build the documentation before checking generated links.');
const htmlFiles = files(root, '.html');
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const ids = new Map(htmlFiles.map(file => [file, new Set([...readFileSync(file, 'utf8').matchAll(/\bid="([^"]*)"/g)].map(m => decode(m[1])))]));
let links = 0;
for (const file of htmlFiles) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const url = new URL(base + relative, origin);
  for (const tag of readFileSync(file, 'utf8').matchAll(/<(?:a|link|script|img|source)\b[^>]*>/g)) {
    if (/\brel="canonical"/.test(tag[0])) continue;
    const match = tag[0].match(/\b(?:href|src|srcset)="([^"]*)"/);
    if (!match) continue;
    const href = decode(match[1]);
    if (!href || /^(?:data|mailto|tel|javascript):/.test(href)) continue;
    const target = new URL(href, url);
    if (target.origin !== origin) continue;
    // The separately maintained Hermes guide is an intentional sibling site.
    if (target.pathname === '/martian-hermes-docs' || target.pathname.startsWith('/martian-hermes-docs/')) continue;
    links++;
    if (!target.pathname.startsWith(base)) {
      failures.push(`${relative}: link escapes project base: ${href}`);
      continue;
    }
    let destination = path.join(root, decodeURIComponent(target.pathname.slice(base.length)));
    if (existsSync(destination) && statSync(destination).isDirectory()) destination = path.join(destination, 'index.html');
    if (!existsSync(destination)) {
      failures.push(`${relative}: missing file: ${href}`);
    } else if (target.hash && ids.has(destination) && !ids.get(destination).has(decodeURIComponent(target.hash.slice(1)))) {
      failures.push(`${relative}: missing anchor: ${href}`);
    }
  }
}
console.log(JSON.stringify({ sourcePages: source.length, builtPages: htmlFiles.length, localLinksChecked: links, failures }, null, 2));
if (failures.length) process.exitCode = 1;
