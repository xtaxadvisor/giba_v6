# _jarvis.log.md

---

## [2025-05-17] 🧩 Login Hydration Debug

**Issue**:  
Concurrent logins (50+ users simultaneously) cause session hydration issues in the frontend.

**Analysis**:  
Likely caused by the UI rendering before Supabase session has resolved in `AuthContext`.

**Recommendation**:
- Add a `Loading` gate (spinner or skeleton screen) that delays rendering until `isAuthenticated !== undefined`.
- Ensure `AuthProvider` returns `null` or `fallback UI` until session check completes.

**Next Steps**:
- Simulate 50+ logins with `k6` to confirm stability under load.
- Confirm with Supabase logs if rate limiting is triggered.

---

## [2025-05-17] 🎥 Video Library Customization

**Goal**:  
Allow Giba to add personal videos to the video library **without affecting existing functionality**.

**Implementation**:
- Created `data/myVideos.ts` to hold new video objects.
- Appended `myVideos` to `defaultVideos` in the video component.
- Supports both:
  - 🔓 YouTube/Vimeo (for marketing & visibility)
  - 🔐 Supabase Storage (for member-only access)

**Next Steps**:
- Finalize first 3 promotional videos and upload to YouTube.
- Prepare Supabase private upload workflow with signed URL generator if needed.

---

> Ongoing logic conversations between Giba & Jarvis will continue here.