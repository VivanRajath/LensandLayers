/**
 * Sends the enquiry form to the Google Apps Script web app
 * (see google-apps-script/Code.gs), which records it in a Google Sheet
 * and emails the visitor a thank-you.
 *
 * The /exec URL comes from VITE_CONTACT_ENDPOINT at build time.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

export async function sendEnquiry(form: HTMLFormElement): Promise<void> {
  if (!ENDPOINT) throw new Error("The contact form isn't connected yet. Please email us directly.");

  const body = new URLSearchParams();
  new FormData(form).forEach((v, k) => body.append(k, String(v)));
  body.append("page", window.location.href);

  // Form-encoded body keeps this a "simple" CORS request: Apps Script can't answer a preflight.
  const res = await fetch(ENDPOINT, { method: "POST", body });
  const data = (await res.json().catch(() => null)) as { ok: boolean; error?: string } | null;
  if (!res.ok || !data?.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
}
