const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1. Destellos flotantes de fondo */
(() => {
  const box = $('#sparkles');
  const glyphs = ['♡', '✦', '✧', '✿', '★', '❀'];
  const colors = ['#5fc8a8', '#7fd0cc', '#8fc4ef', '#9cc7f2', '#bfe9e0'];
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('span');
    s.textContent = glyphs[i % glyphs.length];
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;font-size:${12 + Math.random() * 18}px;color:${colors[i % colors.length]};--d:${5 + Math.random() * 5}s;--dl:${Math.random() * 6}s`;
    box.appendChild(s);
  }
})();

/* 2. Aparición suave al hacer scroll (también activa las barras de habilidades) */
const io = new IntersectionObserver(
    entries => 
        {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
        }, 
            { threshold: 0.15 });

$$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });

/* 3. Menú: marca la sección visible */
const links = $$('#nav a');
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
$$('main section, #favoritos').forEach(s => spy.observe(s));

/* 4. Carrusel de la galería */
(() => {
  const track = $('#track'), dots = $('#dots'), slides = [...track.children];
  const perPage = () => Math.max(1, Math.round(track.clientWidth / slides[0].offsetWidth));
  const pages = () => Math.ceil(slides.length / perPage());
  const page = () => Math.round(track.scrollLeft / track.clientWidth);
 
  function build() {
    dots.innerHTML = '';
    for (let i = 0; i < pages(); i++) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Página ' + (i + 1));
      b.onclick = () => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
      dots.appendChild(b);
    }
    mark();
  }
  function mark() { $$('button', dots).forEach((b, i) => b.classList.toggle('on', i === Math.min(page(), pages() - 1))); }
 
  $('#next').onclick = () => track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
  $('#prev').onclick = () => track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
  track.addEventListener('scroll', () => requestAnimationFrame(mark));
  addEventListener('resize', build);
  build();
})();