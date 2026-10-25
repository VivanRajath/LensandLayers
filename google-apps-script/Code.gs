/**
 * Lens & Layers — contact form backend (Google Apps Script)
 *
 * What it does for every enquiry sent from the website:
 *   1. Adds a row to the "Enquiries" tab of a Google Sheet.
 *   2. Emails the visitor a thank-you ("our team will get in touch").
 *   3. Optionally emails the team a notification (set TEAM_EMAIL below).
 *
 * Setup / after any edit:
 *   1. Paste this file into the Apps Script editor and fill in CONFIG.
 *      - If the script was opened from a Sheet (Extensions → Apps Script), leave SPREADSHEET_ID "".
 *      - If it is a standalone script (made at script.google.com), paste the ID of the sheet:
 *        docs.google.com/spreadsheets/d/<THIS PART>/edit
 *   2. Choose the function "setup" in the toolbar and press Run. Approve the permissions
 *      (Sheets + send email). It creates the tab and emails you a test message.
 *   3. Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.
 *      (Execute as: Me · Who has access: Anyone.) The /exec URL stays the same.
 *
 * If the site shows an error, open Executions (left sidebar) to see the full message.
 */

const CONFIG = {
  /** Leave "" when this script is attached to the sheet; otherwise the sheet's ID. */
  SPREADSHEET_ID: "1k7LKJUDPgsf4sJRnnUvuXKyLNBKgJpdTGouFXW4tSYk",
  SHEET_NAME: "Enquiries",
  BRAND: "Lens & Layers Digital Solutions",
  /** Where team notifications go and where visitor replies land. Leave "" to skip notifications. */
  TEAM_EMAIL: "",
  WEBSITE: "https://lensandlayers.in",
};

// "Consent" is last so sheets created before it was added keep their existing columns.
const HEADERS = ["Submitted at", "Name", "Email", "Phone", "Company", "Services", "Message", "Page", "Email status", "Consent"];
const STATUS_COL = HEADERS.indexOf("Email status") + 1;
/** Wording shown next to the website's consent checkbox; stored with each enquiry as the DPDP Act consent record. */
const CONSENT_TEXT = "Agreed to use of details to respond to enquiry, per Privacy Policy (lensandlayers.in/privacy)";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  let stage = "read";
  try {
    const p = (e && e.parameter) || {};

    // Honeypot: real visitors never fill this hidden field; bots usually do.
    if (p.website) return json({ ok: true });

    const data = {
      name: clean(p.name, 120),
      email: clean(p.email, 160).toLowerCase(),
      phone: clean(p.phone, 40),
      company: clean(p.company, 120),
      service: clean(p.service, 600),
      message: clean(p.message, 3000),
      page: clean(p.page, 300),
    };

    // DPDP Act, 2023: only process personal data the visitor has consented to share.
    if (p.consent !== "yes") return json({ ok: false, error: "Please tick the consent box so we can use your details to reply." });
    if (!data.name) return json({ ok: false, error: "Please enter your name." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return json({ ok: false, error: "Please enter a valid email address." });

    // 1. Record first, so an email problem never loses an enquiry.
    stage = "sheet";
    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      safeCell(data.name),
      safeCell(data.email),
      safeCell(data.phone),
      safeCell(data.company),
      safeCell(data.service),
      safeCell(data.message),
      safeCell(data.page),
      "sending…",
      CONSENT_TEXT,
    ]);
    const row = sheet.getLastRow();

    // 2. Emails. Failures are logged on the row but the visitor still gets a success.
    stage = "email";
    let status = "sent";
    try {
      sendThankYou(data);
    } catch (mailErr) {
      console.error("Thank-you email failed:", mailErr);
      status = "failed: " + String(mailErr).slice(0, 200);
    }
    if (CONFIG.TEAM_EMAIL) {
      try {
        notifyTeam(data, sheet.getParent().getUrl());
      } catch (teamErr) {
        console.error("Team notification failed:", teamErr);
      }
    }
    sheet.getRange(row, STATUS_COL).setValue(status);

    return json({ ok: true });
  } catch (err) {
    console.error("Enquiry failed at stage '" + stage + "':", err);
    return json({
      ok: false,
      error: "Something went wrong. Please try again or email us directly. (ref: " + stage.toUpperCase() + ")",
    });
  } finally {
    lock.releaseLock();
  }
}

/** Visiting the /exec URL in a browser shows this, which is a quick way to check the deployment. */
function doGet() {
  return json({ ok: true, service: "Lens & Layers contact form" });
}

/**
 * Run once from the editor (select "setup" → Run). Grants permissions, creates the
 * Enquiries tab, and emails you a test so you know mail delivery works.
 */
function setup() {
  const sheet = getSheet();
  const me = Session.getEffectiveUser().getEmail();
  MailApp.sendEmail(me, CONFIG.BRAND + " contact form is connected", "Enquiries will be saved to:\n" + sheet.getParent().getUrl());
  console.log("OK — sheet: " + sheet.getParent().getUrl() + " · test email sent to " + me + " · emails left today: " + MailApp.getRemainingDailyQuota());
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

function notifyTeam(d, sheetUrl) {
  MailApp.sendEmail({
    to: CONFIG.TEAM_EMAIL,
    replyTo: d.email,
    subject: "New website enquiry: " + d.name + (d.service ? " — " + d.service : ""),
    body:
      "Name: " + d.name + "\nEmail: " + d.email + "\nPhone: " + (d.phone || "-") + "\nCompany: " + (d.company || "-") + "\nServices: " + (d.service || "-") +
      "\n\nMessage:\n" + (d.message || "-") + "\n\nSent from: " + (d.page || "-") +
      "\n\nAll enquiries: " + sheetUrl,
  });
}

function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID) return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      "This script isn't attached to a Google Sheet. Set CONFIG.SPREADSHEET_ID to your sheet's ID " +
        "(docs.google.com/spreadsheets/d/<ID>/edit), run setup, then deploy a new version.",
    );
  }
  return ss;
}

function getSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  } else if (sheet.getRange(1, HEADERS.length).getValue() !== HEADERS[HEADERS.length - 1]) {
    // Sheet made by an older version of this script: add any new header cells.
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
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
