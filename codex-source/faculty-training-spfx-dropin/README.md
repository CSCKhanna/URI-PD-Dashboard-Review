# URI Faculty Training Calendar SPFx Drop-In

This folder contains the SharePoint Framework web part source for the interactive URI faculty development training calendar.

The web part renders the existing static calendar inside a self-contained iframe. That keeps the current Cards, Timeline, Table, filters, source links, CSV export, calendar export, print view, and URI seal intact while allowing the experience to be installed as a SharePoint web part.

## Current Status

I could not build the final `.sppkg` package in this Codex shell because npm is not available and the shell cannot currently resolve `nodejs.org` to download the supported Node/npm toolchain.

The source files are ready to drop into a generated SPFx project.

## Build Steps On A Machine With npm

1. Install the SPFx-supported Node.js LTS version listed by Microsoft for your SPFx version.
2. Install the SharePoint generator:

   ```bash
   npm install --global @rushstack/heft yo @microsoft/generator-sharepoint
   ```

3. Create a no-framework web part:

   ```bash
   mkdir uri-faculty-training-calendar-spfx
   cd uri-faculty-training-calendar-spfx
   yo @microsoft/sharepoint
   ```

   Recommended generator choices:

   - Solution name: `uri-faculty-training-calendar`
   - Component type: `WebPart`
   - Web part name: `UriFacultyTrainingCalendar`
   - Framework: `No JavaScript framework`
   - Tenant-wide deployment: choose based on URI admin preference

4. Replace the generated web part folder with:

   ```text
   src/webparts/uriFacultyTrainingCalendar
   ```

   from this drop-in folder.

5. Build and package:

   ```bash
   npm install
   heft build --production
   heft package-solution --production
   ```

6. Upload the generated `.sppkg` file from `sharepoint/solution/` to the SharePoint App Catalog.

7. Add the app to the target SharePoint site, then edit a page and add the **URI Faculty Training Calendar** web part.

## Updating The Calendar Data

The embedded calendar HTML is generated from:

```text
outputs/faculty-training-webpage
```

After changing the static calendar, regenerate the SPFx HTML module from the repository root:

```bash
/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node work/build_spfx_calendar_html.mjs
```

Then rebuild and repackage the SPFx solution.

## Important Limitation

This SPFx version embeds the current curated data at package time. It will not run the local `server.mjs` updater from SharePoint. For automatic production updates, pair this with an external scheduled process, such as GitHub Actions or Power Automate, and then rebuild/redeploy the package or switch the data source to a SharePoint-hosted JSON file.
