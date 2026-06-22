/**
 * ============================================================
 *  PORTFOLIO BUILDER  v2
 *  Reads CONFIG from config.js and renders the entire page.
 *  New in v2: dark/light toggle, photo, resume download,
 *             live in-browser editor with config export.
 * ============================================================
 */

/* ── SVG ICON HELPERS ─────────────────────────────────────── */
const ICONS = {
  email:    `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  phone:    `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.21 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  pin:      `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  linkedin: `<svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
  github:   `<svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>`,
  link:     `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};
const icon = name => ICONS[name] || '';

/* ── LIVE CONFIG (can be mutated by editor) ─────────────────── */
let C = CONFIG; // reference — we mutate this object in the editor

/* ── APPLY ACCENT COLOR ─────────────────────────────────────── */
function applyAccentColor() {
  if (C.accentColor && C.accentColor.trim()) {
    document.documentElement.style.setProperty('--accent', C.accentColor.trim());
  }
}

/* ── DARK / LIGHT TOGGLE ──────────────────────────────────────  */
function initTheme() {
  const saved = localStorage.getItem('sp-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sp-theme', next);
  });
}

/* ── NAV ────────────────────────────────────────────────────── */
function renderNav() {
  const first = C.name.split(' ')[0].toLowerCase();
  const rest  = C.name.split(' ').slice(1).join(' ').toLowerCase();
  document.getElementById('nav-logo').innerHTML = `${first}<span>.${rest}</span>`;
  document.getElementById('nav-hire').href   = `mailto:${C.email}`;

  const resumeHref = C.resumeFile || '#';
  document.getElementById('nav-resume').href = resumeHref;
  if (!C.resumeFile) document.getElementById('nav-resume').style.display = 'none';
}

/* ── HERO ────────────────────────────────────────────────────── */
function renderHero() {
  document.getElementById('hero-tag').textContent  = C.tagline;
  document.getElementById('hero-name').textContent = C.name;
  document.getElementById('hero-role').textContent = C.role;
  document.getElementById('hero-bio').innerHTML    = C.bio.join('<br><br>');

  // Photo / avatar
  const inner = document.getElementById('photo-inner');
  if (C.photoUrl && C.photoUrl.trim()) {
    inner.innerHTML = `<img src="${C.photoUrl.trim()}" alt="${C.name} photo">`;
  } else {
    const initials = C.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    inner.textContent = initials;
  }

  // Resume button in hero
  const heroBtn = document.getElementById('hero-resume-btn');
  if (C.resumeFile) {
    heroBtn.href = C.resumeFile;
    heroBtn.download = C.resumeFile;
  } else {
    heroBtn.style.display = 'none';
  }

  // Stats
  document.getElementById('hero-stats').innerHTML = C.heroStats.map(s => `
    <div class="stat-item">
      <span class="stat-num">${s.value}</span>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

/* ── CONTACT BAR ─────────────────────────────────────────────── */
function renderContactBar() {
  document.getElementById('contact-bar').innerHTML = `
    <a href="tel:${C.phone}"             class="cbar-item">${icon('phone')} ${C.phone}</a>
    <a href="mailto:${C.email}"          class="cbar-item">${icon('email')} ${C.email}</a>
    <a href="${C.linkedin}" target="_blank" rel="noopener" class="cbar-item">${icon('linkedin')} ${C.linkedin.replace('https://','')}</a>
    <span class="cbar-item">${icon('pin')} ${C.location}</span>
  `;
}

/* ── ABOUT ───────────────────────────────────────────────────── */
function renderAbout() {
  document.getElementById('about-bio').innerHTML =
    C.bio.map(p => `<p class="about-text">${p}</p>`).join('');

  const topEdu = C.education[0];
  const secEdu = C.education[1];
  document.getElementById('about-facts').innerHTML = `
    <div class="fact-box"><span class="fact-val">${topEdu.institution.split(',')[0]}</span><div class="fact-key">${topEdu.degree.split('—')[0].trim()} · ${topEdu.grade}</div></div>
    <div class="fact-box"><span class="fact-val">${secEdu.institution.split(',')[0].split(' ').slice(0,2).join(' ')}</span><div class="fact-key">${secEdu.degree.split('—')[0].trim()} · ${secEdu.grade}</div></div>
    <div class="fact-box"><span class="fact-val">AIR 60</span><div class="fact-key">IIT JAM Mathematics 2022</div></div>
    <div class="fact-box"><span class="fact-val">1.5+ Yrs</span><div class="fact-key">Industry Experience</div></div>
  `;

  document.getElementById('about-edu').innerHTML =
    C.education.map(e => `
      <div class="edu-item">
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-inst">${e.institution}</div>
        <div class="edu-grade">${e.grade}</div>
        <div class="edu-year">${e.year}</div>
      </div>
    `).join('');

  document.getElementById('about-certs').innerHTML =
    C.certifications.map(c => `
      <div class="cert-badge"><strong>${c.issuer}</strong>${c.title}</div>
    `).join('');

  document.getElementById('about-hobbies').innerHTML =
    C.hobbies.map(h => `<span class="hobby">${h}</span>`).join('');
}

/* ── SKILLS ──────────────────────────────────────────────────── */
function renderSkills() {
  document.getElementById('skills-grid').innerHTML =
    C.skills.map(s => `
      <div class="skill-card">
        <div class="skill-cat">${s.category}</div>
        <div class="skill-tags">
          ${s.highlights.map(t => `<span class="tag highlight">${t}</span>`).join('')}
          ${s.others.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');
}

/* ── EXPERIENCE ──────────────────────────────────────────────── */
function renderExperience() {
  document.getElementById('experience-list').innerHTML =
    C.experience.map(e => `
      <div class="exp-item">
        <div class="exp-meta">
          <div class="exp-period">${e.period}</div>
          <div class="exp-company">${e.company}</div>
          <div class="exp-loc">${e.location}</div>
          <span class="exp-type">${e.type}</span>
        </div>
        <div>
          <div class="exp-role">${e.role}</div>
          <ul class="exp-bullets">
            ${e.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
}

/* ── PROJECTS ────────────────────────────────────────────────── */
function renderProjects() {
  document.getElementById('projects-grid').innerHTML =
    C.projects.map(p => `
      <div class="proj-card">
        <div class="proj-accent"></div>
        <div class="proj-body">
          <div class="proj-title">${p.title}</div>
          <div class="proj-desc">${p.desc}</div>
          <div class="proj-metric">${p.metric}</div>
        </div>
        <div class="proj-footer">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener" class="proj-link">GitHub ${icon('link')}</a>` : ''}
        </div>
      </div>
    `).join('');
}

/* ── ACHIEVEMENTS ────────────────────────────────────────────── */
function renderAchievements() {
  document.getElementById('ach-grid').innerHTML =
    C.achievements.map(a => `
      <div class="ach-card">
        <div class="ach-icon">${a.icon}</div>
        <div>
          <div class="ach-title">${a.title}</div>
          <div class="ach-desc">${a.desc}</div>
        </div>
      </div>
    `).join('');
}

/* ── CONTACT ─────────────────────────────────────────────────── */
function renderContact() {
  document.getElementById('contact-links').innerHTML = `
    <a href="mailto:${C.email}" class="clink">
      <div class="clink-icon">${icon('email')}</div>${C.email}
    </a>
    <a href="tel:${C.phone}" class="clink">
      <div class="clink-icon">${icon('phone')}</div>${C.phone}
    </a>
    <a href="${C.linkedin}" target="_blank" rel="noopener" class="clink">
      <div class="clink-icon">${icon('linkedin')}</div>${C.linkedin.replace('https://','')}
    </a>
    ${C.github ? `<a href="${C.github}" target="_blank" rel="noopener" class="clink">
      <div class="clink-icon">${icon('github')}</div>${C.github.replace('https://','')}
    </a>` : ''}
    <span class="clink"><div class="clink-icon">${icon('pin')}</div>${C.location}</span>
  `;
}

/* ── FOOTER ──────────────────────────────────────────────────── */
function renderFooter() {
  const year = new Date().getFullYear();
  document.getElementById('footer-text').innerHTML =
    `© ${year} <span>${C.name}</span> · ${C.role} · ${C.location}`;
}

/* ── FULL RE-RENDER ──────────────────────────────────────────── */
function renderAll() {
  renderNav(); renderHero(); renderContactBar(); renderAbout();
  renderSkills(); renderExperience(); renderProjects();
  renderAchievements(); renderContact(); renderFooter();
  applyAccentColor();
}

/* ── MOBILE MENU ─────────────────────────────────────────────── */
function initMobileMenu() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

/* ── CONTACT FORM ────────────────────────────────────────────── */
function initContactForm() {
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    this.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  });
}

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = document.querySelectorAll('.skill-card, .proj-card, .ach-card, .exp-item, .photo-wrap');
  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   LIVE EDITOR
══════════════════════════════════════════════════════════════ */
function initEditor() {
  const panel   = document.getElementById('edit-panel');
  const overlay = document.getElementById('edit-overlay');
  const toggle  = document.getElementById('edit-toggle');
  const close   = document.getElementById('ep-close');

  function openPanel() {
    panel.classList.add('open');
    overlay.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    toggle.classList.add('active');
    populateEditor();
  }
  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    toggle.classList.remove('active');
  }

  toggle.addEventListener('click', () => panel.classList.contains('open') ? closePanel() : openPanel());
  close.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  /* ── TAB SWITCHING ── */
  document.querySelectorAll('.ep-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ep-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.ep-body').forEach(b => b.classList.add('hidden'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.remove('hidden');
      if (tab.dataset.tab === 'export') buildExport();
    });
  });

  /* ── POPULATE FIELDS ── */
  function populateEditor() {
    // Simple text fields
    ['name','role','tagline','location','email','phone','linkedin','github','resumeFile','photoUrl','accentColor'].forEach(key => {
      const el = document.querySelector(`[data-key="${key}"]`);
      if (!el) return;
      el.value = C[key] || '';
      el.addEventListener('input', () => {
        C[key] = el.value;
        renderAll();
        initScrollReveal();
      });
    });

    // Bio (array → textarea, one paragraph per line)
    const bioEl = document.querySelector('[data-key="bio"]');
    if (bioEl) {
      bioEl.value = C.bio.join('\n');
      bioEl.addEventListener('input', () => {
        C.bio = bioEl.value.split('\n').filter(l => l.trim());
        renderAll();
      });
    }

    // Color picker sync
    const picker = document.getElementById('color-picker');
    const accentEl = document.querySelector('[data-key="accentColor"]');
    if (picker && accentEl) {
      picker.value = C.accentColor || '#00D4AA';
      picker.addEventListener('input', () => {
        accentEl.value = picker.value;
        C.accentColor = picker.value;
        applyAccentColor();
      });
      accentEl.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(accentEl.value)) picker.value = accentEl.value;
      });
    }

    buildStatsEditor();
    buildExpEditor();
    buildProjEditor();
  }

  /* ── HERO STATS ── */
  function buildStatsEditor() {
    const list = document.getElementById('ep-stats-list');
    list.innerHTML = '';
    C.heroStats.forEach((stat, i) => {
      const card = document.createElement('div');
      card.className = 'ef-item-card';
      card.innerHTML = `
        <div class="ef-item-header">
          <span class="ef-item-title">Stat ${i+1}</span>
          <button class="ef-remove-btn" data-i="${i}">✕ Remove</button>
        </div>
        <div class="ef-group">
          <label class="ef-label">Value</label>
          <input class="ef-input" data-stat-val="${i}" type="text" value="${stat.value}">
        </div>
        <div class="ef-group">
          <label class="ef-label">Label</label>
          <input class="ef-input" data-stat-lab="${i}" type="text" value="${stat.label}">
        </div>
      `;
      list.appendChild(card);
      card.querySelector(`[data-stat-val="${i}"]`).addEventListener('input', e => {
        C.heroStats[i].value = e.target.value; renderHero();
      });
      card.querySelector(`[data-stat-lab="${i}"]`).addEventListener('input', e => {
        C.heroStats[i].label = e.target.value; renderHero();
      });
      card.querySelector('.ef-remove-btn').addEventListener('click', () => {
        C.heroStats.splice(i, 1); buildStatsEditor(); renderHero();
      });
    });
  }

  /* ── EXPERIENCE EDITOR ── */
  function buildExpEditor() {
    const list = document.getElementById('ep-exp-list');
    list.innerHTML = '';
    C.experience.forEach((exp, i) => {
      const card = document.createElement('div');
      card.className = 'ef-item-card';
      card.innerHTML = `
        <div class="ef-item-header">
          <span class="ef-item-title">${exp.role || 'New Role'}</span>
          <button class="ef-remove-btn" data-i="${i}">✕</button>
        </div>
        <div class="ef-group"><label class="ef-label">Role Title</label>
          <input class="ef-input" data-exp-role="${i}" type="text" value="${exp.role}"></div>
        <div class="ef-group"><label class="ef-label">Company</label>
          <input class="ef-input" data-exp-co="${i}" type="text" value="${exp.company}"></div>
        <div class="ef-group"><label class="ef-label">Period</label>
          <input class="ef-input" data-exp-per="${i}" type="text" value="${exp.period}"></div>
        <div class="ef-group"><label class="ef-label">Type (Full-time / Internship)</label>
          <input class="ef-input" data-exp-type="${i}" type="text" value="${exp.type}"></div>
        <div class="ef-group"><label class="ef-label">Bullet points (one per line)</label>
          <textarea class="ef-textarea" data-exp-bul="${i}" rows="5">${exp.bullets.join('\n')}</textarea></div>
      `;
      list.appendChild(card);

      const bind = (sel, key) => {
        card.querySelector(sel).addEventListener('input', e => {
          C.experience[i][key] = e.target.value;
          card.querySelector('.ef-item-title').textContent = C.experience[i].role || 'New Role';
          renderExperience(); initScrollReveal();
        });
      };
      bind(`[data-exp-role="${i}"]`, 'role');
      bind(`[data-exp-co="${i}"]`,   'company');
      bind(`[data-exp-per="${i}"]`,  'period');
      bind(`[data-exp-type="${i}"]`, 'type');

      card.querySelector(`[data-exp-bul="${i}"]`).addEventListener('input', e => {
        C.experience[i].bullets = e.target.value.split('\n').filter(l => l.trim());
        renderExperience(); initScrollReveal();
      });
      card.querySelector('.ef-remove-btn').addEventListener('click', () => {
        C.experience.splice(i, 1); buildExpEditor(); renderExperience(); initScrollReveal();
      });
    });

    document.getElementById('ep-add-exp').onclick = () => {
      C.experience.push({ period:'', role:'New Role', company:'', location:'India', type:'Full-time', bullets:[''] });
      buildExpEditor(); renderExperience(); initScrollReveal();
    };
  }

  /* ── PROJECTS EDITOR ── */
  function buildProjEditor() {
    const list = document.getElementById('ep-proj-list');
    list.innerHTML = '';
    C.projects.forEach((proj, i) => {
      const card = document.createElement('div');
      card.className = 'ef-item-card';
      card.innerHTML = `
        <div class="ef-item-header">
          <span class="ef-item-title">${proj.title || 'New Project'}</span>
          <button class="ef-remove-btn" data-i="${i}">✕</button>
        </div>
        <div class="ef-group"><label class="ef-label">Title</label>
          <input class="ef-input" data-proj-title="${i}" type="text" value="${proj.title}"></div>
        <div class="ef-group"><label class="ef-label">Description</label>
          <textarea class="ef-textarea" data-proj-desc="${i}" rows="3">${proj.desc}</textarea></div>
        <div class="ef-group"><label class="ef-label">Result / Metric</label>
          <input class="ef-input" data-proj-met="${i}" type="text" value="${proj.metric}"></div>
        <div class="ef-group"><label class="ef-label">Tags (comma-separated)</label>
          <input class="ef-input" data-proj-tags="${i}" type="text" value="${proj.tags.join(', ')}"></div>
        <div class="ef-group"><label class="ef-label">GitHub Link (optional)</label>
          <input class="ef-input" data-proj-link="${i}" type="url" value="${proj.link}"></div>
      `;
      list.appendChild(card);

      card.querySelector(`[data-proj-title="${i}"]`).addEventListener('input', e => {
        C.projects[i].title = e.target.value;
        card.querySelector('.ef-item-title').textContent = e.target.value || 'New Project';
        renderProjects(); initScrollReveal();
      });
      card.querySelector(`[data-proj-desc="${i}"]`).addEventListener('input', e => {
        C.projects[i].desc = e.target.value; renderProjects(); initScrollReveal();
      });
      card.querySelector(`[data-proj-met="${i}"]`).addEventListener('input', e => {
        C.projects[i].metric = e.target.value; renderProjects(); initScrollReveal();
      });
      card.querySelector(`[data-proj-tags="${i}"]`).addEventListener('input', e => {
        C.projects[i].tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
        renderProjects(); initScrollReveal();
      });
      card.querySelector(`[data-proj-link="${i}"]`).addEventListener('input', e => {
        C.projects[i].link = e.target.value; renderProjects(); initScrollReveal();
      });
      card.querySelector('.ef-remove-btn').addEventListener('click', () => {
        C.projects.splice(i, 1); buildProjEditor(); renderProjects(); initScrollReveal();
      });
    });

    document.getElementById('ep-add-proj').onclick = () => {
      C.projects.push({ title:'New Project', desc:'', metric:'', tags:[], link:'' });
      buildProjEditor(); renderProjects(); initScrollReveal();
    };
  }

  /* ── CONFIG EXPORT ── */
  function buildExport() {
    const out = `/**
 * ============================================================
 *  PERSONAL PORTFOLIO — CONFIG FILE
 *  Edit ONLY this file to update your entire website.
 * ============================================================
 */

const CONFIG = ${JSON.stringify(C, null, 2)};
`;
    document.getElementById('ep-config-output').value = out;
  }

  document.getElementById('ep-copy-config').addEventListener('click', () => {
    buildExport();
    const ta = document.getElementById('ep-config-output');
    ta.select();
    document.execCommand('copy');
    const btn = document.getElementById('ep-copy-config');
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy config.js to clipboard', 2000);
  });
}

/* ── BOOT ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderAll();
  initMobileMenu();
  initContactForm();
  initEditor();
  initScrollReveal();
});
