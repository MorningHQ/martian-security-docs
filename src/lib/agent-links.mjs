import { documentationRepository, siteBase, siteOrigin } from '../../site.config.mjs';

export const docsBase = `${siteBase.replace(/\/$/, '')}/`;
export const mirrorBase = `${documentationRepository.replace('https://github.com/', 'https://raw.githubusercontent.com/').replace(/\/$/, '')}/main/`;
export const mirrorAsset = (name) => new URL(`public/${name}`, mirrorBase).href;

export function pageLinks(pathname) {
  if (!pathname.startsWith(docsBase)) throw new Error(`Documentation path escapes base: ${pathname}`);
  const relative = decodeURIComponent(pathname.slice(docsBase.length)).replace(/\/?index\.html$/, '').replace(/\/$/, '');
  const slug = relative || 'index';
  if (slug.split('/').some((part) => !part || part === '.' || part === '..' || part.includes('\\'))) {
    throw new Error(`Invalid documentation path: ${pathname}`);
  }
  const asset = `markdown/${slug}.md`;
  return {
    slug,
    asset,
    local: `${docsBase}${asset}`,
    mirror: mirrorAsset(asset),
    canonical: new URL(pathname, siteOrigin).href,
  };
}

export function rewriteForAgents(href, canonical, pagePaths, publicAssets) {
  if (!href || /^(?:mailto:|tel:|data:)/.test(href)) return href;
  const target = new URL(href, canonical);
  if (target.hostname !== new URL(siteOrigin).hostname) return target.href;
  const documentPath = target.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  if (pagePaths.has(documentPath)) return pageLinks(documentPath).mirror + target.hash;
  const relative = decodeURIComponent(target.pathname.slice(docsBase.length));
  if (publicAssets.has(relative) || relative === 'llms.txt' || relative === 'llms-full.txt') {
    return mirrorAsset(relative) + target.hash;
  }
  const diagram = relative.match(/^media\/diagrams\/([a-z0-9-]+)\.mmd$/);
  if (diagram) return new URL(`src/diagrams/${diagram[1]}.mmd`, mirrorBase).href;
  return target.href;
}
