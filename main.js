/**
 * ══════════════════════════════════════════════════════════
 *  PORTFOLIO  main.js  v3
 *  — Particle canvas background
 *  — Full page render from CONFIG
 *  — Password-protected admin panel
 *  — Live in-browser editing (instant preview)
 *  — Push config.js changes directly to GitHub via API
 * ══════════════════════════════════════════════════════════
 */

const CONFIG = await fetch('/config.json').then(r => r.json());

/* ── mutable config reference ───────────────────────────── */
let C = CONFIG;

/* ════════════════════════════════════════════════════════════
   PARTICLE CANVAS
════════════════════════════════════════════════════════════ */
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const hex2rgb = h => {
    const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
    return `${r},${g},${b}`;
  };

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.5 + .3;
      this.vy = -(Math.random() * .3 + .1);
      this.vx = (Math.random() - .5) * .15;
      this.alpha = Math.random() * .5 + .1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      const acc = C.accentColor || '#00D4AA';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${hex2rgb(acc)},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  };
  loop();
}

/* ════════════════════════════════════════════════════════════
   THEME TOGGLE
════════════════════════════════════════════════════════════ */
function initTheme() {
  const saved = localStorage.getItem('sp-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('theme-btn').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sp-theme', next);
  });
}

/* ════════════════════════════════════════════════════════════
   ACCENT COLOR
════════════════════════════════════════════════════════════ */
function applyAccent() {
  const a = C.accentColor || '#00D4AA';
  document.documentElement.style.setProperty('--accent', a);
}

/* ════════════════════════════════════════════════════════════
   SVG ICONS
════════════════════════════════════════════════════════════ */
const I = {
  email:    `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>`,
  phone:    `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.9.7 2.81a2 2 0 01-.45 2.11L7.91 8.6a16 16 0 006.09 6.09l.96-.96a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  pin:      `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  linkedin: `<svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
  github:   `<svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>`,
  ext:      `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};

/* ════════════════════════════════════════════════════════════
   RENDERERS
════════════════════════════════════════════════════════════ */
function renderNav() {
  const [first, ...rest] = C.name.split(' ');
  document.getElementById('nav-logo').innerHTML =
    `${first.toLowerCase()}<span>.${rest.join(' ').toLowerCase()}</span>`;
  const resumeEl = document.getElementById('nav-resume');
  resumeEl.href = C.resumeFile || '#';
  resumeEl.style.display = C.resumeFile ? '' : 'none';
}

function renderHero() {
  document.getElementById('hero-eyebrow').textContent = C.tagline;
  document.getElementById('hero-name').textContent    = C.name;
  document.getElementById('hero-role').textContent    = C.role;
  document.getElementById('hero-bio').innerHTML       = C.bio.map(p => `<p>${p}</p>`).join('');

  const dlBtn = document.getElementById('hero-dl');
  dlBtn.href = C.resumeFile || '#';
  dlBtn.style.display = C.resumeFile ? '' : 'none';

  // Avatar
  const av = document.getElementById('avatar-img');
  if (C.photoUrl && C.photoUrl.trim()) {
    av.innerHTML = `<img src="${C.photoUrl.trim()}" alt="${C.name}">`;
  } else {
    av.textContent = C.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  }

  // Stats
  document.getElementById('hero-stats').innerHTML = C.heroStats.map(s => `
    <div class="stat-card reveal">
      <span class="stat-val">${s.value}</span>
      <div class="stat-lab">${s.label}</div>
    </div>`).join('');
}

function renderTicker() {
  const skills = C.skills.flatMap(s => [s.category, ...s.highlights]).filter(Boolean);
  const items  = [...skills, ...skills]; // duplicate for seamless loop
  const html   = items.map(t => `<span class="ticker-item">${t}</span>`).join('');
  document.getElementById('ticker').innerHTML = html + html; // double for seamless
}

