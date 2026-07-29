import fs from "node:fs";

const dataPath = "outputs/faculty-training-webpage/data/trainings.json";
const sourcesPath = "outputs/faculty-training-webpage/data/sources.json";
const today = "2026-06-02";

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));

data.meta.lastUpdated = new Date("2026-06-02T11:05:00-04:00").toISOString();
data.meta.notes = [
  "The three starter DOCX files were imported locally on June 2, 2026.",
  "The internal training grid labeled DO NOT USE was used only for planning signals such as audience, timing, and topic gaps; its internal presenter and logistics details were not published.",
  "NCFDD, CIRTL, and CUR access were verified from URI or user-provided membership documentation. EAB and AAC&U access notes still need local confirmation for member-only or paid items."
];
data.meta.documentImports = [
  {
    title: "Faculty Membership Resources.docx",
    use: "Added NCFDD and CIRTL member resources and self-paced faculty development options."
  },
  {
    title: "Assoc Dean, Chairs and New Faculty Training Grid DO NOT USE.docx",
    use: "Used only to improve yearlong timing and audience alignment."
  },
  {
    title: "System for sharing key CUR and other UR resources.docx",
    use: "Verified URI CUR Enhanced Institutional Membership and added CUR activation, community, publication, and undergraduate research resources."
  }
];

const curNote = data.accessNotes.find((note) => note.provider === "CUR");
if (curNote) {
  curNote.status = "verified";
  curNote.summary = "URI has an Institutional - Enhanced membership in CUR, allowing any URI faculty member, mentor, administrator, student, or staff member to join CUR at no additional individual cost.";
  curNote.action = "Activate enhanced membership benefits through CUR, then use CUR Community, publications, divisions, and member resources.";
  curNote.url = "https://www.cur.org/membership-community/membership/activate-enhanced-membership-benefits/";
}

upsertTraining({
  id: "ncfdd-mentor-map",
  title: "NCFDD Mentor Map",
  provider: "NCFDD",
  status: "recommended",
  priority: "advertise-now",
  startDate: "2026-08-01",
  endDate: "2026-08-01",
  dateLabel: "Self-paced; recommended for August mentoring and onboarding",
  datePrecision: "recommended-window",
  format: "Self-paced planning tool",
  topics: ["Mentoring", "Promotion & Tenure", "Productivity"],
  audience: ["Faculty", "New faculty", "Mentors", "Chairs"],
  access: "NCFDD member resource; URI NCFDD membership verified.",
  accessStatus: "verified",
  costStatus: "free-or-member",
  description: "A guided tool for mapping current mentoring networks, identifying unmet needs, and planning how to expand support.",
  whyInclude: "Strong August/onboarding resource because it helps faculty build mentoring networks before annual review and promotion pressures accumulate.",
  sourceUrl: "https://members.ncfdd.org/ncfddmentormap",
  lastVerified: today
});

upsertTraining({
  id: "ncfdd-member-library-on-demand",
  title: "NCFDD On-Demand Workshop Library",
  provider: "NCFDD",
  status: "recommended",
  priority: "advertise-now",
  startDate: "2026-08-20",
  endDate: "2026-08-20",
  dateLabel: "Self-paced; use throughout the academic year",
  datePrecision: "recommended-window",
  format: "On-demand webinar and course library",
  topics: ["Writing", "Promotion & Tenure", "Teaching", "Productivity"],
  audience: ["Faculty", "Postdocs", "Graduate students", "Chairs"],
  access: "NCFDD member resource; URI NCFDD membership verified.",
  accessStatus: "verified",
  costStatus: "free-or-member",
  description: "The member library includes archived webinars, Q&A sessions, and multi-week course materials. Faculty can filter by categories such as career transitions, teaching, grant and funding, work-life balance, and wellness.",
  whyInclude: "Best flexible option for faculty who cannot attend live workshops and need just-in-time support.",
  sourceUrl: "https://members.ncfdd.org/library?page=1",
  lastVerified: today
});

