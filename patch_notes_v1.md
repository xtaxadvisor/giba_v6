# patch_notes_v1.md

### 🔧 Version 1.0.1 - [2025-05-17]
- [Added] Support for custom video injection via `data/myVideos.ts` and integration with `VideoLibrary.tsx`.
- [Fixed] Login hydration issue by delaying route rendering in `App.tsx` until session is resolved.
- [Updated] `AuthProvider.tsx` to ensure session check completes before rendering children.

### 📌 Coming in 1.0.2
- [Planned] Load testing script using `k6` to simulate 50 concurrent logins.
- [Planned] Patch to fix client dashboard consultation calendar timezone issue.
- [Planned] Improvements to `_ProtectedRoute.tsx` to enhance session-based redirects and loading guards.