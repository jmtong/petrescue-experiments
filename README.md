# PetRescue Experiments

A series of interactive editorial data visualisations. Static frontend only — no backend, database, or auth.

## Develop

```sh
npm install
npm run dev
```

## Add an experiment

1. Create `src/experiments/NN-slug/index.tsx`
2. Wrap the page in the shared `Experiment` component
3. Register it in `src/App.tsx` and `src/data/experiments.ts`

Shared UI lives in `src/components`. Shared datasets live in `src/data`.

## Deploy

Static Vite app. Vercel is configured with SPA rewrites in `vercel.json`.
