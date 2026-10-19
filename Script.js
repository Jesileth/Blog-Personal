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
(() => {
  // Solo se usan los enlaces del menú que apuntan a una sección que existe
  const items = $$('#nav a')
    .map(a => ({ a, id: a.hash.slice(1), el: document.getElementById(a.hash.slice(1)) }))
    .filter(i => i.el);
  if (!items.length) return;
 
  const setActive = id => items.forEach(i => i.a.classList.toggle('active', i.id === id));
  let pin = null; // sección elegida con un clic: se respeta hasta que la persona vuelva a hacer scroll

  function spy() {
    const ref = innerHeight * 0.4;
    const wide = matchMedia('(min-width:1181px)').matches;
    // En pantallas anchas la columna derecha (Favoritos) queda al lado: se marca solo con clic
    const list = items.filter(i => !(wide && i.el.closest('.right')));
    if (!list.length) return;
    let cur = list[0].id;
    list.forEach(i => { if (i.el.getBoundingClientRect().top <= ref) cur = i.id; });
 
    // Intereses y Habilidades van lado a lado: se reparte según el avance por esa fila
    const a = document.getElementById('intereses'), b = document.getElementById('habilidades');
    if (a && b && cur === 'habilidades') {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      if (Math.abs(ra.top - rb.top) < 10) cur = (ref - rb.top) < rb.height / 2 ? 'intereses' : 'habilidades';
    }
    // Al llegar al final de la página no se puede subir más: se marca la última sección
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 6) cur = list[list.length - 1].id;
    setActive(cur);
  }
 
  let ticking = false;
  addEventListener('scroll', () => {
    if (pin && pin.ok && Math.abs(scrollY - pin.y) > 80) pin = null;
    if (pin) return setActive(pin.id);
    if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; spy(); }); }
  }, { passive: true });
 
  items.forEach(i => i.a.addEventListener('click', () => {
    const p = pin = { id: i.id, ok: false };
    setActive(p.id);
    setTimeout(() => { p.y = scrollY; p.ok = true; }, 1000); // espera a que termine el scroll suave
  }));
  spy();
})();

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

/* 5. Corazoncitos al pulsar "Conóceme más" + mensaje */
$('#more').addEventListener('click', e => {
  const r = e.currentTarget.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  if (!calm) for (let i = 0; i < 14; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = ['♡', '✦', '✿', '♥'][i % 4];
    h.style.cssText = `left:${cx}px;top:${cy}px;color:${['#5fc8a8', '#7fd0cc', '#8fc4ef'][i % 3]};--dx:${(Math.random() - .5) * 220}px;--dy:${-40 - Math.random() * 140}px`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1000);
  }
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = '¡Gracias por visitar mi Blog personal! ♡';
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 500); }, 2600);
});

/* 6. Estela de brillitos al mover el mouse (solo en pantallas con mouse) */
if (!calm && matchMedia('(hover:hover)').matches) {
  let last = 0;
  addEventListener('mousemove', e => {
    const now = performance.now();
    if (now - last < 70) return;
    last = now;
    const s = document.createElement('span');
    s.className = 'trail';
    s.textContent = ['✦', '♡', '✧'][Math.floor(Math.random() * 3)];
    s.style.cssText = `left:${e.clientX + 6}px;top:${e.clientY + 6}px;font-size:${10 + Math.random() * 10}px;color:${['#5fc8a8', '#7fd0cc', '#8fc4ef'][Math.floor(Math.random() * 3)]}`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  });
}

/* 7. Ver los dibujos en grande al hacer clic */
(() => {
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  const big = lb.firstChild;
  $$('.slide img').forEach(img => img.addEventListener('click', () => { big.src = img.src; big.alt = img.alt; lb.classList.add('on'); }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });
})();