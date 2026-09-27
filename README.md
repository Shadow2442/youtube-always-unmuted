# YouTube Always Unmuted

**Current release: v1.0.0**

A tiny Manifest V3 extension for Brave and other Chromium browsers that clears YouTube's player-level mute state without changing the selected volume.

- [Project website](https://shadow2442.github.io/youtube-always-unmuted/)
- [Download the latest release](https://github.com/Shadow2442/youtube-always-unmuted/releases/latest)
- [Source code](https://github.com/Shadow2442/youtube-always-unmuted)
- [Report a problem](https://github.com/Shadow2442/youtube-always-unmuted/issues)

## Resource use and privacy

- No service worker or background page
- No network requests, telemetry, storage, or third-party code
- No browser permissions beyond injection on YouTube pages
- Event-driven checks with one cached `muted` property read every 500 ms
- No scheduled task, Windows service, startup entry, or helper server

## Install in Brave

1. Download and extract `youtube-always-unmuted-v1.0.0.zip` from the [latest release](https://github.com/Shadow2442/youtube-always-unmuted/releases/latest).
2. Open `brave://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the extracted extension folder containing `manifest.json`.
6. Confirm **YouTube Always Unmuted** is enabled and shows no errors.
7. Reload any YouTube tabs that were already open.

Chrome installation is the same, starting from `chrome://extensions`.

## What it does

The extension watches YouTube's active HTML video element. When YouTube marks that element as muted, it changes only the element's `muted` property back to `false`. Your selected volume level is preserved.

It uses media events and a single cached-video safety check every 500 ms. It does not repeatedly scan the page.

## Install from source

1. Clone or download this repository.
2. Open `brave://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the repository folder.
6. Confirm **YouTube Always Unmuted** is enabled and shows no errors.
7. Reload any YouTube tabs that were already open.

## Reload after a source change

Open `brave://extensions`, select **Reload** on the extension card, and reload the YouTube tab.

## Verify

Play a YouTube video and use YouTube's player mute control. The player should unmute again within one second while preserving its previous nonzero volume.

This extension affects only the HTML video player's mute state. It cannot override Brave's native **Mute site/tab** command, Windows audio, a keyboard mute key, autoplay blocking, or paused playback.

## Development

Run the complete test suite with:

```powershell
node --test tests\*.test.js
```

See [CHANGELOG.md](CHANGELOG.md) for release history.

## Remove

Open `brave://extensions`, select **Remove** on the extension card, and confirm. Removing the local source folder afterward is optional and separate.