function renderAbout() {
  document.getElementById('about-bio').innerHTML =
    C.bio.map(p => `<p class="reveal">${p}</p>`).join('');

  document.getElementById('edu-cards').innerHTML = C.education.map(e => `
    <div class="edu-card reveal">
      <div class="edu-degree">${e.degree}</div>
      <div class="edu-inst">${e.institution}</div>
      <div class="edu-meta">
        <span class="edu-grade">${e.grade}</span>
        <span>${e.year}</span>
      </div>
    </div>`).join('');

  document.getElementById('cert-row').innerHTML = C.certifications.map(c => `
    <span class="cert-pill"><strong>${c.issuer}</strong> ${c.title}</span>`).join('');

  const top = C.education[0], sec = C.education[1];
  document.getElementById('fact-strip').innerHTML = `
    <div class="fact-card reveal"><span class="fact-val">${top.grade}</span><div class="fact-key">M.Sc. GPA · IIT Bombay</div></div>
    <div class="fact-card reveal"><span class="fact-val">${sec.grade}</span><div class="fact-key">B.Sc. GPA · DU</div></div>
    <div class="fact-card reveal"><span class="fact-val">1.5+</span><div class="fact-key">Years Industry Exp</div></div>
    <div class="fact-card reveal"><span class="fact-val">AIR 60</span><div class="fact-key">IIT JAM 2022</div></div>
    ${C.hobbies.map(h=>`<div class="fact-card reveal"><span class="fact-val" style="font-size:1.4rem">${h.split(' ')[0]}</span><div class="fact-key">${h.replace(/^\S+\s*/,'')}</div></div>`).join('')}
  `;
}

function renderSkills() {
  document.getElementById('skills-grid').innerHTML = C.skills.map(s => `
    <div class="skill-card reveal">
      <div class="skill-cat">${s.category}</div>
      <div class="skill-tags">
        ${s.highlights.map(t=>`<span class="tag hi">${t}</span>`).join('')}
        ${s.others.map(t=>`<span class="tag">${t}</span>`).join('')}
      </div>
    </div>`).join('');
}

function renderExperience() {
  document.getElementById('timeline').innerHTML = C.experience.map(e => `
    <div class="tl-item reveal">
      <div class="tl-dot"></div>
      <div class="tl-meta">
        <span class="tl-period">${e.period}</span>
        <span class="tl-company">${e.company}</span>
        <span class="tl-type">${e.type}</span>
      </div>
      <div class="tl-role">${e.role}</div>
      <ul class="tl-bullets">${e.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
    </div>`).join('');
}

function renderProjects() {
  document.getElementById('projects-grid').innerHTML = C.projects.map(p => `
    <div class="proj-card reveal">
      <div class="proj-bar"></div>
      <div class="proj-body">
        <div class="proj-title">${p.title}</div>
        <div class="proj-desc">${p.desc}</div>
        <div class="proj-metric">${p.metric}</div>
      </div>
      <div class="proj-foot">
        ${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
        ${p.link ? `<a class="proj-link" href="${p.link}" target="_blank" rel="noopener">GitHub ${I.ext}</a>` : ''}
      </div>
    </div>`).join('');
}

function renderAchievements() {
  document.getElementById('ach-grid').innerHTML = C.achievements.map(a => `
    <div class="ach-card reveal">
      <div class="ach-icon">${a.icon}</div>
      <div><div class="ach-title">${a.title}</div><div class="ach-desc">${a.desc}</div></div>
    </div>`).join('');
}

function renderContact() {
  document.getElementById('contact-links').innerHTML = `
    <a href="mailto:${C.email}"                      class="c-link"><div class="c-icon">${I.email}</div>${C.email}</a>
    <a href="tel:${C.phone}"                          class="c-link"><div class="c-icon">${I.phone}</div>${C.phone}</a>
    <a href="${C.linkedin}" target="_blank" rel="noopener" class="c-link"><div class="c-icon">${I.linkedin}</div>${C.linkedin.replace('https://','')}</a>
    ${C.github ? `<a href="${C.github}" target="_blank" rel="noopener" class="c-link"><div class="c-icon">${I.github}</div>${C.github.replace('https://','')}</a>` : ''}
    <span class="c-link"><div class="c-icon">${I.pin}</div>${C.location}</span>`;
}

function renderFooter() {
  document.getElementById('footer-txt').innerHTML =
    `© ${new Date().getFullYear()} <span>${C.name}</span> · ${C.role} · ${C.location}`;
}

function renderAll() {
  applyAccent();
  renderNav(); renderHero(); renderTicker(); renderAbout();
  renderSkills(); renderExperience(); renderProjects();
  renderAchievements(); renderContact(); renderFooter();
  initReveal();
}

/* ════════════════════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════════════════════ */
function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach((e,i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ════════════════════════════════════════════════════════════
   MOBILE MENU / CONTACT FORM
════════════════════════════════════════════════════════════ */
function initMisc() {
  const burger = document.getElementById('nav-burger');
  const links  = document.getElementById('nav-links');
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    e.target.style.display = 'none';
    document.getElementById('form-ok').classList.remove('hidden');
  });
}

