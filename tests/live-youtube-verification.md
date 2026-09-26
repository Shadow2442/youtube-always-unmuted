# Live YouTube Verification

Date: 2026-09-26 (Europe/Zurich)

## Environment

- Brave executable version: `154.1.96.59`
- Extension: `YouTube Always Unmuted 0.1.0`
- Extension ID: `bfcalfkljfpljbdokkiphpnmiapojcpf`
- Installation: unpacked extension in Brave Developer mode
- Installed source size: 6 files, 9,692 bytes

## Installation evidence

The Brave extensions page showed the extension card enabled. The card exposed no error control and no Service Worker/background-page inspection entry. Other installed extensions displayed Service Worker entries on the same page, confirming that the absence was distinguishable in the UI.

## Live behavior

Test page: `https://www.youtube.com/watch?v=jNQXAC9IVRw`

1. Current-player test: set the live HTML video's `muted` property to `true`, then measured with `performance.now()` until it returned to `false`.
   - Recovery: **1 ms**
   - Starting volume: `1`
   - Ending volume: `1`
   - Volume preserved: `true`
2. Replacement-video test: replaced the live video node with a cloned video, set the replacement volume to `0.63`, muted it, and measured until the extension corrected it.
   - Recovery: **7 ms**
   - Ending volume: `0.63`
   - Volume preserved: `true`

Both results are below the required 1,000 ms limit. The YouTube page was reloaded after the replacement test.

After the final early-startup fix, the unpacked extension was reloaded from its Brave extension card and the current-player test was repeated. The reloaded installed build recovered in **113 ms** with volume `1` preserved, confirming that Brave was running the reviewed source.

## Resource and error checks

- The manifest declares no `background`, `permissions`, or `host_permissions` key.
- The extension card reports no error and provides no background/Service Worker entry.
- A complete JavaScript-source scan found no `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, extension storage, tab, or runtime API call.
- The controller uses DOM/media events and one cached `muted` read every 500 ms; it does not repeat a document query on the timer.
- The live replacement test exercised MutationObserver attachment to a newly inserted video.

YouTube itself continues to make its normal site and media requests. No network-capable code path exists in this extension.
