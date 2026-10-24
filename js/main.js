/* ==========================================================
   RENDERING (no need to edit below this line)
   ========================================================== */
const TBA = '<span class="tba">To be added</span>';

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function text(value) {
  return value && value.trim() ? esc(value) : TBA;
}

// Accepts watch?v=, youtu.be/, /embed/, /shorts/ links or a bare 11-character ID
function youtubeId(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : "";
}

function video(url, title) {
  const id = youtubeId(url);
  if (!id) {
    return `<div class="video video-placeholder" role="img" aria-label="Video coming soon for ${esc(title)}">
              <div><span class="icon" aria-hidden="true"></span><strong>Video coming soon</strong></div>
            </div>`;
  }
  return `<div class="video">
            <iframe src="https://www.youtube-nocookie.com/embed/${id}"
                    title="YouTube video: ${esc(title)}"
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen></iframe>
          </div>`;
}

function safeUrl(url) {
  return /^https:\/\//i.test((url || "").trim()) ? url.trim() : "";
}

function repoButton(url, label) {
  const href = safeUrl(url);
  if (!href) return `<p class="repo-missing">Repository link coming soon</p>`;
  return `<a class="btn" href="${esc(href)}" target="_blank" rel="noopener noreferrer"
             aria-label="View ${esc(label)} on GitHub (opens in a new tab)">View on GitHub <span class="arrow" aria-hidden="true">↗</span></a>`;
}

function initials(name) {
  return name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// Stagger delay for cards in a grid row. Stored as a data attribute and applied
// with JavaScript, because the Content-Security-Policy blocks inline style="" attributes.
const delay = (i, perRow = 3) => `data-d="${(i % perRow) * 90}"`;

// ---------- OWASP Top 10 helpers ----------
const owaspById = id => owaspTop10.items.find(item => item.id === (id || "").trim().toUpperCase());

function owaspBadge(id) {
  const item = owaspById(id);
  if (!item) return `<span class="owasp-badge unmapped">OWASP category to be added</span>`;
  return `<span class="owasp-badge" title="OWASP Top 10 ${esc(owaspTop10.version)}: ${esc(item.name)}">
            <span class="owasp-id">${esc(item.id)}:${esc(owaspTop10.version)}</span> ${esc(item.name)}
          </span>`;
}

// ---------- Before / after code comparison ----------
// Marks lines that were removed (vulnerable) or added (fixed) using a
// longest-common-subsequence line diff.
function diffLines(before, after) {
  const a = before.split("\n"), b = after.split("\n");
  const same = (x, y) => x.trim() === y.trim();
  const lcs = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = same(a[i], b[j]) ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const removed = new Set(), added = new Set();
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (same(a[i], b[j])) { i++; j++; }
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) removed.add(i++);
    else added.add(j++);
  }
  while (i < a.length) removed.add(i++);
  while (j < b.length) added.add(j++);
  return { a, b, removed, added };
}

function codeBlock(lines, changed, kind) {
  return `<pre class="code ${kind}"><code>${lines.map((line, n) => {
    const mark = changed.has(n) ? ` class="ln-${kind}"` : "";
    const sign = changed.has(n) ? (kind === "del" ? "−" : "+") : " ";
    return `<span${mark}><span class="ln" aria-hidden="true">${sign}</span>${esc(line) || " "}</span>`;
  }).join("")}</code></pre>`;
}

