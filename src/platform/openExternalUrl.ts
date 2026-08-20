import type { MouseEvent } from 'react';
import { isNativeShell } from './runtime';

export async function openExternalUrl(url: string): Promise<boolean> {
  if (!isNativeShell) return false;

  try {
    const { openUrl } = await import('@tauri-apps/plugin-opener');
    await openUrl(url);
    return true;
  } catch {
    return false;
  }
}

export function handleExternalLinkClick(event: MouseEvent<HTMLAnchorElement>): void {
  if (!isNativeShell || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  event.preventDefault();
  const url = event.currentTarget.href;
  void openExternalUrl(url).then((opened) => {
    if (!opened) window.open(url, '_blank', 'noopener,noreferrer');
  });
}
