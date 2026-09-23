const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const header = $('.site-header');
const menuToggle = $('.menu-toggle');
const menu = $('.nav-menu');

window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 20), {passive:true});

menuToggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('.nav-menu a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded','false');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
$$('.reveal').forEach(el => revealObserver.observe(el));

$$('.pollution-card').forEach(card => {
  card.addEventListener('click', () => {
    const open = card.getAttribute('aria-expanded') === 'true';
    $$('.pollution-card').forEach(c => c.setAttribute('aria-expanded','false'));
    card.setAttribute('aria-expanded', String(!open));
  });
});

const stats = $$('.stat-value');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = Number(el.dataset.target), suffix = el.dataset.suffix || '';
    const decimals = String(target).includes('.') ? 2 : 0;
    const start = performance.now(), duration = 1200;
    function tick(now){
      const progress = Math.min((now-start)/duration,1);
      const eased = 1-Math.pow(1-progress,3);
      el.textContent = (target*eased).toFixed(decimals) + suffix;
      if(progress<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statsObserver.unobserve(el);
  });
}, {threshold:.7});
stats.forEach(el => statsObserver.observe(el));

$$('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const id = tab.dataset.tab;
    $$('.tab').forEach(t => t.classList.toggle('active', t === tab));
    $$('.tab').forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    $$('.tab-panel').forEach(panel => panel.classList.toggle('active', panel.id === id));
  });
});

const checks = $$('.checks input');
const message = $('.check-message');
checks.forEach(check => check.addEventListener('change', () => {
  const count = checks.filter(c => c.checked).length;
  message.textContent = count === 0
    ? 'Every action contributes to a healthier ocean.'
    : count === checks.length
      ? 'You have selected every action. Keep the current moving by encouraging others, too.'
      : `${count} action${count === 1 ? '' : 's'} selected. Every action contributes to a healthier ocean.`;
}));

const sectionLinks = $$('.nav-menu a');
const sections = sectionLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      sectionLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, {rootMargin:'-35% 0px -55% 0px', threshold:0});
sections.forEach(s => activeObserver.observe(s));

const cursor = $('.cursor-glow');
if (cursor && matchMedia('(pointer:fine)').matches) {
  cursor.classList.add('active');
  window.addEventListener('pointermove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }, {passive:true});
  $$('a,button,.life-card,.info-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

const bubbleLayer = $('.hero-bubbles');
if (bubbleLayer && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  for(let i=0;i<10;i++){
    const b = document.createElement('i');
    b.style.cssText = `position:absolute;width:${4+Math.random()*12}px;height:${4+Math.random()*12}px;left:${Math.random()*100}%;bottom:-20px;border:1px solid rgba(180,250,246,.35);border-radius:50%;animation:bubble ${7+Math.random()*10}s linear ${-Math.random()*12}s infinite;`;
    bubbleLayer.appendChild(b);
  }
}
