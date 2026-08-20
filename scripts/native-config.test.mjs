import assert from 'node:assert/strict';
import test from 'node:test';
import { validateNativeConfiguration } from './native-config.mjs';

function validFixture() {
  return {
    packageJson: {
      version: '2.0.12',
      scripts: {
        'native:dev': 'tauri dev',
        'native:build': 'tauri build',
        'native:build:ci': 'tauri build --no-bundle --no-sign',
        'check:native': 'native checks',
        'android:init': 'tauri android init --ci',
        'android:build': 'tauri android build',
        'ios:init': 'tauri ios init --ci',
        'ios:build': 'tauri ios build',
      },
      dependencies: { '@tauri-apps/plugin-opener': '2.5.4' },
      devDependencies: { '@tauri-apps/cli': '2.11.4' },
    },
    cargoToml: '[package]\nname = "tablespark"\nversion = "2.0.12"\n',
    tauriConfig: {
      version: '../package.json',
      identifier: 'in.sanskar.tablespark',
      build: { frontendDist: '../dist', devUrl: 'http://localhost:5173' },
    },
    androidConfig: { bundle: { android: { minSdkVersion: 24 } } },
    iosConfig: { bundle: { iOS: { minimumSystemVersion: '14.0' } } },
  };
}

test('accepts synchronized native configuration', () => {
  assert.deepEqual(validateNativeConfiguration(validFixture()), []);
});

test('reports version and target drift', () => {
  const fixture = validFixture();
  fixture.packageJson.version = '2.0.13';
  fixture.androidConfig.bundle.android.minSdkVersion = 23;
  fixture.iosConfig.bundle.iOS.minimumSystemVersion = '13.0';

  const errors = validateNativeConfiguration(fixture);
  assert.ok(errors.some((error) => error.includes('Cargo version')));
  assert.ok(errors.some((error) => error.includes('Android minSdkVersion')));
  assert.ok(errors.some((error) => error.includes('iOS minimumSystemVersion')));
});
