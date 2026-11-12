import type { APIRoute } from 'astro';
import { diagramIds, diagramImage } from '../../../diagrams';

export const prerender = true;
export function getStaticPaths() {
  return diagramIds.flatMap(id => [
    { params: { id }, props: { id, mobile: false } },
    { params: { id: `${id}-mobile` }, props: { id, mobile: true } },
  ]);
}
export const GET: APIRoute = ({ props }) => new Response(diagramImage(props.id, props.mobile).svg, { headers: { 'Content-Type': 'image/svg+xml' } });
