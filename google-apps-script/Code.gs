/**
 * Lens & Layers — contact form backend (Google Apps Script)
 *
 * What it does for every enquiry sent from the website:
 *   1. Adds a row to the "Enquiries" tab of the Google Sheet this script is attached to.
 *   2. Emails the visitor a thank-you ("our team will get in touch").
 *   3. Optionally emails the team a notification (set TEAM_EMAIL below).
 *
 * Setup (once):
 *   1. Create a Google Sheet → Extensions → Apps Script. Replace Code.gs with this file.
 *   2. Edit the CONFIG block below and save.
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as: Me        Who has access: Anyone
 *      Authorise when asked (it needs Sheets + "send email as you").
 *   4. Copy the Web app URL (ends in /exec) and set it as VITE_CONTACT_ENDPOINT for the site.
 *   After editing this script later, use Deploy → Manage deployments → Edit → New version,
 *   so the same /exec URL keeps working.
 */

const CONFIG = {
  SHEET_NAME: "Enquiries",
  BRAND: "Lens & Layers Digital Solutions",
  /** Where team notifications go and where visitor replies land. Leave "" to skip notifications. */
  TEAM_EMAIL: "",
  WEBSITE: "https://lensandlayers.pages.dev",
};

const HEADERS = ["Submitted at", "Name", "Email", "Phone", "Service", "Message", "Page"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const p = (e && e.parameter) || {};

    // Honeypot: real visitors never fill this hidden field; bots usually do.
    if (p.website) return json({ ok: true });

    const data = {
      name: clean(p.name, 120),
      email: clean(p.email, 160).toLowerCase(),
      phone: clean(p.phone, 40),
      service: clean(p.service, 120),
      message: clean(p.message, 3000),
      page: clean(p.page, 300),
    };

    if (!data.name) return json({ ok: false, error: "Please enter your name." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return json({ ok: false, error: "Please enter a valid email address." });

    getSheet().appendRow([
      new Date(),
      safeCell(data.name),
      safeCell(data.email),
      safeCell(data.phone),
      safeCell(data.service),
      safeCell(data.message),
      safeCell(data.page),
    ]);

    sendThankYou(data);
    if (CONFIG.TEAM_EMAIL) notifyTeam(data);

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: "Something went wrong. Please try again or email us directly." });
  } finally {
    lock.releaseLock();
  }
}

/** Visiting the /exec URL in a browser shows this, which is a quick way to check the deployment. */
function doGet() {
  return json({ ok: true, service: "Lens & Layers contact form" });
}

function sendThankYou(d) {
  const first = d.name.split(/\s+/)[0];
  const html =
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px;line-height:1.6">' +
    '<p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#2337ff;margin:0 0 16px">' + esc(CONFIG.BRAND) + "</p>" +
    '<h1 style="font-size:24px;margin:0 0 16px">Thank you for contacting us, ' + esc(first) + ".</h1>" +
    "<p>We've received your enquiry" + (d.service ? " about <strong>" + esc(d.service) + "</strong>" : "") +
    ". Our team will get in touch with you within one working day with ideas and next steps.</p>" +
    (d.message ? '<p style="border-left:3px solid #2337ff;padding:4px 0 4px 12px;color:#555">' + esc(d.message).replace(/\n/g, "<br>") + "</p>" : "") +
    "<p>If anything is urgent, simply reply to this email.</p>" +
    '<p style="margin-top:28px">— The Lens &amp; Layers team<br><a href="' + CONFIG.WEBSITE + '" style="color:#2337ff">' + CONFIG.WEBSITE.replace(/^https?:\/\//, "") + "</a></p>" +
    "</div>";

  const opts = { to: d.email, subject: "Thank you for contacting " + CONFIG.BRAND, htmlBody: html, name: CONFIG.BRAND };
  if (CONFIG.TEAM_EMAIL) opts.replyTo = CONFIG.TEAM_EMAIL;
  MailApp.sendEmail(opts);
}

function notifyTeam(d) {
  MailApp.sendEmail({
    to: CONFIG.TEAM_EMAIL,
    replyTo: d.email,
    subject: "New website enquiry: " + d.name + (d.service ? " — " + d.service : ""),
    body:
      "Name: " + d.name + "\nEmail: " + d.email + "\nPhone: " + (d.phone || "-") + "\nService: " + (d.service || "-") +
      "\n\nMessage:\n" + (d.message || "-") + "\n\nSent from: " + (d.page || "-") +
      "\n\nAll enquiries: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clean(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}

/** Stop spreadsheet formula injection (values starting with = + - @ are stored as text). */
function safeCell(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
