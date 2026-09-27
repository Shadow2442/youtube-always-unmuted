'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (...segments) => fs.readFileSync(path.join(root, ...segments), 'utf8');

test('manifest identifies the first stable release', () => {
  const manifest = JSON.parse(read('manifest.json'));
  assert.equal(manifest.name, 'YouTube Always Unmuted');
  assert.equal(manifest.version, '1.0.0');
  assert.equal(manifest.manifest_version, 3);
});

test('release documentation records v1.0.0 and public links', () => {
  const readme = read('README.md');
  const changelog = read('CHANGELOG.md');

  assert.match(readme, /v1\.0\.0/);
  assert.match(readme, /shadow2442\.github\.io\/youtube-always-unmuted/i);
  assert.match(readme, /github\.com\/Shadow2442\/youtube-always-unmuted\/releases/i);
  assert.match(changelog, /\[1\.0\.0\]/);
});

test('GitHub Pages surface provides release, source, privacy, and installation paths', () => {
  const page = read('website', 'index.html');
  const css = read('website', 'styles', 'site.css');

  assert.match(page, /YouTube Always Unmuted/);
  assert.match(page, /github\.com\/Shadow2442\/youtube-always-unmuted\/releases\/latest/i);
  assert.match(page, /github\.com\/Shadow2442\/youtube-always-unmuted/i);
  assert.match(page, /No telemetry/i);
  assert.match(page, /Load unpacked/i);
  assert.match(page, /class="release-banner"/);
  assert.match(css, /--gold:\s*#f4bf54/i);
  assert.match(css, /--azure:\s*#71d6ff/i);
});
