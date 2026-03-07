(function () {
  var currentDayIndex = 0;

  function dayLabel(day, i, withCheck) {
    var monthName = CONFIG.months.find(function (m) { return m.id === day.monthId; }).name;
    var text = 'Ngày ' + (i + 1) + ' – ' + monthName + ' · ' + day.title;
    if (withCheck && typeof Progress !== 'undefined' && Progress.isCompleted(i)) {
      text = '✓ ' + text;
    }
    return text;
  }

  function buildDayOptions() {
    var select = document.getElementById('day-select');
    if (!select) return;
    select.innerHTML = '';
    DAILY_PLAN.forEach(function (day, i) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = dayLabel(day, i, true);
      select.appendChild(opt);
    });
  }

  function updateCurrentOptionLabel() {
    var select = document.getElementById('day-select');
    if (!select) return;
    var day = DAILY_PLAN[currentDayIndex];
    if (day) select.options[select.selectedIndex].textContent = dayLabel(day, currentDayIndex, true);
  }

  function onDayChange() {
    var select = document.getElementById('day-select');
    currentDayIndex = parseInt(select.value, 10);
    if (typeof Progress !== 'undefined') Progress.setLastDay(currentDayIndex);
    renderDay(currentDayIndex);
    updateMarkDoneButton();
  }

  function updateMarkDoneButton() {
    var btn = document.getElementById('mark-done-btn');
    if (!btn) return;
    var done = typeof Progress !== 'undefined' && Progress.isCompleted(currentDayIndex);
    btn.textContent = done ? '✓ Đã xong' : 'Đánh dấu đã xong';
    btn.classList.toggle('is-done', done);
  }

  function onMarkDone() {
    if (typeof Progress === 'undefined') return;
    Progress.markCompleted(currentDayIndex);
    updateCurrentOptionLabel();
    updateMarkDoneButton();
    var total = DAILY_PLAN.length;
    var next = Progress.getNextIncompleteDay(total);
    if (next !== currentDayIndex && next < total) {
      var select = document.getElementById('day-select');
      if (select) {
        select.value = String(next);
        currentDayIndex = next;
        Progress.setLastDay(currentDayIndex);
        renderDay(currentDayIndex);
        updateMarkDoneButton();
      }
    }
  }

  function init() {
    buildDayOptions();
    var select = document.getElementById('day-select');
    var startIndex = 0;
    if (typeof Progress !== 'undefined') {
      var last = Progress.getLastDayIndex();
      if (last >= 0 && last < DAILY_PLAN.length) startIndex = last;
    }
    select.value = String(startIndex);
    currentDayIndex = startIndex;
    if (typeof Progress !== 'undefined') Progress.setLastDay(currentDayIndex);
    renderDay(currentDayIndex);
    select.addEventListener('change', onDayChange);

    var wrap = document.querySelector('.day-picker-wrap');
    if (wrap) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'mark-done-btn';
      btn.className = 'mark-done-btn';
      btn.setAttribute('aria-label', 'Đánh dấu ngày này đã hoàn thành');
      btn.addEventListener('click', onMarkDone);
      wrap.appendChild(btn);
      updateMarkDoneButton();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
