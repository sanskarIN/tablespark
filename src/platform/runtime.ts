export type TableSparkRuntimePlatform =
  | 'web'
  | 'windows'
  | 'darwin'
  | 'linux'
  | 'android'
  | 'ios'
  | string;

export const runtimePlatform = __TABLESPARK_PLATFORM__ as TableSparkRuntimePlatform;
export const isNativeShell = __TABLESPARK_NATIVE__;
export const isMobileNativeShell =
  isNativeShell && (runtimePlatform === 'android' || runtimePlatform === 'ios');

export function shouldRegisterPwaServiceWorker(): boolean {
  return !isNativeShell;
}
