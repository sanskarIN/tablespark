export type TableSparkRuntimePlatform =
  | 'web'
  | 'windows'
  | 'darwin'
  | 'linux'
  | 'android'
  | 'ios'
  | string;

const detectedPlatform =
  typeof __TABLESPARK_PLATFORM__ === 'string' ? __TABLESPARK_PLATFORM__ : 'web';
const detectedNative =
  typeof __TABLESPARK_NATIVE__ === 'boolean' ? __TABLESPARK_NATIVE__ : false;

export const runtimePlatform = detectedPlatform as TableSparkRuntimePlatform;
export const isNativeShell = detectedNative;
export const isMobileNativeShell =
  isNativeShell && (runtimePlatform === 'android' || runtimePlatform === 'ios');

export function shouldRegisterPwaServiceWorker(): boolean {
  return !isNativeShell;
}
