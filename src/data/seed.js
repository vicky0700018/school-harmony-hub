import { KEYS, read, write } from "@/services/storage";
import { SESSION } from "@/utils/format";

const FIRST_M = [
  "Aarav", "Kabir", "Ishaan", "Arjun", "Vivaan", "Reyansh", "Aditya", "Rudra",
  "Krishna", "Dhruv", "Aryan", "Yash",
];
const FIRST_F = [
  "Ananya", "Diya", "Saanvi", "Aadhya", "Ira", "Meera", "Sana", "Devika",
  "Riya", "Kavya", "Tanvi", "Nitya",
];
const SURNAMES = [
  "Sharma", "Patel", "Reddy", "Iyer", "Mehta", "Nair", "Verma", "Qureshi",
  "Joshi", "Menon", "Shah", "Kulkarni", "Banerjee", "Chauhan",
];
const FATHER = ["Rakesh", "Mehul", "Suresh", "Nikhil", "Rohit", "Anil", "Vikram", "Deepak"];
const MOTHER = ["Sunita", "Lakshmi", "Neha", "Priya", "Anita", "Rekha", "Kavita", "Shalini"];
const BLOOD = ["A+", "B+", "O+", "AB+", "A-", "O-"];
const CATEGORY = ["General", "OBC", "SC", "ST", "EWS"];
const CITY = "Pune";

