# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## What this is

Photography portfolio for Jan Svaty, deployed to **https://photo.jansvaty.com**. Static
HTML/CSS/JS, no framework, no build step — same philosophy as the `jansvaty-portfolio`
(jansvaty.com) repo.

## Local development

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Architecture

- **`index.html`** — the entire site. It's a single-page app: a fixed glass sidebar (logo,
  series nav, About/Contact, footer) next to either a horizontal photo filmstrip or a text
  view (About/Contact), switched by JS based on `location.hash` (`#`, `#portraits`, `#ocean`,
  `#street`, `#about`, `#contact`).
- **`assets/style.css`** — all styling. CSS variables in `:root` / `[data-theme="dark"]` drive
  the light/dark theme.
- **`assets/app.js`** — owns the photo data (`FRAMES`, with title + series per photo), routing,
  the floating-sidebar-on-scroll effect, theme toggle (persisted to `localStorage`), and the
  click-to-zoom lightbox.
- **`assets/photos/pN.jpg`** — web-optimized (1800px long edge) photos, used on viewports
  above 720px. Add a new photo by dropping the file here, generating its mobile companion (see
  below), and adding an entry to `FRAMES` in `assets/app.js`.
- **`assets/photos-mobile/pN.jpg`** — the same photos re-encoded at 900px long edge / quality 60
  for viewports ≤720px (`assets/app.js` picks between the two via `matchMedia`, re-rendering the
  gallery on breakpoint changes so orientation flips pick up the right source). Regenerate with:
  `sips -Z 900 --setProperty formatOptions 60 assets/photos/pN.jpg --out assets/photos-mobile/pN.jpg`.
- **Mobile nav**: below 720px the sidebar becomes a slide-out drawer (`.sidebar.mobile-open`,
  triggered by `.menu-toggle`, dimmed by `.sidebar-scrim`) instead of a fixed column, so the
  gallery keeps the full viewport height. Don't reintroduce a wrapper `<div>` (or `<picture>`)
  around `.frame img` — nesting anything between `.frame` and its `img` breaks the flex
  shrink-to-fit sizing that gives each photo its natural aspect-ratio width in the strip
  (confirmed twice: silently stretches every frame to fill the row). Position overlays via
  `.frame { position: relative }` + `position: absolute` on the overlay instead.
- **CSS/JS versioning**: `index.html` references `style.css` and `app.js` with a `?v=N` query
  string for cache busting — bump it when editing either file.

## Deployment

Pushing to `main` triggers `.github/workflows/pages.yml`, which copies `*.html`, `CNAME`,
`.nojekyll`, and `assets/` into `dist/` and deploys to GitHub Pages at photo.jansvaty.com.

## Workflow note

After every edit, commit and push to `main` so the live site stays in sync — same convention
as the `jansvaty-portfolio` repo.