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
