# YouTube Always Unmuted

A tiny local Brave extension that clears YouTube's player-level mute state without changing the selected volume.

## Resource use and privacy

- No service worker or background page
- No network requests, telemetry, storage, or third-party code
- No browser permissions beyond injection on YouTube pages
- Event-driven checks with one cached `muted` property read every 500 ms
- No scheduled task, Windows service, startup entry, or helper server

## Install in Brave

1. Open `brave://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this `youtube-always-unmuted-extension` folder.
5. Confirm **YouTube Always Unmuted** is enabled and shows no errors.
6. Reload any YouTube tabs that were already open.

## Reload after a source change

Open `brave://extensions`, select **Reload** on the extension card, and reload the YouTube tab.

## Verify

Play a YouTube video and use YouTube's player mute control. The player should unmute again within one second while preserving its previous nonzero volume.

This extension affects only the HTML video player's mute state. It cannot override Brave's native **Mute site/tab** command, Windows audio, a keyboard mute key, autoplay blocking, or paused playback.

## Remove

Open `brave://extensions`, select **Remove** on the extension card, and confirm. Removing the local source folder afterward is optional and separate.
