import { describe, expect, it, vi } from 'vitest';
import { isBrowserInstallPromptEvent } from './installPrompt';

describe('browser install prompt type guard', () => {
  it('rejects an ordinary browser event', () => {
    expect(isBrowserInstallPromptEvent(new Event('beforeinstallprompt'))).toBe(false);
  });

  it('accepts an event that exposes a callable prompt method', () => {
    const prompt = vi.fn(async () => undefined);
    const event = Object.assign(new Event('beforeinstallprompt'), { prompt });

    expect(isBrowserInstallPromptEvent(event)).toBe(true);
  });

  it('rejects a non-callable prompt property', () => {
    const event = Object.assign(new Event('beforeinstallprompt'), { prompt: true });

    expect(isBrowserInstallPromptEvent(event)).toBe(false);
  });
});
