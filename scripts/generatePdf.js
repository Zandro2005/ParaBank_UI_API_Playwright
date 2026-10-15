const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { chromium } = require('@playwright/test');

async function generatePdf() {
  const mdPath = path.join(__dirname, '..', 'docs', 'TEST_CASES.md');
  const pdfPath = path.join(__dirname, '..', 'docs', 'ParaBank_Test_Cases_Specification.pdf');

  let markdown = fs.readFileSync(mdPath, 'utf8');

  // Convert GitHub-style callouts to styled alert boxes
  markdown = markdown.replace(
    /> \[!IMPORTANT\]\s*\n((?:> .*\n?)+)/g,
    (_, content) => {
      const clean = content.replace(/^> ?/gm, '');
      return `<div class="alert alert-important"><strong>IMPORTANT:</strong> ${clean}</div>\n`;
    }
  );
  markdown = markdown.replace(
    /> \[!NOTE\]\s*\n((?:> .*\n?)+)/g,
    (_, content) => {
      const clean = content.replace(/^> ?/gm, '');
      return `<div class="alert alert-note"><strong>NOTE:</strong> ${clean}</div>\n`;
    }
  );
  markdown = markdown.replace(
    /> \[!TIP\]\s*\n((?:> .*\n?)+)/g,
    (_, content) => {
      const clean = content.replace(/^> ?/gm, '');
      return `<div class="alert alert-tip"><strong>TIP:</strong> ${clean}</div>\n`;
    }
  );

  // Parse markdown to HTML
  let htmlBody = marked.parse(markdown);

  // Enhance badges in table cells:
  // 1. Priority badges (P1, P2, P3)
  htmlBody = htmlBody.replace(/<td>P1<\/td>/g, '<td><span class="badge badge-p1">P1</span></td>');
  htmlBody = htmlBody.replace(/<td>P2<\/td>/g, '<td><span class="badge badge-p2">P2</span></td>');
  htmlBody = htmlBody.replace(/<td>P3<\/td>/g, '<td><span class="badge badge-p3">P3</span></td>');

  // 2. Test ID badges
  htmlBody = htmlBody.replace(/<td>(TC-[A-Z]+-(API|UI|HYB|MCK)-\d+)<\/td>/g, (match, id, layer) => {
    return `<td><span class="badge-id badge-id-${layer.toLowerCase()}">${id}</span></td>`;
  });

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ParaBank Test Case Specification</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 14mm 12mm 14mm 12mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 12.5px;
      line-height: 1.55;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* Headers */
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 8px;
      margin-top: 0;
      margin-bottom: 14px;
    }

    h2 {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      background: #f1f5f9;
      border-left: 5px solid #2563eb;
      padding: 8px 12px;
      margin-top: 22px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 13.5px;
      font-weight: 700;
      color: #1e40af;
      margin-top: 16px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    p, li {
      font-size: 12px;
      color: #334155;
      line-height: 1.55;
    }

    hr {
      border: none;
      border-top: 1px solid #cbd5e1;
      margin: 18px 0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 11.5px;
      page-break-inside: auto;
    }

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    thead {
      display: table-header-group;
    }

    th {
      background-color: #0f172a;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 8px 9px;
      border: 1px solid #334155;
      font-size: 11.5px;
      white-space: nowrap;
    }

    td {
      padding: 8px 9px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
      line-height: 1.45;
      font-size: 11px;
    }

    tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }

    tbody tr:hover {
      background-color: #f1f5f9;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 3px 7px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 10.5px;
      text-align: center;
      white-space: nowrap;
    }

    .badge-p1 {
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
    }

    .badge-p2 {
      background-color: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
    }

    .badge-p3 {
      background-color: #e0f2fe;
      color: #075985;
      border: 1px solid #7dd3fc;
    }

    .badge-id {
      display: inline-block;
      font-family: "Courier New", Courier, monospace;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .badge-id-api {
      background-color: #dbeafe;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }

    .badge-id-ui {
      background-color: #ede9fe;
      color: #5b21b6;
      border: 1px solid #ddd6fe;
    }

    .badge-id-hyb {
      background-color: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .badge-id-mck {
      background-color: #ffedd5;
      color: #9a3412;
      border: 1px solid #fed7aa;
    }

    /* Callout Alerts */
    .alert {
      padding: 10px 14px;
      border-radius: 5px;
      margin: 12px 0;
      font-size: 11.5px;
      line-height: 1.5;
      page-break-inside: avoid;
    }

    .alert-important {
      background-color: #fff1f2;
      border-left: 5px solid #e11d48;
      color: #9f1239;
    }

    .alert-note {
      background-color: #eff6ff;
      border-left: 5px solid #3b82f6;
      color: #1e40af;
    }

    .alert-tip {
      background-color: #f0fdf4;
      border-left: 5px solid #22c55e;
      color: #166534;
    }

    code {
      font-family: "Courier New", Courier, monospace;
      font-size: 10.5px;
      background-color: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      color: #0f172a;
    }
  </style>
</head>
<body>
  ${htmlBody}
</body>
</html>`;

  console.log('Launching headless Chromium...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Rendering content...');
  await page.setContent(fullHtml, { waitUntil: 'networkidle' });

  console.log('Generating PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: {
      top: '14mm',
      bottom: '14mm',
      left: '12mm',
      right: '12mm',
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size: 10px; font-family: -apple-system, sans-serif; color: #475569; width: 100%; padding: 0 12mm; display: flex; justify-content: space-between;">
        <span>🏦 <strong>ParaBank</strong> — Test Case Specification (API + UI + Hybrid Automation)</span>
        <span>Portfolio QA Automation</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-size: 10px; font-family: -apple-system, sans-serif; color: #475569; width: 100%; padding: 0 12mm; display: flex; justify-content: space-between;">
        <span>Playwright & TypeScript Test Engineering Framework</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
  });

  await browser.close();

  const stats = fs.statSync(pdfPath);
  console.log(`✅ PDF successfully generated at: ${pdfPath}`);
  console.log(`📄 File size: ${(stats.size / 1024).toFixed(2)} KB`);
}

generatePdf().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
