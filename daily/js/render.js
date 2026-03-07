/**
 * Renders the current day's content into the page.
 */
function renderDay(dayIndex) {
  const day = DAILY_PLAN[dayIndex];
  if (!day) return;

  const basePath = getBaseForMonth(day.monthId);
  const monthLabel = CONFIG.months.find(m => m.id === day.monthId).name;

  document.getElementById('day-title').textContent = day.title;
  document.getElementById('day-badge').textContent = monthLabel + ' · Ngày ' + day.dayInMonth;
  document.getElementById('parent-guide-text').textContent = getParentGuide(day.monthId, day.dayInMonth);
  document.getElementById('kid-guide-text').textContent = getKidGuide(day.monthId, day.dayInMonth);

  const videosEl = document.getElementById('day-videos');
  const songsEl = document.getElementById('day-songs');
  const flashcardsEl = document.getElementById('day-flashcards');
  const activityEl = document.getElementById('day-activity');
  const gamesEl = document.getElementById('day-games');

  videosEl.innerHTML = '';
  if (day.videos && day.videos.length) {
    day.videos.forEach(v => {
      const src = fullUrl(basePath, v);
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<video controls preload="metadata" src="${src}"></video><div class="card-body"><h3>${cleanName(v)}</h3></div>`;
      videosEl.appendChild(card);
    });
  } else {
    videosEl.innerHTML = '<p class="empty-msg">Hôm nay không có video. Thử làm hoạt động hoặc xem thẻ từ!</p>';
  }

  songsEl.innerHTML = '';
  if (day.songs && day.songs.length) {
    day.songs.forEach(s => {
      const src = fullUrl(basePath, s);
      const div = document.createElement('div');
      div.className = 'audio-card';
      div.innerHTML = `<div class="audio-icon">&#9835;</div><div class="audio-info"><h3>${cleanName(s)}</h3><audio controls preload="none" src="${src}"></audio></div>`;
      songsEl.appendChild(div);
    });
  } else {
    songsEl.innerHTML = '<p class="empty-msg">Hôm nay không có bài hát.</p>';
  }

  flashcardsEl.innerHTML = '';
  if (day.flashcards && day.flashcards.length) {
    day.flashcards.forEach(f => {
      const href = fullUrl(basePath, f);
      const card = document.createElement('div');
      card.className = 'flashcard-viewer';
      card.innerHTML = `
        <div class="flashcard-viewer-header">
          <span class="flashcard-viewer-title">${cleanName(f)}</span>
          <a href="${href}" target="_blank" class="flashcard-open-link" title="Mở trong tab mới">↗</a>
        </div>
        <iframe src="${href}" class="flashcard-iframe" title="${cleanName(f)}"></iframe>
      `;
      flashcardsEl.appendChild(card);
    });
  } else {
    flashcardsEl.innerHTML = '<p class="empty-msg">Hôm nay không có thẻ từ.</p>';
  }

  if (day.activity) {
    activityEl.style.display = 'block';
    const nameEl = activityEl.querySelector('.activity-name');
    if (nameEl) nameEl.textContent = day.activity.name;
    const pdfLink = activityEl.querySelector('a.activity-pdf');
    if (pdfLink) {
      pdfLink.href = fullUrl(basePath, day.activity.pdf);
      pdfLink.target = '_blank';
    }
    const videoWrap = activityEl.querySelector('.activity-video-wrap');
    if (day.activity.video && videoWrap) {
      videoWrap.style.display = 'block';
      const vid = videoWrap.querySelector('video');
      if (vid) vid.src = fullUrl(basePath, day.activity.video);
    } else if (videoWrap) {
      videoWrap.style.display = 'none';
    }
  } else {
    activityEl.style.display = 'none';
  }

  if (day.games && day.games.length) {
    gamesEl.style.display = 'block';
    gamesEl.querySelector('.games-list').innerHTML = day.games.map(g => {
      const href = fullUrl(basePath, g);
      return `<a class="pdf-card" href="${href}" target="_blank"><div class="pdf-icon">&#127922;</div><span>${cleanName(g)}</span></a>`;
    }).join('');
  } else {
    gamesEl.style.display = 'none';
  }

  document.getElementById('day-content').scrollIntoView({ behavior: 'smooth' });
}
