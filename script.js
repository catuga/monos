const BASE = 'visual/picks/';

// Load order.json, build grid, init lightbox
fetch('order.json')
  .then(r => r.json())
  .then(picks => init(picks));

function init(picks) {
  const main = document.querySelector('main');

  // Build grid
  picks.forEach((pick, i) => {
    const div = document.createElement('div');
    div.className = 'work';
    div.innerHTML = `<img src="${BASE}${pick.file}" alt="" loading="lazy">`;
    div.addEventListener('click', () => open(i));
    main.appendChild(div);
  });

  // Build lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lb-close" aria-label="close">&times;</button>
    <div class="lb-body">
      <div class="lb-img-wrap"><img src="" alt=""></div>
      <div class="lb-caption"></div>
    </div>
    <div class="lb-nav">
      <button class="lb-btn" id="lb-prev">&#8592;</button>
      <span class="lb-count" id="lb-count"></span>
      <button class="lb-btn" id="lb-next">&#8594;</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg     = lightbox.querySelector('.lb-img-wrap img');
  const lbCaption = lightbox.querySelector('.lb-caption');
  const lbCount   = lightbox.querySelector('#lb-count');
  let current = 0;

  function show(index) {
    current = (index + picks.length) % picks.length;
    const pick = picks[current];
    lbImg.src = BASE + pick.file;
    lbCaption.innerHTML = `<span class="lb-filename">${pick.file}</span>${pick.caption ? '<br><br>' + pick.caption : ''}`;
    lbCount.textContent = `${current + 1} / ${picks.length}`;
    history.replaceState(null, '', '#' + encodeURIComponent(pick.file));
  }

  function open(index) {
    show(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    history.replaceState(null, '', location.pathname);
  }

  lightbox.querySelector('.lb-close').addEventListener('click', close);
  lightbox.querySelector('#lb-prev').addEventListener('click', () => show(current - 1));
  lightbox.querySelector('#lb-next').addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Deep link from URL hash
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash) {
    const index = picks.findIndex(p => p.file === hash);
    if (index !== -1) open(index);
  }
}
