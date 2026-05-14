# VJU Public Service Portal — Static Demo

English public-service-portal mockup for VJU Hub Request refactor — Phase 1a (static HTML/CSS/JS, no React/Inertia, no build step required to view).

**Live demo:** GitHub Pages — see repo Settings → Pages, or open `index.html` directly in a browser.

## Pages

| Public (no sign-in) | Auth-gated (sign in first) |
|---|---|
| `index.html` — Home + service catalogue | `my-requests.html` — Submitted by me / Assigned to me |
| `login.html` — OIDC stub (Continue with VJU) | `case-detail.html` — Chat-style timeline + slide-overs |
| `service-detail.html` — Service flow + Apply/Deploy CTA | `deploy.html` — Deploy workflow to many recipients |
| `submit-success.html` — Confirmation | `service-submit.html` — Apply form |
| `help.html`, `contact.html` | `schedule.html`, `directory.html`, `reports.html` |

## Stack

- Plain HTML + plain CSS + vanilla JS (no React / Vue / Inertia / Bootstrap)
- Google Fonts (Nunito) via CDN
- Tailwind CSS via standalone CLI — utility classes on top of `styles.css` component layer

## Build (Tailwind)

The Tailwind CLI binary `tools/tailwindcss.exe` is **not committed** (40 MB). Download it once:

```powershell
Invoke-WebRequest `
  -Uri 'https://github.com/tailwindlabs/tailwindcss/releases/download/v3.4.17/tailwindcss-windows-x64.exe' `
  -OutFile 'tools/tailwindcss.exe'
```

For Linux/Mac, get the matching binary from <https://github.com/tailwindlabs/tailwindcss/releases>.

Then build the output CSS:

```powershell
./tools/tailwindcss.exe -c tailwind.config.js -i tailwind.input.css -o tailwind.output.css --minify
```

Watch mode while editing:

```powershell
./tools/tailwindcss.exe -c tailwind.config.js -i tailwind.input.css -o tailwind.output.css --watch
```

`tailwind.output.css` IS committed so the demo works without running the build.

## Data shape

Mock data lives in `data.js`. Field shapes mirror real VJU Hub Laravel models for an eventual Phase 1b port:

- `SERVICES` ↔ `workflows` (process_code, due_working_hours, team, deployer_eligible, internal)
- `MOCK_USERS` ↔ `User` + `Workflow.deployers()` membership
- `SUBMITTED` / `INBOX` ↔ `workflow_requests` + `workflow_tasks`
- `DIRECTORY` ↔ `ContactDirectory/Index.tsx` sections → departments → employees
- `WORK_SCHEDULES` ↔ `work_schedules` (schedule_type, tieu_de, start/end date+time, chu_tri, attendees)
- `RECIPIENT_POOL` — pool for `DeployRequestRequest` recipient picker

## Constitution

This demo respects Constitution v1.1.0 Principle VI (public-service-portal UX): hồ-sơ-first landing, status timeline always visible, multi-step wizard, mã hồ sơ kiểu DVC. Tailwind was added later — Constitution amendment recorded separately.

## Approval gate

Each screen needs separate user approval before being ported to Phase 1b (React/Inertia integration into live VJU Hub).
