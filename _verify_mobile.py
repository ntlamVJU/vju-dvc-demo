"""Screenshot all pages on mobile viewport (iPhone 13 Pro)."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")

BASE = Path(__file__).parent
OUT = BASE / "_preview" / "mobile"
OUT.mkdir(parents=True, exist_ok=True)

pages = [
    ("01-home",          "index.html"),
    ("02-services",      "services.html"),
    ("03-service-detail","service-detail.html?code=TT-VJU-IT-01"),
    ("04-submit",        "service-submit.html?code=TT-VJU-IT-01"),
    ("05-success",       "submit-success.html?code=DVC-2026-001234&svc=TT-VJU-IT-01"),
    ("06-lookup",        "lookup.html?code=DVC-2026-001234"),
    ("07-my-requests",   "my-requests.html"),
    ("08-stats",         "stats.html"),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(
        viewport={"width": 390, "height": 844},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15",
    )
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda exc: errors.append(f"pageerror: {exc}"))
    for name, fn in pages:
        del errors[:]
        path = fn.split("?")[0]
        qs = fn.split("?")[1] if "?" in fn else ""
        url = (BASE / path).as_uri() + (f"?{qs}" if qs else "")
        page.goto(url, wait_until="networkidle", timeout=12000)
        page.wait_for_timeout(600)
        out = OUT / f"{name}.png"
        page.screenshot(path=str(out), full_page=True)
        msg = f"[{name}] ok"
        if errors: msg += " ERR: " + " | ".join(errors[:2])
        print(msg)
    browser.close()
