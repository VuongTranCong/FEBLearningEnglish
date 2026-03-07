# Learn English – Kế hoạch mỗi ngày

## Run locally

```bash
npx --yes serve .
```

Then open **http://localhost:3000** (main) or **http://localhost:3000/daily/** (daily plan).

## Where files load from

**Videos, MP3s, and PDFs** (flashcards, activity sheets, games) all load from **Google Drive** when listed in `daily/js/drive-map.js`. See `scripts/README-drive.md` for setup. Run `node scripts/list-drive-folder.js` to refresh the map from your Drive folder (includes .mp4, .mp3, .pdf).

If a file is not in the map (or has no Drive ID), the app falls back to local paths—so you can still put content folders in the project root if you prefer.
