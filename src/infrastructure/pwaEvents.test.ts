import { describe, expect, it, vi } from 'vitest';
import {
  dispatchPwaOfflineReady,
  dispatchPwaUpdateAvailable,
  PWA_OFFLINE_READY_EVENT,
  PWA_UPDATE_AVAILABLE_EVENT,
  type PwaUpdateAvailableDetail,
} from './pwaEvents';

describe('PWA lifecycle events', () => {
  it('dispatches an offline-ready event', () => {
    const listener = vi.fn();
    window.addEventListener(PWA_OFFLINE_READY_EVENT, listener);

    dispatchPwaOfflineReady();

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(PWA_OFFLINE_READY_EVENT, listener);
  });

  it('dispatches the update callback without calling it', () => {
    const update = vi.fn(async (_reloadPage?: boolean) => undefined);
    const listener = vi.fn((event: Event) => {
      const detail = (event as CustomEvent<PwaUpdateAvailableDetail>).detail;
      expect(detail.update).toBe(update);
    });
    window.addEventListener(PWA_UPDATE_AVAILABLE_EVENT, listener);

    dispatchPwaUpdateAvailable(update);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(update).not.toHaveBeenCalled();
    window.removeEventListener(PWA_UPDATE_AVAILABLE_EVENT, listener);
  });
});
