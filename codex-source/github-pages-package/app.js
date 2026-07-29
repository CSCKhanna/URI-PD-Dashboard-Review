const DATA_URL = "./data/trainings.json";
const TODAY = new Date();

const els = {
  search: document.querySelector("#searchInput"),
  sort: document.querySelector("#sortSelect"),
  time: document.querySelector("#timeSelect"),
  providerChips: document.querySelector("#providerChips"),
  topicChips: document.querySelector("#topicChips"),
  audienceChips: document.querySelector("#audienceChips"),
  metricShowing: document.querySelector("#metricShowing"),
  metricConfirm: document.querySelector("#metricConfirm"),
  accessNotes: document.querySelector("#accessNotes"),
  accessToggle: document.querySelector("#accessToggle"),
  resultsShell: document.querySelector(".results-shell"),
  cardsView: document.querySelector("#cardsView"),
  timelineView: document.querySelector("#timelineView"),
  tableView: document.querySelector("#tableView"),
  emptyState: document.querySelector("#emptyState"),
  resultsTitle: document.querySelector("#resultsTitle"),
  resultsCount: document.querySelector("#resultsCount"),
  lastUpdatedText: document.querySelector("#lastUpdatedText"),
  statusDot: document.querySelector("#statusDot"),
  serverStatus: document.querySelector("#serverStatus"),
  guideButton: document.querySelector("#guideButton"),
  guidePanel: document.querySelector("#guidePanel"),
  guideClose: document.querySelector("#guideClose"),
  csvButton: document.querySelector("#csvButton"),
  icsButton: document.querySelector("#icsButton"),
  copyButton: document.querySelector("#copyButton"),
  printButton: document.querySelector("#printButton"),
  viewCards: document.querySelector("#viewCards"),
  viewTimeline: document.querySelector("#viewTimeline"),
  viewTable: document.querySelector("#viewTable")
};

const state = {
  data: null,
  view: "cards",
  query: "",
  providers: new Set(),
  topics: new Set(),
  audiences: new Set(),
  sort: "date",
  time: "all"
};

const PINNED_PROVIDER_CHIPS = [
  "URI-ATL",
  "URI-Academic Affairs",
  "URI-Library",
  "URI-ITS",
  "URI-IACR",
  "URI-Provost's Office"
];

init();

async function init() {
  bindEvents();
  await loadData();
}

function bindEvents() {
  els.search.addEventListener("input", () => {
    state.query = els.search.value.trim().toLowerCase();
    render();
  });

  els.sort.addEventListener("change", () => {
    state.sort = els.sort.value;
    render();
  });

  els.time.addEventListener("change", () => {
    state.time = els.time.value;
    render();
  });

  els.accessToggle.addEventListener("click", () => {
    els.accessNotes.classList.toggle("open");
  });

  els.viewCards.addEventListener("click", () => setView("cards", { scrollToResults: true }));
  els.viewTimeline.addEventListener("click", () => setView("timeline", { scrollToResults: true }));
  els.viewTable.addEventListener("click", () => setView("table", { scrollToResults: true }));

  els.csvButton.addEventListener("click", () => downloadCsv(getFilteredItems()));
  els.icsButton.addEventListener("click", () => downloadIcs(getFilteredItems()));
  els.copyButton.addEventListener("click", copyAnnouncement);
  els.printButton.addEventListener("click", () => window.print());
  els.guideButton.addEventListener("click", openGuide);
  els.guideClose.addEventListener("click", closeGuide);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.guidePanel.hidden) closeGuide();
  });
}

function openGuide() {
  els.guidePanel.hidden = false;
  els.guideButton.setAttribute("aria-expanded", "true");
  els.guideClose.focus();
}

function closeGuide() {
  els.guidePanel.hidden = true;
  els.guideButton.setAttribute("aria-expanded", "false");
  els.guideButton.focus();
}

async function loadData() {
  try {
    const response = await fetch(`${DATA_URL}?v=${Date.now()}`);
    if (!response.ok) throw new Error(`Could not load data: ${response.status}`);
    state.data = await response.json();
    els.statusDot.className = "status-dot ready";
    els.lastUpdatedText.textContent = `Updated ${formatDateTime(state.data.meta.lastUpdated)}`;
    buildFilterControls();
    renderAccessNotes();
    render();
    els.serverStatus.textContent = "Updates run automatically daily at 11:59 p.m. Eastern.";
  } catch (error) {
    els.statusDot.className = "status-dot error";
    els.lastUpdatedText.textContent = "Data could not be loaded";
    els.serverStatus.textContent = error.message;
  }
}

