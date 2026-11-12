import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = process.cwd();
const coverage = JSON.parse(readFileSync('quality/coverage.json', 'utf8'));
const registry = JSON.parse(readFileSync('quality/screenshots.json', 'utf8'));
const release = process.argv.includes('--release');
const failures = [];
const pending = [];
const screenshots = new Map();
for (const entry of registry.screenshots) {
  if (screenshots.has(entry.id)) failures.push(`Duplicate screenshot id: ${entry.id}`);
  screenshots.set(entry.id, entry);
  const file = path.join(root, 'public/media/screenshots', entry.file);
  if (!entry.alt || !entry.caption || !entry.guideSteps?.length || !entry.environment || !entry.role || !entry.capturedAt || !entry.sourceRevisions || !entry.validationStatus || !entry.reviewedForSecrets) failures.push(`${entry.id}: incomplete provenance`);
  if (entry.width !== 1440 || entry.height !== 1000) failures.push(`${entry.id}: inconsistent application viewport`);
  if (!existsSync(file)) failures.push(`${entry.id}: missing image file`);
  else if (createHash('sha256').update(readFileSync(file)).digest('hex') !== entry.sha256) failures.push(`${entry.id}: capture hash mismatch`);
}
const guides = new Set();
let pendingScreenshots = 0;
for (const guide of coverage.guides) {
  if (guides.has(guide.id)) failures.push(`Duplicate guide: ${guide.id}`);
  guides.add(guide.id);
  const file = path.join(root, 'src/content/docs', `${guide.id}.mdx`);
  if (!existsSync(file)) { failures.push(`${guide.id}: missing guide`); continue; }
  const text = readFileSync(file, 'utf8');
  if (!guide.role || !guide.route || !guide.prerequisites?.length || !guide.requiredValidation?.length) failures.push(`${guide.id}: incomplete coverage matrix`);
  const referenced = [...text.matchAll(/<Screenshot\s+id="([^"]+)"/g)].map(m => m[1]);
  for (const id of referenced) {
    if (!guide.screenshots?.includes(id)) failures.push(`${guide.id}: screenshot ${id} missing from coverage matrix`);
    if (!screenshots.has(id)) { pendingScreenshots++; if (release || guide.qualification === 'verified') failures.push(`${guide.id}: required real screenshot ${id} not captured`); }
  }
  if (guide.qualification !== 'verified') pending.push(guide.id);
  if ((release || guide.qualification === 'verified') && (!guide.validation?.length || !guide.verifiedAt || !guide.verifiedEnvironment)) failures.push(`${guide.id}: missing walkthrough evidence, date or environment`);
}
function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : file.endsWith('.mdx') ? [file] : [];
  });
}
for (const file of sourceFiles('src/content/docs')) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/<GuideMeta\s+id="([^"]+)"/g)) {
    if (!guides.has(match[1])) failures.push(`${match[1]}: task guide absent from coverage matrix`);
  }
}
if (release && pending.length) failures.push(`${pending.length} guide walkthroughs remain unverified`);
console.log(JSON.stringify({ guides: guides.size, capturedScreenshotReferences: screenshots.size, uniqueCapturedImages: new Set(registry.screenshots.map(entry => entry.file)).size, pendingScreenshotReferences: pendingScreenshots, pendingWalkthroughs: pending, releaseAudit: release, failures }, null, 2));
if (failures.length) process.exitCode = 1;
