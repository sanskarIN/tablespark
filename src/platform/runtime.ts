export type TableSparkRuntimePlatform = string;

const detectedPlatform: TableSparkRuntimePlatform =
  typeof __TABLESPARK_PLATFORM__ === 'string' ? __TABLESPARK_PLATFORM__ : 'web';
const detectedNative = typeof __TABLESPARK_NATIVE__ === 'boolean' ? __TABLESPARK_NATIVE__ : false;

export const runtimePlatform = detectedPlatform;
export const isNativeShell = detectedNative;
export const isMobileNativeShell =
  isNativeShell && (runtimePlatform === 'android' || runtimePlatform === 'ios');

export function shouldRegisterPwaServiceWorker(): boolean {
  return !isNativeShell;
}
