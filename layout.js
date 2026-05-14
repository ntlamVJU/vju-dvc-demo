// Shared header + nav + footer + auth helpers for the VJU Public Service Portal (cong-dvc-demo).
// Design ref: dichvucong.gov.vn — 3-band header (utility · brand · nav).

// Public navigation — visible to everyone (signed in or not).
const NAV_PUBLIC = [
  { id: "home",    href: "index.html",   label: "Home" },
  { id: "guide",   href: "help.html",    label: "Help" },
  { id: "contact", href: "contact.html", label: "Contact" },
];

// Extra items inserted AFTER Home when the user is signed in.
const NAV_AUTH_EXTRA = [
  { id: "my-requests", href: "my-requests.html", label: "My Requests" },
  { id: "schedule",    href: "schedule.html",    label: "My Schedule" },
  { id: "directory",   href: "directory.html",   label: "Contact Directory" },
];

// ────────────────────────────────────────────────────────────────
// Current-user helpers (mock OIDC — persists in localStorage)
// ────────────────────────────────────────────────────────────────
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("dvc-demo:current-user") || "null"); }
  catch { return null; }
}
function setCurrentUser(u) {
  localStorage.setItem("dvc-demo:current-user", JSON.stringify(u));
}
function signOut() {
  localStorage.removeItem("dvc-demo:current-user");
  location.href = "index.html";
}

// ────────────────────────────────────────────────────────────────
// Build the actual <nav> items — Home + (auth items if signed in) + Help + Contact
// ────────────────────────────────────────────────────────────────
function buildNav(activeId, signedIn) {
  const items = [NAV_PUBLIC[0]]; // Home
  if (signedIn) items.push(...NAV_AUTH_EXTRA);
  items.push(NAV_PUBLIC[1], NAV_PUBLIC[2]); // Help, Contact
  return items.map(n =>
    `<a class="${n.id === activeId ? "active" : ""}" href="${n.href}">${esc(n.label)}</a>`
  ).join("");
}

