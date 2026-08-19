import process from 'node:process';
import { checkLocalDocumentationLinks } from './link-checker.mjs';

const failures = await checkLocalDocumentationLinks(process.cwd());

if (failures.length === 0) {
  console.log('Documentation link check passed: all local Markdown links resolve.');
  process.exit(0);
}

console.error(`Documentation link check failed with ${failures.length} broken local link(s):`);
for (const failure of failures) {
  console.error(`- ${failure.file} -> ${failure.target}`);
}
process.exit(1);
