/**
 * ═══════════════════════════════════════════════════════════
 *  PORTFOLIO main.js  v4 (fixed)
 *
 *  • Loads data from config.json (fetch)
 *  • Particle canvas background
 *  • Dark / light theme toggle
 *  • Serverless GitHub auth (PAT verified against GitHub API,
 *    never stored — session memory only)
 *  • Live in-panel editor with instant preview
 *  • Draggable project reordering
 *  • Pushes updated config.json directly to GitHub via API
 * ═══════════════════════════════════════════════════════════
 */

/* ═══ STATE ════════════════════════════════════════════════ */
let C = null;           // live config object (mutated by editor)
let SESSION = {         // in-memory only — never persisted
  token:  null,
  owner:  null,
  repo:   null,
  branch: 'main',
  authed: false
};

/* ═══ BOOT: fetch config.json then render ══════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  animateLoader();
  try {
    const res = await fetch('config.json?v=' + Date.now()); // cache-bust
    if (!res.ok) throw new Error('config.json not found');
    C = await res.json();
  } catch (e) {
    document.getElementById('loader').innerHTML =
      `<div style="color:#EF4444;font-family:monospace;padding:2rem;text-align:center">
        ⚠ Could not load config.json<br><small>${e.message}</small>
      </div>`;
    return;
  }

  // Pre-fill SESSION from config if set
  if (C.githubBranch) SESSION.branch = C.githubBranch;

  // FIX: each init step is isolated so one failure can never block
  // the others — most importantly, it can never block hiding the loader.
  const steps = [
    renderAll, initCanvas, initTheme, initNav,
    initHeroScroll, initContactForm, initAdmin, initReveal
  ];
  steps.forEach(fn => {
    try { fn(); }
    catch (err) { console.error(`[init error] ${fn.name}:`, err); }
  });

  // Hide loader — now guaranteed to run regardless of the steps above
  setTimeout(() => {
    const l = document.getElementById('loader');
    l.classList.add('out');
    setTimeout(() => l.style.display = 'none', 500);
  }, 600);
});

/* ═══ LOADER ANIMATION ═════════════════════════════════════ */
function animateLoader() {
  const fill = document.getElementById('loader-fill');
  let w = 0;
  const t = setInterval(() => {
    w = Math.min(w + Math.random() * 18, 90);
    fill.style.width = w + '%';
    if (w >= 90) clearInterval(t);
  }, 80);
  window._loaderDone = () => { fill.style.width = '100%'; };
}

/* ═══ PARTICLE CANVAS ══════════════════════════════════════ */
function initCanvas() {
  const cv  = document.getElementById('bg-canvas');
  const ctx = cv.getContext('2d');
  let W, H, pts = [];

  const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  resize(); addEventListener('resize', resize);

  const toRgb = hex => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  };

  class Pt {
    constructor(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 5;
      this.r  = Math.random() * 1.4 + .3;
      this.vy = -(Math.random() * .28 + .08);
      this.vx = (Math.random() - .5) * .12;
      this.a  = Math.random() * .45 + .08;
    }
    tick() { this.x += this.vx; this.y += this.vy; if (this.y < -5) { this.y = H + 5; this.x = Math.random() * W; } }
    draw() {
      const hex = C?.accentColor || '#00D4AA';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${toRgb(hex)},${this.a})`;
      ctx.fill();
    }
  }
  for (let i = 0; i < 80; i++) pts.push(new Pt(true));
  const loop = () => { ctx.clearRect(0,0,W,H); pts.forEach(p=>{p.tick();p.draw();}); requestAnimationFrame(loop); };
  loop();
}

/* ═══ THEME ════════════════════════════════════════════════ */
function initTheme() {
  const t = localStorage.getItem('sp-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
  document.getElementById('theme-btn').addEventListener('click', () => {
    const n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', n);
    localStorage.setItem('sp-theme', n);
  });
}

function applyAccent() {
  const a = C.accentColor || '#00D4AA';
  document.documentElement.style.setProperty('--a', a);
}

/* ═══ NAV / MISC ═══════════════════════════════════════════ */
function initNav() {
  const burger = document.getElementById('nav-burger');
  const links  = document.getElementById('nav-links');
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

function initHeroScroll() {
  const secs = ['hero','about','skills','experience','projects','achievements','contact'];
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.style.color = a.getAttribute('href') === '#'+e.target.id ? 'var(--a)' : '';
        });
      }
    });
  }, { threshold: .4 });
  secs.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
}

// FIX: guard against missing #contact-form / #form-ok so this can never
// throw and block the rest of the boot sequence (this was the bug that
// froze the loading screen on the live site).
async function initContactForm() {
  const form = document.getElementById('contact-form');
  const ok = document.getElementById('form-ok');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const response = await fetch(form.action, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      form.style.display = 'none';
      ok.classList.remove('hidden');
    } else {
      alert(result.message || 'Failed to send message.');
    }
  });
}

/* ═══ ICONS ════════════════════════════════════════════════ */
const IC = {
  email:    `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>`,
  phone:    `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.9.7 2.81a2 2 0 01-.45 2.11L7.91 8.6a16 16 0 006.09 6.09l.96-.96a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  pin:      `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  linkedin: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
  github:   `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>`,
  ext:      `<svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  trophy:   `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z"/><path d="M17 5h3a2 2 0 01-2 5M7 5H4a2 2 0 002 5"/></svg>`,
};

