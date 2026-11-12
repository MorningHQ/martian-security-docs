import { readFileSync } from 'node:fs';

// These downloads are imported through the console before SDK/native execution.
// The inline SDK example uses nested inputs and expectations instead.
const files = [
  'public/examples/http-agent/first-evaluation.jsonl',
  'public/examples/sdk/support-regressions.jsonl',
];
const allowed = new Set(['id', 'input', 'expected_output', 'status']);
const failures = [];
let records = 0;
for (const file of files) {
  const ids = new Set();
  const lines = readFileSync(file, 'utf8').trim().split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const label = `${file}:${index + 1}`;
    let row;
    try { row = JSON.parse(line); }
    catch { failures.push(`${label}: invalid JSON`); continue; }
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      failures.push(`${label}: expected a console import record`);
      continue;
    }
    for (const key of Object.keys(row)) {
      if (!allowed.has(key)) failures.push(`${label}: unsupported example field ${key}`);
    }
    for (const key of ['id', 'input', 'expected_output']) {
      if (typeof row[key] !== 'string' || !row[key].trim()) failures.push(`${label}: missing ${key}`);
    }
    if (row.status !== 'ACTIVE') failures.push(`${label}: teaching record must be ACTIVE`);
    if (ids.has(row.id)) failures.push(`${label}: duplicate record ID`);
    ids.add(row.id);
    records++;
  }
}
console.log(JSON.stringify({ consoleImportFiles: files.length, records, failures }, null, 2));
if (failures.length) process.exitCode = 1;
