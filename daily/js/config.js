/**
 * Base paths and labels for each month (relative to FEB folder).
 * Set useGoogleDrive: true to load video/audio from Google Drive (see drive-map.js).
 */
const CONFIG = {
  basePath: '..',
  useGoogleDrive: true,
  /** Google Drive folder (optional; used by scripts to list files): https://drive.google.com/drive/folders/1gk3RgwxvMAfwibv-pL-xYCGzRs0sc6XH */
  googleDriveFolderId: '1gk3RgwxvMAfwibv-pL-xYCGzRs0sc6XH',
  months: [
    { id: 1, name: 'Động từ hành động', base: 'FED Tháng 1-Action Verb' },
    { id: 2, name: 'Động vật', base: 'FED Tháng 2-Animals' },
    { id: 3, name: 'Đồ vật trong nhà', base: 'Tháng 3-Around the house' }
  ]
};

function getBaseForMonth(monthId) {
  const m = CONFIG.months.find(x => x.id === monthId);
  return m ? CONFIG.basePath + '/' + m.base : '';
}
