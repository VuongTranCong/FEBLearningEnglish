# Loading video/audio from Google Drive

Videos and MP3s can be served from your Google Drive folder instead of your server to save space.

## 1. Share the folder

- Create **one** folder on Google Drive and upload your media so paths match the app:
  - e.g. subfolders `Video/`, `MP3/`, `Activity/` with the same file names as in the app (e.g. `Video/1. Learn Verbs #1.mp4`, `MP3/Learn Verbs #1.mp3`).
- Paths are relative to this folder (no month-name folder needed; filenames are unique across months).
- Share the folder: **Anyone with the link** → **Viewer** (so the app can stream without login).
- Folder URL format: `https://drive.google.com/drive/folders/FOLDER_ID`  
  Your folder ID: `1gk3RgwxvMAfwibv-pL-xYCGzRs0sc6XH`

## 2. Generate the file-ID map

The app needs a mapping from path (e.g. `Video/1. Learn Verbs #1.mp4`) to Google Drive file ID. Two options:

### Option A: Automatic (recommended)

1. **Google Cloud**: Create a project → **APIs & Services** → **Enable "Google Drive API"**.
2. **Credentials** → **Create credentials** → **Service account** → Create and download JSON key.
3. Save the JSON as `scripts/credentials.json` in this project (or set env `GOOGLE_APPLICATION_CREDENTIALS` to its path).
4. **Share your Drive folder** with the service account email (e.g. `xxx@yyy.iam.gserviceaccount.com`) as **Viewer**.
5. Install and run:

   ```bash
   npm install googleapis
   node scripts/list-drive-folder.js
   ```

   This overwrites `daily/js/drive-map.js` with path → file ID for all `.mp4` and `.mp3` files in that folder.

### Option B: Manual

1. Open `daily/js/drive-map.js`.
2. For each file: open it in Drive → **Share** → **Copy link**. The ID is the part between `/d/` and `/view` (e.g. `1abc...xyz`).
3. Add an entry: `"Video/1. Learn Verbs #1.mp4": "1abc...xyz",`

Path keys must match exactly what the app uses (e.g. `Video/...`, `MP3/...`, `Activity/...`).

## 3. Turn Drive on/off

In `daily/js/config.js`:

- `useGoogleDrive: true` → video/audio load from Drive (when the path exists in `DRIVE_FILE_IDS`).
- `useGoogleDrive: false` → video/audio load from your server (current `basePath`).

PDFs and flashcards still use your server unless you add a similar map for them later.
