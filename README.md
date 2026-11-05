# RisePath (PWA)

Income Mobility Platform for young South Africans. Mobile-first Progressive Web App in plain HTML, CSS and JavaScript. No build step, no dependencies.

## Run locally
Service workers need http, not file://. From this folder:

    python3 -m http.server 8000

Open http://localhost:8000 on your computer (or on your phone using your computer's IP address).

## Deploy to GitHub Pages
1. Create a repo and upload everything in this folder (index.html must be in the root).
2. Settings > Pages > Deploy from branch > main / root.
3. Open the Pages URL on your phone and choose "Add to Home Screen" / "Install".

## What is inside
- `index.html` app shell and public discovery home, `manifest.webmanifest`, `sw.js` (offline caching)
- `js/scoring-engine.js` Income Mobility Score: 70% Work + 15% Money + 15% Business, rule-based and transparent
- `js/screens.js` all 8 screens; `js/app.js` routing and actions; `js/i18n.js` core UI labels in all 11 official South African languages
- `opportunities.json` and `mentors.json` sample listings and mentor profiles (fictional)

## Demo tip
From the public home, choose "Try the demo" to open the dashboard with sample data.

## Honest limitations
- Data is stored only on the device (localStorage). There is no server, login or real verification.
- Non-English translations are drafts, and some screen copy still falls back to English. Have native speakers review translations before launch.
- Experience Builder uses keyword rules, not a real AI model.
- If you change any file, bump `CACHE` in `sw.js` so phones pick up the update.
