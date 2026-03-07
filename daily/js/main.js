(function () {
  let currentDayIndex = 0;

  function buildDayOptions() {
    const select = document.getElementById('day-select');
    if (!select) return;
    select.innerHTML = '';
  DAILY_PLAN.forEach((day, i) => {
    const monthName = CONFIG.months.find(m => m.id === day.monthId).name;
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = 'Ngày ' + (i + 1) + ' – ' + monthName + ' · ' + day.title;
    select.appendChild(opt);
  });
  }

  function onDayChange() {
    const select = document.getElementById('day-select');
    currentDayIndex = parseInt(select.value, 10);
    renderDay(currentDayIndex);
  }

  function init() {
    buildDayOptions();
    document.getElementById('day-select').value = '0';
    currentDayIndex = 0;
    renderDay(0);
    document.getElementById('day-select').addEventListener('change', onDayChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
