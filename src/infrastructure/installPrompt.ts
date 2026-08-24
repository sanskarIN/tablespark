export interface BrowserInstallPromptEvent extends Event {
  readonly prompt: () => Promise<void>;
}

export function isBrowserInstallPromptEvent(event: Event): event is BrowserInstallPromptEvent {
  return 'prompt' in event && typeof (event as { prompt?: unknown }).prompt === 'function';
}
