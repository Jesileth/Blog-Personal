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