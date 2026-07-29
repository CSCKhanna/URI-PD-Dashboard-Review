(async () => {
  const siteUrl = "https://uri0.sharepoint.com/sites/NECHEWritingTeam";
  const fileName = "uri-calendar-smoke.aspx";
  const targetFolder = "/sites/NECHEWritingTeam/SiteAssets";
  const html = "<!doctype html><html><head><title>URI Calendar Smoke Test</title></head><body><h1>URI Calendar Smoke Test</h1><p>If this renders, SharePoint allows inline ASPX from Site Assets.</p></body></html>";

  const digestInput = document.querySelector("#__REQUESTDIGEST");
  let digest = digestInput?.value;

  if (!digest) {
    const contextResponse = await fetch(`${siteUrl}/_api/contextinfo`, {
      method: "POST",
      headers: { Accept: "application/json;odata=nometadata" }
    });
    if (!contextResponse.ok) {
      throw new Error(`Could not get SharePoint request digest: ${contextResponse.status}`);
    }
    digest = (await contextResponse.json()).FormDigestValue;
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
    throw new Error(`Upload failed: ${uploadResponse.status} ${(await uploadResponse.text()).slice(0, 500)}`);
  }

  return JSON.stringify({ ok: true, url: `${siteUrl}/SiteAssets/${fileName}` });
})()
  .then((result) => {
    window.__uriCalendarSmokeUploadResult = result;
  })
  .catch((error) => {
    window.__uriCalendarSmokeUploadResult = JSON.stringify({ ok: false, error: error.message });
  });

"started";

