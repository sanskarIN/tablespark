import { readFile } from 'node:fs/promises';
import { validateNativeConfiguration } from './native-config.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

const [packageJson, cargoToml, tauriConfig, androidConfig, iosConfig] = await Promise.all([
  readJson('package.json'),
  readFile('src-tauri/Cargo.toml', 'utf8'),
  readJson('src-tauri/tauri.conf.json'),
  readJson('src-tauri/tauri.android.conf.json'),
  readJson('src-tauri/tauri.ios.conf.json'),
]);

const errors = validateNativeConfiguration({
  packageJson,
  cargoToml,
  tauriConfig,
  androidConfig,
  iosConfig,
});

if (errors.length > 0) {
  console.error('Native configuration check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('Native configuration is synchronized.');
}
