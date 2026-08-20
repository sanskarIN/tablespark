import { describe, expect, it } from 'vitest';
import { isMobileNativeShell, isNativeShell, runtimePlatform, shouldRegisterPwaServiceWorker } from './runtime';

describe('runtime platform flags', () => {
  it('treats the ordinary Vitest build as the web runtime', () => {
    expect(runtimePlatform).toBe('web');
    expect(isNativeShell).toBe(false);
    expect(isMobileNativeShell).toBe(false);
    expect(shouldRegisterPwaServiceWorker()).toBe(true);
  });
});
