'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

require('../unmute-core.js');

const { ensureUnmuted } = globalThis.YouTubeAlwaysUnmuted;

test('unmutes muted media without changing volume', () => {
  const media = { muted: true, volume: 0.37 };

  assert.equal(ensureUnmuted(media), true);
  assert.equal(media.muted, false);
  assert.equal(media.volume, 0.37);
});

test('leaves unmuted media unchanged', () => {
  const media = { muted: false, volume: 0.64 };

  assert.equal(ensureUnmuted(media), false);
  assert.equal(media.muted, false);
  assert.equal(media.volume, 0.64);
});

test('ignores missing or invalid media', () => {
  assert.equal(ensureUnmuted(), false);
  assert.equal(ensureUnmuted(null), false);
  assert.equal(ensureUnmuted({}), false);
  assert.equal(ensureUnmuted({ muted: 'yes', volume: 0.5 }), false);
});