upsertTraining({
  id: "ncfdd-monday-motivator",
  title: "NCFDD Monday Motivator",
  provider: "NCFDD",
  status: "recommended",
  priority: "standard",
  startDate: "2026-09-07",
  endDate: "2027-05-31",
  dateLabel: "Weekly email; recommended September-May",
  datePrecision: "recommended-window",
  format: "Weekly micro-learning email",
  topics: ["Writing", "Productivity", "Promotion & Tenure"],
  audience: ["Faculty", "Postdocs", "Graduate students"],
  access: "Free sign-up; pairs well with URI's NCFDD membership.",
  accessStatus: "verified",
  costStatus: "free-or-member",
  description: "A weekly productivity tip that reinforces NCFDD core-curriculum ideas in a small, sustained format.",
  whyInclude: "Low-lift way to keep writing and productivity visible across the year.",
  sourceUrl: "https://ncfdd.us14.list-manage.com/subscribe?u=2f3b48fce8d6584678db66b60&id=75f7937b49",
  lastVerified: today
});

upsertTraining({
  id: "ncfdd-early-career-guidebook",
  title: "NCFDD Early-Career Faculty Guidebook",
  provider: "NCFDD",
  status: "recommended",
  priority: "standard",
  startDate: "2026-08-25",
  endDate: "2026-08-25",
  dateLabel: "Self-paced guidebook; recommended for new faculty orientation",
  datePrecision: "recommended-window",
  format: "Guidebook and curated resource pathway",
  topics: ["Writing", "Promotion & Tenure", "Mentoring", "Productivity"],
  audience: ["New faculty", "Early-career faculty", "Mentors"],
  access: "URI-supported NCFDD guidebook from the faculty membership resources document.",
  accessStatus: "verified",
  costStatus: "free-or-member",
  description: "A curated pathway of resources, webinars, and advice for the first years of faculty life.",
  whyInclude: "Useful companion to orientation, mentoring, and first-year review conversations.",
  sourceUrl: "https://drive.google.com/file/d/1tR0aI764TZfQ6N6yROp5lYch6BCXJSkh/view?usp=sharing",
  lastVerified: today
});

upsertTraining({
  id: "ncfdd-tenure-midcareer-guidebook",
  title: "NCFDD Tenure and Mid-Career Faculty Guidebook",
  provider: "NCFDD",
  status: "recommended",
  priority: "standard",
  startDate: "2026-09-10",
  endDate: "2026-09-10",
  dateLabel: "Self-paced guidebook; recommended for September P&T planning",
  datePrecision: "recommended-window",
  format: "Guidebook and curated resource pathway",
  topics: ["Writing", "Promotion & Tenure", "Career Transitions"],
  audience: ["Pre-tenure faculty", "Mid-career faculty", "Mentors", "Chairs"],
  access: "URI-supported NCFDD guidebook from the faculty membership resources document.",
  accessStatus: "verified",
  costStatus: "free-or-member",
  description: "Resources, webinars, and advice to help faculty navigate tenure, mid-career transitions, and career-path decisions.",
  whyInclude: "Directly supports promotion/tenure readiness and mid-career planning.",
  sourceUrl: "https://drive.google.com/file/d/1ZLSaRbQ9dkst1bwMAV1IHWKk3Ad4PaZA/view?usp=sharing",
  lastVerified: today
});

upsertTraining({
  id: "ncfdd-department-chair-success-program-hold",
  title: "Department Chair Success Program",
  provider: "NCFDD",
  status: "hold",
  priority: "sponsor-only",
  startDate: "2026-08-15",
  endDate: "2026-11-15",
  dateLabel: "12-week chair program; include only if URI sponsors seats",
  datePrecision: "recommended-window",
  format: "12-week chair development program",
  topics: ["Faculty Leadership", "Mentoring", "Promotion & Tenure"],
  audience: ["Department chairs", "Associate deans"],
  access: "Confirm URI sponsorship or seat availability before advertising.",
  accessStatus: "confirm",
  costStatus: "paid-or-sponsor-needed",
  description: "An immersive chair-development program focused on peer learning, expert mentorship, and practical exercises for the department chair role.",
  whyInclude: "Strong leadership fit, but should stay off the free list unless URI has sponsored access.",
  sourceUrl: "https://drive.google.com/file/d/18NHUX8V3R_qLhSdShjJIat55ObCicxSL/view?usp=sharing",
  lastVerified: today
});

