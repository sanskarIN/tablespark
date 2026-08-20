export function validateNativeConfiguration({
  packageJson,
  cargoToml,
  tauriConfig,
  androidConfig,
  iosConfig,
}) {
  const errors = [];
  const cargoVersion = cargoToml.match(/^version\s*=\s*"([^"]+)"/m)?.[1];

  if (!cargoVersion) errors.push('src-tauri/Cargo.toml package version is missing.');
  if (cargoVersion && cargoVersion !== packageJson.version) {
    errors.push(`Cargo version ${cargoVersion} does not match package version ${packageJson.version}.`);
  }

  if (tauriConfig.version !== '../package.json') {
    errors.push('Tauri version must be sourced from ../package.json.');
  }
  if (tauriConfig.identifier !== 'in.sanskar.tablespark') {
    errors.push('Unexpected native application identifier.');
  }
  if (tauriConfig.build?.frontendDist !== '../dist') {
    errors.push('Tauri frontendDist must point to ../dist.');
  }
  if (tauriConfig.build?.devUrl !== 'http://localhost:5173') {
    errors.push('Tauri devUrl must match the fixed Vite development port.');
  }

  const requiredScripts = [
    'native:dev',
    'native:build',
    'native:build:ci',
    'check:native',
    'android:init',
    'android:build',
    'ios:init',
    'ios:build',
  ];
  for (const script of requiredScripts) {
    if (!packageJson.scripts?.[script]) errors.push(`Missing package script: ${script}.`);
  }

  if (!packageJson.devDependencies?.['@tauri-apps/cli']) {
    errors.push('Missing @tauri-apps/cli development dependency.');
  }
  if (!packageJson.dependencies?.['@tauri-apps/plugin-opener']) {
    errors.push('Missing @tauri-apps/plugin-opener dependency.');
  }

  const minSdk = androidConfig.bundle?.android?.minSdkVersion;
  if (typeof minSdk !== 'number' || minSdk < 24) {
    errors.push('Android minSdkVersion must be at least 24.');
  }

  const minimumIos = iosConfig.bundle?.iOS?.minimumSystemVersion;
  if (typeof minimumIos !== 'string' || Number.parseFloat(minimumIos) < 14) {
    errors.push('iOS minimumSystemVersion must be at least 14.0.');
  }

  return errors;
}