function buildFilterControls() {
  const trainings = state.data.trainings;
  const providers = unique([...PINNED_PROVIDER_CHIPS, ...trainings.map((item) => item.provider)]).sort();
  const topics = unique(trainings.flatMap((item) => item.topics || [])).sort();
  const audiences = unique(trainings.flatMap((item) => item.audience || [])).sort();

  els.providerChips.innerHTML = providers.map((provider) => chipHtml(provider, "provider")).join("");
  els.topicChips.innerHTML = topics.map((topic) => chipHtml(topic, "topic")).join("");
  els.audienceChips.innerHTML = audiences.map((audience) => chipHtml(audience, "audience")).join("");

  els.providerChips.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => toggleSetChip(button, state.providers));
  });
  els.topicChips.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => toggleSetChip(button, state.topics));
  });
  els.audienceChips.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => toggleSetChip(button, state.audiences));
  });
}

function chipHtml(value, type) {
  return `<button class="chip" type="button" data-${type}="${escapeAttr(value)}">${escapeHtml(value)}</button>`;
}

function toggleSetChip(button, set) {
  const value = button.dataset.provider || button.dataset.topic || button.dataset.audience;
  if (set.has(value)) {
    set.delete(value);
    button.classList.remove("active");
  } else {
    set.add(value);
    button.classList.add("active");
  }
  render();
}

function render() {
  if (!state.data) return;
  const items = getFilteredItems();
  els.emptyState.hidden = items.length > 0;
  els.resultsTitle.textContent = titleForFilters();
  els.resultsCount.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;

  renderMetrics(items);
  renderCards(items);
  renderTimeline(items);
  renderTable(items);
}

function getFilteredItems() {
  if (!state.data) return [];
  let items = [...state.data.trainings];

  if (state.providers.size) {
    items = items.filter((item) => state.providers.has(item.provider));
  }

  if (state.topics.size) {
    items = items.filter((item) => (item.topics || []).some((topic) => state.topics.has(topic)));
  }

  if (state.audiences.size) {
    items = items.filter((item) => (item.audience || []).some((audience) => state.audiences.has(audience)));
  }

  if (state.query) {
    items = items.filter((item) => searchableText(item).includes(state.query));
  }

  items = items.filter((item) => matchesTime(item, state.time));

  return sortItems(items, state.sort);
}

function searchableText(item) {
  return [
    item.title,
    item.provider,
    item.coProvider,
    item.format,
    item.description,
    item.whyInclude,
    item.access,
    item.dateLabel,
    ...(item.topics || []),
    ...(item.audience || [])
  ].filter(Boolean).join(" ").toLowerCase();
}

function matchesTime(item, mode) {
  if (mode === "all") return true;
  const date = parseDate(item.startDate);
  if (!date) return false;
  if (mode === "upcoming") return date >= startOfDay(TODAY);
  if (mode === "summer") return inRange(date, "2026-06-01", "2026-08-31");
  if (mode === "fall") return inRange(date, "2026-09-01", "2026-12-31");
  if (mode === "spring") return inRange(date, "2027-01-01", "2027-05-31");
  return true;
}

function sortItems(items, sortMode) {
  return items.sort((a, b) => {
    if (sortMode === "provider") return `${a.provider}${a.title}`.localeCompare(`${b.provider}${b.title}`);
    if (sortMode === "priority") return priorityRank(a) - priorityRank(b) || compareDate(a, b);
    return compareDate(a, b);
  });
}

function compareDate(a, b) {
  return (parseDate(a.startDate)?.getTime() || 0) - (parseDate(b.startDate)?.getTime() || 0);
}

function priorityRank(item) {
  const map = { "advertise-now": 0, standard: 1, local: 2, maintenance: 3, "screen-cost": 4, "sponsor-only": 5 };
  return map[item.priority] ?? 9;
}

function renderMetrics(items) {
  els.metricShowing.textContent = items.length;
  els.metricConfirm.textContent = items.filter((item) => item.accessStatus === "confirm").length;
}

