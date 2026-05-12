"""Screenshot all demo pages."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")

BASE = Path(__file__).parent
OUT  = BASE / "_preview"
OUT.mkdir(exist_ok=True)

pages = [
    ("01-home",          "index.html"),
    ("02-services",      "services.html"),
    ("03-service-detail","service-detail.html"),
    ("04-submit",        "service-submit.html"),
    ("05-success",       "submit-success.html"),
    ("06-lookup",        "lookup.html?code=DVC-2026-001234"),
    ("07-my-requests",   "my-requests.html"),
    ("08-stats",         "stats.html"),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda exc: errors.append(f"pageerror: {exc}"))
    page.on("console", lambda m: errors.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)
    for name, fn in pages:
        del errors[:]
        url = (BASE / fn).as_uri() if "?" not in fn else "file:///" + str(BASE / fn.split("?")[0]).replace("\\", "/") + "?" + fn.split("?")[1]
        page.goto(url, wait_until="networkidle", timeout=12000)
        page.wait_for_timeout(600)
        out = OUT / f"{name}.png"
        page.screenshot(path=str(out), full_page=True)
        msg = f"[{name}] ok"
        if errors: msg += " " + " | ".join(errors[:3])
        print(msg)
    browser.close()