upsertTraining({
  id: "cirtl-instructor-materials",
  title: "CIRTL Instructor Materials Library",
  provider: "CIRTL",
  status: "recommended",
  priority: "standard",
  startDate: "2026-10-01",
  endDate: "2026-10-01",
  dateLabel: "Self-paced; recommended for fall teaching refresh",
  datePrecision: "recommended-window",
  format: "Instructor materials and course archive",
  topics: ["Teaching", "Curriculum", "Accessibility"],
  audience: ["Faculty", "Postdocs", "Graduate students", "Future faculty"],
  access: "Public CIRTL resource; URI CIRTL access verified.",
  accessStatus: "verified",
  costStatus: "free-or-member",
  description: "Materials from selected CIRTL courses and workshops, including syllabi, course plans, handouts, slides, and assignments.",
  whyInclude: "Useful for faculty adapting evidence-based teaching materials without waiting for a live course.",
  sourceUrl: "https://cirtl.net/instructor-materials/",
  lastVerified: today
});

upsertTraining({
  id: "cirtl-teaching-as-research-pathway",
  title: "CIRTL Teaching-as-Research Pathway",
  provider: "CIRTL",
  status: "recommended",
  priority: "standard",
  startDate: "2026-11-05",
  endDate: "2026-11-05",
  dateLabel: "Self-paced; recommended for November scholarly teaching/P&T evidence",
  datePrecision: "recommended-window",
  format: "Self-paced teaching inquiry resource",
  topics: ["Teaching", "Research", "Promotion & Tenure"],
  audience: ["Faculty", "Postdocs", "Graduate students", "Future faculty"],
  access: "Public CIRTL resource; URI CIRTL access verified.",
  accessStatus: "verified",
  costStatus: "free-or-member",
  description: "Teaching-as-Research uses deliberate, systematic, and reflective inquiry to improve teaching practices and student learning outcomes.",
  whyInclude: "Helps faculty connect teaching improvement to evidence that can be documented in annual review or promotion materials.",
  sourceUrl: "https://cirtl.net/teaching-as-research/",
  lastVerified: today
});

upsertTraining({
  id: "cirtl-disciplinary-learning-communities",
  title: "CIRTL Disciplinary Learning Communities Curricula",
  provider: "CIRTL",
  status: "recommended",
  priority: "standard",
  startDate: "2027-01-20",
  endDate: "2027-01-20",
  dateLabel: "Self-paced facilitation resource; recommended for spring department learning communities",
  datePrecision: "recommended-window",
  format: "Curricula and assessment resources",
  topics: ["Teaching", "Faculty Leadership", "Assessment"],
  audience: ["Faculty", "Chairs", "Program directors", "Teaching support staff"],
  access: "Public CIRTL resource; URI CIRTL access verified.",
  accessStatus: "verified",
  costStatus: "free-or-member",
  description: "Two curricula and survey tools that departments can use to facilitate disciplinary learning communities around teaching and discipline-based education research.",
  whyInclude: "Gives chairs and programs a ready structure for department-level faculty development.",
  sourceUrl: "https://cirtl.net/disciplinary-learning-communities/",
  lastVerified: today
});

upsertTraining({
  id: "cur-enhanced-membership-activation",
  title: "Activate URI's CUR Enhanced Institutional Membership",
  provider: "CUR",
  status: "recommended",
  priority: "advertise-now",
  startDate: "2026-08-10",
  endDate: "2026-08-10",
  dateLabel: "Self-paced; recommended for August onboarding",
  datePrecision: "recommended-window",
  format: "Membership activation and orientation",
  topics: ["Undergraduate Research", "Mentoring", "Promotion & Tenure"],
  audience: ["Faculty", "Mentors", "Administrators", "Staff", "Students"],
  access: "URI has CUR Institutional - Enhanced membership; individual CUR membership is available at no additional cost to eligible URI community members.",
  accessStatus: "verified",
  costStatus: "free-or-member",
  description: "Faculty, mentors, administrators, students, and staff can activate CUR membership benefits and access CUR communities, divisions, resources, and member materials.",
  whyInclude: "This should be the first CUR item promoted so faculty can unlock the rest of the CUR resources.",
  sourceUrl: "https://www.cur.org/membership-community/membership/activate-enhanced-membership-benefits/",
  lastVerified: today
});

upsertTraining({
  id: "cur-community-forums",
  title: "CUR Community Online Forums",
  provider: "CUR",
  status: "recommended",
  priority: "standard",
  startDate: "2026-09-15",
  endDate: "2027-05-31",
  dateLabel: "Ongoing; recommended monthly",
  datePrecision: "recommended-window",
  format: "Online community forums",
  topics: ["Undergraduate Research", "Mentoring", "Faculty Leadership"],
  audience: ["Faculty", "Mentors", "Program directors", "Administrators"],
  access: "Available through URI's CUR Enhanced Institutional Membership after activation.",
  accessStatus: "verified",
  costStatus: "free-or-member",
  description: "CUR offers online forums for disciplinary divisions, jobs, student journals, and resource-sharing among undergraduate research mentors and program leaders.",
  whyInclude: "A lightweight way for faculty to find discipline-specific undergraduate research mentoring examples and colleagues.",
  sourceUrl: "https://community.cur.org/home",
  lastVerified: today
});

