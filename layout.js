// Shared header + nav + footer for Cổng dịch vụ công VJU
// Style references: dichvucong.gov.vn, DVCLT (integrated portal), sv04.bcse-vju.com

const NAV = [
  { id: "home",      href: "index.html",        label: "Trang chủ"      },
  { id: "services",  href: "services.html",     label: "Dịch vụ công"   },
  { id: "lookup",    href: "lookup.html",       label: "Tra cứu hồ sơ"  },
  { id: "stats",     href: "stats.html",        label: "Thống kê"       },
  { id: "guide",     href: "#",                 label: "Hướng dẫn"      },
  { id: "contact",   href: "#",                 label: "Liên hệ"        },
];

function mountLayout(activeId = "") {
  const utilityBar = `
    <div class="utility-bar">
      <div class="utility-inner">
        <div class="utility-left">
          <span>${new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</span>
          <a href="#">Sơ đồ cổng</a>
          <a href="#">RSS</a>
        </div>
        <div class="utility-right">
          <a href="#">Hỗ trợ: 024.7300.0000</a>
          <span>·</span>
          <a href="lookup.html">Tra cứu hồ sơ</a>
          <span>·</span>
          <a href="login.html">Đăng nhập</a>
        </div>
      </div>
    </div>`;

  const header = `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="index.html">
          <img src="logo.png" alt="VJU" />
          <div class="brand-text">
            <div class="brand-title">Cổng Dịch Vụ Công Trường Đại Học Việt Nhật</div>
            <div class="brand-sub">VIETNAM JAPAN UNIVERSITY · Public Service Portal</div>
          </div>
        </a>
        <div class="header-actions">
          <button class="btn-lang">🇻🇳 Tiếng Việt ▾</button>
          <a class="btn-login-top" href="login.html">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Đăng nhập
          </a>
        </div>
      </div>
    </header>`;

  const nav = `
    <nav class="main-nav">
      <div class="main-nav-inner">
        ${NAV.map(n => `<a class="${n.id === activeId ? "active" : ""}" href="${n.href}">${n.label}</a>`).join("")}
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
          <h3>Trường Đại học Việt Nhật — ĐHQGHN</h3>
          <p>Cổng dịch vụ công trực tuyến của Trường ĐH Việt Nhật. Mọi thắc mắc xin liên hệ Bộ phận Một cửa: <strong>024.7300.0000</strong> · Email: dichvucong@vju.ac.vn</p>
        </div>
        <div class="footer-col">
          <h4>Liên kết nhanh</h4>
          <a href="services.html">Danh mục dịch vụ</a>
          <a href="lookup.html">Tra cứu hồ sơ</a>
          <a href="stats.html">Thống kê công khai</a>
          <a href="#">Hướng dẫn sử dụng</a>
          <a href="#">Câu hỏi thường gặp</a>
        </div>
        <div class="footer-col">
          <h4>Liên kết hữu ích</h4>
          <a href="https://dichvucong.gov.vn">Cổng DVC Quốc gia</a>
          <a href="#">Cổng DVC ĐHQGHN</a>
          <a href="https://vju.ac.vn">Trang chủ VJU</a>
          <a href="#">Văn bản pháp luật</a>
        </div>
      </div>
      <div class="footer-copy">
        © 2026 Trường Đại học Việt Nhật — ĐHQGHN · Bản quyền thuộc về VJU · Mã đăng ký DVC: <strong>VJU-DVC-2026</strong>
      </div>
    </footer>`;
  document.body.insertAdjacentHTML("beforeend", footer);
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
