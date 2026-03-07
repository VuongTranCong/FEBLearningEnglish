#!/usr/bin/env node
/**
 * Reads daily/js/data.js and extracts all video/MP3/activity video paths,
 * then writes daily/js/drive-map.js with those paths and empty IDs for manual fill.
 * Run from project root: node scripts/generate-drive-map-from-data.js
 *
 * Optional: node scripts/generate-drive-map-from-data.js 1
 *   (only month 1 = FED Tháng 1-Action Verb)
 */

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'daily', 'js', 'data.js');
const outPath = path.join(__dirname, '..', 'daily', 'js', 'drive-map.js');
const onlyMonth = process.argv[2] ? parseInt(process.argv[2], 10) : null;

const content = fs.readFileSync(dataPath, 'utf8');

// Match paths: 'Video/...mp4', 'MP3/...mp3', 'Activity/...mp4', 'Mp3 Tháng 3/...', etc.
const pathRegex = /'(Video\/[^']+\.(?:mp4|mkv|webm))'|'(MP3\/[^']+\.mp3)'|'(Mp3[^']*\/[^']+\.mp3)'|'(Activity[^']*\/[^']+\.(?:mp4|mkv|webm))'/g;
const seen = new Set();
let m;
while ((m = pathRegex.exec(content)) !== null) {
  const p = (m[1] || m[2] || m[3] || m[4]).trim();
  if (p && !p.includes('null')) seen.add(p);
}

// Also catch activity.video from pattern like video: 'Activity/...'
const activityVideoRegex = /video:\s*'([^']+\.(?:mp4|mkv|webm))'/g;
while ((m = activityVideoRegex.exec(content)) !== null) {
  if (m[1] && !m[1].includes('null')) seen.add(m[1]);
}

const sorted = [...seen].sort();

const lines = [
  '/**',
  ' * Google Drive file ID map (same paths as local folder FED Tháng 1-Action Verb, etc.).',
  ' * Fill each value with Drive file ID: open file in Drive → Share → Copy link → ID is between /d/ and /view',
  ' */',
  'window.DRIVE_FILE_IDS = {',
  ...sorted.map((p) => `  "${p.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}": "",`),
  '};',
];
fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
console.log('Wrote', outPath, 'with', sorted.length, 'paths. Fill in the empty IDs manually.');
if (onlyMonth) console.log('(Filter by month not applied; all months included. Edit script to filter.)');