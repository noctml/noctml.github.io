# Minimal Mistakes pilot

This branch keeps the existing static detail pages while introducing a Jekyll
shell for the home archive and MonST3R.

## Local preview

```bash
docker build -f Dockerfile.jekyll -t insighted-jekyll .
docker run --rm -p 4000:4000 -v "$PWD:/srv/jekyll" insighted-jekyll
```

Open `http://127.0.0.1:4000/`.

## Pilot scope

- Minimal Mistakes `4.28.0`
- Jekyll archive home using the existing `data.js` and `archive.js`
- Existing project, study, review, and summary URLs preserved
- MonST3R processed by Jekyll while retaining its KaTeX, language switch,
  section bookmark, reveal control, image lightbox, and comments

The remaining detail pages are intentionally left unchanged until the pilot is
accepted.
