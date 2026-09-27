# Fit Log — Workout Library & Planner

Fit Log is a personal gym companion: browse a library of twelve lifts fetched
live from the Fit Log API, stack up to five of them into today's plan, save
lifts for later, and watch your exercise, minute, and calorie totals update in
real time.

- **Live link:** https://lamia96588-source.github.io/PH-A-FitLog/
- **Repository:** https://github.com/lamia96588-source/PH-A-FitLog

## Features

1. **Workout Library** — all twelve API workouts in a responsive grid
   (3 columns on large screens) with muscle-group tags, equipment, and a
   duration / calories / rating stats row on every card.
2. **Search & Sort** — search by workout name or muscle group, and re-sort the
   whole list with the "Sort By" dropdown (Duration, Calories, Rating).
3. **Workout Details** — a dynamic detail page per lift with a full specs
   table (equipment, difficulty, sets, reps, duration, calories, rating) and
   step-by-step instructions.
4. **Today's Plan** — add up to five lifts for the day (the add button
   disables at the cap), mark them as done, and remove them; three metric
   cards show live exercise, minute, and calorie totals.
5. **Saved for Later** — bookmark any lift from its detail page and find it
   again on the Saved tab.
6. **Persistent & Reactive** — plan and saved lists survive page reloads via
   localStorage, the navbar Plan/Saved badges update live, and every action
   gets a toast. Includes a custom 404 page and loading skeletons.

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, server components, dynamic
  routes) with [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4 for styling
- No other runtime dependencies — toasts, icons, and plan state are custom
  builds (React Context + `localStorage`)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Production Build

```bash
npm run build
npm start
```

## Deployment

The site is statically exported (`next.config.mjs` → `output: "export"`) and
deployed to **GitHub Pages** by a GitHub Actions workflow
(`.github/workflows/deploy.yml`) on every push to `main`. Pushes set
`NEXT_PUBLIC_BASE_PATH=/PH-A-FitLog` so all assets resolve under the project
path.

## API

Data comes from the Fit Log API. The app tries the primary host first and
automatically fails over to the alternative:

1. `https://api.abcz.workers.dev/api/fitlog`
2. `https://api.api-store.workers.dev/api/fitlog`
