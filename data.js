// Mock data for the VJU Public Service Portal demo.
// Field shapes mirror the real VJU Hub Laravel models so the demo can be ported later:
//   • SERVICES   -> Workflow (process_code, process_code_prefix, due_working_hours, team, etc.)
//   • INBOX/SUBMITTED -> WorkflowRequest + workflow_tasks
//   • MOCK_USERS -> User + role + Workflow.deployers() membership
// Anything not present in VJU Hub is annotated "demo only".

// ─────────────────────────────────────────────────────────────
// Service categories (mirrors workflow_categories.name).
// ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "it",      name: "IT & Technical Support" },
  { id: "hr",      name: "HR · Leave & Travel" },
  { id: "academic",name: "Academic Affairs" },
  { id: "finance", name: "Finance & Tuition" },
  { id: "internal",name: "Internal Workflows" },
];

// ─────────────────────────────────────────────────────────────
// Services. Flags:
//   deployed          true  = live on portal (clickable)
//                     false = on the roadmap (greyed out)
//   deployer_eligible true  = workflow can be deployed to many (HR-style mass deploy)
//   internal          true  = hidden from non-deployers (workflow_categories internal flag)
// ─────────────────────────────────────────────────────────────
const SERVICES = [
  {
    code: "VJU-IT-01",
    name: "IT Support request",
    cat: "it",
    desc: "Report a hardware, software, network or A/V issue. Priority-based SLA.",
    team: "IT Office", due_hours: 24,
    deployed: true, bpmn: "it-support",
    deployer_eligible: false, internal: false,
    steps: [
      { name: "Request submitted", actor: "Requester" },
      { name: "Routing", actor: "System (DMN)" },
      { name: "Handle issue", actor: "IT Office" },
      { name: "Requester confirmation", actor: "Requester" },
      { name: "Close / escalate", actor: "Team Lead" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Short summary" },
      { key: "category", label: "Issue category", type: "select", required: true,
        options: ["Hardware", "Software", "Network", "A/V & events", "Other"] },
      { key: "priority", label: "Priority", type: "select", required: true,
        options: ["Low", "Medium", "High", "Urgent"] },
      { key: "description", label: "Details", type: "textarea", required: true },
    ],
  },
  {
    code: "VJU-LV-01",
    name: "Leave / Business Trip / Remote Work Request",
    cat: "hr",
    desc: "Apply for annual leave, sick leave, business trip, or remote-work request. Syncs to VJU Attendance.",
    team: "HR Office + Direct Manager", due_hours: 16,
    deployed: true, bpmn: "attendance-request",
    deployer_eligible: false, internal: false,
    steps: [
      { name: "Staff submits request", actor: "Staff" },
      { name: "Manager review", actor: "Direct Manager" },
      { name: "Staff revision", actor: "Staff" },
      { name: "Sync to VJU Attendance", actor: "Satellite" },
    ],
    fields: [
      { key: "kind", label: "Request type", type: "select", required: true,
        options: ["Annual leave", "Sick leave", "Unpaid leave", "Business trip", "Remote work"] },
      { key: "from", label: "From", type: "text", required: true, placeholder: "YYYY-MM-DD" },
      { key: "to",   label: "To",   type: "text", required: true, placeholder: "YYYY-MM-DD" },
      { key: "reason", label: "Reason", type: "textarea", required: true },
    ],
  },
  {
    code: "VJU-AC-01",
    name: "Student academic transcript request",
    cat: "academic",
    desc: "Request an official transcript of academic results (digital or printed copy).",
    team: "Office of Academic Affairs", due_hours: 40,
    deployed: false, bpmn: null,
    deployer_eligible: false, internal: false,
    steps: [{ name: "Submitted", actor: "Student" }, { name: "Issued", actor: "Academic Affairs" }],
    fields: [],
  },
  {
    code: "VJU-FN-01",
    name: "Tuition fee receipt re-issuance",
    cat: "finance",
    desc: "Request a re-issued tuition receipt for completed payments.",
    team: "Finance Office", due_hours: 48,
    deployed: false, bpmn: null,
    deployer_eligible: false, internal: false,
    steps: [{ name: "Submitted", actor: "Student" }, { name: "Reviewed", actor: "Finance" }],
    fields: [],
  },
  // ─── Internal workflows (hidden from non-deployer public) ───
  {
    code: "VJU-IN-01",
    name: "Annual policy acknowledgement",
    cat: "internal",
    desc: "Internal workflow: HR deploys annual policy text to all staff for acknowledgement.",
    team: "HR Office", due_hours: 120,
    deployed: true, bpmn: "policy-acknowledgement",
    deployer_eligible: true, internal: true,
    steps: [
      { name: "HR deploys", actor: "HR Office" },
      { name: "Staff acknowledges", actor: "Recipient" },
    ],
    fields: [
      { key: "policy_version", label: "Policy version", type: "text", required: true, placeholder: "e.g. 2026.01" },
      { key: "ack", label: "I have read and understood the policy", type: "select", required: true, options: ["Yes"] },
    ],
  },
  {
    code: "VJU-IN-02",
    name: "IT security training acknowledgement",
    cat: "internal",
    desc: "Internal workflow: IT deploys security training material for staff to confirm completion.",
    team: "IT Office", due_hours: 72,
    deployed: true, bpmn: "security-acknowledgement",
    deployer_eligible: true, internal: true,
    steps: [
      { name: "IT deploys to recipients", actor: "IT Office" },
      { name: "Recipient acknowledges", actor: "Recipient" },
    ],
    fields: [
      { key: "policy_version", label: "Policy version", type: "text", required: true },
      { key: "ack", label: "I have read and understood the policy", type: "select", required: true, options: ["Yes"] },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Mock users (signed-in personas — picked on login.html).
// `is_deployer` mirrors Workflow.deployers() membership (per-workflow in real VJU Hub;
// simplified here to one global flag for the demo).
// ─────────────────────────────────────────────────────────────
const MOCK_USERS = {
  staff: {
    id: "VJU-STF-0001", name: "John Smith", email: "john.smith@vju.ac.vn",
    role: "staff", role_label: "Staff · Officer",
    unit: "Office of Academic Affairs", is_deployer: true,
  },
  manager: {
    id: "VJU-STF-0007", name: "Charles Le", email: "charles.le@vju.ac.vn",
    role: "manager", role_label: "Staff · Direct Manager",
    unit: "Office of Academic Affairs", is_deployer: false,
  },
  student: {
    id: "VJU-STU-2026-001", name: "Mary Tran", email: "mary.tran@st.vju.ac.vn",
    role: "student", role_label: "Student · Class of 2029",
    unit: "School of Computer Science & Engineering", is_deployer: false,
  },
};

// ─────────────────────────────────────────────────────────────
// Visibility + deploy gates (mirror Workflow.scopeAccessibleBy + Workflow.deployers)
// ─────────────────────────────────────────────────────────────
function canSeeService(service, user) {
  if (!service) return false;
  if (!service.internal) return true;                  // public workflow
  return !!(user && user.is_deployer);                 // internal: deployer-only
}
function canDeployService(service, user) {
  if (!service || !service.deployer_eligible) return false;
  return !!(user && user.is_deployer);
}
function findService(code) { return SERVICES.find(s => s.code === code) || null; }

// ─────────────────────────────────────────────────────────────
// Recipient pool — used by deploy.html
// ─────────────────────────────────────────────────────────────
const RECIPIENT_POOL = [
  { id: 101, name: "Brandon Tran",  email: "brandon.tran@vju.ac.vn",  department: "IT Office" },
  { id: 102, name: "Phoebe Pham",   email: "phoebe.pham@vju.ac.vn",   department: "IT Office" },
  { id: 103, name: "Charles Le",    email: "charles.le@vju.ac.vn",    department: "HR Office" },
  { id: 104, name: "Emily Do",      email: "emily.do@vju.ac.vn",      department: "Office of Academic Affairs" },
  { id: 105, name: "Patricia Pham", email: "patricia.pham@vju.ac.vn", department: "Finance Office" },
  { id: 106, name: "Tom Nguyen",    email: "tom.nguyen@vju.ac.vn",    department: "Finance Office" },
  { id: 107, name: "David Pham",    email: "david.pham@vju.ac.vn",    department: "School of Mechatronics" },
  { id: 108, name: "Greg Tran",     email: "greg.tran@vju.ac.vn",     department: "School of Computer Science" },
  { id: 109, name: "Lisa K. Tran",  email: "lisa.tran@vju.ac.vn",     department: "Phòng Đào tạo" },
  { id: 110, name: "Fiona Le",      email: "fiona.le@vju.ac.vn",      department: "School of Mechatronics" },
];

// ─────────────────────────────────────────────────────────────
// Public stats strip (for the home page)
// ─────────────────────────────────────────────────────────────
const PUBLIC_STATS = {
  total_30d: 1247,
  on_time_pct: 96,
  total_services: SERVICES.filter(s => s.deployed).length,
  roadmap_services: SERVICES.filter(s => !s.deployed).length,
};

// ─────────────────────────────────────────────────────────────
// SUBMITTED — workflow_requests created by me (current user, demo as John Smith).
// `timeline` mirrors what request-timeline.tsx renders: each entry has `t` (ISO),
// `label`, `actor`, and may have `done + decision + submission` for task-completed entries.
// ─────────────────────────────────────────────────────────────
const SUBMITTED = [
  {
    code: "VJU-IT-2026-001198",
    service: SERVICES[0], // IT Support
    requester: { name: "John Smith", id: "VJU-STF-0001", unit: "Office of Academic Affairs" },
    submitted_at: "2026-05-08T10:00:00",
    due_at: "2026-05-11T17:00:00",
    current_step: 4,
    status: "done",
    summary: "Weak afternoon Wi-Fi on Building A 3rd floor",
    submitted_data: { Title: "Weak afternoon Wi-Fi on Building A 3rd floor", Priority: "Medium" },
    timeline: [
      { t: "2026-05-08T10:00:00", label: "Request submitted", actor: "John Smith" },
      { t: "2026-05-08T10:00:00", label: "Auto-assigned",      actor: "—", note: "Routed to Phoebe Pham (Network group)" },
      { t: "2026-05-08T11:05:00", type: "comment", actor: "Phoebe Pham", note: "Hi John, taking a look now. Can you tell me which side of the 3rd floor — east wing or west?" },
      { t: "2026-05-08T11:18:00", type: "comment", actor: "John Smith",  note: "East wing, near rooms 305–312. Worst around 14:00–16:00 every day." },
      { t: "2026-05-08T14:02:00", type: "comment", actor: "Phoebe Pham", note: "Confirmed — signal drops to -78 dBm under load. Will request a new AP install. ETA tomorrow morning." },
      { t: "2026-05-09T16:32:00", label: "Issue handled",      actor: "Phoebe Pham", done: true,
        decision: "Fixed — added a new access point",
        startedAt: "2026-05-08T11:00:00",
        submission: { "Resolution summary": "Added AP on east corridor; signal now ≥-65 dBm" } },
      { t: "2026-05-09T17:10:00", type: "comment", actor: "Phoebe Pham", note: "New AP is live. Could you confirm the signal is OK now when you get a chance?" },
      { t: "2026-05-10T08:50:00", type: "comment", actor: "John Smith",  note: "Tested this morning — strong signal across the whole corridor. Thanks Phoebe!" },
      { t: "2026-05-10T09:15:00", label: "Requester confirmation", actor: "John Smith", done: true,
        decision: "Confirmed — issue resolved",
        startedAt: "2026-05-09T16:32:00",
        submission: { "Was the issue resolved?": "Yes" } },
      { t: "2026-05-10T15:00:00", label: "Closed", actor: "—" },
    ],
  },
  {
    code: "VJU-LV-2026-001102",
    service: SERVICES[1], // Leave
    requester: { name: "John Smith", id: "VJU-STF-0001", unit: "Office of Academic Affairs" },
    submitted_at: "2026-05-04T10:00:00",
    due_at: "2026-05-06T17:00:00",
    current_step: 3,
    status: "done",
    summary: "Business trip · Hanoi → HCMC, May 12-14",
    submitted_data: { "Request type": "Business trip", From: "2026-05-12", To: "2026-05-14" },
    timeline: [
      { t: "2026-05-04T10:00:00", label: "Request submitted", actor: "John Smith" },
      { t: "2026-05-04T12:14:00", type: "comment", actor: "Charles Le", note: "Looks good. Have you already booked the HCMC return ticket, or should HR do it?" },
      { t: "2026-05-04T13:02:00", type: "comment", actor: "John Smith",  note: "Booked both legs already — Vietnam Airlines, May 12 morning out, May 14 evening back." },
      { t: "2026-05-04T14:30:00", label: "Manager review", actor: "Charles Le", done: true,
        decision: "Approve",
        startedAt: "2026-05-04T11:00:00",
        submission: { "Decision": "Approve", "Notes": "Approved for both legs" } },
      { t: "2026-05-04T15:00:00", label: "(No revision needed)", actor: "—" },
      { t: "2026-05-04T15:01:00", label: "Synced to VJU Attendance successfully", actor: "Satellite", note: "Trip recorded in the attendance system." },
    ],
  },
  {
    code: "VJU-IT-2026-001244",
    service: SERVICES[0],
    requester: { name: "John Smith", id: "VJU-STF-0001", unit: "Office of Academic Affairs" },
    submitted_at: "2026-05-13T08:30:00",
    due_at: "2026-05-14T17:00:00",
    current_step: 2,
    status: "processing",
    summary: "Projector in Room B-201 won't power on",
    submitted_data: { Title: "Projector in Room B-201 won't power on", Priority: "High" },
    timeline: [
      { t: "2026-05-13T08:30:00", label: "Request submitted", actor: "John Smith" },
      { t: "2026-05-13T08:30:00", label: "Auto-assigned", actor: "—", note: "Routed to Brandon Tran (A/V group)" },
      { t: "2026-05-13T09:10:00", type: "comment", actor: "Brandon Tran", note: "Got it — heading to B-201 now. Will check the projector and the HDMI source." },
      { t: "2026-05-13T09:45:00", type: "comment", actor: "Brandon Tran", note: "Projector power supply seems faulty. Ordering a replacement, ETA Friday. Will keep you posted." },
      { t: "2026-05-13T10:02:00", type: "comment", actor: "John Smith",  note: "Thanks Brandon. I have a lecture in B-201 on Friday afternoon — please prioritise if you can." },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// INBOX — workflow_tasks assigned to me. `task_name` is the BPMN task name.
// ─────────────────────────────────────────────────────────────
const INBOX = [
  {
    code: "VJU-IT-2026-001220",
    service: SERVICES[0],
    requester: { name: "David Pham", id: "VJU-STF-0042", unit: "School of Mechatronics" },
    submitted_at: "2026-05-13T14:12:00",
    due_at: "2026-05-14T17:00:00",
    current_step: 2,
    status: "processing",
    task_name: "Handle issue",
    summary: "Office laptop won't boot after Windows update",
    submitted_data: { Title: "Office laptop won't boot after Windows update", Priority: "High" },
    timeline: [
      { t: "2026-05-13T14:12:00", label: "Request submitted", actor: "David Pham" },
      { t: "2026-05-13T14:12:00", label: "Auto-assigned", actor: "—", note: "Routed to current user (John Smith)" },
      { t: "2026-05-13T14:18:00", type: "comment", actor: "David Pham", note: "Hi — laptop won't get past the Lenovo splash since the latest Windows update last night. Already tried hard-reboot a few times." },
      { t: "2026-05-13T15:40:00", type: "comment", actor: "David Pham", note: "Tried safe mode boot, no luck. Sending the laptop to your office now." },
    ],
  },
  {
    code: "VJU-LV-2026-001231",
    service: SERVICES[1],
    requester: { name: "Emily Do", id: "VJU-STF-0019", unit: "Office of Academic Affairs" },
    submitted_at: "2026-05-13T09:45:00",
    due_at: "2026-05-14T17:00:00",
    current_step: 1,
    status: "processing",
    task_name: "Manager review",
    summary: "Sick leave · May 15-16",
    submitted_data: { "Request type": "Sick leave", From: "2026-05-15", To: "2026-05-16" },
    timeline: [
      { t: "2026-05-13T09:45:00", label: "Request submitted", actor: "Emily Do" },
      { t: "2026-05-13T10:30:00", type: "comment", actor: "Emily Do", note: "Hi, I came down with the flu yesterday. Doctor's note attached in case you need it." },
      { t: "2026-05-13T11:15:00", type: "comment", actor: "Emily Do", note: "Already handed over my Friday office hours to Tom. Let me know if anything else is needed." },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Work Schedule — mirrors VJU Hub WorkSchedule/index.tsx
// Each event maps to `work_schedules` row: schedule_type, tieu_de, start/end
// date+time, chu_tri (chairperson), dia_diem, attendees, ghi_chu, meeting_notes.
// ─────────────────────────────────────────────────────────────
const WORK_SCHEDULE_TYPES = [
  { type: "meeting",       label: "Meeting",        color: "#1f558f", bg: "#e9f0f8" },
  { type: "teaching",      label: "Teaching",       color: "#176c3e", bg: "#e6f4ec" },
  { type: "business_trip", label: "Business trip",  color: "#b5613d", bg: "#fbf1ec" },
  { type: "on_site",       label: "On-site event",  color: "#6d28d9", bg: "#f5f3ff" },
  { type: "personal",      label: "Personal",       color: "#b59023", bg: "#fbf4d9" },
];

const WORK_SCHEDULES = [
  {
    id: 1, schedule_type: "meeting",
    tieu_de: "Weekly IT Office stand-up",
    start_date: "2026-05-11", end_date: "2026-05-11", start_time: "09:00", end_time: "09:30",
    chu_tri: "Brandon Tran", dia_diem: "Room C-331 · IT Office",
    attendees: ["Phoebe Pham", "John Smith"],
    ghi_chu: "Review last week's tickets and assign owners for new incidents.",
  },
  {
    id: 2, schedule_type: "teaching",
    tieu_de: "CSE-201 · Operating Systems lecture",
    start_date: "2026-05-12", end_date: "2026-05-12", start_time: "08:00", end_time: "10:00",
    chu_tri: "Dr. Greg Tran", dia_diem: "Room B-201",
    attendees: ["Mary Tran"],
    ghi_chu: "Chapter 4 — Process scheduling.",
  },
  {
    id: 3, schedule_type: "business_trip",
    tieu_de: "Business trip · Hanoi → HCMC",
    start_date: "2026-05-12", end_date: "2026-05-14", start_time: null, end_time: null,
    chu_tri: "John Smith", dia_diem: "VJU HCMC liaison office",
    attendees: ["Charles Le"],
    ghi_chu: "Coordinating with the HCMC partner office. Synced from leave workflow VJU-LV-2026-001102.",
  },
  {
    id: 4, schedule_type: "meeting",
    tieu_de: "All-staff townhall · Q2 update",
    start_date: "2026-05-14", end_date: "2026-05-14", start_time: "14:00", end_time: "16:00",
    chu_tri: "Prof. Furuta Motoo", dia_diem: "Hall C-101",
    attendees: ["John Smith", "Charles Le", "Emily Do", "Brandon Tran", "Phoebe Pham", "Patricia Pham"],
    ghi_chu: "Quarterly progress, budget update, Q3 plans. Live-streamed for HCMC campus.",
    meeting_notes: "President's keynote + 30min Q&A.",
  },
  {
    id: 5, schedule_type: "on_site",
    tieu_de: "New AP rollout · Building A 3rd floor",
    start_date: "2026-05-14", end_date: "2026-05-14", start_time: "10:00", end_time: "12:00",
    chu_tri: "Phoebe Pham", dia_diem: "Building A · 3F east corridor",
    attendees: ["Brandon Tran"],
    ghi_chu: "Field install for IT case VJU-IT-2026-001198 follow-up.",
  },
  {
    id: 6, schedule_type: "teaching",
    tieu_de: "MEC-310 · Robotics lab",
    start_date: "2026-05-15", end_date: "2026-05-15", start_time: "13:30", end_time: "16:30",
    chu_tri: "Prof. David Pham", dia_diem: "Lab D-205",
    attendees: ["Fiona Le"],
  },
  {
    id: 7, schedule_type: "personal",
    tieu_de: "Doctor's appointment",
    start_date: "2026-05-15", end_date: "2026-05-15", start_time: "17:30", end_time: "18:30",
    chu_tri: "John Smith", dia_diem: "Bach Mai Hospital",
    attendees: [],
    visibility: "private",
  },
  {
    id: 8, schedule_type: "meeting",
    tieu_de: "HR · Onboarding orientation for new hires",
    start_date: "2026-05-18", end_date: "2026-05-18", start_time: "09:30", end_time: "11:30",
    chu_tri: "Charles Le", dia_diem: "Room C-311",
    attendees: ["Emily Do", "Brandon Tran"],
    ghi_chu: "3 new staff joining the HR Office and IT Office on May 18.",
  },
];

function findSchedule(id) { return WORK_SCHEDULES.find(e => e.id === Number(id)) || null; }
function getScheduleType(t)  { return WORK_SCHEDULE_TYPES.find(x => x.type === t) || WORK_SCHEDULE_TYPES[0]; }

// ─────────────────────────────────────────────────────────────
// Contact Directory — mirrors VJU Hub ContactDirectory/Index.tsx
// shape: sections (Roman-numeral grouped) → departments → employees.
// ─────────────────────────────────────────────────────────────
const DIRECTORY = {
  title: "VJU CONTACT DIRECTORY",
  sections: [
    {
      code: "L", roman: "I", label_en: "Leadership", label_vi: "Ban Giám hiệu",
      departments: [
        {
          id: 1, name_en: "President's Office", name_vi: "Văn phòng Hiệu trưởng",
          employees: [
            { no: 1, display_name: "Prof. Furuta Motoo",    position: "President",          emails: ["president@vju.ac.vn"],     mobile: "+84 24 7300 1001", room: "C-501", dob: "1957-04-02" },
            { no: 2, display_name: "Assoc. Prof. Nguyen Hoang Oanh", position: "Vice President", emails: ["vp.oanh@vju.ac.vn"], mobile: "+84 24 7300 1002", room: "C-502", dob: "1971-11-15" },
          ],
        },
      ],
    },
    {
      code: "F", roman: "II", label_en: "Faculty Schools", label_vi: "Các Khoa",
      departments: [
        {
          id: 11, name_en: "School of Mechatronics", name_vi: "Khoa Cơ điện tử",
          employees: [
            { no: 1, display_name: "Prof. David Pham", position: "Dean",      emails: ["d.pham@vju.ac.vn"],    mobile: "+84 24 7300 2001", room: "C-401", dob: "1972-05-25" },
            { no: 2, display_name: "Dr. Fiona Le",     position: "Lecturer",  emails: ["fiona.le@vju.ac.vn"],  mobile: "+84 24 7300 2002", room: "C-402", dob: "1985-08-12" },
          ],
        },
        {
          id: 12, name_en: "School of Computer Science & Engineering", name_vi: "Khoa Khoa học máy tính",
          employees: [
            { no: 1, display_name: "Dr. Greg Tran",  position: "Acting Dean", emails: ["greg.tran@vju.ac.vn"], mobile: "+84 24 7300 2101", room: "C-411", dob: "1980-02-09" },
            { no: 2, display_name: "Ms. Mary Tran",  position: "Researcher",  emails: ["mary.tran@st.vju.ac.vn"], mobile: "+84 24 7300 2102", room: "C-412", dob: "2007-06-15" },
          ],
        },
      ],
    },
    {
      code: "A", roman: "III", label_en: "Administrative Offices", label_vi: "Các Phòng / Tổ",
      departments: [
        {
          id: 21, name_en: "Office of Academic Affairs", name_vi: "Phòng Đào tạo",
          employees: [
            { no: 1, display_name: "Ms. Emily Do",    position: "Head of Office", emails: ["emily.do@vju.ac.vn"],   mobile: "+84 24 7300 3001", room: "C-301", dob: "1979-03-21" },
            { no: 2, display_name: "Ms. Lisa K. Tran",position: "Officer",        emails: ["lisa.tran@vju.ac.vn"],  mobile: "+84 24 7300 3002", room: "C-302", dob: "1986-09-08" },
            { no: 3, display_name: "Mr. John Smith",  position: "Officer",        emails: ["john.smith@vju.ac.vn"], mobile: "+84 24 7300 3003", room: "C-303", dob: "1988-12-19" },
          ],
        },
        {
          id: 22, name_en: "HR Office", name_vi: "Phòng Tổ chức Cán bộ",
          employees: [
            { no: 1, display_name: "Mr. Charles Le",  position: "Head of HR",     emails: ["charles.le@vju.ac.vn"], mobile: "+84 24 7300 3101", room: "C-311", dob: "1975-07-04" },
          ],
        },
        {
          id: 23, name_en: "Finance Office", name_vi: "Phòng Kế hoạch Tài chính",
          employees: [
            { no: 1, display_name: "Ms. Patricia Pham", position: "Head of Finance", emails: ["patricia.pham@vju.ac.vn"], mobile: "+84 24 7300 3201", room: "C-321", dob: "1978-01-30" },
            { no: 2, display_name: "Mr. Tom Nguyen",    position: "Accountant",      emails: ["tom.nguyen@vju.ac.vn"],    mobile: "+84 24 7300 3202", room: "C-322", dob: "1982-10-11" },
          ],
        },
        {
          id: 24, name_en: "IT Office", name_vi: "Tổ Công nghệ Thông tin",
          employees: [
            { no: 1, display_name: "Mr. Brandon Tran", position: "Head of IT",  emails: ["brandon.tran@vju.ac.vn"], mobile: "+84 24 7300 3301", room: "C-331", dob: "1984-04-22" },
            { no: 2, display_name: "Ms. Phoebe Pham",  position: "Engineer",    emails: ["phoebe.pham@vju.ac.vn"],  mobile: "+84 24 7300 3302", room: "C-332", dob: "1990-09-03" },
          ],
        },
      ],
    },
  ],
};

function findSubmitted(code) { return SUBMITTED.find(r => r.code === code) || null; }
function findInbox(code)     { return INBOX.find(r => r.code === code) || null; }
function findCase(code)      { return findSubmitted(code) || findInbox(code); }

// ─────────────────────────────────────────────────────────────
// Checklist (workflow_task_checklist_items) — per-case mock, persisted in localStorage.
// ─────────────────────────────────────────────────────────────
function getChecklist(caseCode) {
  const key = "dvc-demo:checklist:" + caseCode;
  const saved = localStorage.getItem(key);
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  const seed = [
    { id: 1, label: "Verify reporter contact details",   done: false },
    { id: 2, label: "Check service history for this user", done: false },
    { id: 3, label: "Confirm resolution with reporter",   done: false },
  ];
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}
function setChecklist(caseCode, items) {
  localStorage.setItem("dvc-demo:checklist:" + caseCode, JSON.stringify(items));
}
