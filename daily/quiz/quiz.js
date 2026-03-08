/**
 * Quiz: load the day's flashcard PDF(s), one page = one card; show pages in random order.
 * Depends: pdfjsLib (PDF.js), DAILY_PLAN, getBaseForMonth, getPdfDownloadUrl.
 */
(function () {
  var currentDayIndex = 0;
  var cards = [];
  var loading = false;
  var renderId = 0;
  var savedScrollY = null;

  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
  }

  function getPdfUrlsForDay(dayIndex) {
    if (typeof DAILY_PLAN === 'undefined' || !DAILY_PLAN[dayIndex]) return [];
    var day = DAILY_PLAN[dayIndex];
    var basePath = typeof getBaseForMonth === 'function' ? getBaseForMonth(day.monthId) : '';
    var list = (day.flashcards || []).filter(function (p) { return p && /\.pdf$/i.test(p); });
    if (typeof getPdfDownloadUrl !== 'function') return [];
    return list.map(function (path) { return getPdfDownloadUrl(basePath, path); }).filter(Boolean);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function setState(wrap, state, msg) {
    var mainEl = wrap.querySelector('.quiz-main');
    var cardEl = wrap.querySelector('.quiz-card-inner');
    var loadingEl = wrap.querySelector('.quiz-loading');
    var errorEl = wrap.querySelector('.quiz-error');
    var hintEl = wrap.querySelector('.quiz-hint');
    var nextBtn = document.getElementById('quiz-btn-next');
    var shuffleBtn = document.getElementById('quiz-btn-shuffle');
    if (loadingEl) loadingEl.style.display = state === 'loading' ? 'block' : 'none';
    if (errorEl) { errorEl.style.display = state === 'error' ? 'block' : 'none'; if (state === 'error') errorEl.textContent = msg || ''; }
    if (mainEl) mainEl.style.display = (state === 'card' && cards.length > 0) ? 'flex' : 'none';
    if (cardEl) cardEl.style.display = state === 'card' ? 'block' : 'none';
    if (hintEl) hintEl.style.display = (state === 'card' && cards.length > 0) ? 'block' : 'none';
    if (nextBtn) nextBtn.style.display = state === 'card' && cards.length > 0 ? 'inline-block' : 'none';
    if (shuffleBtn) shuffleBtn.style.display = state === 'card' && cards.length > 0 ? 'inline-block' : 'none';
  }

  function renderPage(wrap, card, onDone) {
    if (!card || !wrap) return;
    var container = wrap.querySelector('.quiz-card-canvas-wrap');
    if (!container) return;
    var thisRenderId = ++renderId;
    container.innerHTML = '';
    var viewport = card.viewport;
    var canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    var ctx = canvas.getContext('2d');
    card.page.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise.then(function () {
      if (thisRenderId !== renderId) return;
      var scrollY = savedScrollY !== null ? savedScrollY : window.scrollY;
      savedScrollY = null;
      container.innerHTML = '';
      container.appendChild(canvas);
      requestAnimationFrame(function () {
        window.scrollTo(0, scrollY);
        requestAnimationFrame(function () {
          window.scrollTo(0, scrollY);
          if (typeof onDone === 'function') onDone();
        });
      });
    }).catch(function () {
      if (thisRenderId !== renderId) return;
      if (typeof onDone === 'function') onDone();
    });
  }

  function showCard(isInitial) {
    var wrap = document.getElementById('quiz-wrap');
    if (!wrap || cards.length === 0) return;
    var idx = Math.floor(Math.random() * cards.length);
    var card = cards[idx];
    var hintEl = wrap.querySelector('.quiz-hint');
    if (hintEl) hintEl.textContent = (idx + 1) + ' / ' + cards.length;
    var onDone = isInitial ? function () { setState(wrap, 'card'); } : null;
    renderPage(wrap, card, onDone);
  }

  function loadPdfs() {
    var wrap = document.getElementById('quiz-wrap');
    if (!wrap) return;
    var urls = getPdfUrlsForDay(currentDayIndex);
    if (urls.length === 0) {
      wrap.classList.add('no-words');
      return;
    }
    wrap.classList.remove('no-words');
    setState(wrap, 'loading');
    cards = [];
    loading = true;

    var pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib || !pdfjsLib.getDocument) {
      setState(wrap, 'error', 'Thiếu thư viện PDF.');
      loading = false;
      return;
    }

    var scale = 1.8;
    var promises = urls.map(function (url) {
      return pdfjsLib.getDocument({ url: url }).promise
        .then(function (pdf) {
          var numPages = pdf.numPages;
          var pagePromises = [];
          for (var p = 1; p <= numPages; p++) {
            pagePromises.push(
              pdf.getPage(p).then(function (page) {
                var viewport = page.getViewport({ scale: scale });
                return { page: page, viewport: viewport };
              })
            );
          }
          return Promise.all(pagePromises);
        })
        .catch(function (err) {
          console.warn('Quiz: could not load PDF', url, err);
          return [];
        });
    });

    Promise.all(promises).then(function (pageArrays) {
      loading = false;
      var all = [];
      pageArrays.forEach(function (arr) { arr.forEach(function (c) { all.push(c); }); });
      if (all.length === 0) {
        setState(wrap, 'error', 'Không tải được thẻ từ. Thử mở PDF trực tiếp hoặc kiểm tra kết nối.');
        return;
      }
      cards = shuffle(all);
      showCard(true);
    });
  }

  function nextCard(ev) {
    if (cards.length === 0) return;
    savedScrollY = window.scrollY;
    if (ev && ev.target) ev.target.blur();
    requestAnimationFrame(function () { window.scrollTo(0, savedScrollY); });
    showCard(false);
  }

  function reshuffle(ev) {
    if (cards.length === 0) return;
    savedScrollY = window.scrollY;
    if (ev && ev.target) ev.target.blur();
    requestAnimationFrame(function () { window.scrollTo(0, savedScrollY); });
    showCard(false);
  }

  function buildMarkup() {
    var wrap = document.getElementById('quiz-wrap');
    if (!wrap) return;
    wrap.innerHTML = [
      '<h3 class="section-title">📖 Đọc thẻ từ (Quiz)</h3>',
      '<p class="section-guide section-guide-quiz">👨‍👩‍👧 Bấm &quot;Thẻ tiếp theo&quot; để xem từng thẻ ngẫu nhiên, khuyến khích bé đọc to từ trên thẻ. Dùng &quot;Xáo trộn lại&quot; để đổi thứ tự.</p>',
      '<p class="quiz-hint" aria-live="polite" style="display:none;"></p>',
      '<div class="quiz-loading" style="display:none;">Đang tải thẻ từ…</div>',
      '<p class="quiz-error" style="display:none;"></p>',
      '<div class="quiz-main" style="display:none;">',
      '  <div class="quiz-card">',
      '    <div class="quiz-card-inner" style="display:none;">',
      '      <div class="quiz-card-canvas-wrap"></div>',
      '    </div>',
      '  </div>',
      '  <div class="quiz-actions">',
      '    <button type="button" class="quiz-btn quiz-btn-next" id="quiz-btn-next" style="display:none;">Thẻ tiếp theo</button>',
      '    <button type="button" class="quiz-btn quiz-btn-shuffle" id="quiz-btn-shuffle" style="display:none;">Xáo trộn lại</button>',
      '  </div>',
      '</div>'
    ].join('');
    document.getElementById('quiz-btn-next').addEventListener('click', function (e) { nextCard(e); });
    document.getElementById('quiz-btn-shuffle').addEventListener('click', function (e) { reshuffle(e); });
  }

  function updateDay(dayIndex) {
    currentDayIndex = dayIndex;
    cards = [];
    position = 0;
    loadPdfs();
  }

  function init() {
    buildMarkup();
    loadPdfs();
  }

  window.Quiz = { updateDay: updateDay };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