// ────────────────────────────────────────────────────────────────
// mountLayout — public layout (Home / Help / Contact)
// If user is signed in, also injects auth items into nav + user dropdown into header.
// ────────────────────────────────────────────────────────────────
function mountLayout(activeId = "") {
  const me = getCurrentUser();
  const signedIn = !!me;

  const utilityBar = `
    <div class="utility-bar">
      <div class="utility-inner">
        <div class="utility-left">
          <span>${new Date().toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</span>
        </div>
        <div class="utility-right">
          <a href="tel:+842473000000">Support: 024.7300.0000</a>
          <span class="sep">·</span>
          <a href="help.html">Help</a>
        </div>
      </div>
    </div>`;

  const headerRight = signedIn
    ? `<div class="user-menu-wrap">
         <button class="user-menu-btn" onclick="event.stopPropagation(); toggleUserMenu(this)" aria-haspopup="menu">
           <span class="user-avatar">${esc((me.name || "?").charAt(0))}</span>
           <span class="user-name">${esc(me.name || "Account")}</span>
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
         </button>
         <div class="user-menu">
           <a href="#" onclick="event.preventDefault(); toast('Settings — demo only')">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.27.27.66.43 1 .43H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1 .43z"/></svg>
             Settings
           </a>
           <a href="#" onclick="event.preventDefault(); signOut()">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
             Log out
           </a>
         </div>
       </div>`
    : `<a class="btn-login-top" href="login.html">
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
         Sign in
       </a>`;

  const header = `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="index.html">
          <img src="logo.png" alt="VJU" />
          <div class="brand-text">
            <div class="brand-title">VJU Public Service Portal</div>
            <div class="brand-sub">VIETNAM JAPAN UNIVERSITY</div>
          </div>
        </a>
        <div class="header-actions">
          ${headerRight}
        </div>
      </div>
    </header>`;

  const nav = `
    <nav class="main-nav">
      <div class="main-nav-inner">
        <button class="main-nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false" onclick="toggleMobileNav(this)">
          <svg class="ico-open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <svg class="ico-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <span class="main-nav-toggle-label">Menu</span>
        </button>
        <div class="main-nav-links">
          ${buildNav(activeId, signedIn)}
        </div>
      </div>
    </nav>`;

  const slot = document.getElementById("site-shell");
  if (slot) slot.outerHTML = utilityBar + header + nav;

  // Footer
  const footer = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img src="logo.png" alt="VJU" />
          <h3>Vietnam Japan University — VNU</h3>
          <p>Online public service portal of VJU. Contact the One-stop Desk: <strong>024.7300.0000</strong> · Email: dichvucong@vju.ac.vn</p>
        </div>
        <div class="footer-col">
          <h4>Quick links</h4>
          <a href="index.html">Home</a>
          <a href="help.html">User guide</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-col">
          <h4>External</h4>
          <a href="https://dichvucong.gov.vn">National Public Service Portal</a>
          <a href="https://vju.ac.vn">VJU homepage</a>
        </div>
      </div>
      <div class="footer-copy">© 2026 Vietnam Japan University — VNU · Service ID: <strong>VJU-DVC-2026</strong></div>
    </footer>`;
  document.body.insertAdjacentHTML("beforeend", footer);

  // Global click-out handler for user menu
  document.addEventListener("click", () => {
    document.querySelectorAll(".user-menu.open").forEach(m => m.classList.remove("open"));
  });
}

// ────────────────────────────────────────────────────────────────
// mountAuthLayout — auth-gated layout. If not signed in, redirect to login with ?next=
// Use on pages that require a user (My Requests, Schedule, Directory, case-detail, deploy, reports).
// ────────────────────────────────────────────────────────────────
function mountAuthLayout(activeId = "") {
  const me = getCurrentUser();
  if (!me) {
    const next = encodeURIComponent(location.pathname.split("/").pop() + location.search);
    location.href = "login.html?next=" + next;
    return;
  }
  mountLayout(activeId);
}

// ────────────────────────────────────────────────────────────────
// Mobile nav toggle (hamburger menu at ≤640px)
// ────────────────────────────────────────────────────────────────
function toggleMobileNav(btn) {
  const nav = btn.closest(".main-nav");
  if (!nav) return;
  const open = nav.classList.toggle("open");
  btn.setAttribute("aria-expanded", String(open));
}

// ────────────────────────────────────────────────────────────────
// User menu toggle
// ────────────────────────────────────────────────────────────────
function toggleUserMenu(btn) {
  const menu = btn.parentElement.querySelector(".user-menu");
  const open = menu.classList.contains("open");
  document.querySelectorAll(".user-menu.open").forEach(m => m.classList.remove("open"));
  if (!open) menu.classList.add("open");
}

// ────────────────────────────────────────────────────────────────
// Lightweight toast — top-right, auto-dismiss.
// ────────────────────────────────────────────────────────────────
function toast(msg, kind = "info") {
  let host = document.getElementById("toast-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "toast-host";
    host.className = "toast-host";
    document.body.appendChild(host);
  }
  const el = document.createElement("div");
  el.className = "toast toast-" + kind;
  el.textContent = msg;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 240);
  }, 3200);
}

// ────────────────────────────────────────────────────────────────
// HTML-escape helper (used everywhere)
// ────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

// ────────────────────────────────────────────────────────────────
// Date / time formatting helpers (referenced by detail pages)
// ────────────────────────────────────────────────────────────────
function fmtDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}
function dueHoursText(h) {
  if (h == null) return "—";
  if (h < 1)  return Math.round(h * 60) + " minutes";
  if (h < 24) return h + " hour" + (h === 1 ? "" : "s");
  const days = Math.round(h / 8); // business-day approximation
  return days + " business day" + (days === 1 ? "" : "s");
}
function statusLabel(s) {
  return ({ pending: "Pending", processing: "Processing", late: "Overdue", done: "Completed" }[s] || s || "—");
}
