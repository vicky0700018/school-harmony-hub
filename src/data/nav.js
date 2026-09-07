/**
 * Single source of truth for sidebar navigation, page titles and
 * role-based visibility. `registry.jsx` renders the component for each slug.
 */

export const ROLES = ["Admin", "Teacher", "Accountant", "Staff"];

const ALL = ROLES;
const ADMIN = ["Admin"];
const ACADEMIC = ["Admin", "Teacher"];
const FINANCE = ["Admin", "Accountant"];
const OFFICE = ["Admin", "Staff"];

export const NAV = [
  {
    group: "Overview",
    items: [
      { slug: "dashboard", label: "Dashboard", icon: "LayoutDashboard", roles: ALL },
    ],
  },
  {
    group: "Students",
    items: [
      {
        slug: "students",
        label: "Students",
        icon: "Users",
        roles: ["Admin", "Teacher", "Staff"],
        children: [
          { slug: "students", label: "Student List" },
          { slug: "students/add", label: "Add Student" },
          { slug: "students/promote", label: "Promote Student" },
          { slug: "students/transfer", label: "Transfer Student" },
          { slug: "students/id-card", label: "Student ID Card" },
        ],
      },
      {
        slug: "admissions",
        label: "Admissions",
        icon: "UserPlus",
        roles: OFFICE,
        children: [
          { slug: "admissions", label: "Admission List" },
          { slug: "admissions/new", label: "New Admission" },
          { slug: "admissions/form", label: "Registration Form" },
          { slug: "admissions/receipt", label: "Admission Receipt" },
        ],
      },
    ],
  },
  {
    group: "Operations",
    items: [
      {
        slug: "attendance",
        label: "Attendance",
        icon: "CalendarCheck",
        roles: ["Admin", "Teacher", "Staff"],
        children: [
          { slug: "attendance/mark", label: "Mark Attendance" },
          { slug: "attendance/daily", label: "Daily Attendance" },
          { slug: "attendance/monthly", label: "Monthly Attendance" },
          { slug: "attendance/report", label: "Attendance Report" },
        ],
      },
      {
        slug: "fees",
        label: "Fees",
        icon: "IndianRupee",
        roles: FINANCE,
        children: [
          { slug: "fees/structure", label: "Fee Structure" },
          { slug: "fees/generate", label: "Generate Fee" },
          { slug: "fees/collect", label: "Collect Fee" },
          { slug: "fees/receipt", label: "Fee Receipt" },
          { slug: "fees/pending", label: "Pending Fees" },
          { slug: "fees/defaulters", label: "Fee Defaulters" },
          { slug: "fees/history", label: "Payment History" },
          { slug: "fees/collection-report", label: "Monthly Collection" },
        ],
      },
      {
        slug: "exams",
        label: "Examinations",
        icon: "ClipboardList",
        roles: ACADEMIC,
        children: [
          { slug: "exams", label: "Exams & Schedule" },
          { slug: "exams/create", label: "Create Exam" },
          { slug: "exams/marks", label: "Enter Marks" },
          { slug: "exams/marks-list", label: "Marks List" },
          { slug: "exams/marksheet", label: "Generate Marksheet" },
          { slug: "exams/report-card", label: "Report Card" },
          { slug: "exams/class-result", label: "Class Result" },
          { slug: "exams/student-result", label: "Student Result" },
        ],
      },
      {
        slug: "certificates",
        label: "Certificates",
        icon: "Award",
        roles: OFFICE,
        children: [
          { slug: "certificates/bonafide", label: "Bonafide Certificate" },
          { slug: "certificates/transfer", label: "Transfer Certificate" },
          { slug: "certificates/character", label: "Character Certificate" },
          { slug: "certificates/leaving", label: "School Leaving" },
          { slug: "certificates/study", label: "Study Certificate" },
          { slug: "certificates/fee", label: "Fee Certificate" },
          { slug: "certificates/admission-letter", label: "Admission Letter" },
          { slug: "certificates/experience", label: "Experience Certificate" },
          { slug: "certificates/custom", label: "Custom Certificate" },
        ],
      },
    ],
  },
  {
    group: "People",
    items: [
      {
        slug: "teachers",
        label: "Teachers & Staff",
        icon: "GraduationCap",
        roles: ADMIN,
        children: [
          { slug: "teachers", label: "Teacher List" },
          { slug: "teachers/add", label: "Add Teacher" },
          { slug: "staff", label: "Staff List" },
          { slug: "teachers/attendance", label: "Teacher Attendance" },
          { slug: "staff/attendance", label: "Staff Attendance" },
          { slug: "payroll", label: "Salary / Payroll" },
        ],
      },
      {
        slug: "academics",
        label: "Classes & Academics",
        icon: "BookOpen",
        roles: ACADEMIC,
        children: [
          { slug: "academics/classes", label: "Classes" },
          { slug: "academics/sections", label: "Sections" },
          { slug: "academics/subjects", label: "Subjects" },
          { slug: "academics/assign-teacher", label: "Assign Teacher" },
          { slug: "academics/timetable", label: "Timetable" },
          { slug: "academics/session", label: "Academic Session" },
        ],
      },
    ],
  },
  {
    group: "Insights",
    items: [
      {
        slug: "reports",
        label: "Reports",
        icon: "BarChart3",
        roles: ALL,
        children: [
          { slug: "reports/students", label: "Student Report" },
          { slug: "reports/attendance", label: "Attendance Report" },
          { slug: "reports/fees", label: "Fee Report" },
          { slug: "reports/results", label: "Result Report" },
          { slug: "reports/admissions", label: "Admission Report" },
          { slug: "reports/teachers", label: "Teacher Report" },
        ],
      },
      {
        slug: "communication",
        label: "Communication",
        icon: "Megaphone",
        roles: ["Admin", "Staff", "Teacher"],
        children: [
          { slug: "communication/notices", label: "Notices" },
          { slug: "communication/announcements", label: "Announcements" },
          { slug: "communication/messages", label: "SMS / WhatsApp" },
          { slug: "communication/parents", label: "Parent Communication" },
        ],
      },
      {
        slug: "settings",
        label: "Settings",
        icon: "Settings",
        roles: ADMIN,
        children: [
          { slug: "settings/school", label: "School Profile" },
          { slug: "settings/fees", label: "Fee Settings" },
          { slug: "settings/certificates", label: "Certificate Settings" },
          { slug: "settings/users", label: "User Management" },
          { slug: "settings/backup", label: "Backup / Restore" },
        ],
      },
    ],
  },
];

export function navForRole(role) {
  return NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.roles.includes(role)),
  })).filter((g) => g.items.length > 0);
}

export function canAccess(role, slug) {
  if (role === "Admin") return true;
  const flat = NAV.flatMap((g) => g.items);
  const owner = flat.find(
    (i) => slug === i.slug || slug.startsWith(i.slug + "/") || (i.children || []).some((c) => c.slug === slug),
  );
  if (!owner) return false;
  return owner.roles.includes(role);
}
