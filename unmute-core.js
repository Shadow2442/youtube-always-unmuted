'use strict';

(() => {
  const namespace = globalThis.YouTubeAlwaysUnmuted ?? {};

  namespace.ensureUnmuted = (media) => {
    if (!media || typeof media.muted !== 'boolean' || !media.muted) {
      return false;
    }

    media.muted = false;
    return true;
  };

  globalThis.YouTubeAlwaysUnmuted = namespace;
})();