/* ════════════════════════════════════════════════════════════
   ADMIN PANEL — LOGIN
════════════════════════════════════════════════════════════ */
function initAdmin() {
  const loginOverlay = document.getElementById('login-overlay');
  const loginClose   = document.getElementById('login-close');
  const pwInput      = document.getElementById('pw-input');
  const pwErr        = document.getElementById('pw-err');
  const pwSubmit     = document.getElementById('pw-submit');
  const panel        = document.getElementById('admin-panel');
  const overlay      = document.getElementById('admin-overlay');
  const apClose      = document.getElementById('ap-close');
  const adminBtn     = document.getElementById('admin-btn');

  const openLogin = () => {
    loginOverlay.classList.remove('hidden');
    pwInput.value = ''; pwErr.classList.add('hidden');
    setTimeout(() => pwInput.focus(), 50);
  };
  const closeLogin = () => loginOverlay.classList.add('hidden');
  const openPanel  = () => {
    panel.classList.add('open');
    panel.classList.remove('hidden');
    overlay.classList.remove('hidden');
    panel.setAttribute('aria-hidden','false');
    populateEditor();
  };
  const closePanel = () => {
    panel.classList.remove('open');
    setTimeout(() => { panel.classList.add('hidden'); overlay.classList.add('hidden'); }, 350);
    panel.setAttribute('aria-hidden','true');
  };

  adminBtn.addEventListener('click', openLogin);
  loginClose.addEventListener('click', closeLogin);
  loginOverlay.addEventListener('click', e => { if (e.target === loginOverlay) closeLogin(); });

  const tryLogin = () => {
    if (pwInput.value === C.adminPassword) {
      closeLogin(); openPanel();
    } else {
      pwErr.classList.remove('hidden');
      pwInput.value = ''; pwInput.focus();
    }
  };
  pwSubmit.addEventListener('click', tryLogin);
  pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });

  apClose.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  /* ── TAB SWITCHING ── */
  document.querySelectorAll('.ap-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ap-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.ap-body').forEach(b => { b.style.display = 'none'; b.classList.add('hidden'); });
      tab.classList.add('active');
      const body = document.getElementById('tab-' + tab.dataset.tab);
      body.classList.remove('hidden');
      body.style.display = 'flex';
    });
  });
  // init first tab visible
  document.getElementById('tab-identity').style.display = 'flex';

  /* ── PUSH TO GITHUB ── */
  document.getElementById('ap-save-gh').addEventListener('click', pushToGitHub);
}

/* ════════════════════════════════════════════════════════════
   EDITOR — POPULATE
════════════════════════════════════════════════════════════ */
function populateEditor() {
  buildFieldComponents();
  buildStatsEditor();
  buildExpEditor();
  buildProjEditor();
}

/* Build all .ef[data-k] divs into proper input fields */
function buildFieldComponents() {
  document.querySelectorAll('.ef[data-k]').forEach(div => {
    const key   = div.dataset.k;
    const label = div.getAttribute('label') || key;
    const hint  = div.getAttribute('hint') || '';
    const type  = div.getAttribute('type') || 'text';
    const rows  = div.getAttribute('rows') || 4;

    let val = C[key];
    if (Array.isArray(val)) val = val.join('\n');
    val = val || '';

    let inputHtml;
    if (type === 'textarea') {
      inputHtml = `<textarea class="ef-ta" data-field="${key}" rows="${rows}">${esc(val)}</textarea>`;
    } else if (type === 'color') {
      inputHtml = `<div style="display:flex;gap:8px;align-items:center;">
        <input class="ef-input" type="text" data-field="${key}" value="${esc(val)}" style="flex:1">
        <input type="color" data-color-for="${key}" value="${val||'#00D4AA'}" style="width:36px;height:36px;border:none;border-radius:4px;cursor:pointer;background:none;">
      </div>`;
    } else {
      inputHtml = `<input class="ef-input" type="${type}" data-field="${key}" value="${esc(val)}">`;
    }

    div.className = 'ef-wrap';
    div.innerHTML = `
      ${label ? `<label class="ef-label">${label}</label>` : ''}
      ${inputHtml}
      ${hint ? `<span class="ef-hint">${hint}</span>` : ''}`;

    // wire events
    const input = div.querySelector(`[data-field="${key}"]`);
    input.addEventListener('input', () => {
      let v = input.value;
      if (Array.isArray(C[key])) { C[key] = v.split('\n').filter(l=>l.trim()); }
      else { C[key] = v; }
      renderAll();
    });

    const colorPicker = div.querySelector(`[data-color-for="${key}"]`);
    if (colorPicker) {
      colorPicker.addEventListener('input', () => {
        input.value = colorPicker.value;
        C[key] = colorPicker.value;
        applyAccent();
      });
      input.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(input.value)) colorPicker.value = input.value;
      });
    }
  });
}

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

