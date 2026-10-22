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
- `index.html` app shell, `manifest.webmanifest`, `sw.js` (offline caching)
- `js/scoring-engine.js` Income Mobility Score: 70% Work + 15% Money + 15% Business, rule-based and transparent
- `js/screens.js` all 8 screens; `js/app.js` routing and actions; `js/i18n.js` English, isiZulu, Sepedi, Xitsonga, Setswana
- `data/` sample opportunities and mentors (fictional)

## Demo tip
On the first screen tap "Try the demo as Sarah" to land straight on the dashboard.

## Honest limitations
- Data is stored only on the device (localStorage). There is no server, login or real verification.
- Translations in non-English languages are drafts. Have native speakers review them before judging.
- Experience Builder uses keyword rules, not a real AI model.
- If you change any file, bump `CACHE` in `sw.js` so phones pick up the update.
