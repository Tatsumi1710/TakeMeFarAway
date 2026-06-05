const audio = document.getElementById('audio');
const btnPlay = document.getElementById('btnPlay');
const iconPlay = document.getElementById('iconPlay');
const iconPause = document.getElementById('iconPause');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const progressWrap = document.getElementById('progressWrap');
const timeElapsed = document.getElementById('timeElapsed');
const timeDuration = document.getElementById('timeDuration');
const volSlider = document.getElementById('volSlider');
const lyricBlocks = Array.from(document.querySelectorAll('.lyric-block'));

audio.volume = 0.8;

function fmt(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

btnPlay.addEventListener('click', () => {
  audio.paused ? audio.play() : audio.pause();
});

audio.addEventListener('play', () => {
  iconPlay.style.display = 'none';
  iconPause.style.display = 'block';
  document.getElementById('lyricsScroll').style.visibility = 'visible';
});
audio.addEventListener('pause', () => {
  iconPlay.style.display = 'block';
  iconPause.style.display = 'none';
});

audio.addEventListener('loadedmetadata', () => {
  timeDuration.textContent = fmt(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  timeElapsed.textContent = fmt(audio.currentTime);
  updateLyrics(audio.currentTime);
});

progressWrap.addEventListener('click', (e) => {
  const rect = progressWrap.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.currentTime = ratio * audio.duration;
});

volSlider.addEventListener('input', () => {
  audio.volume = volSlider.value;
});

function seekRel(sec) {
  audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + sec));
}

let currentActive = null;

function updateLyrics(t) {
  let active = lyricBlocks[0];
  for (let i = 0; i < lyricBlocks.length; i++) {
    const time = parseFloat(lyricBlocks[i].dataset.time || 0);
    if (t >= time) active = lyricBlocks[i];
  }

  if (active && active !== currentActive) {
    const prev = currentActive;

    // Ẩn TẤT CẢ các block trước (phòng trường hợp còn sót)
    lyricBlocks.forEach(b => {
      if (b !== active) {
        b.style.opacity = '0';
        b.style.transform = 'translateY(-16px)';
        b.style.visibility = 'hidden';
        b.classList.remove('active');
      }
    });

    currentActive = active;

    setTimeout(() => {
      active.classList.add('active');
      active.style.visibility = 'visible';
      active.style.opacity = '0';
      active.style.transform = 'translateY(16px)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          active.style.opacity = '1';
          active.style.transform = 'translateY(0)';
        });
      });
    }, prev ? 150 : 0);
  }
}

lyricBlocks.forEach(block => {
  block.addEventListener('click', () => {
    audio.currentTime = parseFloat(block.dataset.time || 0);
    if (audio.paused) audio.play();
  });
});

// Hoa anh đào rơi
const colors = ['#ffb7c5', '#ffc8d4', '#ff9eb5', '#ffd6e0', '#ffaec0'];

for (let i = 0; i < 28; i++) {
  const petal = document.createElement('div');
  petal.classList.add('petal');

  const size = Math.random() * 10 + 8;
  petal.style.width = size + 'px';
  petal.style.height = size + 'px';
  petal.style.left = Math.random() * 100 + 'vw';
  petal.style.animationDuration = Math.random() * 5 + 5 + 's';
  petal.style.animationDelay = Math.random() * 5 + 's';
  petal.style.background = colors[Math.floor(Math.random() * colors.length)];

  document.body.appendChild(petal);
}