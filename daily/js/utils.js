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
