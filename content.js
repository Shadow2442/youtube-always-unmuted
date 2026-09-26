'use strict';

(() => {
  const namespace = globalThis.YouTubeAlwaysUnmuted;
  const mediaEvents = ['volumechange', 'loadedmetadata', 'play', 'playing'];

  namespace.createController = (environment) => {
    const documentRef = environment.document;
    const Observer = environment.MutationObserver;
    const scheduleInterval = environment.setInterval;
    const attachedVideos = new WeakSet();
    let currentVideo = null;
    let started = false;

    const attach = (video) => {
      if (!video || typeof video.addEventListener !== 'function') {
        return false;
      }

      currentVideo = video;
      namespace.ensureUnmuted(video);

      if (!attachedVideos.has(video)) {
        const correctMute = () => namespace.ensureUnmuted(video);
        for (const eventName of mediaEvents) {
          video.addEventListener(eventName, correctMute, { passive: true });
        }
        attachedVideos.add(video);
      }

      return true;
    };

    const inspectAddedNode = (node) => {
      if (!node) {
        return;
      }
      if (typeof node.matches === 'function' && node.matches('video')) {
        attach(node);
      }
      if (typeof node.querySelectorAll === 'function') {
        for (const video of node.querySelectorAll('video')) {
          attach(video);
        }
      }
    };

    const check = () => (
      currentVideo ? namespace.ensureUnmuted(currentVideo) : false
    );

    const start = () => {
      if (started) {
        return;
      }
      started = true;

      attach(documentRef.querySelector('video'));

      const observer = new Observer((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes ?? []) {
            inspectAddedNode(node);
          }
        }
      });
      observer.observe(documentRef.documentElement, {
        childList: true,
        subtree: true,
      });

      scheduleInterval(check, 500);
    };

    return { start, check };
  };

  if (
    typeof document !== 'undefined'
    && typeof MutationObserver !== 'undefined'
    && typeof setInterval === 'function'
  ) {
    namespace.createController({
      document,
      MutationObserver,
      setInterval: globalThis.setInterval.bind(globalThis),
    }).start();
  }
})();