upsertTraining({
  id: "cur-publications-member-resources",
  title: "CUR Publications and Member Resource Library",
  provider: "CUR",
  status: "recommended",
  priority: "standard",
  startDate: "2026-10-20",
  endDate: "2026-10-20",
  dateLabel: "Self-paced; recommended for October undergraduate research mentoring",
  datePrecision: "recommended-window",
  format: "Publications and digital member resources",
  topics: ["Undergraduate Research", "Mentoring", "Promotion & Tenure"],
  audience: ["Faculty", "Mentors", "Program directors"],
  access: "Many digital versions are free to CUR members; URI Enhanced Institutional Membership verified.",
  accessStatus: "verified",
  costStatus: "free-or-member",
  description: "CUR publications and digital resources support undergraduate research mentoring, program development, and assessment.",
  whyInclude: "Good source for building local mentoring guidance and documentation examples.",
  sourceUrl: "https://myaccount.cur.org/bookstore",
  lastVerified: today
});

upsertTraining({
  id: "cur-grant-dialogues-hold",
  title: "CUR Grant Dialogues",
  provider: "CUR",
  status: "hold",
  priority: "screen-cost",
  startDate: "2027-02-10",
  endDate: "2027-02-11",
  dateLabel: "Two-day virtual event; screen cost before advertising",
  datePrecision: "recommended-window",
  format: "Virtual professional development event",
  topics: ["Grant Writing", "Undergraduate Research", "Faculty Leadership"],
  audience: ["Faculty", "Mentors", "Research administrators"],
  access: "CUR membership verified, but event cost should be screened before listing as free.",
  accessStatus: "confirm",
  costStatus: "paid-or-sponsor-needed",
  description: "A CUR and NGMA professional development event on navigating the funding landscape.",
  whyInclude: "Strong writing/grants fit, but should not be advertised as free without cost confirmation.",
  sourceUrl: "https://www.cur.org/events-services/dialogues/",
  lastVerified: today
});

upsertTraining({
  id: "cur-on-demand-ai-writing-courses-hold",
  title: "CUR/HigherEd+ On-Demand Courses: AI, Grant Writing, and Mentoring",
  provider: "CUR",
  status: "hold",
  priority: "screen-cost",
  startDate: "2027-03-01",
  endDate: "2027-03-01",
  dateLabel: "On-demand; screen cost before advertising",
  datePrecision: "recommended-window",
  format: "On-demand course bundles",
  topics: ["AI", "Grant Writing", "Mentoring", "Undergraduate Research"],
  audience: ["Faculty", "Mentors", "Research-active faculty"],
  access: "The downloaded CUR resource document notes that some HigherEd+ bundles are for a fee; screen before listing as free.",
  accessStatus: "confirm",
  costStatus: "paid-or-sponsor-needed",
  description: "Potentially relevant courses include Ethical Use of AI in Higher Education, Introduction to ChatGPT for Academic Research, Master Class on Grant Writing Best Practices, and Building Mentorship and Student Supervision Skills for University Faculty.",
  whyInclude: "Excellent topic fit for AI, writing, and mentoring, but cost status needs review.",
  sourceUrl: "https://www.cur.org/events-services/on-demand-learning-courses/",
  lastVerified: today
});

upsertTraining({
  id: "uri-cur-ur-welcome-packet-session",
  title: "URI Undergraduate Research Welcome Packet and CUR Activation Session",
  provider: "URI",
  status: "recommended",
  priority: "local",
  startDate: "2026-08-28",
  endDate: "2026-08-28",
  dateLabel: "Recommended local session for new faculty orientation",
  datePrecision: "recommended-window",
  format: "Local facilitated orientation module",
  topics: ["Undergraduate Research", "Mentoring", "Promotion & Tenure"],
  audience: ["New faculty", "Mentors", "Chairs"],
  access: "Local URI session to be created using CUR activation instructions and undergraduate research resources.",
  accessStatus: "local",
  costStatus: "local",
  description: "A short orientation module that explains URI's CUR membership, how to activate benefits, how undergraduate research supports faculty work, and how to document undergraduate research mentoring for annual review and promotion.",
  whyInclude: "The CUR resource-system document specifically recommends a new-faculty welcome packet, activation instructions, inspiring UR examples, and guidance on noting UR activity for P&T.",
  sourceUrl: "https://www.cur.org/membership-community/membership/activate-enhanced-membership-benefits/",
  lastVerified: today
});

