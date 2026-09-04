# SSLL DSP

Source for [SSLL DSP](https://ssll.gumroad.com) — Max for Live devices, tutorials,
publications and writing by Henrik Forssell.

A static site: plain HTML, one stylesheet, two small scripts. No build step, no
dependencies, no framework. Open a file and edit it.

## Structure

```
index.html          Landing page: hero and the updates feed
devices.html        Device catalogue; each card opens that device's folder
fm-radio/           One folder per published device, giving it a clean URL
morph/                (/fm-radio/) and its own share preview. Each page is a
verbet/               thin shell — content comes from assets/js/device.js
device.html         Legacy redirect: ?project=<slug> forwards to /<slug>/
tutorials.html      Video tutorials (YouTube embeds)
publications.html   Papers and conference talks
about.html          About and contact

assets/css/styles.css   All styles; palette and metrics are CSS variables at the top
assets/js/main.js       Top bar, feed filters, expandable posts
assets/js/device.js     The device table, and the rendering for a device page
assets/img/             Images, icons and share cards
assets/papers/          Publication PDFs (naming convention in its own README)
assets/_src/            Master artwork, gitignored and never published
serve.py                Local preview server
```

## Local preview

```bash
python3 serve.py          # http://localhost:8000
```

Use this rather than `python3 -m http.server`. The stdlib server sends no cache
headers, so a browser will hold on to an `.html` file and keep requesting the
old `?v=` assets named inside it — which looks exactly like an edit that did not
save. `serve.py` is the same server with caching disabled. Safari also refuses
to show favicons over `file://`, so the site needs to be served either way.

## Adding a device

1. Add an entry to `devices` in `assets/js/device.js`, keyed by slug. Only
   `name`, `type`, `summary` and `description` are required. The rest are
   optional, and each adds its own piece to the page: `heading`, `image`,
   `backdrop`, `features`, `detail`, `demo`, `videos`, `source`, `note`, and
   `buy` + `buyLabel` + `price` for a purchase link.
2. Add a card to the list in `devices.html` with `data-project="<slug>"`.
3. Copy an existing device folder, rename it to the slug, and in its
   `index.html` set `window.SSLL_PROJECT` and the title, description and
   `og:` tags.

`window.SSLL_BASE` is what lets a page sit one folder deep: `main.js` and
`device.js` prefix every in-site path with it. Root pages leave it unset.

Device screenshots should be exported at a consistent height — every Max for
Live device is the same height inside Live, and the catalogue relies on that to
show them all at one scale. `--panel-ratio-max` in `styles.css` tracks the
widest panel and needs raising if a wider device is added.

## Adding a feed entry

Copy the commented `<article class="feed-item">` block at the top of the feed in
`index.html`, set `data-cat` to one of `devices | projects | tutorials | music |
writing`, and set the date. Newest first. `data-cat` drives the filter buttons,
and a filter only belongs on the page while something is filed under it.

## Cache busting

CSS and JS are linked with a `?v=N` query. Bump it when you change those files,
or returning visitors keep the old version.

## Before going live

- The `og:` tags hard-code `https://sslldsp.com` as the site URL. `og:image`
  must be absolute, so this cannot be left relative — update it everywhere once
  the real domain is registered:

  ```bash
  grep -rl "https://sslldsp.com" *.html */index.html \
    | xargs sed -i '' 's|https://sslldsp.com|https://YOUR-DOMAIN|g'
  ```

- `assets/_src/` is gitignored and holds the only copies of the master artwork.
  Back it up somewhere outside this repo.

## Deployment

Static hosting, no build. On GitHub Pages: Settings → Pages, deploy from `main`,
root folder. With a custom domain the site serves from the domain root, so a
project repo works and relative paths resolve correctly.
