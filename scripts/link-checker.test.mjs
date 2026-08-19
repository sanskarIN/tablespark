import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { checkLocalDocumentationLinks, extractLocalLinks } from './link-checker.mjs';

test('extractLocalLinks ignores external and fragment targets', () => {
  const markdown = [
    '[local](docs/setup.md)',
    '[section](#quick-start)',
    '[web](https://example.com)',
    '<a href="mailto:support@example.com">mail</a>',
    '<img src="public/logo.svg" alt="logo" />',
  ].join('\n');

  assert.deepEqual(extractLocalLinks(markdown), ['docs/setup.md', 'public/logo.svg']);
});

test('checkLocalDocumentationLinks accepts existing relative links', async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'tablespark-links-'));
  context.after(async () => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'docs'));
  await writeFile(path.join(root, 'README.md'), '[Setup](docs/setup.md)\n');
  await writeFile(path.join(root, 'docs', 'setup.md'), '# Setup\n[Home](../README.md)\n');

  assert.deepEqual(await checkLocalDocumentationLinks(root), []);
});

test('checkLocalDocumentationLinks reports broken relative links', async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'tablespark-links-'));
  context.after(async () => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, 'README.md'), '[Missing](docs/missing.md)\n');

  assert.deepEqual(await checkLocalDocumentationLinks(root), [
    { file: 'README.md', target: 'docs/missing.md' },
  ]);
});