updateExistingCurItems();
upsertSources();

fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
fs.writeFileSync(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`);

function upsertTraining(item) {
  const index = data.trainings.findIndex((existing) => existing.id === item.id);
  if (index >= 0) {
    data.trainings[index] = { ...data.trainings[index], ...item };
  } else {
    data.trainings.push(item);
  }
}

function updateExistingCurItems() {
  for (const id of ["cur-coeur-2-0-webinar", "cur-mentoring-webinar-archive", "cur-teacher-research-thinking-reasoning-ai"]) {
    const item = data.trainings.find((training) => training.id === id);
    if (!item) continue;
    item.accessStatus = "verified";
    item.costStatus = "free-or-member";
    item.access = "Available through URI's CUR Enhanced Institutional Membership after activation; screen any separately priced event or course.";
    item.lastVerified = today;
  }

  const connect = data.trainings.find((training) => training.id === "cur-connectur-2026-hold");
  if (connect) {
    connect.sourceUrl = "https://www.cur.org/events-services/connectur/";
    connect.description = "CUR's annual conference focuses on practical strategies, leadership insights, inclusive approaches, emerging trends, scalable practices, and campus impact in undergraduate research.";
    connect.access = "URI CUR membership is verified, but event registration cost should be screened before advertising as free.";
    connect.lastVerified = today;
  }
}

function upsertSources() {
  const additions = [
    {
      key: "cur_activation",
      provider: "CUR",
      label: "CUR Enhanced Membership activation",
      url: "https://www.cur.org/membership-community/membership/activate-enhanced-membership-benefits/",
      type: "access-evidence",
      enabled: true
    },
    {
      key: "cur_connectur",
      provider: "CUR",
      label: "CUR ConnectUR",
      url: "https://www.cur.org/events-services/connectur/",
      type: "event-page",
      enabled: true,
      match: ["ConnectUR", "undergraduate research", "conference"]
    },
    {
      key: "cur_dialogues",
      provider: "CUR",
      label: "CUR Grant Dialogues",
      url: "https://www.cur.org/events-services/dialogues/",
      type: "event-page",
      enabled: true,
      match: ["Grant Dialogues", "funding", "professional development"]
    },
    {
      key: "cur_on_demand",
      provider: "CUR",
      label: "CUR on-demand learning courses",
      url: "https://www.cur.org/events-services/on-demand-learning-courses/",
      type: "resource-page",
      enabled: true,
      match: ["AI", "Grant Writing", "ChatGPT", "Mentorship"]
    },
    {
      key: "cirtl_instructor_materials",
      provider: "CIRTL",
      label: "CIRTL Instructor Materials",
      url: "https://cirtl.net/instructor-materials/",
      type: "resource-page",
      enabled: true,
      match: ["Instructor Materials", "Teaching"]
    },
    {
      key: "cirtl_teaching_as_research",
      provider: "CIRTL",
      label: "CIRTL Teaching-as-Research",
      url: "https://cirtl.net/teaching-as-research/",
      type: "resource-page",
      enabled: true,
      match: ["Teaching-as-Research", "learning outcomes"]
    },
    {
      key: "cirtl_disciplinary_learning_communities",
      provider: "CIRTL",
      label: "CIRTL Disciplinary Learning Communities",
      url: "https://cirtl.net/disciplinary-learning-communities/",
      type: "resource-page",
      enabled: true,
      match: ["Disciplinary Learning Communities", "curricula"]
    },
    {
      key: "ncfdd_member_library",
      provider: "NCFDD",
      label: "NCFDD member library",
      url: "https://members.ncfdd.org/library?page=1",
      type: "member-resource",
      enabled: false,
      match: ["Webinars", "Courses"]
    }
  ];

  for (const addition of additions) {
    const index = sources.sources.findIndex((source) => source.key === addition.key);
    if (index >= 0) {
      sources.sources[index] = { ...sources.sources[index], ...addition };
    } else {
      sources.sources.push(addition);
    }
  }
}
