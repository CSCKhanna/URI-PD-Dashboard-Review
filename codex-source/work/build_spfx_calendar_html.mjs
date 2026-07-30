import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = root;
const targetDir = path.join(root, "codex-source/faculty-training-spfx-dropin/src/webparts/uriFacultyTrainingCalendar");

const [indexHtml, stylesCss, appJs, trainingsJson, sealPng] = await Promise.all([
  fs.readFile(path.join(sourceDir, "index.html"), "utf8"),
  fs.readFile(path.join(sourceDir, "styles.css"), "utf8"),
  fs.readFile(path.join(sourceDir, "app.js"), "utf8"),
  fs.readFile(path.join(sourceDir, "data/trainings.json"), "utf8"),
  fs.readFile(path.join(sourceDir, "assets/uri-seal-web.png"))
]);

const sealDataUri = `data:image/png;base64,${sealPng.toString("base64")}`;
const bodyMatch = indexHtml.match(/<body>([\s\S]*?)\s*<script src="\.\/app\.js" type="module"><\/script>\s*<\/body>/);

if (!bodyMatch) {
  throw new Error("Could not locate the calendar body markup in index.html.");
}

const bodyMarkup = bodyMatch[1].replaceAll("./assets/uri-seal-web.png", sealDataUri);

const embeddedDataScript = `
<script>
window.URI_TRAINING_DATA = ${trainingsJson};
const uriTrainingOriginalFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  const url = typeof input === "string" ? input : input && input.url;
  if (url && url.includes("./data/trainings.json")) {
    return Promise.resolve(new Response(JSON.stringify(window.URI_TRAINING_DATA), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    }));
  }
  return uriTrainingOriginalFetch(input, init);
};
</script>`;

const resizeScript = `
<script>
(() => {
  const notifyHeight = () => {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
    parent.postMessage({ type: "uriFacultyTrainingCalendar:height", height }, "*");
  };
  const scheduleHeight = () => requestAnimationFrame(notifyHeight);
  if ("ResizeObserver" in window) {
    new ResizeObserver(scheduleHeight).observe(document.body);
  }
  window.addEventListener("load", scheduleHeight);
  document.addEventListener("click", () => setTimeout(scheduleHeight, 100), true);
  document.addEventListener("input", () => setTimeout(scheduleHeight, 100), true);
  setTimeout(scheduleHeight, 250);
  setTimeout(scheduleHeight, 1200);
})();
</script>`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>URI Instructor Development Calendar: Professional Development from URI and Member Organizations</title>
    <style>
${stylesCss}
html, body {
  overflow-x: hidden;
}
    </style>
  </head>
  <body>
${bodyMarkup}
${embeddedDataScript}
<script type="module">
${appJs}
</script>
${resizeScript}
  </body>
</html>`;

await fs.mkdir(targetDir, { recursive: true });
await fs.writeFile(
  path.join(targetDir, "calendarHtml.ts"),
  `// Generated from the static calendar files by codex-source/work/build_spfx_calendar_html.mjs.\n` +
    `// Re-run the SPFx HTML build after editing the static calendar files.\n\n` +
    `export function buildCalendarHtml(): string {\n` +
    `  return ${JSON.stringify(html)};\n` +
    `}\n`,
  "utf8"
);

await fs.writeFile(
  path.join(root, "codex-source/faculty-training-spfx-dropin/calendar-preview.html"),
  html,
  "utf8"
);
