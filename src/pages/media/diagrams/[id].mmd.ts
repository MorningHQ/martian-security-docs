import type { APIRoute } from 'astro';
import { diagramIds, diagramSource } from '../../../diagrams';

export const prerender = true;
export function getStaticPaths() {
  return diagramIds.map(id => ({ params: { id }, props: { id } }));
}
export const GET: APIRoute = ({ props }) => new Response(diagramSource(props.id), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
