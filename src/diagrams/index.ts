import { renderMermaidSVG } from 'beautiful-mermaid';
import { createHash } from 'node:crypto';
import interFont from '@fontsource-variable/inter/files/inter-latin-standard-normal.woff2?inline';
import architecture from './architecture.mmd?raw';
import assessment from './assessment.mmd?raw';
import evals from './evals.mmd?raw';
import sdk from './sdk.mmd?raw';

const definitions = {
  architecture: { source: architecture, title: 'How Martian Security fits together', description: 'The console uses the customer API. Assessment execution calls the approved agent, while evaluation results remain in the organization workspace.' },
  assessment: { source: assessment, title: 'From agent connection to assessment evidence', description: 'Connect and approve an agent, choose endpoint or sandbox scope, select goals and tests, run a bounded assessment, then inspect evidence and verified outcomes.' },
  evals: { source: evals, title: 'From dataset to quality evidence', description: 'Publish a dataset version, run an approved HTTP agent, retain outputs, score saved results, then review and compare.' },
  sdk: { source: sdk, title: 'SDK and platform responsibilities', description: 'Customer tests and callbacks run locally. The SDK uses platform authorization for probe generation and judging, and retains reports and CI outcomes.' },
} as const;

export type DiagramId = keyof typeof definitions;
export const diagramIds = Object.keys(definitions) as DiagramId[];

// Color supports the labels: orange agent, blue tools, violet provider/decision,
// green target/evidence, amber storage, and slate access.
const classes = `
classDef access fill:#f1f5f9,stroke:#cbd5e1,color:#334155
classDef agent fill:#fff0e6,stroke:#f4ad83,color:#9a3412
classDef tool fill:#edf5ff,stroke:#a6c8f4,color:#1e40af
classDef external fill:#f4efff,stroke:#c7b5ed,color:#5b21b6
classDef target fill:#ecf9f2,stroke:#9bd2b3,color:#166534
classDef storage fill:#fff8e8,stroke:#e7c57b,color:#854d0e
`;

export function diagramSource(id: DiagramId, mobile = false): string {
  const definition = definitions[id];
  const body = mobile && 'mobileSource' in definition ? definition.mobileSource : definition.source;
  const layout = mobile ? body.replace(/^flowchart LR/m, 'flowchart TB').replace(/direction LR/g, 'direction TB') : body;
  return `${layout.trim()}\n${classes}`;
}

const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const cache = new Map<string, { svg: string; width: number; height: number; title: string; description: string; version: string }>();

export function diagramImage(id: DiagramId, mobile = false) {
  const key = `${id}${mobile ? '-mobile' : ''}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const definition = definitions[id];
  let svg = renderMermaidSVG(diagramSource(id, mobile), {
    bg: '#fafafa', fg: '#292524', line: '#a8a29e', accent: '#777169',
    muted: '#57534e', surface: '#ffffff', border: '#d6d3d1',
    font: 'Inter', padding: 24, nodeSpacing: 28, layerSpacing: id === 'assessment' ? 28 : 44, componentSpacing: 32,
  });
  const dimensions = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!dimensions) throw new Error(`Missing SVG dimensions: ${id}`);
  // Standalone SVGs carry their own local font, including when opened full size.
  svg = svg.replace(/^[ \t]*@import[^\n]*\n?/gm, '');
  svg = svg.replace('<svg ', '<svg role="img" aria-labelledby="diagram-title diagram-description" ');
  svg = svg.replace(/(<svg\b[^>]*>)/, `$1\n<title id="diagram-title">${escape(definition.title)}</title>\n<desc id="diagram-description">${escape(definition.description)}</desc>\n<style>@font-face{font-family:Inter;font-style:normal;font-weight:100 900;src:url("${interFont}") format("woff2")}</style>`);
  const version = createHash('sha256').update(svg).digest('hex').slice(0, 12);
  const image = { svg, width: Number(dimensions[1]), height: Number(dimensions[2]), title: definition.title, description: definition.description, version };
  cache.set(key, image);
  return image;
}