let compareCount = 0;
function codeCompare(c) {
  const before = (c.vulnerableCode || "").replace(/^\n+|\s+$/g, "");
  const after = (c.fixedCode || "").replace(/^\n+|\s+$/g, "");
  if (!before && !after) {
    return `<div><h4>Code Comparison</h4><p>${TBA}</p></div>`;
  }
  const d = diffLines(before, after);
  const id = `cmp-${++compareCount}`;
  const lang = c.language && c.language.trim() ? `<span class="code-lang">${esc(c.language)}</span>` : "";
  return `
    <div class="compare">
      <h4>Code Comparison ${lang}</h4>
      <div class="tabs" role="tablist" aria-label="Code before and after the fix">
        <button type="button" role="tab" id="${id}-t1" aria-controls="${id}-p1" aria-selected="true" class="tab bad">Vulnerable</button>
        <button type="button" role="tab" id="${id}-t2" aria-controls="${id}-p2" aria-selected="false" tabindex="-1" class="tab good">Fixed</button>
      </div>
      <div role="tabpanel" id="${id}-p1" aria-labelledby="${id}-t1" tabindex="0">
        ${before ? codeBlock(d.a, d.removed, "del") : `<p>${TBA}</p>`}
      </div>
      <div role="tabpanel" id="${id}-p2" aria-labelledby="${id}-t2" tabindex="0" hidden>
        ${after ? codeBlock(d.b, d.added, "add") : `<p>${TBA}</p>`}
      </div>
    </div>`;
}

// Members
document.getElementById("members-grid").innerHTML = members.map((m, i) => `
  <article class="card reveal" ${delay(i, 4)}>
    <div class="member-top">
      <div class="avatar" aria-hidden="true">${esc(initials(m.name))}</div>
      <h3>${esc(m.name)}</h3>
    </div>
    <span class="role">${esc(m.role)}</span>
    <dl class="member-meta">
      <dt>Matric No.</dt><dd>${text(m.matric)}</dd>
    </dl>
    <div class="contrib">
      <span class="status done">Completed contribution</span>
      <p>${text(m.completed)}</p>
    </div>
    <div class="contrib">
      <span class="status proposed">Proposed responsibilities</span>
      <p>${text(m.proposed)}</p>
    </div>
  </article>`).join("");

// Labs
document.getElementById("labs-grid").innerHTML = labs.map((lab, i) => {
  const title = lab.title && lab.title.trim() ? lab.title : `Lab ${i + 1}`;
  return `
  <article class="card reveal" ${delay(i)}>
    <h3>${esc(title)}${lab.title && lab.title.trim() ? "" : ` <span class="tba">Title to be added</span>`}</h3>
    <div><h4>Description</h4><p>${text(lab.description)}</p></div>
    ${video(lab.video, title + " demonstration")}
    <div><h4>Reflection</h4><p>${text(lab.reflection)}</p></div>
  </article>`;
}).join("");

// Main project
document.getElementById("project-main").innerHTML = `
  <article class="card project-feature reveal">
    <div class="project-body">
      <h3 class="project-title">${esc(project.name)}</h3>
      <div><h4>Problem Statement</h4><p>${text(project.problem)}</p></div>
      <div><h4>Project Description</h4><p>${text(project.description)}</p></div>
      <div><h4>Reflection</h4><p>${text(project.reflection)}</p></div>
      <div class="card-actions">${repoButton(project.repo, project.name)}</div>
    </div>
    ${video(project.video, project.name + " project overview")}
  </article>`;

// OWASP Top 10 coverage grid
document.getElementById("owasp-version").textContent = owaspTop10.version;
document.getElementById("owasp-grid").innerHTML = owaspTop10.items.map((item, i) => {
  const matched = cases.map((c, n) => ({ c, n })).filter(({ c }) => owaspById(c.owasp) === item);
  const list = matched.map(({ c, n }) => `Case ${String(n + 1).padStart(2, "0")}: ${esc(c.title)}`).join("<br>");
  return `
  <li class="owasp-tile reveal${matched.length ? " covered" : ""}" ${delay(i, 5)}>
    <span class="owasp-id">${esc(item.id)}</span>
    <span class="owasp-name">${esc(item.name)}</span>
    <span class="owasp-cases">${matched.length ? list : "Not covered yet"}</span>
  </li>`;
}).join("");
const coveredCount = new Set(cases.map(c => owaspById(c.owasp)).filter(Boolean)).size;
document.getElementById("owasp-count").textContent = `${coveredCount} of ${owaspTop10.items.length}`;

