/**
 * Learning progress stored in localStorage (per device).
 * Tracks last viewed day and which days are marked complete.
 */
(function () {
  var STORAGE_KEY = 'learnenglish_progress';

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { lastDayIndex: 0, completedDays: [] };
      var data = JSON.parse(raw);
      return {
        lastDayIndex: typeof data.lastDayIndex === 'number' ? data.lastDayIndex : 0,
        completedDays: Array.isArray(data.completedDays) ? data.completedDays : []
      };
    } catch (e) {
      return { lastDayIndex: 0, completedDays: [] };
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  window.Progress = {
    get: load,

    getLastDayIndex: function () {
      return load().lastDayIndex;
    },

    setLastDay: function (dayIndex) {
      var data = load();
      data.lastDayIndex = dayIndex;
      save(data);
    },

    isCompleted: function (dayIndex) {
      return load().completedDays.indexOf(dayIndex) !== -1;
    },

    markCompleted: function (dayIndex) {
      var data = load();
      if (data.completedDays.indexOf(dayIndex) === -1) {
        data.completedDays.push(dayIndex);
        data.completedDays.sort(function (a, b) { return a - b; });
        save(data);
      }
    },

    unmarkCompleted: function (dayIndex) {
      var data = load();
      var i = data.completedDays.indexOf(dayIndex);
      if (i !== -1) {
        data.completedDays.splice(i, 1);
        save(data);
      }
    },

    getCompletedCount: function () {
      return load().completedDays.length;
    },

    getNextIncompleteDay: function (totalDays) {
      var data = load();
      for (var i = 0; i < totalDays; i++) {
        if (data.completedDays.indexOf(i) === -1) return i;
      }
      return 0;
    }
  };
})();