function renderAccessNotes() {
  els.accessNotes.innerHTML = state.data.accessNotes.map((note) => `
    <article class="access-note">
      <span class="badge ${note.status}">${escapeHtml(note.provider)}</span>
      <div>
        <strong>${escapeHtml(statusLabel(note.status))}</strong>
        <p class="description">${escapeHtml(note.summary)}</p>
        <p class="description"><strong>Action:</strong> ${escapeHtml(note.action)}</p>
      </div>
      <a class="text-link" href="${escapeAttr(note.url)}" target="_blank" rel="noopener">
        <svg class="button-icon" aria-hidden="true"><use href="#icon-link"></use></svg>
        Source
      </a>
    </article>
  `).join("");
}

function renderCards(items) {
  els.cardsView.innerHTML = items.map((item) => `
    <article class="training-card">
      <div class="training-top provider-${providerClassName(item.provider)}"></div>
      <div class="training-body">
        <div class="card-meta">
          ${cardBadges(item)}
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="date-line">${escapeHtml(item.dateLabel)}</p>
        <p class="description">${escapeHtml(item.description)}</p>
        <div class="topic-list">${item.topics.map((topic) => `<span class="topic-pill">${escapeHtml(topic)}</span>`).join("")}</div>
        <p class="description"><strong>Access:</strong> ${escapeHtml(item.access)}</p>
        <div class="card-actions">
          <a class="text-link" href="${escapeAttr(item.sourceUrl)}" target="_blank" rel="noopener">
            <svg class="button-icon" aria-hidden="true"><use href="#icon-link"></use></svg>
            Source
          </a>
          ${calendarUrl(item) ? `<a class="text-link" href="${calendarUrl(item)}" target="_blank" rel="noopener">Calendar</a>` : ""}
        </div>
      </div>
    </article>
  `).join("");
}

function cardBadges(item) {
  return [
    `<span class="badge provider-${providerClassName(item.provider)}">${escapeHtml(item.provider)}</span>`,
    item.status === "discovered" ? tooltipBadge("Review", "confirm", "Items found by the updater.") : "",
  ].filter(Boolean).join("");
}

function tooltipBadge(label, className, tooltip) {
  return `<span class="badge ${escapeAttr(className)} has-tooltip badge-tooltip" tabindex="0" role="note" data-tooltip="${escapeAttr(tooltip)}" aria-label="${escapeAttr(`${label}: ${tooltip}`)}">${escapeHtml(label)}</span>`;
}

function badgeTooltipForAccess(item) {
  const tooltips = {
    verified: "Access is verified for URI or publicly available as listed.",
    confirm: "Access or cost needs local confirmation.",
    partial: "Some access evidence is available; screen cost or membership details.",
    paid: "Paid or sponsor-needed item.",
    local: "Local URI-created session or resource."
  };
  return tooltips[item.accessStatus] || "Access status for this item.";
}