// Vulnerability cases
document.getElementById("cases-grid").innerHTML = cases.map((c, i) => `
  <article class="card reveal" ${delay(i, 2)}>
    <span class="case-number">Case ${String(i + 1).padStart(2, "0")} · Planned</span>
    <h3>${esc(c.title)}</h3>
    ${owaspBadge(c.owasp)}
    <div><h4>Vulnerability &amp; Impact</h4><p>${text(c.description)}</p></div>
    <div><h4>Security Fix Implemented</h4><p>${text(c.fix)}</p></div>
    ${codeCompare(c)}
    ${video(c.video, `Case ${i + 1}: ${c.title} demonstration`)}
    <div>
      <h4>Test Result</h4>
      <table class="test-table">
        <caption class="planned-note table-caption">Behaviour before and after the fix</caption>
        <tr><th scope="row">Before fix</th><td>${text(c.before)}</td></tr>
        <tr><th scope="row">After fix</th><td>${text(c.after)}</td></tr>
      </table>
    </div>
    <div><h4>Reflection</h4><p>${text(c.reflection)}</p></div>
    <div class="card-actions">${repoButton(c.repo, `Case ${i + 1} source code`)}</div>
  </article>`).join("");

// Apply stagger delays through the CSSOM (allowed by the CSP, unlike style="" attributes)
document.querySelectorAll("[data-d]").forEach(el => el.style.setProperty("--d", `${el.dataset.d}ms`));

/* ---------- Code comparison tabs (click + arrow keys) ---------- */
function selectTab(tab) {
  tab.parentElement.querySelectorAll('[role="tab"]').forEach(t => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
}
document.addEventListener("click", e => {
  const tab = e.target.closest('[role="tab"]');
  if (tab) selectTab(tab);
});
document.addEventListener("keydown", e => {
  const tab = e.target.closest('[role="tab"]');
  if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
  const tabs = [...tab.parentElement.querySelectorAll('[role="tab"]')];
  let i = tabs.indexOf(tab);
  if (e.key === "ArrowRight") i = (i + 1) % tabs.length;
  if (e.key === "ArrowLeft") i = (i - 1 + tabs.length) % tabs.length;
  if (e.key === "Home") i = 0;
  if (e.key === "End") i = tabs.length - 1;
  e.preventDefault();
  selectTab(tabs[i]);
  tabs[i].focus();
});

/* ---------- Show the live Content-Security-Policy in the Security section ---------- */
const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
const cspOut = document.getElementById("csp-text");
if (cspMeta && cspOut) {
  cspOut.textContent = cspMeta.content.split(";").map(rule => rule.trim()).filter(Boolean).join(";\n") + ";";
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Hero background: animated network of nodes ---------- */
(function heroNetwork() {
  const hero = document.querySelector(".hero");
  const canvas = document.querySelector(".hero-canvas");
  const ctx = canvas && canvas.getContext("2d");
  if (!ctx) return;

  const LINK = 140;                 // max distance for a connecting line
  const GOLD = "255, 215, 0";
  const BLUE = "170, 180, 255";
  let w = 0, h = 0, nodes = [], packets = [], running = false, frame = 0;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.round((w * h) / 13000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.6 + .8,
      gold: Math.random() < .3,
      phase: Math.random() * Math.PI * 2
    }));
    packets = [];
  }

  // A "packet" is a small gold light travelling along a link
  function spawnPacket() {
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    let best = null, bestD = LINK;
    for (const b of nodes) {
      if (b === a) continue;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < bestD) { best = b; bestD = d; }
    }
    if (best) packets.push({ a, b: best, t: 0 });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    frame++;

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      // gently pull nodes towards the mouse
      const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
      if (d < 180 && d > 1) { n.x += dx / d * .4; n.y += dy / d * .4; }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${a.gold && b.gold ? GOLD : BLUE}, ${(1 - d / LINK) * .28})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const a = nodes[i];
      const md = Math.hypot(mouse.x - a.x, mouse.y - a.y);
      if (md < 180) {
        ctx.strokeStyle = `rgba(${GOLD}, ${(1 - md / 180) * .5})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    for (const n of nodes) {
      const glow = n.gold ? .6 + Math.sin(frame * .03 + n.phase) * .4 : .55;
      ctx.fillStyle = `rgba(${n.gold ? GOLD : BLUE}, ${glow})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.gold ? n.r + .6 : n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (frame % 40 === 0 && packets.length < 8) spawnPacket();
    packets = packets.filter(p => (p.t += .012) < 1);
    for (const p of packets) {
      const x = p.a.x + (p.b.x - p.a.x) * p.t;
      const y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.fillStyle = `rgba(${GOLD}, .95)`;
      ctx.shadowColor = `rgba(${GOLD}, .9)`;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (running) requestAnimationFrame(draw);
  }

  function start() { if (!running) { running = true; requestAnimationFrame(draw); } }
  function stop() { running = false; }

  resize();
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); if (!running) draw(); }, 150);
  });

  if (reduceMotion) { draw(); return; }   // one still frame, no movement

  hero.addEventListener("pointermove", e => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });

  // Only animate while the hero is on screen and the tab is visible
  let heroVisible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      heroVisible && !document.hidden ? start() : stop();
    }).observe(hero);
  }
  document.addEventListener("visibilitychange", () => {
    document.hidden || !heroVisible ? stop() : start();
  });
  start();
})();

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  revealEls.forEach(el => revealer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("in"));
}

