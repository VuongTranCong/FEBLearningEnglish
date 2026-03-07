/**
 * Base paths and labels for each month (relative to FEB folder).
 */
const CONFIG = {
  basePath: '..',
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
