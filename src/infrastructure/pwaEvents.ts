export const PWA_UPDATE_AVAILABLE_EVENT = 'tablespark:pwa-update-available';
export const PWA_OFFLINE_READY_EVENT = 'tablespark:pwa-offline-ready';

export interface PwaUpdateAvailableDetail {
  readonly update: (reloadPage?: boolean) => Promise<void>;
}

export function dispatchPwaUpdateAvailable(update: PwaUpdateAvailableDetail['update']): void {
  window.dispatchEvent(
    new CustomEvent<PwaUpdateAvailableDetail>(PWA_UPDATE_AVAILABLE_EVENT, {
      detail: { update },
    }),
  );
}

export function dispatchPwaOfflineReady(): void {
  window.dispatchEvent(new Event(PWA_OFFLINE_READY_EVENT));
}
