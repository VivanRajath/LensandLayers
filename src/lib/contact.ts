/**
 * Sends the enquiry form to the Google Apps Script web app
 * (see google-apps-script/Code.gs), which records it in a Google Sheet
 * and emails the visitor a thank-you.
 *
 * The /exec URL comes from VITE_CONTACT_ENDPOINT at build time.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  company: string;
  /** Selected services, comma-separated */
  service: string;
  message: string;
  /** Honeypot — must stay empty */
  website: string;
};

export async function sendEnquiry(data: Enquiry): Promise<void> {
  if (!ENDPOINT) throw new Error("The contact form isn't connected yet. Please email us directly.");

  const body = new URLSearchParams({ ...data, page: window.location.href });

  // Form-encoded body keeps this a "simple" CORS request: Apps Script can't answer a preflight.
  const res = await fetch(ENDPOINT, { method: "POST", body });
  const json = (await res.json().catch(() => null)) as { ok: boolean; error?: string } | null;
  if (!res.ok || !json?.ok) throw new Error(json?.error || "Something went wrong. Please try again.");
}
