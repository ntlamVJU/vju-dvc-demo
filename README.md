# Cổng dịch vụ công VJU — Demo HTML

Demo tinh thần "Cổng dịch vụ công" cho chức năng Request của VJU Hub.

**Mục tiêu:** Refactor giao diện Request → mang tinh thần dịch vụ công (theo mẫu [dichvucong.gov.vn](https://dichvucong.gov.vn)), giữ engine workflow Flowable phía sau.

## Xem demo

🌐 Live: được host trên GitHub Pages — link sẽ có trong phần Settings → Pages của repo.

Hoặc mở local: double-click `index.html`.

## Cấu trúc

- `index.html` — Trang chủ DVC (banner đỏ + search + 2 cột danh mục + stats công khai)
- `services.html` — Danh mục dịch vụ công (group theo lĩnh vực, filter)
- `service-detail.html` — Chi tiết thủ tục: 6 mục chuẩn Nghị định 42 + stepper "luồng tốt nhất"
- `service-submit.html` — Nộp hồ sơ wizard 6 bước (style DVCLT)
- `submit-success.html` — Phiếu hẹn nhận kết quả + QR code
- `lookup.html` — Tra cứu hồ sơ công khai (không cần đăng nhập)
- `my-requests.html` — Hồ sơ của tôi (stepper, không phải inbox)
- `stats.html` — Thống kê công khai

## Tích hợp với VJU Hub

2 dịch vụ "Đang chạy thật" hiển thị mock của 2 workflow BPMN có sẵn trong VJU Hub:

| Mã | Tên | BPMN | Form gốc |
|---|---|---|---|
| TT-VJU-IT-01 | Hỗ trợ kỹ thuật & IT | `it-support` | `it-support-start-form.form` |
| TT-VJU-NP-01 | Xin nghỉ phép / công tác | `attendance-request` | `attendance-request-start-form.form` |

Mã thử cho trang Tra cứu:
- `DVC-2026-001234` — IT Support đang xử lý
- `DVC-2026-001198` — IT Support đã hoàn tất 5⭐
- `DVC-2026-001150` — Nghỉ phép chờ duyệt
- `DVC-2026-001102` — Đi công tác đã đồng bộ về VJU Attendance

## Palette

- Banner đỏ `#B91C1C` (đồng bộ logo VJU)
- Primary terracotta `#CE7A58` (theo dichvucong.gov.vn)
- Text navy `#1E2F41`
- Background `#F5F5F5`
- Font: Nunito

## Plan đầy đủ

Xem [`PLAN_request-dvc-refactor.md`](../PLAN_request-dvc-refactor.md) ở thư mục cha (4 phase: Demo → Backend → Frontend → Polish).