/* ═══ RENDERERS ════════════════════════════════════════════ */
function renderAll() {
  applyAccent();
  rNav(); rHero(); rTicker(); rAbout();
  rSkills(); rExp(); rProjects(); rAch(); rContact(); rFooter();
  if (window._loaderDone) window._loaderDone();
  initReveal();
}

const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');

function rNav() {
  const [f,...rest] = C.name.split(' ');
  document.getElementById('nav-logo').innerHTML = `${f.toLowerCase()}<span>.${rest.join(' ').toLowerCase()}</span>`;
  const r = document.getElementById('nav-resume');
  r.href = C.resumeFile || '#';
  r.style.display = C.resumeFile ? '' : 'none';
}

function rHero() {
  document.getElementById('hero-eyebrow').textContent = C.tagline;
  document.getElementById('hero-name').textContent    = C.name;
  document.getElementById('hero-role').textContent    = C.role;
  document.getElementById('hero-bio').innerHTML       = C.bio.map(p=>`<p>${p}</p>`).join('');
  const dl = document.getElementById('hero-dl');
  dl.href = C.resumeFile || '#'; dl.style.display = C.resumeFile ? '' : 'none';
  const av = document.getElementById('avatar-img');
  if (C.photoUrl?.trim()) {
    av.innerHTML = `<img src="${C.photoUrl.trim()}" alt="${esc(C.name)}">`;
  } else {
    av.textContent = C.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  }
  document.getElementById('hero-stats').innerHTML = C.heroStats.map(s=>`
    <div class="stat-card rv">
      <span class="stat-val">${esc(s.value)}</span>
      <div class="stat-lab">${esc(s.label)}</div>
    </div>`).join('');
}

function rTicker() {
  const items = C.skills.flatMap(s=>[s.category,...s.highlights]).filter(Boolean);
  const html  = items.map(t=>`<span class="ticker-item">${esc(t)}</span>`).join('');
  document.getElementById('ticker').innerHTML = html+html+html;
}

