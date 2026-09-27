# Changelog

All notable changes to this project are documented here.

## [1.0.0] - 2026-09-27

### Added

- Immediate unmuting through YouTube media events.
- A lightweight 500 ms safety check against the cached active video element.
- Support for YouTube replacing the video element during navigation.
- Safe startup at `document_start`, including before `documentElement` exists.
- Brave and Chromium installation documentation.
- Automated controller, release-surface, and core behavior tests.

### Privacy and resource use

- No telemetry, storage, background page, service worker, or third-party code.
- No network requests made by the extension.
- No permissions beyond running the content script on YouTube pages.