/* ── STATS editor ── */
function buildStatsEditor() {
  const el = document.getElementById('ap-stats');
  el.innerHTML = '';
  C.heroStats.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'ef-card';
    card.innerHTML = `
      <div class="ef-card-head">
        <span class="ef-card-title">Stat ${i+1}</span>
        <button class="ef-del" data-i="${i}">✕ Remove</button>
      </div>
      <div class="ef-wrap"><label class="ef-label">Value</label><input class="ef-input" data-sv="${i}" value="${esc(s.value)}"></div>
      <div class="ef-wrap"><label class="ef-label">Label</label><input class="ef-input" data-sl="${i}" value="${esc(s.label)}"></div>`;
    el.appendChild(card);
    card.querySelector(`[data-sv="${i}"]`).addEventListener('input', e => { C.heroStats[i].value = e.target.value; renderHero(); initReveal(); });
    card.querySelector(`[data-sl="${i}"]`).addEventListener('input', e => { C.heroStats[i].label = e.target.value; renderHero(); initReveal(); });
    card.querySelector('.ef-del').addEventListener('click', () => { C.heroStats.splice(i,1); buildStatsEditor(); renderHero(); initReveal(); });
  });
  let addBtn = document.getElementById('ap-add-stat');
  addBtn.onclick = () => { C.heroStats.push({value:'',label:''}); buildStatsEditor(); renderHero(); initReveal(); };
}

/* ── EXPERIENCE editor ── */
function buildExpEditor() {
  const el = document.getElementById('ap-exp');
  el.innerHTML = '';
  C.experience.forEach((exp, i) => {
    const card = document.createElement('div');
    card.className = 'ef-card';
    card.innerHTML = `
      <div class="ef-card-head">
        <span class="ef-card-title">${exp.role || 'New Role'}</span>
        <button class="ef-del">✕</button>
      </div>
      <div class="ef-wrap"><label class="ef-label">Role</label><input class="ef-input" data-er="role" value="${esc(exp.role)}"></div>
      <div class="ef-wrap"><label class="ef-label">Company</label><input class="ef-input" data-er="company" value="${esc(exp.company)}"></div>
      <div class="ef-wrap"><label class="ef-label">Period</label><input class="ef-input" data-er="period" value="${esc(exp.period)}"></div>
      <div class="ef-wrap"><label class="ef-label">Type</label><input class="ef-input" data-er="type" value="${esc(exp.type)}"></div>
      <div class="ef-wrap"><label class="ef-label">Bullets (one per line)</label><textarea class="ef-ta" data-er="bullets" rows="4">${esc(exp.bullets.join('\n'))}</textarea></div>`;
    el.appendChild(card);
    card.querySelectorAll('[data-er]').forEach(inp => {
      inp.addEventListener('input', () => {
        const k = inp.dataset.er;
        C.experience[i][k] = k === 'bullets'
          ? inp.value.split('\n').filter(l=>l.trim())
          : inp.value;
        card.querySelector('.ef-card-title').textContent = C.experience[i].role || 'New Role';
        renderExperience(); initReveal();
      });
    });
    card.querySelector('.ef-del').addEventListener('click', () => { C.experience.splice(i,1); buildExpEditor(); renderExperience(); initReveal(); });
  });
  document.getElementById('ap-add-exp').onclick = () => {
    C.experience.push({period:'',role:'New Role',company:'',location:'India',type:'Full-time',bullets:['']});
    buildExpEditor(); renderExperience(); initReveal();
  };
}