const CLASS_NAMES = ["VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const SECTIONS = ["A", "B", "C"];

const SUBJECTS = [
  { name: "English", code: "ENG" },
  { name: "Hindi", code: "HIN" },
  { name: "Mathematics", code: "MAT" },
  { name: "Science", code: "SCI" },
  { name: "Social Science", code: "SST" },
  { name: "Computer Science", code: "CSC" },
];

function rand(seedRef) {
  seedRef.v = (seedRef.v * 1103515245 + 12345) % 2147483648;
  return seedRef.v / 2147483648;
}

function pick(arr, r) {
  return arr[Math.floor(r * arr.length) % arr.length];
}

export function buildSeed() {
  const s = { v: 987654321 };
  const R = () => rand(s);

  /* ---------- Classes, sections, subjects ---------- */
  const classes = [];
  CLASS_NAMES.forEach((name, i) => {
    SECTIONS.slice(0, i < 5 ? 3 : 2).forEach((sec) => {
      classes.push({
        id: `cls_${name}_${sec}`,
        name,
        section: sec,
        label: `${name}-${sec}`,
        room: `R-${100 + classes.length}`,
        classTeacherId: null,
      });
    });
  });

  const subjects = SUBJECTS.map((x, i) => ({ id: `sub_${i}`, ...x, maxMarks: 100, passMarks: 33 }));

  /* ---------- Teachers ---------- */
  const teacherNames = [
    ["Meera Kulkarni", "M.Sc, B.Ed", "Mathematics"],
    ["Rajesh Iyer", "M.A English, B.Ed", "English"],
    ["Sunita Deshpande", "M.Sc Physics", "Science"],
    ["Amit Banerjee", "MCA", "Computer Science"],
    ["Farhan Qureshi", "M.A History", "Social Science"],
    ["Pooja Nair", "M.A Hindi, B.Ed", "Hindi"],
    ["Vikram Chauhan", "M.Sc Chemistry", "Science"],
    ["Anita Joshi", "M.Com, B.Ed", "Mathematics"],
  ];
  const teachers = teacherNames.map((t, i) => ({
    id: `tch_${i + 1}`,
    employeeId: `EMP-T${String(101 + i)}`,
    name: t[0],
    guardianName: pick(FATHER, R()) + " " + pick(SURNAMES, R()),
    dob: `19${75 + (i % 12)}-0${(i % 9) + 1}-1${i % 9}`,
    mobile: `98${String(23000000 + i * 13571).slice(0, 8)}`,
    email: t[0].toLowerCase().replace(/\s+/g, ".") + "@glowstone.edu.in",
    address: `${12 + i} Shivaji Nagar, ${CITY}`,
    qualification: t[1],
    subject: t[2],
    joiningDate: `20${15 + (i % 8)}-06-15`,
    salary: 42000 + i * 3500,
    designation: i === 0 ? "Senior Teacher" : "Teacher",
    classes: [classes[i % classes.length].label, classes[(i + 3) % classes.length].label],
    status: "Active",
  }));
  classes.forEach((c, i) => {
    c.classTeacherId = teachers[i % teachers.length].id;
  });

  /* ---------- Staff ---------- */
  const staffSpec = [
    ["Ramesh Gupta", "Accountant", "Accounts", 38000],
    ["Sneha Kulkarni", "Office Clerk", "Administration", 26000],
    ["Mahesh Pawar", "Librarian", "Library", 29000],
    ["Salim Shaikh", "Lab Assistant", "Science Lab", 24000],
    ["Geeta Rane", "Receptionist", "Front Office", 22000],
    ["Dinesh Yadav", "Transport In-charge", "Transport", 27000],
  ];
  const staff = staffSpec.map((x, i) => ({
    id: `stf_${i + 1}`,
    employeeId: `EMP-S${String(201 + i)}`,
    name: x[0],
    designation: x[1],
    department: x[2],
    joiningDate: `20${16 + (i % 7)}-04-01`,
    salary: x[3],
    mobile: `97${String(64000000 + i * 24681).slice(0, 8)}`,
    email: x[0].toLowerCase().replace(/\s+/g, ".") + "@glowstone.edu.in",
    address: `${30 + i} Kothrud, ${CITY}`,
    bankName: "State Bank of India",
    accountNumber: `3${String(1000000000 + i * 777777).slice(0, 10)}`,
    ifsc: "SBIN0001234",
    status: "Active",
  }));

  /* ---------- Students ---------- */
  const students = [];
  for (let i = 0; i < 24; i++) {
    const female = i % 2 === 1;
    const first = female ? FIRST_F[i % FIRST_F.length] : FIRST_M[i % FIRST_M.length];
    const sur = SURNAMES[i % SURNAMES.length];
    const cls = classes[i % classes.length];
    students.push({
      id: `std_${i + 1}`,
      admissionNo: `ADM-2024-${String(101 + i)}`,
      name: `${first} ${sur}`,
      fatherName: `${FATHER[i % FATHER.length]} ${sur}`,
      motherName: `${MOTHER[i % MOTHER.length]} ${sur}`,
      guardianName: `${FATHER[i % FATHER.length]} ${sur}`,
      guardianOccupation: pick(["Business", "Engineer", "Doctor", "Teacher", "Government Service"], R()),
      dob: `20${String(10 + (i % 6)).padStart(2, "0")}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
      gender: female ? "Female" : "Male",
      mobile: `9${String(812345670 + i * 137).slice(0, 9)}`,
      email: `${first.toLowerCase()}.${sur.toLowerCase()}@parentmail.com`,
      address: `${10 + i}, Lane ${2 + (i % 8)}, Aundh`,
      city: CITY,
      state: "Maharashtra",
      pincode: `4110${String(10 + (i % 40)).slice(0, 2)}`,
      className: cls.name,
      section: cls.section,
      rollNo: String(Math.floor(i / classes.length) + 1 + (i % 12)),
      admissionDate: `2024-0${(i % 6) + 1}-1${i % 9}`,
      session: SESSION,
      category: CATEGORY[i % CATEGORY.length],
      bloodGroup: BLOOD[i % BLOOD.length],
      previousSchool: i % 3 === 0 ? "Little Scholars English School" : "",
      transport: i % 4 === 0 ? "Yes" : "No",
      status: "Active",
      photo: "",
    });
  }

  /* ---------- Fee structure ---------- */
  const feeHeads = [
    "Admission Fee",
    "Tuition Fee",
    "Annual Fee",
    "Exam Fee",
    "Transport Fee",
    "Computer Fee",
    "Activity Fee",
    "Other Charges",
  ];
  const feeStructure = classes
    .filter((c, i, a) => a.findIndex((x) => x.name === c.name) === i)
    .map((c, i) => ({
      id: `fs_${c.name}`,
      className: c.name,
      frequency: "Monthly",
      heads: {
        "Admission Fee": 0,
        "Tuition Fee": 2200 + i * 200,
        "Annual Fee": 600,
        "Exam Fee": 300,
        "Transport Fee": 900,
        "Computer Fee": 250,
        "Activity Fee": 200,
        "Other Charges": 100,
      },
    }));

  /* ---------- Fee invoices + payments ---------- */
  const months = ["April", "May", "June", "July", "August", "September"];
  const fees = [];
  const payments = [];
  students.forEach((st, si) => {
    const fs = feeStructure.find((f) => f.className === st.className);
    months.forEach((m, mi) => {
      const heads = { ...fs.heads };
      if (st.transport === "No") heads["Transport Fee"] = 0;
      if (mi > 0) heads["Admission Fee"] = 0;
      const total = Object.values(heads).reduce((a, b) => a + b, 0);
      const paidFull = (si + mi) % 5 !== 0;
      const paid = paidFull ? total : mi % 2 === 0 ? Math.round(total * 0.4) : 0;
      const id = `fee_${st.id}_${m}`;
      fees.push({
        id,
        studentId: st.id,
        month: m,
        session: SESSION,
        heads,
        discount: si % 7 === 0 ? 300 : 0,
        lateFee: paidFull ? 0 : 100,
        previousBalance: 0,
        total,
        paid,
        dueDate: `2024-${String(4 + mi).padStart(2, "0")}-10`,
        status: paid >= total ? "Paid" : paid > 0 ? "Partial" : "Pending",
      });
      if (paid > 0) {
        payments.push({
          id: `pay_${st.id}_${m}`,
          receiptNo: `RC-2024-${String(1000 + payments.length)}`,
          feeId: id,
          studentId: st.id,
          date: `2024-${String(4 + mi).padStart(2, "0")}-${String(5 + (si % 20)).padStart(2, "0")}`,
          amount: paid,
          mode: ["Cash", "UPI", "Card", "Bank Transfer", "Cheque"][(si + mi) % 5],
          month: m,
          receivedBy: "Ramesh Gupta",
          note: "",
        });
      }
    });
  });

  /* ---------- Attendance (last 20 school days) ---------- */
  const attendance = [];
  const base = new Date();
  for (let d = 0; d < 20; d++) {
    const day = new Date(base);
    day.setDate(base.getDate() - d);
    if (day.getDay() === 0) continue;
    const date = day.toISOString().slice(0, 10);
    students.forEach((st, si) => {
      const roll = (si * 7 + d * 3) % 20;
      const status = roll === 0 ? "Absent" : roll === 1 ? "Late" : roll === 2 ? "Leave" : "Present";
      attendance.push({
        id: `att_${st.id}_${date}`,
        studentId: st.id,
        date,
        className: st.className,
        section: st.section,
        status,
      });
    });
  }

  /* ---------- Exams + marks ---------- */
  const exams = [
    {
      id: "exm_1",
      name: "Unit Test I",
      type: "Unit Test",
      session: SESSION,
      startDate: "2024-07-08",
      endDate: "2024-07-12",
      classes: CLASS_NAMES,
      subjects: subjects.map((s2) => ({ subjectId: s2.id, name: s2.name, maxMarks: 25, passMarks: 9 })),
      status: "Completed",
    },
    {
      id: "exm_2",
      name: "Half Yearly Examination",
      type: "Half Yearly",
      session: SESSION,
      startDate: "2024-09-16",
      endDate: "2024-09-27",
      classes: CLASS_NAMES,
      subjects: subjects.map((s2) => ({ subjectId: s2.id, name: s2.name, maxMarks: 100, passMarks: 33 })),
      status: "Completed",
    },
    {
      id: "exm_3",
      name: "Annual Examination",
      type: "Annual Examination",
      session: SESSION,
      startDate: "2025-03-03",
      endDate: "2025-03-18",
      classes: CLASS_NAMES,
      subjects: subjects.map((s2) => ({ subjectId: s2.id, name: s2.name, maxMarks: 100, passMarks: 33 })),
      status: "Scheduled",
    },
  ];

  const marks = [];
  ["exm_1", "exm_2"].forEach((examId) => {
    const exam = exams.find((e) => e.id === examId);
    students.forEach((st, si) => {
      exam.subjects.forEach((sub, sj) => {
        const base2 = 0.55 + ((si * 13 + sj * 7) % 40) / 100;
        marks.push({
          id: `mrk_${examId}_${st.id}_${sub.subjectId}`,
          examId,
          studentId: st.id,
          subjectId: sub.subjectId,
          subject: sub.name,
          maxMarks: sub.maxMarks,
          obtained: Math.min(sub.maxMarks, Math.round(sub.maxMarks * base2)),
        });
      });
    });
  });

  /* ---------- Timetable ---------- */
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timetable = [];
  classes.slice(0, 8).forEach((c, ci) => {
    days.forEach((day, di) => {
      for (let p = 1; p <= 6; p++) {
        const sub = subjects[(ci + di + p) % subjects.length];
        const t = teachers[(ci + p) % teachers.length];
        timetable.push({
          id: `tt_${c.id}_${day}_${p}`,
          className: c.name,
          section: c.section,
          day,
          period: p,
          subject: sub.name,
          teacherId: t.id,
          teacher: t.name,
          startTime: `${String(8 + p).padStart(2, "0")}:00`,
          endTime: `${String(8 + p).padStart(2, "0")}:45`,
        });
      }
    });
  });

  /* ---------- Notices ---------- */
  const notices = [
    {
      id: "not_1",
      title: "Half-yearly exam timetable released",
      description:
        "The detailed date sheet for the half-yearly examination is now available with class teachers. Students must report 15 minutes before each paper.",
      date: "2024-09-02",
      audience: "All",
      status: "Published",
    },
    {
      id: "not_2",
      title: "Fee deadline — October installment",
      description:
        "Parents are requested to clear the October installment before the 10th to avoid a late fee of ₹100.",
      date: "2024-10-01",
      audience: "Parents",
      status: "Published",
    },
    {
      id: "not_3",
      title: "Annual Sports Day",
      description:
        "Annual Sports Day will be held on the main ground at 9:00 AM. Students must wear the school sports uniform.",
      date: "2024-11-14",
      audience: "Students",
      status: "Published",
    },
    {
      id: "not_4",
      title: "Staff meeting — curriculum review",
      description: "All teaching staff to assemble in the conference hall at 3:30 PM.",
      date: "2024-11-20",
      audience: "Teachers",
      status: "Draft",
    },
  ];

  /* ---------- Admissions ---------- */
  const admissions = students.slice(0, 10).map((st, i) => ({
    id: `adm_${i + 1}`,
    regNo: `REG-2024-${String(501 + i)}`,
    studentId: st.id,
    name: st.name,
    fatherName: st.fatherName,
    motherName: st.motherName,
    dob: st.dob,
    gender: st.gender,
    mobile: st.mobile,
    email: st.email,
    applyingClass: st.className,
    previousSchool: st.previousSchool || "—",
    session: SESSION,
    date: st.admissionDate,
    status: i < 8 ? "Approved" : "Pending",
    documents: {
      "Birth Certificate": i % 2 === 0,
      "Address Proof": true,
      "Previous School Certificate": i % 3 !== 0,
      Photograph: true,
      "ID Proof": i % 4 !== 0,
      Other: false,
    },
  }));

  /* ---------- Payroll ---------- */
  const payroll = [...teachers, ...staff].map((p, i) => {
    const basic = p.salary;
    const allowances = Math.round(basic * 0.18);
    const deductions = Math.round(basic * 0.08);
    const advance = i % 6 === 0 ? 2000 : 0;
    return {
      id: `pr_${p.id}`,
      employeeId: p.employeeId,
      personId: p.id,
      name: p.name,
      designation: p.designation || "Teacher",
      month: "September",
      basic,
      allowances,
      deductions,
      advance,
      net: basic + allowances - deductions - advance,
      paymentDate: "2024-09-30",
      status: i % 9 === 0 ? "Pending" : "Paid",
    };
  });

  const settings = {
    name: "Glowstone Academy",
    tagline: "Senior Secondary School",
    address: "Plot 14, Sector 21, Aundh, Pune, Maharashtra 411007",
    phone: "+91 20 4567 8900",
    email: "office@glowstone.edu.in",
    website: "www.glowstone.edu.in",
    affiliation: "CBSE Affiliation No. 273014",
    schoolCode: "GSA-1198",
    principalName: "Dr. Meera Kulkarni",
    session: SESSION,
    logoText: "G",
    lateFee: 100,
    certificatePrefix: "GSA",
  };

  const users = [
    { id: "usr_1", name: "Dr. Meera Kulkarni", username: "admin", password: "admin123", role: "Admin", email: "admin@glowstone.edu.in" },
    { id: "usr_2", name: "Rajesh Iyer", username: "teacher", password: "teacher123", role: "Teacher", email: "teacher@glowstone.edu.in" },
    { id: "usr_3", name: "Ramesh Gupta", username: "accounts", password: "accounts123", role: "Accountant", email: "accounts@glowstone.edu.in" },
    { id: "usr_4", name: "Sneha Kulkarni", username: "staff", password: "staff123", role: "Staff", email: "staff@glowstone.edu.in" },
  ];

  return {
    classes,
    subjects,
    teachers,
    staff,
    students,
    feeStructure,
    fees,
    payments,
    attendance,
    staffAttendance: [],
    exams,
    marks,
    timetable,
    notices,
    admissions,
    payroll,
    certificates: [],
    settings,
    users,
  };
}

export const FEE_HEADS = [
  "Admission Fee",
  "Tuition Fee",
  "Annual Fee",
  "Exam Fee",
  "Transport Fee",
  "Computer Fee",
  "Activity Fee",
  "Other Charges",
];

export const PAYMENT_MODES = ["Cash", "UPI", "Card", "Bank Transfer", "Cheque"];

export function ensureSeed() {
  if (read(KEYS.students, null)) return;
  const seed = buildSeed();
  Object.entries(seed).forEach(([k, v]) => write(k, v));
}

export function resetSeed() {
  const seed = buildSeed();
  Object.entries(seed).forEach(([k, v]) => write(k, v));
}
