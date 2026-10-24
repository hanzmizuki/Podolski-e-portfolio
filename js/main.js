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
            <iframe src="https://www.youtube.com/embed/${id}"
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

// Stagger delay for cards in a grid row
const delay = i => `style="--d:${(i % 3) * 90}ms"`;

// Members
document.getElementById("members-grid").innerHTML = members.map((m, i) => `
  <article class="card reveal" style="--d:${(i % 4) * 90}ms">
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
    <div style="display:flex;flex-direction:column;gap:12px;min-width:0">
      <h3 style="font-size:1.35rem">${esc(project.name)}</h3>
      <div><h4>Problem Statement</h4><p>${text(project.problem)}</p></div>
      <div><h4>Project Description</h4><p>${text(project.description)}</p></div>
      <div><h4>Reflection</h4><p>${text(project.reflection)}</p></div>
      <div class="card-actions">${repoButton(project.repo, project.name)}</div>
    </div>
    ${video(project.video, project.name + " project overview")}
  </article>`;

// Vulnerability cases
document.getElementById("cases-grid").innerHTML = cases.map((c, i) => `
  <article class="card reveal" ${delay(i)}>
    <span class="case-number">Case ${String(i + 1).padStart(2, "0")} · Planned</span>
    <h3>${esc(c.title)}</h3>
    <div><h4>Vulnerability &amp; Impact</h4><p>${text(c.description)}</p></div>
    <div><h4>Security Fix Implemented</h4><p>${text(c.fix)}</p></div>
    ${video(c.video, `Case ${i + 1}: ${c.title} demonstration`)}
    <div>
      <h4>Test Result</h4>
      <table class="test-table">
        <caption class="planned-note" style="text-align:left;padding-bottom:4px">Behaviour before and after the fix</caption>
        <tr><th scope="row">Before fix</th><td>${text(c.before)}</td></tr>
        <tr><th scope="row">After fix</th><td>${text(c.after)}</td></tr>
      </table>
    </div>
    <div><h4>Reflection</h4><p>${text(c.reflection)}</p></div>
    <div class="card-actions">${repoButton(c.repo, `Case ${i + 1} source code`)}</div>
  </article>`).join("");

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
const sectionIds = ["home", "team", "labs", "projects", "reflection", "skills", "resources"];
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
