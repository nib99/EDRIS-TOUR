# Idris Tour & Travel — Frontend

Premium Tour & Travel platform frontend with cinematic hero (background video + poster).

## Highlights

- **Full-viewport cinematic hero** with looping background video (`hero.mp4`), poster fallback, multi-layer gradients for readability, and elegant typography.
- **Official poster section** with refined framing and CTA.
- **Journeys** — interactive package cards with traveler count and live indicative total.
- **Services** — six clear capability cards.
- **Enquire desk** — client-side request form (localStorage).
- **Sticky transparent header** that solidifies on scroll.
- Dark navy + gold luxury palette, Cormorant Garamond + Outfit.

## Key files

```
src/
  components/site/
    showcase.tsx   ← Hero video + poster
    header.tsx
    journeys.tsx
    services.tsx
    enquire.tsx
    footer.tsx
  data/catalog.ts
  routes/index.tsx
  styles.css
public/
  hero.mp4
  hero-poster.jpg
  favicon.svg
  og.jpg
```

## Brand colors

| Token       | Hex     |
|-------------|---------|
| ink         | #071428 |
| navy        | #0e2344 |
| gold        | #e2b340 |
| cream       | #f6f0df |
| muted       | #b7b09e |

Drop these files into your existing TanStack Start / Vite React project (or the original workspace) and run the app.
