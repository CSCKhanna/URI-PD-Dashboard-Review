window.__uriCalendarUploadResult = JSON.stringify({ ok: false, status: "running" });

(async () => {
  const siteUrl = "https://uri0.sharepoint.com/sites/NECHEWritingTeam";
  const fileName = "uri-faculty-training-calendar.html";
  const localPreviewUrl = "http://127.0.0.1:4175/calendar-preview.html";
  const targetFolder = "/sites/NECHEWritingTeam/SiteAssets";

  const previewResponse = await fetch(localPreviewUrl, { cache: "no-store" });
  if (!previewResponse.ok) {
    throw new Error(`Could not read local preview: ${previewResponse.status}`);
  }

  const html = await previewResponse.text();
  const digestInput = document.querySelector("#__REQUESTDIGEST");
  let digest = digestInput?.value;

  if (!digest) {
    const contextResponse = await fetch(`${siteUrl}/_api/contextinfo`, {
      method: "POST",
      headers: {
        Accept: "application/json;odata=nometadata"
      }
    });
    if (!contextResponse.ok) {
      throw new Error(`Could not get SharePoint request digest: ${contextResponse.status}`);
    }
    const contextInfo = await contextResponse.json();
    digest = contextInfo.FormDigestValue;
  }

  const uploadUrl = `${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${targetFolder}')/Files/add(url='${fileName}',overwrite=true)`;
  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Accept: "application/json;odata=nometadata",
      "Content-Type": "text/html; charset=utf-8",
      "X-RequestDigest": digest
    },
    body: html
  });

  if (!uploadResponse.ok) {
    const details = await uploadResponse.text();
    throw new Error(`Upload failed: ${uploadResponse.status} ${details.slice(0, 500)}`);
  }

  return JSON.stringify({
    ok: true,
    bytes: html.length,
    url: `${siteUrl}/SiteAssets/${fileName}`
  });
})()
  .then((result) => {
    window.__uriCalendarUploadResult = result;
  })
  .catch((error) => {
    window.__uriCalendarUploadResult = JSON.stringify({ ok: false, error: error.message });
  });

"started";
