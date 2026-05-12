// Mock services catalog — based on the spirit of dichvucong.gov.vn (chuẩn Nghị định 42/2022)

// Mức độ DVC: 1 = chỉ thông tin, 2 = tải biểu mẫu, 3 = nộp online, 4 = nộp + nhận KQ online

const CATEGORIES = [
  // Đã triển khai trên VJU Hub (Flowable engine)
  { id: "it-support",   name: "Hỗ trợ kỹ thuật & IT",       audience: "all" },
  { id: "nghi-phep",    name: "Nghỉ phép · Công tác",       audience: "cb" },
  // Đang chuẩn bị
  { id: "hoc-vu",       name: "Học vụ",                     audience: "sv" },
  { id: "tai-chinh",    name: "Tài chính · Học phí",        audience: "sv" },
  { id: "ktx",          name: "Ký túc xá",                  audience: "sv" },
  { id: "khieu-nai",    name: "Khiếu nại · Phản ánh",       audience: "all" },
];

const SERVICES = [
  // ═══════════════════════════════════════════════════════════════════
  // ✅ ĐÃ TRIỂN KHAI TRÊN VJU HUB — chạy thật trên Flowable engine
  // ═══════════════════════════════════════════════════════════════════

  // ─── IT Support (tích hợp từ VJU Hub `it-support` BPMN) ───
  {
    code: "TT-VJU-IT-01",
    name: "Yêu cầu hỗ trợ kỹ thuật (IT Support)",
    cat: "it-support", audience: "all",
    muc: 4, sla_days: 3, fee: 0, agency: "Tổ Công nghệ thông tin",
    rating: 4.8, reviews: 156, used_30d: 198,
    deployed: true, bpmn: "it-support",
    desc: "Gửi yêu cầu hỗ trợ kỹ thuật cho phần cứng (laptop, máy in, máy chiếu…), phần mềm (website, hệ thống), mạng/Internet, hoặc hỗ trợ sự kiện. Tích hợp SLA tự động theo mức ưu tiên.",
    legal: "Quy định hỗ trợ CNTT nội bộ VJU 2025",
    docs: [
      { name: "Mô tả chi tiết sự cố (ảnh chụp màn hình nếu có)", required: false, has_template: false },
    ],
    steps: [
      { name: "Người yêu cầu gửi", actor: "Người dùng",          current: true },
      { name: "Phân công agent",   actor: "Hệ thống DMN",         duration: "tức thì" },
      { name: "Xử lý sự cố",       actor: "Chuyên viên IT",       duration: "0,5–7 ngày (theo mức ưu tiên)" },
      { name: "Người yêu cầu xác nhận", actor: "Người yêu cầu",   duration: "1 ngày" },
      { name: "Hoàn tất / Eskalate Team Leader", actor: "TL CNTT",duration: "(nếu cần)" },
    ],
    fields: [
      { key: "title", label: "Tiêu đề sự cố", type: "text", required: true, placeholder: "Mô tả ngắn gọn vấn đề" },
      { key: "category", label: "Lĩnh vực sự cố", type: "select", required: true, options: [
        "Phần cứng (Laptop, máy in, máy chiếu…)",
        "Phần mềm (Website, hệ thống…)",
        "Mạng / Internet",
        "Hỗ trợ truyền thông / sự kiện",
        "Khác",
      ]},
      { key: "priority", label: "Mức ưu tiên (SLA dự kiến)", type: "select", required: true, options: [
        "Thấp (7 ngày làm việc)",
        "Trung bình (3 ngày làm việc)",
        "Cao (1 ngày làm việc)",
        "Khẩn cấp (0,5 ngày làm việc)",
        "Thủ công — chọn deadline",
      ]},
      { key: "description", label: "Mô tả chi tiết", type: "textarea", required: true, placeholder: "Mô tả sự cố, các bước đã thử…" },
      { key: "ck_restart", label: "Tôi đã thử khởi động lại thiết bị / ứng dụng", type: "select", required: true, options: ["Có", "Không áp dụng"] },
      { key: "ck_guide", label: "Tôi đã tham khảo tài liệu hướng dẫn có sẵn", type: "select", required: true, options: ["Có", "Không áp dụng"] },
    ],
  },

  // ─── Xin nghỉ phép (tích hợp từ VJU Hub `attendance-request` BPMN) ───
  {
    code: "TT-VJU-NP-01",
    name: "Đơn xin nghỉ phép / công tác / làm việc từ xa",
    cat: "nghi-phep", audience: "cb",
    muc: 4, sla_days: 2, fee: 0, agency: "Phòng Tổ chức Cán bộ + Quản lý trực tiếp",
    rating: 4.7, reviews: 312, used_30d: 142,
    deployed: true, bpmn: "attendance-request",
    desc: "Cán bộ, viên chức gửi đơn xin nghỉ phép (phép năm, ốm, không lương, thai sản…), đi công tác, làm việc online hoặc tại cơ sở Mỹ Đình. Kết quả duyệt được đồng bộ tự động về hệ thống VJU Attendance.",
    legal: "Bộ Luật Lao động 2019 + Quy chế nội bộ VJU 2024",
    docs: [
      { name: "Giấy tờ minh chứng (giấy nghỉ ốm, vé máy bay…)", required: false, has_template: false },
    ],
    steps: [
      { name: "Cán bộ gửi đơn",              actor: "Cán bộ",          current: true },
      { name: "Quản lý trực tiếp duyệt",     actor: "Quản lý",         duration: "1 ngày" },
      { name: "Cán bộ chỉnh sửa (nếu cần)",  actor: "Cán bộ",          duration: "(tuỳ)" },
      { name: "Đồng bộ sang VJU Attendance", actor: "Hệ thống vệ tinh", duration: "tức thì" },
    ],
    fields: [
      { key: "title", label: "Tiêu đề đơn", type: "text", required: true, placeholder: "VD: Nghỉ phép năm tuần 10/03" },
      { key: "arrangement_type", label: "Hình thức nghỉ / sắp xếp công việc", type: "select", required: true, options: [
        "Làm việc online (không nghỉ)",
        "Làm việc tại cơ sở Mỹ Đình (không nghỉ)",
        "Nghỉ phép năm",
        "Nghỉ ốm",
        "Nghỉ không lương",
        "Nghỉ thai sản",
        "Đi công tác",
        "Nghỉ khác",
      ]},
      { key: "start_date", label: "Từ ngày & giờ",  type: "date", required: true },
      { key: "end_date",   label: "Đến ngày & giờ", type: "date", required: true },
      { key: "reason", label: "Ghi chú gửi quản lý", type: "textarea", placeholder: "Bối cảnh, người bàn giao công việc…" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 📋 ROADMAP — Workflow đề xuất triển khai tiếp (mock, "Đang chuẩn bị")
  // ═══════════════════════════════════════════════════════════════════

  // ─── Học vụ (đề xuất) ───
  {
    code: "TT-VJU-HV-01",
    name: "Cấp giấy xác nhận sinh viên",
    deployed: false,
    cat: "hoc-vu", audience: "sv",
    muc: 4,
    sla_days: 2,
    fee: 0,
    agency: "Phòng Đào tạo",
    rating: 4.8, reviews: 234, used_30d: 312,
    desc: "Cấp giấy xác nhận sinh viên đang theo học tại trường để làm thủ tục vay vốn ngân hàng chính sách, xin việc làm thêm, xin visa du học hoặc các mục đích khác.",
    legal: "Quyết định số 123/QĐ-VJU ngày 15/01/2026 của Hiệu trưởng",
    docs: [
      { name: "Đơn đề nghị xác nhận sinh viên", required: true, has_template: true },
      { name: "Bản chụp CCCD/CMND", required: true, has_template: false },
      { name: "Giấy giới thiệu của cơ quan nơi cần xác nhận (nếu có)", required: false, has_template: false },
    ],
    steps: [
      { name: "Sinh viên nộp hồ sơ", actor: "Sinh viên", duration: "—", current: true },
      { name: "Tiếp nhận & kiểm tra", actor: "Bộ phận Một cửa P. Đào tạo", duration: "0,5 ngày" },
      { name: "Trưởng phòng duyệt & ký", actor: "Trưởng Phòng Đào tạo",   duration: "1 ngày" },
      { name: "Trả kết quả",             actor: "Bộ phận Một cửa",         duration: "0,5 ngày" },
    ],
    fields: [
      { key: "muc_dich",  label: "Mục đích xin xác nhận", type: "select", required: true,
        options: ["Vay vốn ngân hàng chính sách", "Xin việc làm thêm", "Làm visa du học", "Mua vé tàu/xe ưu đãi", "Khác"] },
      { key: "so_ban",    label: "Số bản cần cấp", type: "number", required: true, placeholder: "vd: 2" },
      { key: "ngon_ngu",  label: "Ngôn ngữ", type: "select", required: true, options: ["Tiếng Việt", "Tiếng Anh", "Song ngữ"] },
      { key: "ghi_chu",   label: "Ghi chú thêm", type: "textarea" },
    ],
  },
  {
    code: "TT-VJU-HV-02",
    name: "Cấp bảng điểm tích lũy",
    cat: "hoc-vu", audience: "sv",
    muc: 4, sla_days: 3, fee: 20000, agency: "Phòng Đào tạo",
    rating: 4.7, reviews: 412, used_30d: 287,
    desc: "Cấp bảng điểm tích lũy chính thức có đóng dấu, dùng để nộp hồ sơ chuyển trường, du học, xin học bổng, xin việc.",
    legal: "Quyết định số 124/QĐ-VJU ngày 15/01/2026 của Hiệu trưởng",
    docs: [
      { name: "Đơn đề nghị cấp bảng điểm", required: true, has_template: true },
      { name: "Biên lai nộp lệ phí (nếu nộp trực tiếp)", required: false, has_template: false },
    ],
    steps: [
      { name: "Sinh viên nộp hồ sơ + nộp phí online", actor: "Sinh viên" },
      { name: "Tiếp nhận & đối chiếu điểm", actor: "Chuyên viên P. Đào tạo", duration: "1 ngày" },
      { name: "In bảng điểm & trình ký",   actor: "P. Đào tạo",              duration: "1 ngày" },
      { name: "Trưởng phòng ký + đóng dấu", actor: "Trưởng phòng",           duration: "0,5 ngày" },
      { name: "Trả kết quả",                actor: "Bộ phận Một cửa",        duration: "0,5 ngày" },
    ],
    fields: [
      { key: "hoc_ky",   label: "Học kỳ tính đến", type: "text", required: true, placeholder: "vd: HK1 2025–2026" },
      { key: "so_ban",   label: "Số bản",          type: "number", required: true, placeholder: "1" },
      { key: "ngon_ngu", label: "Ngôn ngữ",        type: "select", required: true, options: ["Tiếng Việt", "Tiếng Anh", "Song ngữ"] },
      { key: "xep_loai", label: "Kèm xếp loại?",   type: "select", required: true, options: ["Có", "Không"] },
    ],
  },
  {
    code: "TT-VJU-HV-03",
    name: "Bảo lưu kết quả học tập",
    cat: "hoc-vu", audience: "sv",
    muc: 3, sla_days: 5, fee: 0, agency: "Phòng Đào tạo",
    rating: 4.5, reviews: 76, used_30d: 18,
    desc: "Đăng ký tạm dừng học và bảo lưu kết quả đến tối đa 2 học kỳ.",
    legal: "Quy chế đào tạo đại học VJU 2024, Điều 18",
    docs: [
      { name: "Đơn xin bảo lưu (có xác nhận của Khoa)", required: true, has_template: true },
      { name: "Minh chứng lý do bảo lưu", required: true },
    ],
    steps: [
      { name: "SV nộp hồ sơ", actor: "Sinh viên" },
      { name: "Cố vấn học tập xác nhận", actor: "Cố vấn HT", duration: "1 ngày" },
      { name: "Khoa duyệt", actor: "Trưởng/Phó Khoa", duration: "2 ngày" },
      { name: "P. Đào tạo trình Hiệu trưởng", actor: "P. Đào tạo", duration: "1 ngày" },
      { name: "Hiệu trưởng ký quyết định", actor: "Hiệu trưởng", duration: "1 ngày" },
    ],
    fields: [
      { key: "hoc_ky", label: "Học kỳ bắt đầu bảo lưu", type: "text", required: true, placeholder: "Xuân 2026" },
      { key: "so_ky",  label: "Số học kỳ bảo lưu",      type: "select", required: true, options: ["1 học kỳ", "2 học kỳ"] },
      { key: "ly_do",  label: "Lý do bảo lưu",          type: "textarea", required: true },
    ],
  },

  // ─── Tài chính ───
  {
    code: "TT-VJU-TC-01",
    name: "Miễn, giảm học phí",
    cat: "tai-chinh", audience: "sv",
    muc: 4, sla_days: 7, fee: 0, agency: "Phòng Tài chính – Kế toán",
    rating: 4.6, reviews: 145, used_30d: 89,
    desc: "Đề nghị xét miễn, giảm học phí theo chính sách của Nhà nước và Nhà trường (diện hộ nghèo, dân tộc thiểu số, con thương binh…).",
    legal: "Nghị định 81/2021/NĐ-CP, Quy định miễn giảm HP của VJU",
    docs: [
      { name: "Đơn đề nghị miễn, giảm học phí", required: true, has_template: true },
      { name: "Bản sao sổ hộ nghèo/cận nghèo có công chứng", required: true },
      { name: "Bản sao giấy khai sinh", required: true },
      { name: "Giấy xác nhận của UBND xã/phường", required: true },
    ],
    steps: [
      { name: "SV nộp hồ sơ",             actor: "Sinh viên" },
      { name: "Tiếp nhận & đối chiếu",    actor: "P. TC-KT",         duration: "1 ngày" },
      { name: "Xác minh hoàn cảnh",       actor: "P. CTSV phối hợp", duration: "3 ngày" },
      { name: "Hội đồng xét duyệt",       actor: "Hội đồng",         duration: "2 ngày" },
      { name: "Ban hành quyết định",      actor: "Hiệu trưởng",      duration: "1 ngày" },
    ],
    fields: [
      { key: "dien",     label: "Diện xét miễn giảm", type: "select", required: true,
        options: ["Hộ nghèo có sổ", "Hộ cận nghèo", "Dân tộc thiểu số", "Con thương binh / liệt sĩ", "Mồ côi", "Khác"] },
      { key: "hoc_ky",   label: "Học kỳ áp dụng", type: "text", required: true, placeholder: "Xuân 2026" },
      { key: "muc_xin",  label: "Mức xin miễn/giảm", type: "select", required: true, options: ["Miễn 100%", "Giảm 50%", "Giảm 30%"] },
      { key: "hoan_canh",label: "Mô tả hoàn cảnh",   type: "textarea", required: true },
    ],
  },
  {
    code: "TT-VJU-TC-02",
    name: "Hoàn trả lệ phí thi",
    cat: "tai-chinh", audience: "sv",
    muc: 4, sla_days: 5, fee: 0, agency: "Phòng Tài chính – Kế toán",
    rating: 4.4, reviews: 38, used_30d: 12,
    desc: "Hoàn trả các khoản lệ phí đã đóng dư hoặc đóng nhầm.",
    legal: "Quy định thu chi tài chính VJU 2025",
    docs: [
      { name: "Đơn đề nghị hoàn trả", required: true, has_template: true },
      { name: "Biên lai gốc", required: true },
    ],
    steps: [
      { name: "SV nộp hồ sơ", actor: "Sinh viên" },
      { name: "P. TC-KT đối chiếu", actor: "P. TC-KT", duration: "2 ngày" },
      { name: "Trưởng phòng duyệt", actor: "Trưởng P. TC-KT", duration: "1 ngày" },
      { name: "Hoàn tiền + thông báo", actor: "P. TC-KT", duration: "2 ngày" },
    ],
    fields: [
      { key: "khoan_phi", label: "Khoản lệ phí",  type: "text",   required: true },
      { key: "so_tien",   label: "Số tiền (VNĐ)", type: "number", required: true },
      { key: "stk",       label: "STK nhận tiền", type: "text",   required: true },
      { key: "ngan_hang", label: "Ngân hàng",     type: "text",   required: true },
    ],
  },

  // ─── KTX ───
  {
    code: "TT-VJU-KTX-01",
    name: "Đăng ký ở Ký túc xá",
    cat: "ktx", audience: "sv",
    muc: 4, sla_days: 5, fee: 0, agency: "Ban Quản lý KTX",
    rating: 4.3, reviews: 521, used_30d: 78,
    desc: "Đăng ký chỗ ở KTX cho học kỳ tiếp theo. Ưu tiên SV năm thứ nhất, SV có hoàn cảnh khó khăn, SV ở xa.",
    legal: "Quy chế Ký túc xá VJU",
    docs: [
      { name: "Đơn đăng ký KTX", required: true, has_template: true },
      { name: "Giấy khai sinh hoặc CCCD", required: true },
      { name: "Giấy chứng nhận hoàn cảnh (nếu có)", required: false },
    ],
    steps: [
      { name: "SV đăng ký online", actor: "Sinh viên" },
      { name: "BQL KTX xét duyệt", actor: "BQL KTX",  duration: "3 ngày" },
      { name: "Phân phòng",        actor: "BQL KTX",  duration: "1 ngày" },
      { name: "Thông báo + ký HĐ", actor: "BQL KTX",  duration: "1 ngày" },
    ],
    fields: [
      { key: "hoc_ky",  label: "Học kỳ", type: "text", required: true },
      { key: "loai",    label: "Loại phòng mong muốn", type: "select", required: true,
        options: ["4 người", "6 người", "8 người"] },
      { key: "khu",     label: "Khu vực ưu tiên", type: "select", options: ["A", "B", "C", "Không yêu cầu"] },
      { key: "uu_tien", label: "Diện ưu tiên", type: "select", options: ["Không có", "Hộ nghèo", "Con thương binh", "Vùng sâu xa"] },
    ],
  },
  {
    code: "TT-VJU-KTX-02",
    name: "Chuyển phòng KTX",
    cat: "ktx", audience: "sv",
    muc: 3, sla_days: 3, fee: 0, agency: "Ban Quản lý KTX",
    rating: 4.5, reviews: 89, used_30d: 22,
    desc: "Đề nghị đổi sang phòng hoặc khu khác trong KTX.",
    legal: "Quy chế Ký túc xá VJU, Điều 12",
    docs: [
      { name: "Đơn xin chuyển phòng (có xác nhận trưởng phòng cũ)", required: true, has_template: true },
    ],
    steps: [
      { name: "SV nộp đơn",  actor: "Sinh viên" },
      { name: "Kiểm tra phòng trống", actor: "BQL KTX", duration: "1 ngày" },
      { name: "Trưởng BQL duyệt", actor: "Trưởng BQL", duration: "1 ngày" },
      { name: "Bàn giao chuyển phòng", actor: "BQL KTX", duration: "1 ngày" },
    ],
    fields: [
      { key: "phong_cu",  label: "Phòng hiện tại",   type: "text", required: true, placeholder: "vd: A-303" },
      { key: "phong_moi", label: "Phòng mong muốn",  type: "text", required: true, placeholder: "vd: B-205" },
      { key: "ly_do",     label: "Lý do",            type: "textarea", required: true },
    ],
  },

  // ─── Khiếu nại ───
  {
    code: "TT-VJU-KN-01",
    name: "Phản ánh, kiến nghị",
    cat: "khieu-nai", audience: "sv",
    muc: 4, sla_days: 10, fee: 0, agency: "Văn phòng Hiệu trưởng",
    rating: 4.2, reviews: 67, used_30d: 8,
    desc: "Phản ánh, kiến nghị về dịch vụ giáo dục, cơ sở vật chất, thái độ phục vụ của cán bộ.",
    legal: "Luật Khiếu nại, Quy chế tiếp công dân VJU",
    docs: [
      { name: "Đơn phản ánh kiến nghị", required: true, has_template: true },
      { name: "Tài liệu, hình ảnh chứng minh (nếu có)", required: false },
    ],
    steps: [
      { name: "Người dân/SV gửi",      actor: "Người gửi" },
      { name: "VP tiếp nhận, phân loại", actor: "VP Hiệu trưởng",  duration: "2 ngày" },
      { name: "Đơn vị liên quan xử lý",  actor: "Đơn vị",          duration: "5 ngày" },
      { name: "Tổng hợp & phản hồi",    actor: "VP Hiệu trưởng",  duration: "3 ngày" },
    ],
    fields: [
      { key: "loai",     label: "Loại phản ánh", type: "select", required: true,
        options: ["Chất lượng giảng dạy", "Cơ sở vật chất", "Thái độ phục vụ", "Quy trình thủ tục", "Khác"] },
      { key: "tieu_de",  label: "Tiêu đề",       type: "text", required: true },
      { key: "noi_dung", label: "Nội dung chi tiết", type: "textarea", required: true },
      { key: "ky_vong",  label: "Kỳ vọng giải quyết", type: "textarea" },
    ],
  },

];

// ─── Submitted mock requests (chỉ cho 2 workflow đã chạy thật trên VJU Hub) ───
const SVC_IT = SERVICES[0];  // IT Support
const SVC_NP = SERVICES[1];  // Xin nghỉ phép

const SUBMITTED = [
  // IT Support — đang xử lý (Cao priority, SLA 1 ngày)
  {
    code: "DVC-2026-001234",
    service: SVC_IT,
    requester: { name: "Lưu Thị K", id: "VJU-CB-0123" },
    submitted_at: "2026-05-12T09:24:00",
    due_at: "2026-05-13T17:00:00",
    current_step: 2,
    status: "processing",
    submitted_data: {
      "Tiêu đề":      "Máy in HP P. Đào tạo không kết nối được Wi-Fi",
      "Lĩnh vực":     "Phần cứng (Laptop, máy in, máy chiếu…)",
      "Mức ưu tiên":  "Cao (1 ngày làm việc)",
      "Mô tả":        "Máy in HP LaserJet ở P201 mất kết nối Wi-Fi từ sáng nay. Đã khởi động lại router và máy in nhưng không có hiệu quả.",
    },
    timeline: [
      { t: "2026-05-12T09:24", step: 0, label: "Người yêu cầu gửi",                  actor: "Lưu Thị K",       done: true },
      { t: "2026-05-12T09:24", step: 1, label: "Tự động phân công qua DMN",           actor: "Hệ thống",        done: true, note: "Phân cho Trần Văn IT (nhóm Hardware)" },
      { t: "2026-05-12T14:02", step: 2, label: "Trần Văn IT nhận và đang xử lý",      actor: "Trần Văn IT",     done: false, current: true, note: "Đang kiểm tra firmware máy in từ xa" },
    ],
    rating: null,
  },
  // IT Support — đã hoàn tất (5 sao)
  {
    code: "DVC-2026-001198",
    service: SVC_IT,
    requester: { name: "Nguyễn Văn A", id: "VJU-CB-0001" },
    submitted_at: "2026-05-08T10:00:00",
    due_at: "2026-05-15T17:00:00",
    current_step: 4,
    status: "done",
    submitted_data: {
      "Tiêu đề":      "Wi-Fi tầng 3 toà A yếu vào buổi chiều",
      "Lĩnh vực":     "Mạng / Internet",
      "Mức ưu tiên":  "Trung bình (3 ngày làm việc)",
      "Mô tả":        "Wi-Fi VJU-Staff ở khu giảng đường tầng 3 toà A tín hiệu yếu, hay rớt từ ~14h trở đi. Một số máy không kết nối được.",
    },
    timeline: [
      { t: "2026-05-08T10:00", step: 0, label: "Người yêu cầu gửi",                  actor: "Nguyễn Văn A",    done: true },
      { t: "2026-05-08T10:00", step: 1, label: "Tự động phân công",                  actor: "Hệ thống",        done: true, note: "Phân cho Phạm Thị Net (nhóm Network)" },
      { t: "2026-05-09T08:30", step: 2, label: "Khảo sát hiện trường, thêm 1 AP mới", actor: "Phạm Thị Net",    done: true },
      { t: "2026-05-10T15:00", step: 3, label: "Người yêu cầu xác nhận đã ổn",       actor: "Nguyễn Văn A",    done: true, note: "Tín hiệu mạnh đều cả khu vực." },
      { t: "2026-05-10T15:00", step: 4, label: "Hoàn tất",                            actor: "Hệ thống",        done: true },
    ],
    rating: 5,
  },
  // Nghỉ phép — đang chờ quản lý duyệt
  {
    code: "DVC-2026-001150",
    service: SVC_NP,
    requester: { name: "Nguyễn Văn A", id: "VJU-CB-0001" },
    submitted_at: "2026-05-11T16:30:00",
    due_at: "2026-05-13T17:00:00",
    current_step: 1,
    status: "processing",
    submitted_data: {
      "Tiêu đề":  "Nghỉ phép năm tuần 19/05–21/05",
      "Hình thức":"Nghỉ phép năm",
      "Từ":       "19/05/2026 08:00",
      "Đến":      "21/05/2026 17:00",
      "Ghi chú":  "Bàn giao công việc cho Trần Thị B. Vẫn online check email các buổi sáng nếu cần.",
    },
    timeline: [
      { t: "2026-05-11T16:30", step: 0, label: "Cán bộ gửi đơn",                     actor: "Nguyễn Văn A", done: true },
      { t: "2026-05-12T09:00", step: 1, label: "Đang chờ Quản lý trực tiếp duyệt",   actor: "Lê Văn C",     done: false, current: true },
    ],
    rating: null,
  },
  // Nghỉ phép — đã duyệt + đồng bộ về VJU Attendance
  {
    code: "DVC-2026-001102",
    service: SVC_NP,
    requester: { name: "Nguyễn Văn A", id: "VJU-CB-0001" },
    submitted_at: "2026-05-04T10:00:00",
    due_at: "2026-05-06T17:00:00",
    current_step: 3,
    status: "done",
    submitted_data: {
      "Tiêu đề":  "Đi công tác Đà Nẵng 13-14/05",
      "Hình thức":"Đi công tác",
      "Từ":       "13/05/2026 06:00",
      "Đến":      "14/05/2026 20:00",
      "Ghi chú":  "Tham dự hội thảo Open Education Asia. Đăng ký + vé máy bay đính kèm.",
    },
    timeline: [
      { t: "2026-05-04T10:00", step: 0, label: "Cán bộ gửi đơn",                       actor: "Nguyễn Văn A", done: true },
      { t: "2026-05-04T15:00", step: 1, label: "Quản lý đã duyệt",                     actor: "Lê Văn C",     done: true, note: "Đồng ý, lưu ý gửi báo cáo sau công tác." },
      { t: "2026-05-04T15:00", step: 2, label: "(Bỏ qua chỉnh sửa)",                   actor: "—",            done: true },
      { t: "2026-05-04T15:01", step: 3, label: "Đồng bộ về VJU Attendance thành công", actor: "Vệ tinh",      done: true, note: "Đã ghi nhận lịch công tác trong hệ thống chấm công." },
    ],
    rating: 5,
  },
];

// ── Helpers ──
function findService(code) { return SERVICES.find(s => s.code === code); }
function findSubmitted(code) { return SUBMITTED.find(s => s.code === code); }
function findCategory(id)  { return CATEGORIES.find(c => c.id === id); }
function servicesIn(catId) { return SERVICES.filter(s => s.cat === catId); }
function audienceLabel(a)  { return a === "sv" ? "Sinh viên" : "Cán bộ"; }
function feeText(f)        { return f === 0 ? "Miễn phí" : f.toLocaleString("vi-VN") + " đ"; }
function mucBadge(m) {
  const labels = { 1: "Mức 1", 2: "Mức 2", 3: "Mức 3", 4: "Mức 4 (Toàn trình)" };
  return `<span class="svc-muc muc-${m}">${labels[m] || m}</span>`;
}
function statusBadge(s) {
  const map = {
    pending:    { cls: "pending",    label: "Chờ tiếp nhận" },
    processing: { cls: "processing", label: "Đang xử lý" },
    done:       { cls: "done",       label: "Đã trả KQ" },
    rejected:   { cls: "late",       label: "Trả lại" },
    late:       { cls: "late",       label: "Trễ hạn" },
    draft:      { cls: "draft",      label: "Bản nháp" },
  };
  const v = map[s] || { cls: "draft", label: s };
  return `<span class="badge ${v.cls}"><span class="dot"></span>${v.label}</span>`;
}
function fmtDate(iso)   { return new Date(iso).toLocaleDateString("vi-VN"); }
function fmtDateTime(iso) { return new Date(iso).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }); }

// ── Public stats — chỉ tính cho dịch vụ đã triển khai thực tế ──
const DEPLOYED_SERVICES = SERVICES.filter(s => s.deployed);
const PUBLIC_STATS = {
  total_30d: DEPLOYED_SERVICES.reduce((a, s) => a + s.used_30d, 0),  // 340
  on_time_pct: 95.8,
  late_pct: 4.2,
  avg_rating: 4.75,
  total_services: DEPLOYED_SERVICES.length,    // 2
  roadmap_services: SERVICES.length - DEPLOYED_SERVICES.length,  // 6
  total_users: 287,
};