/* ---------- Typewriter in the hero ---------- */
const typed = document.getElementById("typed");
if (!reduceMotion && typedPhrases.length) {
  let phrase = 0, chars = typedPhrases[0].length, deleting = true;
  const tick = () => {
    const current = typedPhrases[phrase];
    chars += deleting ? -1 : 1;
    typed.textContent = current.slice(0, chars);
    let wait = deleting ? 35 : 70;
    if (!deleting && chars === current.length) { deleting = true; wait = 2200; }
    else if (deleting && chars === 0) {
      deleting = false;
      phrase = (phrase + 1) % typedPhrases.length;
      wait = 350;
    }
    setTimeout(tick, wait);
  };
  setTimeout(tick, 2600);
}

/* ---------- Dark / light mode toggle ---------- */
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  themeMeta.setAttribute("content", theme === "dark" ? "#04051c" : "#000080");
}
applyTheme(root.getAttribute("data-theme") || "light");
themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  if (!reduceMotion) {
    root.classList.add("theme-fade");
    setTimeout(() => root.classList.remove("theme-fade"), 500);
  }
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});
// Follow system changes until the visitor picks a theme themselves
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (err) {}
  if (!saved) applyTheme(e.matches ? "dark" : "light");
});

/* ---------- Header shadow, progress bar & back-to-top ---------- */
const header = document.querySelector(".site-header");
const progress = document.querySelector(".progress");
const toTop = document.querySelector(".to-top");
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  header.classList.toggle("scrolled", y > 8);
  toTop.classList.toggle("show", y > 600);
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();
toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  document.querySelector(".brand").focus({ preventScroll: true });
});

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");
toggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
navLinks.addEventListener("click", e => {
  if (e.target.closest("a")) {
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }
});

/* ---------- Highlight current section in navigation ---------- */
const sectionIds = ["home", "team", "labs", "projects", "reflection", "skills", "security", "resources"];
const linkFor = id => navLinks.querySelector(`a[href="#${id}"]`);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach(a => a.removeAttribute("aria-current"));
        const link = linkFor(entry.target.id);
        if (link) link.setAttribute("aria-current", "true");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}
