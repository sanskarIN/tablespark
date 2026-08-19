import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json';
import { hindiMessages } from './hi';
import { englishMessages } from './messages';

function shapeOf(value: unknown): unknown {
  if (typeof value === 'function') return 'function';
  if (typeof value === 'string') return 'string';
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, shapeOf(entry)]),
    );
  }
  return typeof value;
}

function collectStrings(value: unknown, path = 'messages'): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, entry]) =>
    collectStrings(entry, `${path}.${key}`),
  );
}

describe('runtime locale catalogs', () => {
  it('keeps the Hindi catalog structurally identical to the English source catalog', () => {
    expect(shapeOf(hindiMessages)).toEqual(shapeOf(englishMessages));
  });

  it('does not ship blank static Hindi messages', () => {
    for (const [path, message] of collectStrings(hindiMessages)) {
      expect(message.trim(), path).not.toBe('');
    }
  });

  it('keeps visible English and Hindi versions synchronized with package metadata', () => {
    expect(englishMessages.copy.about.version).toBe(packageJson.version);
    expect(hindiMessages.copy.about.version).toBe(packageJson.version);
    expect(englishMessages.copy.settings.versionSummary).toContain(packageJson.version);
    expect(hindiMessages.copy.settings.versionSummary).toContain(packageJson.version);
  });
});
