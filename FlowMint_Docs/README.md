# Docs folder

- **index.html** — Minimal landing page for **Google and Chrome Web Store** discovery.
- **user-guide.html** — Full **user guide** for the extension (record, assertions, data-driven, export, suites, playback, settings). Deploy alongside the landing page for user documentation.
- **privacy.html** — **Privacy policy** page (same modern layout as user guide). Link from your store listing or footer (e.g. `privacy.html` or `/privacy.html` when deployed).

## How to host on GitHub

See **[HOSTING.md](HOSTING.md)** for step-by-step instructions: push repo to GitHub, enable Pages from `/docs`, get your URL, and update links.

## Enable GitHub Pages (quick)

1. In your repo: **Settings** → **Pages**.
2. **Source:** Deploy from a branch.
3. **Branch:** main (or your default) → **/docs** → Save.
4. Your site will be at `https://<username>.github.io/<repo-name>/`.

## Before publishing

- In `index.html`, replace placeholder URLs:
  - `og:url` and `canonical` — your GitHub Pages URL.
  - `og:image` — full URL to your icon (e.g. raw GitHub URL to `public/icons/icon128.png`).
  - "Chrome Web Store" link — your extension store URL once published.
  - "GitHub" link — your actual repo URL if different from `FlowMint/Record_Project`.

## Why this helps SEO

- **Meta title & description** — What shows in Google results.
- **Meta keywords** — Terms people search for (record browser tests, export Playwright, etc.).
- **Open Graph** — Better previews when the link is shared (Twitter, LinkedIn).
- **Canonical URL** — Tells search engines the main URL for this page.
- **Structured content** — H1 and bullets with key phrases so the page ranks for those searches.