function rAbout() {
  document.getElementById('about-bio').innerHTML =
    C.bio.map(p=>`<p class="rv">${p}</p>`).join('');
  document.getElementById('edu-list').innerHTML = C.education.map(e=>`
    <div class="edu-card rv">
      <div class="edu-deg">${esc(e.degree)}</div>
      <div class="edu-inst">${esc(e.institution)}</div>
      <div class="edu-meta"><span class="edu-grade">${esc(e.grade)}</span><span>${esc(e.year)}</span></div>
    </div>`).join('');
  document.getElementById('cert-row').innerHTML =
    C.certifications.map(c=>`<span class="cert-pill"><strong>${esc(c.issuer)}</strong> ${esc(c.title)}</span>`).join('');
  const e0=C.education[0],e1=C.education[1];
  document.getElementById('fact-strip').innerHTML = `
    <div class="fact-card rv"><span class="fact-val">${esc(e0.grade)}</span><div class="fact-key">M.Sc. GPA</div></div>
    <div class="fact-card rv"><span class="fact-val">${esc(e1.grade)}</span><div class="fact-key">B.Sc. GPA</div></div>
    <div class="fact-card rv"><span class="fact-val">1.5+</span><div class="fact-key">Years Exp</div></div>
    <div class="fact-card rv"><span class="fact-val">AIR 60</span><div class="fact-key">IIT JAM 2022</div></div>
    ${C.hobbies.map(h=>`<div class="fact-card rv"><span class="fact-val" style="font-size:1.3rem">${h.split(' ')[0]}</span><div class="fact-key">${h.replace(/^\S+\s*/,'')}</div></div>`).join('')}`;
}

function rSkills() {
  document.getElementById('skills-grid').innerHTML = C.skills.map(s=>`
    <div class="skill-card rv">
      <div class="skill-cat">${esc(s.category)}</div>
      <div class="skill-tags">
        ${s.highlights.map(t=>`<span class="tag hi">${esc(t)}</span>`).join('')}
        ${s.others.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}
      </div>
    </div>`).join('');
}

function rExp() {
  document.getElementById('timeline').innerHTML = C.experience.map(e=>`
    <div class="tl-item rv">
      <div class="tl-dot"></div>
      <div class="tl-meta">
        <span class="tl-period">${esc(e.period)}</span>
        <span class="tl-company">${esc(e.company)}</span>
        <span class="tl-type">${esc(e.type)}</span>
      </div>
      <div class="tl-role">${esc(e.role)}</div>
      <ul class="tl-bullets">${e.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
    </div>`).join('');
}

function rProjects() {
  document.getElementById('projects-grid').innerHTML = C.projects.map(p=>`
    <div class="proj-card rv">
      <div class="proj-bar"></div>
      <div class="proj-body">
        <div class="proj-title">${esc(p.title)}</div>
        <div class="proj-desc">${esc(p.desc)}</div>
        <div class="proj-metric">${esc(p.metric)}</div>
      </div>
      <div class="proj-foot">
        ${p.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}
        ${p.link?`<a class="proj-link" href="${esc(p.link)}" target="_blank" rel="noopener">GitHub ${IC.ext}</a>`:''}
      </div>
    </div>`).join('');
}

// FIX: config.json stores {title, subtitle} for achievements, not
// {title, icon, desc}. Render subtitle and fall back to a default
// trophy icon instead of printing the literal string "undefined".
function rAch() {
  document.getElementById('ach-grid').innerHTML = C.achievements.map(a=>`
    <div class="ach-card rv">
      <div class="ach-icon">${a.icon || IC.trophy}</div>
      <div><div class="ach-title">${esc(a.title)}</div><div class="ach-desc">${esc(a.subtitle ?? a.desc ?? '')}</div></div>
    </div>`).join('');
}

function rContact() {
  document.getElementById('contact-links').innerHTML = `
    <a href="mailto:${esc(C.email)}" class="c-link"><div class="c-icon">${IC.email}</div>${esc(C.email)}</a>
    <a href="tel:${esc(C.phone)}"   class="c-link"><div class="c-icon">${IC.phone}</div>${esc(C.phone)}</a>
    <a href="${esc(C.linkedin)}" target="_blank" rel="noopener" class="c-link"><div class="c-icon">${IC.linkedin}</div>${esc("Linkedin")}</a>
    ${C.github?`<a href="${esc(C.github)}" target="_blank" rel="noopener" class="c-link"><div class="c-icon">${IC.github}</div>${esc("Github")}</a>`:''}
    <span class="c-link"><div class="c-icon">${IC.pin}</div></span>`;
}

function rFooter() {
  document.getElementById('footer-txt').innerHTML =
    `© ${new Date().getFullYear()} <span>${esc(C.name)}</span> · ${esc(C.role)} · ${esc(C.location)}`;
}

