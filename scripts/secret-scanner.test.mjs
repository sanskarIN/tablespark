import assert from 'node:assert/strict';
import test from 'node:test';
import { scanText } from './secret-scanner.mjs';

test('secret scanner leaves ordinary project text clean', () => {
  assert.deepEqual(scanText('TableSpark stores learning data locally.', 'README.md'), []);
});

test('secret scanner identifies supported credential patterns without exposing values', () => {
  const token = 'ghp_' + 'A'.repeat(40);
  const findings = scanText(`safe line\n${token}\n`, 'fixture.txt');
  assert.deepEqual(findings, [{ file: 'fixture.txt', line: 2, type: 'GitHub token' }]);
  assert.equal(JSON.stringify(findings).includes(token), false);
});

test('secret scanner detects private key headers', () => {
  const header = '-----BEGIN ' + 'PRIVATE KEY-----';
  const findings = scanText(header, 'key.pem');
  assert.deepEqual(findings, [{ file: 'key.pem', line: 1, type: 'private key' }]);
});
