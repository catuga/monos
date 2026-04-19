// Password gate
const PASSWORD = '1234';
if (sessionStorage.getItem('auth') !== '1') {
  const input = prompt('password');
  if (input !== PASSWORD) {
    document.body.innerHTML = '';
    throw new Error('wrong password');
  }
  sessionStorage.setItem('auth', '1');
}

// Read all picks from the HTML — source of truth is the markup
const picks = Array.from(document.querySelectorAll('.work')).map(el => ({
  src: el.querySelector('img').src,
  caption: el.querySelector('p').textContent.trim(),
}));

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

const lbImg      = lightbox.querySelector('.lb-img-wrap img');
const lbCaption  = lightbox.querySelector('.lb-caption');
const lbCount    = lightbox.querySelector('#lb-count');

let current = 0;

function show(index) {
  current = (index + picks.length) % picks.length;
  const pick = picks[current];
  lbImg.src = pick.src;
  const filename = pick.src.split('/').pop();
  lbCaption.innerHTML = `<span class="lb-filename">${filename}</span>${pick.caption ? '<br><br>' + pick.caption : ''}`;
  lbCount.textContent = `${current + 1} / ${picks.length}`;
}

function open(index) {
  show(index);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function close() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// Click on grid items
document.querySelectorAll('.work').forEach((el, i) => {
  el.addEventListener('click', () => open(i));
});

lightbox.querySelector('.lb-close').addEventListener('click', close);
lightbox.querySelector('#lb-prev').addEventListener('click', () => show(current - 1));
lightbox.querySelector('#lb-next').addEventListener('click', () => show(current + 1));

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) close();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     close();
  if (e.key === 'ArrowLeft')  show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});