/* ═══ SCROLL REVEAL ════════════════════════════════════════ */
function initReveal() {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) {
    document.querySelectorAll('.rv').forEach(el=>el.classList.add('in')); return;
  }
  const io = new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('in'),i*55); io.unobserve(e.target); }
    });
  },{threshold:.07});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   ADMIN — SERVERLESS GITHUB AUTH
═══════════════════════════════════════════════════════════ */
function initAdmin() {
  const loginModal   = document.getElementById('login-modal');
  const loginClose   = document.getElementById('login-close');
  const loginSubmit  = document.getElementById('login-submit');
  const loginBtnTxt  = document.getElementById('login-btn-txt');
  const loginErr     = document.getElementById('login-err');
  const adminBtn     = document.getElementById('admin-btn');
  const panel        = document.getElementById('admin-panel');
  const overlay      = document.getElementById('panel-overlay');
  const panelClose   = document.getElementById('panel-close');
  const pushBtn      = document.getElementById('btn-push');
  const pushTxt      = document.getElementById('push-txt');
  const apStatus     = document.getElementById('ap-status');

  const openLogin = () => {
    loginModal.classList.remove('hidden');
    loginErr.classList.add('hidden');
    document.getElementById('gh-token-input').value = '';
    setTimeout(()=>document.getElementById('gh-token-input').focus(),60);
  };
  const closeLogin = () => loginModal.classList.add('hidden');

  const openPanel = () => {
    panel.classList.remove('hidden');
    panel.classList.add('open');
    overlay.classList.remove('hidden');
    panel.setAttribute('aria-hidden','false');
    buildEditor();
    updateGhStatus();
  };
  const closePanel = () => {
    panel.classList.remove('open');
    overlay.classList.add('hidden');
    setTimeout(()=>panel.classList.add('hidden'),360);
    panel.setAttribute('aria-hidden','true');
  };

  adminBtn.addEventListener('click', openLogin);
  loginClose.addEventListener('click', closeLogin);
  loginModal.addEventListener('click', e=>{ if(e.target===loginModal) closeLogin(); });
  panelClose.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  loginSubmit.addEventListener('click', async () => {
    const token = document.getElementById('gh-token-input').value.trim();
    const owner = document.getElementById('gh-owner-input').value.trim();
    const repo  = document.getElementById('gh-repo-input').value.trim();

    if (!token || !owner || !repo) {
      loginErr.textContent = 'Please fill in all three fields.';
      loginErr.classList.remove('hidden'); return;
    }

    loginBtnTxt.textContent = 'Verifying…';
    loginSubmit.disabled    = true;
    loginErr.classList.add('hidden');

    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
      });

      if (res.status === 401 || res.status === 403) throw new Error('Token rejected by GitHub.');
      if (res.status === 404) throw new Error(`Repo "${owner}/${repo}" not found (check name + access).`);
      if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

      const data = await res.json();
      if (!data.permissions?.push && !data.permissions?.admin) {
        throw new Error('Token has read-only access. Enable "Contents: Write" permission.');
      }

      SESSION.token  = token;
      SESSION.owner  = owner;
      SESSION.repo   = repo;
      SESSION.branch = C.githubBranch || 'main';
      SESSION.authed = true;

      closeLogin();
      openPanel();
    } catch (err) {
      loginErr.textContent = '✗ ' + err.message;
      loginErr.classList.remove('hidden');
    } finally {
      loginBtnTxt.textContent = 'Verify & Unlock Editor';
      loginSubmit.disabled    = false;
    }
  });

  ['gh-token-input','gh-owner-input','gh-repo-input'].forEach(id=>{
    document.getElementById(id).addEventListener('keydown', e=>{ if(e.key==='Enter') loginSubmit.click(); });
  });

  document.querySelectorAll('.ap-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.ap-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.ap-body').forEach(b=>{b.style.display='none';b.classList.add('hidden');});
      tab.classList.add('active');
      const body = document.getElementById('tab-'+tab.dataset.tab);
      body.classList.remove('hidden');
      body.style.display = 'flex';
    });
  });
  document.getElementById('tab-identity').style.display = 'flex';

  pushBtn.addEventListener('click', async ()=>{
    if (!SESSION.authed) {
      showStatus('Not authenticated. Please log in again.','err'); return;
    }
    pushBtn.disabled = true; pushTxt.textContent = 'Pushing…';

    try {
      const apiUrl = `https://api.github.com/repos/${SESSION.owner}/${SESSION.repo}/contents/config.json`;
      const headers = { Authorization:`Bearer ${SESSION.token}`, Accept:'application/vnd.github+json', 'Content-Type':'application/json' };

      let sha = null;
      try {
        const g = await fetch(`${apiUrl}?ref=${SESSION.branch}`, {headers});
        if (g.ok) { const d = await g.json(); sha = d.sha; }
      } catch(_){}

      const content = btoa(unescape(encodeURIComponent(JSON.stringify(C, null, 2))));
      const body = {
        message: `Update portfolio — ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}`,
        content,
        branch: SESSION.branch,
        ...(sha ? {sha} : {})
      };

      const put = await fetch(apiUrl, {method:'PUT', headers, body:JSON.stringify(body)});
      if (!put.ok) { const e=await put.json(); throw new Error(e.message||`HTTP ${put.status}`); }

      showStatus(`✓ Pushed to ${SESSION.owner}/${SESSION.repo} (${SESSION.branch}) — live in ~1 min`,'ok');
    } catch(err) {
      showStatus('✗ Push failed: '+err.message,'err');
    } finally {
      pushBtn.disabled=false; pushTxt.textContent='Push to GitHub';
    }
  });

  document.getElementById('btn-logout').addEventListener('click', ()=>{
    SESSION = {token:null,owner:null,repo:null,branch:'main',authed:false};
    closePanel();
    showStatus('','');
  });

  document.getElementById('btn-export-json').addEventListener('click', ()=>{
    const json = JSON.stringify(C, null, 2);
    navigator.clipboard?.writeText(json).then(()=>{
      const btn = document.getElementById('btn-export-json');
      btn.textContent = '✓ Copied!';
      setTimeout(()=>btn.textContent='📋 Copy config.json to clipboard', 2200);
    });
  });

  function showStatus(msg, type) {
    apStatus.textContent = msg;
    apStatus.className   = 'ap-status ' + type;
    apStatus.classList.toggle('hidden', !msg);
    if (msg) setTimeout(()=>apStatus.classList.add('hidden'), 8000);
  }
  function updateGhStatus() {
    const dot = document.querySelector('.gh-dot');
    const txt = document.getElementById('gh-status-txt');
    if (SESSION.authed) {
      dot.classList.add('on');
      txt.textContent = `Connected as ${SESSION.owner} → ${SESSION.repo}`;
    } else {
      dot.classList.remove('on');
      txt.textContent = 'Not connected';
    }
  }
}

