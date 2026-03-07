# Learn English – Kế hoạch mỗi ngày

## Run locally

```bash
npx --yes serve .
```

Then open **http://localhost:3000** (main) or **http://localhost:3000/daily/** (daily plan).

## Where files load from

**Videos, MP3s, and PDFs** (flashcards, activity sheets, games) all load from **Google Drive** when listed in `daily/js/drive-map.js`. See `scripts/README-drive.md` for setup. Run `node scripts/list-drive-folder.js` to refresh the map from your Drive folder (includes .mp4, .mp3, .pdf).

If a file is not in the map (or has no Drive ID), the app falls back to local paths—so you can still put content folders in the project root if you prefer.

## Login (optional)

Edit **`daily/js/auth-config.js`**:

- **Disable login** (allow everyone): set `enabled: false`.
- **Change password**: set `users: [{ username: 'youruser', password: 'yourpass' }]`.

Default is one user `admin` / `changeme`. Login is session-based (logout or close tab to sign out). This is client-side only—for light access control, not strong security.
