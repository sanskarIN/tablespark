import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const MARKDOWN_LINK = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const HTML_LINK = /<(?:a|img)\b[^>]*(?:href|src)="([^"]+)"[^>]*>/gi;

function isExternalTarget(target) {
  return (
    target.startsWith('#') ||
    target.startsWith('mailto:') ||
    target.startsWith('tel:') ||
    target.startsWith('data:') ||
    /^[a-z][a-z0-9+.-]*:\/\//i.test(target)
  );
}

function normalizeTarget(target) {
  const withoutFragment = target.split('#', 1)[0] ?? '';
  const withoutQuery = withoutFragment.split('?', 1)[0] ?? '';
  try {
    return decodeURIComponent(withoutQuery);
  } catch {
    return withoutQuery;
  }
}

export function extractLocalLinks(markdown) {
  const targets = [];

  for (const match of markdown.matchAll(MARKDOWN_LINK)) {
    const target = match[1];
    if (target && !isExternalTarget(target)) targets.push(normalizeTarget(target));
  }

  for (const match of markdown.matchAll(HTML_LINK)) {
    const target = match[1];
    if (target && !isExternalTarget(target)) targets.push(normalizeTarget(target));
  }

  return targets.filter(Boolean);
}

async function collectMarkdownFiles(root, current, files) {
  const entries = await readdir(current, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && ['.git', 'node_modules', 'dist', 'coverage'].includes(entry.name)) {
      continue;
    }
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) {
      await collectMarkdownFiles(root, absolute, files);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push({ absolute, relative: path.relative(root, absolute) });
    }
  }
}

export async function checkLocalDocumentationLinks(root) {
  const markdownFiles = [];
  await collectMarkdownFiles(root, root, markdownFiles);
  const failures = [];

  for (const file of markdownFiles) {
    const markdown = await readFile(file.absolute, 'utf8');
    for (const target of extractLocalLinks(markdown)) {
      const resolved = target.startsWith('/')
        ? path.join(root, target.slice(1))
        : path.resolve(path.dirname(file.absolute), target);
      try {
        await access(resolved);
      } catch {
        failures.push({ file: file.relative, target });
      }
    }
  }

  return failures;
}
