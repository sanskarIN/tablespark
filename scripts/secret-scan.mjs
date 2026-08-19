import process from 'node:process';
import { scanRepository } from './secret-scanner.mjs';

const root = process.cwd();
const findings = await scanRepository(root);

if (findings.length === 0) {
  console.log('Secret scan passed: no supported credential patterns were found.');
  process.exit(0);
}

console.error(`Secret scan failed with ${findings.length} finding(s):`);
for (const finding of findings) {
  console.error(`- ${finding.file}:${finding.line} — ${finding.type}`);
}
process.exit(1);
