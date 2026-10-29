import { whatsappUrl } from "../data";
import { WHATSAPP_PATH } from "../lib/glyphs";

/**
 * Floating "chat on WhatsApp" button. Hidden on the live site until whatsapp.number is set in
 * data.ts; in dev it always shows (pointing nowhere) so the design can be previewed.
 */
export default function WhatsApp({ ready }: { ready: boolean }) {
  if (!whatsappUrl && !import.meta.env.DEV) return null;
  return (
    <a
      className={`wa-float${ready ? " is-in" : ""}`}
      href={whatsappUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Lens & Layers on WhatsApp"
    >
      <span className="wa-label">Chat on WhatsApp</span>
      <span className="wa-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d={WHATSAPP_PATH} />
        </svg>
      </span>
    </a>
  );
}
