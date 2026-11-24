# Riah Visuals

Portfolio website for Seraiah (Riah Visuals), photographer and videographer.
React + Vite, hosted on Vercel.

## Run it locally

```bash
npm install
npm run dev
```

Opens at http://127.0.0.1:5195.

## Change the content

All text, films, photos, services and contact details live in `src/content.js`.
Media lives in `public/media/riah/`. Each photo has three sizes:
`pNN-s.jpg` (640 wide), `pNN-m.jpg` (1100 wide) and `pNN.jpg` (1650 wide).
Reels have a full video (`reelN.mp4`), a short silent loop (`reelN-loop.mp4`) and a poster (`reelN.jpg`).

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/portfolio` | Films and photographs (`?k=fashion` filters photos) |
| `/services` | Services, steps and questions |
| `/about` | About Seraiah |
| `/book` | Booking form (`?kind=portraits` pre-selects a shoot) |

## Deploying

Vercel builds with `npm run build` and serves `dist/`. `vercel.json` sends every page route to the app,
redirects the old `.html` addresses to the new routes, and caches media for a year.
Vercel Web Analytics and Speed Insights are included; switch them on in the project's Vercel dashboard.
