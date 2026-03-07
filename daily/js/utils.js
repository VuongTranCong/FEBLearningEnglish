/**
 * Helpers for display names and asset URLs.
 */
function cleanName(path) {
  if (!path) return '';
  let name = path.split('/').pop();
  name = name.replace(/\.(mp4|mp3|pdf|mkv)$/i, '');
  name = name.replace(/_/g, "'");
  name = name.replace(/- ?DA CO.*$/i, '');
  name = name.replace(/-da co.*$/i, '');
  name = name.replace(/-/g, ' ');
  name = name.replace(/\s+/g, ' ').trim();
  return name;
}

function fullUrl(basePath, relativePath) {
  if (!relativePath) return '';
  const path = basePath + '/' + relativePath;
  // Encode # as %23 so filenames like "Learn Verbs #1.mp4" load correctly
  return encodeURI(path).replace(/#/g, '%23');
}

/** Use for video, audio, and PDFs: returns Google Drive link if in DRIVE_FILE_IDS, else fullUrl. All use /preview so they open in-browser (iframe); raw export=download often fails in video/audio tags due to CORS. */
function getMediaUrl(basePath, relativePath) {
  if (!relativePath) return '';
  if (typeof CONFIG !== 'undefined' && CONFIG.useGoogleDrive && typeof DRIVE_FILE_IDS !== 'undefined' && DRIVE_FILE_IDS[relativePath]) {
    var id = DRIVE_FILE_IDS[relativePath];
    return 'https://drive.google.com/file/d/' + id + '/preview';
  }
  return fullUrl(basePath, relativePath);
}

/** True if URL is a Google Drive preview (use iframe instead of video/audio for these). */
function isDrivePreviewUrl(url) {
  return url && url.indexOf('drive.google.com/file/d/') !== -1 && url.indexOf('/preview') !== -1;
}
