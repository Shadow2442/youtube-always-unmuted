'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

require('../unmute-core.js');
require('../content.js');

const { createController } = globalThis.YouTubeAlwaysUnmuted;

function createVideo(muted = false, volume = 0.5) {
  const listeners = new Map();
  return {
    tagName: 'VIDEO',
    muted,
    volume,
    addEventListener(name, listener) {
      const entries = listeners.get(name) ?? [];
      entries.push(listener);
      listeners.set(name, entries);
    },
    emit(name) {
      for (const listener of listeners.get(name) ?? []) {
        listener();
      }
    },
    listenerCount(name) {
      return (listeners.get(name) ?? []).length;
    },
    matches(selector) {
      return selector === 'video';
    },
    querySelectorAll() {
      return [];
    },
  };
}

function createEnvironment(initialVideo = null) {
  let queryCount = 0;
  let intervalCallback;
  let intervalMs;
  let observerCallback;
  let observeCount = 0;

  const document = {
    documentElement: {},
    querySelector(selector) {
      assert.equal(selector, 'video');
      queryCount += 1;
      return initialVideo;
    },
  };

  class FakeMutationObserver {
    constructor(callback) {
      observerCallback = callback;
    }

    observe(target, options) {
      assert.equal(target, document.documentElement);
      assert.deepEqual(options, { childList: true, subtree: true });
      observeCount += 1;
    }
  }

  return {
    environment: {
      document,
      MutationObserver: FakeMutationObserver,
      setInterval(callback, milliseconds) {
        intervalCallback = callback;
        intervalMs = milliseconds;
        return 1;
      },
    },
    queryCount: () => queryCount,
    intervalCallback: () => intervalCallback,
    intervalMs: () => intervalMs,
    observerCallback: () => observerCallback,
    observeCount: () => observeCount,
  };
}

test('attaches to the initial video and unmutes it', () => {
  const video = createVideo(true, 0.42);
  const fixture = createEnvironment(video);
  const controller = createController(fixture.environment);

  controller.start();

  assert.equal(video.muted, false);
  assert.equal(video.volume, 0.42);
  assert.equal(video.listenerCount('volumechange'), 1);
  assert.equal(video.listenerCount('loadedmetadata'), 1);
  assert.equal(video.listenerCount('play'), 1);
  assert.equal(video.listenerCount('playing'), 1);
});

test('does not duplicate listeners, observer, or timer', () => {
  const video = createVideo();
  const fixture = createEnvironment(video);
  const controller = createController(fixture.environment);

  controller.start();
  controller.start();

  assert.equal(video.listenerCount('volumechange'), 1);
  assert.equal(fixture.observeCount(), 1);
  assert.equal(fixture.queryCount(), 1);
});

test('corrects mute immediately when a media event fires', () => {
  const video = createVideo();
  const fixture = createEnvironment(video);
  createController(fixture.environment).start();

  video.muted = true;
  video.emit('volumechange');

  assert.equal(video.muted, false);
});

test('checks one cached video every 500 ms without rescanning the document', () => {
  const video = createVideo();
  const fixture = createEnvironment(video);
  createController(fixture.environment).start();

  video.muted = true;
  fixture.intervalCallback()();

  assert.equal(fixture.intervalMs(), 500);
  assert.equal(video.muted, false);
  assert.equal(fixture.queryCount(), 1);
});

test('handles a missing video without throwing', () => {
  const fixture = createEnvironment(null);
  const controller = createController(fixture.environment);

  assert.doesNotThrow(() => controller.start());
  assert.equal(controller.check(), false);
  assert.equal(fixture.observeCount(), 1);
});

test('attaches to a replacement video added by YouTube', () => {
  const first = createVideo();
  const replacement = createVideo(true, 0.71);
  const fixture = createEnvironment(first);
  const controller = createController(fixture.environment);
  controller.start();

  fixture.observerCallback()([{ addedNodes: [replacement] }]);

  assert.equal(replacement.muted, false);
  assert.equal(replacement.volume, 0.71);
  replacement.muted = true;
  assert.equal(controller.check(), true);
  assert.equal(replacement.muted, false);
  assert.equal(fixture.queryCount(), 1);
});
