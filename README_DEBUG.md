


# README_DEBUG.md

## 🔥 Critical Debugging Points

### 🔐 Auth & Session
- Entry: `contexts/AuthContext.tsx`
- Fix: Login hydration issues often solved by deferring UI until `isAuthenticated !== undefined`
- Use console log: `console.log({ session })` after `onAuthStateChange`

### 📹 Video Library
- File: `components/VideoLibrary.tsx`
- Custom Videos: Add to `data/myVideos.ts`
- Combine with existing via `[...defaultVideos, ...myVideos]`

### 📦 Deployment
- Netlify auto-builds from `main` branch
- Supabase functions in `/functions/` folder
- Check CORS errors in browser console

## 🧠 Project Tools
- Supabase Auth, Storage, Functions
- Netlify for frontend deployment
- Vite + React for SPA
- Chakra UI for layout

---

Use `_jarvis.log.md` for AI recommendations, this file for your debugging headstart.