function renderTimeline(items) {
  const grouped = groupByMonth(items);
  els.timelineView.innerHTML = Object.entries(grouped).map(([month, monthItems]) => `
    <div class="month-group">
      <div class="month-label">${escapeHtml(month)}</div>
      <div class="timeline-list">
        ${monthItems.map((item) => `
          <article class="timeline-item">
            <div class="card-meta">
              <span class="badge">${escapeHtml(item.provider)}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p class="date-line">${escapeHtml(item.dateLabel)}</p>
            <p class="description">${escapeHtml(item.whyInclude)}</p>
            <div class="timeline-actions">
              <a class="text-link" href="${escapeAttr(item.sourceUrl)}" target="_blank" rel="noopener">
                <svg class="button-icon" aria-hidden="true"><use href="#icon-link"></use></svg>
                Source
              </a>
            </div>
          </article>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function renderTable(items) {
  els.tableView.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Training</th>
          <th>Provider</th>
          <th>Topics</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item) => `
          <tr>
            <td>${escapeHtml(item.dateLabel)}</td>
            <td><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.format)}</td>
            <td>${escapeHtml(item.provider)}</td>
            <td>${escapeHtml(item.topics.join(", "))}</td>
            <td><a href="${escapeAttr(item.sourceUrl)}" target="_blank" rel="noopener">Open</a></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function setView(view, options = {}) {
  state.view = view;
  els.cardsView.hidden = view !== "cards";
  els.timelineView.hidden = view !== "timeline";
  els.tableView.hidden = view !== "table";
  els.viewCards.classList.toggle("active", view === "cards");
  els.viewTimeline.classList.toggle("active", view === "timeline");
  els.viewTable.classList.toggle("active", view === "table");
  els.viewCards.setAttribute("aria-pressed", String(view === "cards"));
  els.viewTimeline.setAttribute("aria-pressed", String(view === "timeline"));
  els.viewTable.setAttribute("aria-pressed", String(view === "table"));

  if (options.scrollToResults) {
    requestAnimationFrame(() => {
      selectedViewElement(view).scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

function selectedViewElement(view) {
  if (view === "timeline") return els.timelineView;
  if (view === "table") return els.tableView;
  return els.cardsView;
}

function titleForFilters() {
  if (state.audiences.size === 1) return `${[...state.audiences][0]} Trainings`;
  if (state.audiences.size > 1) return "Audience-Filtered Trainings";
  return "All Trainings";
}

function groupByMonth(items) {
  return items.reduce((groups, item) => {
    const date = parseDate(item.startDate);
    const label = date ? date.toLocaleString("en-US", { month: "long", year: "numeric" }) : "Undated";
    groups[label] ||= [];
    groups[label].push(item);
    return groups;
  }, {});
}

function downloadCsv(items) {
  const headers = ["Date", "Title", "Provider", "Format", "Topics", "Status", "Source"];
  const rows = items.map((item) => [
    item.dateLabel,
    item.title,
    item.provider,
    item.format,
    item.topics.join("; "),
    item.accessStatus,
    item.sourceUrl
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  downloadFile("uri-faculty-training-calendar.csv", csv, "text/csv");
}

function downloadIcs(items) {
  const dated = items.filter((item) => item.startDate && item.datePrecision !== "placeholder");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//URI Faculty Development//Training Calendar//EN"
  ];
  dated.forEach((item) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${item.id}@uri-faculty-training`,
      `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART;VALUE=DATE:${compactDate(item.startDate)}`,
      `DTEND;VALUE=DATE:${compactDate(addDays(item.endDate || item.startDate, 1))}`,
      `SUMMARY:${icsText(item.title)}`,
      `DESCRIPTION:${icsText(`${item.provider} | ${item.dateLabel} | ${item.access} | ${item.sourceUrl}`)}`,
      `URL:${item.sourceUrl}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  downloadFile("uri-faculty-training-calendar.ics", lines.join("\r\n"), "text/calendar");
}

async function copyAnnouncement() {
  const featured = getFilteredItems()
    .filter((item) => item.priority === "advertise-now")
    .slice(0, 6)
    .map((item) => `- ${item.title} (${item.provider}): ${item.dateLabel}`)
    .join("\n");
  const text = `URI faculty can explore a curated yearlong pathway of AI, writing, and promotion/tenure trainings. Recommended starting points:\n${featured}`;
  await navigator.clipboard.writeText(text);
  els.serverStatus.textContent = "Announcement copy placed on clipboard.";
}

function calendarUrl(item) {
  if (!item.startDate || item.datePrecision === "placeholder") return "";
  const start = compactDate(item.startDate);
  const end = compactDate(addDays(item.endDate || item.startDate, 1));
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: item.title,
    dates: `${start}/${end}`,
    details: `${item.description}\n\nAccess: ${item.access}\n\nSource: ${item.sourceUrl}`
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function inRange(date, start, end) {
  return date >= parseDate(start) && date <= parseDate(end);
}

function addDays(value, days) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function compactDate(value) {
  return value.replaceAll("-", "");
}

function icsDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsText(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function providerClassName(provider) {
  return provider.replace(/[^a-z0-9]/gi, "");
}

function statusLabel(status) {
  const labels = {
    verified: "Verified access",
    confirm: "Confirm locally",
    partial: "Partially verified",
    paid: "Paid item",
    local: "Local item"
  };
  return labels[status] || status;
}

function accessLabel(item) {
  if (item.accessStatus === "verified") return "Verified";
  if (item.accessStatus === "partial") return "Free/open";
  if (item.accessStatus === "confirm") return "Confirm";
  if (item.accessStatus === "paid") return "Paid";
  if (item.accessStatus === "local") return "Local";
  return item.accessStatus;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
