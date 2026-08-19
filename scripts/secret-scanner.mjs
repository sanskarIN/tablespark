import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_IGNORED_DIRECTORIES = new Set([
  '.git',
  'node_modules',
  'dist',
  'coverage',
  'playwright-report',
  'test-results',
]);

const MAX_FILE_BYTES = 1_000_000;

export const secretPatterns = [
  {
    name: 'private key',
    pattern: /-----BEGIN\s+(?:RSA\s+|EC\s+|OPENSSH\s+)?PRIVATE KEY-----/g,
  },
  { name: 'GitHub token', pattern: /gh[pousr]_[A-Za-z0-9]{20,}/g },
  { name: 'AWS access key', pattern: /AKIA[0-9A-Z]{16}/g },
  { name: 'Google API key', pattern: /AIza[0-9A-Za-z_-]{35}/g },
  { name: 'Slack token', pattern: /xox[baprs]-[0-9A-Za-z-]{10,}/g },
  { name: 'Stripe live secret', pattern: /sk_live_[0-9A-Za-z]{16,}/g },
];

function lineNumberAt(text, index) {
  return text.slice(0, index).split('\n').length;
}

export function scanText(text, filePath = '<memory>') {
  const findings = [];
  for (const { name, pattern } of secretPatterns) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      findings.push({
        file: filePath,
        line: lineNumberAt(text, match.index ?? 0),
        type: name,
      });
    }
  }
  return findings;
}

function looksBinary(buffer) {
  const sampleLength = Math.min(buffer.length, 8_192);
  for (let index = 0; index < sampleLength; index += 1) {
    if (buffer[index] === 0) return true;
  }
  return false;
}

async function collectFiles(root, current, ignoredDirectories, files) {
  const entries = await readdir(current, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(root, absolute, ignoredDirectories, files);
    } else if (entry.isFile()) {
      const metadata = await stat(absolute);
      if (metadata.size <= MAX_FILE_BYTES) {
        files.push({ absolute, relative: path.relative(root, absolute) });
      }
    }
  }
}

export async function scanRepository(root, options = {}) {
  const ignoredDirectories = new Set([
    ...DEFAULT_IGNORED_DIRECTORIES,
    ...(options.ignoredDirectories ?? []),
  ]);
  const files = [];
  await collectFiles(root, root, ignoredDirectories, files);

  const findings = [];
  for (const file of files) {
    const buffer = await readFile(file.absolute);
    if (looksBinary(buffer)) continue;
    findings.push(...scanText(buffer.toString('utf8'), file.relative));
  }
  return findings;
}