/* ═══ EDITOR: BUILD ALL PANELS ═════════════════════════════ */
function buildEditor() {
  buildFieldDivs();
  buildStatsEditor();
  buildExpEditor();
  buildProjEditor();
}

function buildFieldDivs() {
  document.querySelectorAll('.ef[data-k]').forEach(div=>{
    if (div.classList.contains('built')) return;
    div.classList.add('built');
    const k     = div.dataset.k;
    const label = div.dataset.label || k;
    const hint  = div.dataset.hint  || '';
    const type  = div.dataset.type  || 'text';
    const rows  = div.dataset.rows  || 3;

    let val = C[k];
    if (Array.isArray(val)) val = val.join('\n');
    val = val || '';

    let inner;
    if (type === 'textarea') {
      inner = `<textarea class="ef-ta" data-field="${k}" rows="${rows}">${val}</textarea>`;
    } else if (type === 'color') {
      inner = `<div class="color-row">
        <input class="ef-inp" type="text" data-field="${k}" value="${val}" placeholder="#00D4AA">
        <input class="color-swatch" type="color" data-swatch="${k}" value="${val||'#00D4AA'}">
      </div>`;
    } else if (type === 'password') {
      inner = `<input class="ef-inp" type="password" data-field="${k}" value="${val}">`;
    } else {
      inner = `<input class="ef-inp" type="${type}" data-field="${k}" value="${val}">`;
    }

    div.className = 'ef-wrap';
    div.innerHTML = `
      ${label ? `<label class="ef-lbl">${label}</label>` : ''}
      ${inner}
      ${hint ? `<span class="ef-hint">${hint}</span>` : ''}`;

    const inp = div.querySelector(`[data-field="${k}"]`);
    inp.addEventListener('input', ()=>{
      const v = inp.value;
      C[k] = Array.isArray(CONFIG_ORIG[k]) ? v.split('\n').filter(l=>l.trim()) : v;
      renderAll();
    });

    const sw = div.querySelector(`[data-swatch="${k}"]`);
    if (sw) {
      sw.addEventListener('input', ()=>{
        inp.value = sw.value; C[k] = sw.value; applyAccent();
      });
      inp.addEventListener('input', ()=>{
        if (/^#[0-9A-Fa-f]{6}$/.test(inp.value)) sw.value = inp.value;
      });
    }
  });
}

let CONFIG_ORIG = null;
const _origBoot = setInterval(()=>{ if(C){ CONFIG_ORIG=JSON.parse(JSON.stringify(C)); clearInterval(_origBoot); } },50);

function buildStatsEditor() {
  const el = document.getElementById('ap-stats-list');
  el.innerHTML = '';
  C.heroStats.forEach((s,i)=>{
    const card = mk('div','ef-card');
    card.innerHTML = `
      <div class="ef-card-head">
        <span class="ef-card-title">Stat ${i+1}</span>
        <button class="ef-del">✕</button>
      </div>
      <div class="ef-wrap"><label class="ef-lbl">Value</label><input class="ef-inp" data-sv="${i}" value="${esc(s.value)}"></div>
      <div class="ef-wrap"><label class="ef-lbl">Label</label><input class="ef-inp" data-sl="${i}" value="${esc(s.label)}"></div>`;
    el.appendChild(card);
    card.querySelector(`[data-sv="${i}"]`).addEventListener('input', e=>{ C.heroStats[i].value=e.target.value; rHero(); initReveal(); });
    card.querySelector(`[data-sl="${i}"]`).addEventListener('input', e=>{ C.heroStats[i].label=e.target.value; rHero(); initReveal(); });
    card.querySelector('.ef-del').addEventListener('click', ()=>{ C.heroStats.splice(i,1); buildStatsEditor(); rHero(); initReveal(); });
  });
  document.getElementById('add-stat').onclick = ()=>{ C.heroStats.push({value:'',label:''}); buildStatsEditor(); rHero(); initReveal(); };
}

function buildExpEditor() {
  const el = document.getElementById('ap-exp-list');
  el.innerHTML = '';
  C.experience.forEach((exp,i)=>{
    const card = mk('div','ef-card');
    card.innerHTML = `
      <div class="ef-card-head">
        <span class="ef-card-title">${esc(exp.role||'New Role')}</span>
        <button class="ef-del">✕</button>
      </div>
      <div class="ef-wrap"><label class="ef-lbl">Role</label><input class="ef-inp" data-ek="role" value="${esc(exp.role)}"></div>
      <div class="ef-wrap"><label class="ef-lbl">Company</label><input class="ef-inp" data-ek="company" value="${esc(exp.company)}"></div>
      <div class="ef-wrap"><label class="ef-lbl">Period</label><input class="ef-inp" data-ek="period" value="${esc(exp.period)}"></div>
      <div class="ef-wrap"><label class="ef-lbl">Type</label><input class="ef-inp" data-ek="type" value="${esc(exp.type)}"></div>
      <div class="ef-wrap"><label class="ef-lbl">Bullets (one per line)</label><textarea class="ef-ta" data-ek="bullets" rows="4">${esc(exp.bullets.join('\n'))}</textarea></div>`;
    el.appendChild(card);
    card.querySelectorAll('[data-ek]').forEach(inp=>{
      inp.addEventListener('input', ()=>{
        const k=inp.dataset.ek;
        C.experience[i][k] = k==='bullets' ? inp.value.split('\n').filter(l=>l.trim()) : inp.value;
        card.querySelector('.ef-card-title').textContent = C.experience[i].role||'New Role';
        rExp(); initReveal();
      });
    });
    card.querySelector('.ef-del').addEventListener('click',()=>{ C.experience.splice(i,1); buildExpEditor(); rExp(); initReveal(); });
  });
  document.getElementById('add-exp').onclick = ()=>{ C.experience.push({period:'',role:'New Role',company:'',location:'India',type:'Full-time',bullets:['']});buildExpEditor();rExp();initReveal(); };
}

function buildProjEditor() {
  const list = document.getElementById('ap-proj-list');
  list.innerHTML = '';

  C.projects.forEach((p,i)=>{
    const card = mk('div','ef-card');
    card.dataset.idx = i;
    card.draggable   = false;

    card.innerHTML = `
      <div class="ef-card-head">
        <span class="drag-handle" title="Drag to reorder">⠿</span>
        <span class="ef-card-title">${esc(p.title||'New Project')}</span>
        <button class="ef-del">✕</button>
      </div>
      <div class="ef-wrap"><label class="ef-lbl">Title</label><input class="ef-inp" data-pk="title" value="${esc(p.title)}"></div>
      <div class="ef-wrap"><label class="ef-lbl">Description</label><textarea class="ef-ta" data-pk="desc" rows="3">${esc(p.desc)}</textarea></div>
      <div class="ef-wrap"><label class="ef-lbl">Metric / Result</label><input class="ef-inp" data-pk="metric" value="${esc(p.metric)}"></div>
      <div class="ef-wrap"><label class="ef-lbl">Tags (comma-separated)</label><input class="ef-inp" data-pk="tags" value="${esc(p.tags.join(', '))}"></div>
      <div class="ef-wrap"><label class="ef-lbl">GitHub Link (optional)</label><input class="ef-inp" type="url" data-pk="link" value="${esc(p.link)}"></div>`;

    list.appendChild(card);

    card.querySelectorAll('[data-pk]').forEach(inp=>{
      inp.addEventListener('input', ()=>{
        const k=inp.dataset.pk;
        C.projects[i][k] = k==='tags' ? inp.value.split(',').map(t=>t.trim()).filter(Boolean) : inp.value;
        card.querySelector('.ef-card-title').textContent = C.projects[i].title||'New Project';
        rProjects(); initReveal();
      });
    });
    card.querySelector('.ef-del').addEventListener('click',()=>{ C.projects.splice(i,1); buildProjEditor(); rProjects(); initReveal(); });

    const handle = card.querySelector('.drag-handle');
    handle.addEventListener('mousedown', ()=>{ card.draggable = true; });
    handle.addEventListener('touchstart', ()=>{ card.draggable = true; }, {passive:true});
    card.addEventListener('dragend',  ()=>{ card.draggable = false; card.classList.remove('dragging'); list.querySelectorAll('.ef-card').forEach(c=>c.classList.remove('drag-over')); });
    card.addEventListener('dragstart', e=>{ e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain', i); setTimeout(()=>card.classList.add('dragging'),0); });
    card.addEventListener('dragover', e=>{ e.preventDefault(); e.dataTransfer.dropEffect='move'; list.querySelectorAll('.ef-card').forEach(c=>c.classList.remove('drag-over')); card.classList.add('drag-over'); });
    card.addEventListener('drop', e=>{
      e.preventDefault();
      const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
      const toIdx   = parseInt(card.dataset.idx);
      if (fromIdx === toIdx) return;
      const [moved] = C.projects.splice(fromIdx, 1);
      C.projects.splice(toIdx, 0, moved);
      buildProjEditor();
      rProjects();
      initReveal();
    });
  });

  document.getElementById('add-proj').onclick = ()=>{
    C.projects.push({title:'New Project',desc:'',metric:'',tags:[],link:''});
    buildProjEditor(); rProjects(); initReveal();
  };
}

function mk(tag, cls) { const el=document.createElement(tag); el.className=cls; return el; }
