/* ==========================================================
   EDITABLE CONTENT
   Update the data below. Leave a field as "" (empty) and the
   page will automatically show "To be added", "Video coming
   soon" or "Repository link coming soon".
   Video links can be any normal YouTube link, e.g.
   https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
   ========================================================== */

/* ---------- EDIT: Group members ---------- */
const members = [
  {
    name: "Harith",
    matric: "A211140",
    role: "Project Manager & GitHub Coordinator",
    completed: "Created the GitHub repository and organised the initial project structure.",
    proposed: "Coordinate group tasks, manage code integration and oversee e-Portfolio deployment."
  },
  {
    name: "Farihin",
    matric: "A211017",
    role: "Security Operations Centre (SOC) Analyst",
    completed: "",
    proposed: "Monitor security logs, investigate suspicious activities and document security findings."
  },
  {
    name: "Adam",
    matric: "A211176",
    role: "Application Developer",
    completed: "",
    proposed: "Develop application features, implement security fixes and demonstrate code changes."
  },
  {
    name: "Luqman",
    matric: "A212247",
    role: "Security Tester & Documentation Coordinator",
    completed: "",
    proposed: "Test vulnerabilities and fixes, record test results and prepare documentation and demonstration videos."
  }
];

/* ---------- EDIT: Labs (add or remove objects as needed) ---------- */
const labs = [
  { title: "", description: "", video: "", reflection: "" },
  { title: "", description: "", video: "", reflection: "" },
  { title: "", description: "", video: "", reflection: "" }
];

/* ---------- EDIT: Main project ---------- */
const project = {
  name: "TBD (To Be Decided)",
  problem: "",
  description: "",
  video: "",
  repo: "",
  reflection: ""
};

/* ---------- EDIT: Vulnerability solution cases ----------
   owasp          → the OWASP Top 10 ID this case belongs to, e.g. "A05" (see list below), or "" if unsure
   language       → shown above the code, e.g. "PHP", "JavaScript", "Python"
   vulnerableCode → the original, unsafe code
   fixedCode      → the same code after your fix (changed lines are highlighted automatically)

   Write code between backticks ` ` so it can span several lines. Example:
     vulnerableCode: `
$sql = "SELECT * FROM users WHERE username = '$user'";
$result = mysqli_query($conn, $sql);`,
     fixedCode: `
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $user);
$stmt->execute();`,
   ---------------------------------------------------------- */
const cases = [
  {
    title: "Login Test", owasp: "A07",
    description: "", fix: "", video: "", repo: "", before: "", after: "", reflection: "",
    language: "", vulnerableCode: ``, fixedCode: ``
  },
  {
    title: "Data 1 — Specific topic to be added", owasp: "",
    description: "", fix: "", video: "", repo: "", before: "", after: "", reflection: "",
    language: "", vulnerableCode: ``, fixedCode: ``
  },
  {
    title: "Data 2 — Specific topic to be added", owasp: "",
    description: "", fix: "", video: "", repo: "", before: "", after: "", reflection: "",
    language: "", vulnerableCode: ``, fixedCode: ``
  },
  {
    title: "SQL Injection", owasp: "A05",
    description: "", fix: "", video: "", repo: "", before: "", after: "", reflection: "",
    language: "", vulnerableCode: ``, fixedCode: ``
  },
  {
    title: "Vulnerability topic to be decided", owasp: "",
    description: "", fix: "", video: "", repo: "", before: "", after: "", reflection: "",
    language: "", vulnerableCode: ``, fixedCode: ``
  },
  {
    title: "Vulnerability topic to be decided", owasp: "",
    description: "", fix: "", video: "", repo: "", before: "", after: "", reflection: "",
    language: "", vulnerableCode: ``, fixedCode: ``
  }
];

/* ---------- EDIT: OWASP Top 10 list used for the coverage grid ----------
   This is the 2025 edition. If your course uses the 2021 edition,
   replace the version and the ten names below.
   ---------------------------------------------------------- */
const owaspTop10 = {
  version: "2025",
  link: "https://owasp.org/Top10/",
  items: [
    { id: "A01", name: "Broken Access Control" },
    { id: "A02", name: "Security Misconfiguration" },
    { id: "A03", name: "Software Supply Chain Failures" },
    { id: "A04", name: "Cryptographic Failures" },
    { id: "A05", name: "Injection" },
    { id: "A06", name: "Insecure Design" },
    { id: "A07", name: "Authentication Failures" },
    { id: "A08", name: "Software or Data Integrity Failures" },
    { id: "A09", name: "Security Logging and Alerting Failures" },
    { id: "A10", name: "Mishandling of Exceptional Conditions" }
  ]
};

/* ---------- EDIT: Phrases typed out in the hero ---------- */
const typedPhrases = [
  "validate --every-input",
  "escape --all-output",
  "hash --passwords --salted",
  "grant --least-privilege",
  "trust nothing; verify everything"
];