/* ── PROJECTS editor ── */
function buildProjEditor() {
  const el = document.getElementById('ap-proj');
  el.innerHTML = '';
  C.projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'ef-card';
    card.innerHTML = `
      <div class="ef-card-head">
        <span class="ef-card-title">${p.title || 'New Project'}</span>
        <button class="ef-del">✕</button>
      </div>
      <div class="ef-wrap"><label class="ef-label">Title</label><input class="ef-input" data-pr="title" value="${esc(p.title)}"></div>
      <div class="ef-wrap"><label class="ef-label">Description</label><textarea class="ef-ta" data-pr="desc" rows="3">${esc(p.desc)}</textarea></div>
      <div class="ef-wrap"><label class="ef-label">Metric / Result</label><input class="ef-input" data-pr="metric" value="${esc(p.metric)}"></div>
      <div class="ef-wrap"><label class="ef-label">Tags (comma-separated)</label><input class="ef-input" data-pr="tags" value="${esc(p.tags.join(', '))}"></div>
      <div class="ef-wrap"><label class="ef-label">GitHub Link</label><input class="ef-input" data-pr="link" value="${esc(p.link)}"></div>`;
    el.appendChild(card);
    card.querySelectorAll('[data-pr]').forEach(inp => {
      inp.addEventListener('input', () => {
        const k = inp.dataset.pr;
        C.projects[i][k] = k === 'tags'
          ? inp.value.split(',').map(t=>t.trim()).filter(Boolean)
          : inp.value;
        card.querySelector('.ef-card-title').textContent = C.projects[i].title || 'New Project';
        renderProjects(); initReveal();
      });
    });
    card.querySelector('.ef-del').addEventListener('click', () => { C.projects.splice(i,1); buildProjEditor(); renderProjects(); initReveal(); });
  });
  document.getElementById('ap-add-proj').onclick = () => {
    C.projects.push({title:'New Project',desc:'',metric:'',tags:[],link:''});
    buildProjEditor(); renderProjects(); initReveal();
  };
}

/* ════════════════════════════════════════════════════════════
   PUSH TO GITHUB
════════════════════════════════════════════════════════════ */
async function pushToGitHub() {
  const status = document.getElementById('ap-status');
  const btn    = document.getElementById('ap-save-gh');

  const { githubOwner: owner, githubRepo: repo, githubToken: token, githubBranch: branch } = C;

  if (!owner || !repo || !token) {
    status.textContent = '⚠ Fill in GitHub Owner, Repo, and Token in the GitHub tab first.';
    status.className   = 'ap-status error';
    status.classList.remove('hidden');
    // Auto-switch to GitHub tab
    document.querySelector('.ap-tab[data-tab="github"]').click();
    return;
  }

  btn.textContent = '⏳ Pushing…'; btn.disabled = true;

  try {
    const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/config.js`;

    // 1. Get current file SHA (needed to update)
    let sha = null;
    try {
      const getRes = await fetch(`${apiBase}?ref=${branch}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
      });
      if (getRes.ok) { const d = await getRes.json(); sha = d.sha; }
    } catch(_) {}

    // 2. Build new config.js content
    const newContent = buildConfigContent();
    const encoded    = btoa(unescape(encodeURIComponent(newContent)));

    // 3. Commit
    const body = {
      message: `Update portfolio config — ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}`,
      content:  encoded,
      branch:   branch || 'main',
      ...(sha ? { sha } : {})
    };

    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers: {
        Authorization:  `Bearer ${token}`,
        Accept:         'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (putRes.ok) {
      status.textContent = `✓ Pushed to GitHub (${branch}) — changes live in ~1 min.`;
      status.className   = 'ap-status success';
    } else {
      const err = await putRes.json();
      throw new Error(err.message || `HTTP ${putRes.status}`);
    }
  } catch (err) {
    status.textContent = `✗ GitHub push failed: ${err.message}`;
    status.className   = 'ap-status error';
  }

  status.classList.remove('hidden');
  btn.textContent = '⬆ Push to GitHub'; btn.disabled = false;
  setTimeout(() => status.classList.add('hidden'), 8000);
}

/* Serialise current CONFIG state → config.js file text */
function buildConfigContent() {
  const safe = Object.assign({}, C);
  // Don't include the token in the committed file if owner wants privacy
  // We keep it as-is since it's in a private file per README instructions
  return `/**
 * ============================================================
 *  PORTFOLIO CONFIG — auto-generated by admin panel
 *  Last saved: ${new Date().toISOString()}
 * ============================================================
 */
const CONFIG = ${JSON.stringify(safe, null, 2)};
`;
}

/* ════════════════════════════════════════════════════════════
   BOOT
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTheme();
  renderAll();
  initMisc();
  initAdmin();
});
