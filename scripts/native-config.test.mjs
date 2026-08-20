import assert from 'node:assert/strict';
import test from 'node:test';
import { validateNativeConfiguration } from './native-config.mjs';

function validFixture() {
  return {
    packageJson: {
      version: '2.0.12',
      scripts: {
        'native:icons': 'tauri icon public/logo.svg',
        'native:prepare': 'npm run native:icons',
        'native:dev': 'tauri dev',
        'native:build': 'npm run native:prepare && tauri build',
        'native:build:ci': 'npm run native:prepare && tauri build --no-bundle --no-sign',
        'check:native': 'native checks',
        'android:init': 'npm run native:prepare && tauri android init --ci',
        'android:build': 'npm run native:prepare && tauri android build',
        'android:build:debug': 'npm run native:prepare && tauri android build --debug --apk',
        'ios:init': 'npm run native:prepare && tauri ios init --ci',
        'ios:build': 'npm run native:prepare && tauri ios build',
        'ios:build:simulator':
          'npm run native:prepare && tauri ios build --debug --target aarch64-sim',
      },
      dependencies: { '@tauri-apps/plugin-opener': '2.5.4' },
      devDependencies: { '@tauri-apps/cli': '2.11.4' },
    },
    cargoToml: '[package]\nname = "tablespark"\nversion = "2.0.12"\n',
    tauriConfig: {
      version: '../package.json',
      identifier: 'in.sanskar.tablespark',
      build: { frontendDist: '../dist', devUrl: 'http://localhost:5173' },
      app: {
        security: {
          capabilities: ['main-capability'],
          csp: { 'default-src': "'self'" },
          devCsp: { 'default-src': "'self' http:" },
        },
      },
      bundle: {
        icon: [
          'icons/32x32.png',
          'icons/128x128.png',
          'icons/128x128@2x.png',
          'icons/icon.icns',
          'icons/icon.ico',
        ],
      },
    },
    androidConfig: { bundle: { android: { minSdkVersion: 24 } } },
    iosConfig: { bundle: { iOS: { minimumSystemVersion: '14.0' } } },
  };
}

test('accepts synchronized native configuration', () => {
  assert.deepEqual(validateNativeConfiguration(validFixture()), []);
});

test('reports version, security, icon, and target drift', () => {
  const fixture = validFixture();
  fixture.packageJson.version = '2.0.13';
  fixture.androidConfig.bundle.android.minSdkVersion = 23;
  fixture.iosConfig.bundle.iOS.minimumSystemVersion = '13.0';
  fixture.tauriConfig.bundle.icon = ['icons/icon.ico'];
  fixture.tauriConfig.app.security.csp = null;
  fixture.tauriConfig.app.security.capabilities = ['main-capability', 'unexpected-capability'];

  const errors = validateNativeConfiguration(fixture);
  assert.ok(errors.some((error) => error.includes('Cargo version')));
  assert.ok(errors.some((error) => error.includes('Content Security Policy')));
  assert.ok(errors.some((error) => error.includes('main-capability')));
  assert.ok(errors.some((error) => error.includes('Android minSdkVersion')));
  assert.ok(errors.some((error) => error.includes('iOS minimumSystemVersion')));
  assert.ok(errors.some((error) => error.includes('native bundle icon declaration')));
});
