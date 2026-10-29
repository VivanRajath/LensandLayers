import { whatsappUrl } from "../data";

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
          <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5zm0 1.8a7.7 7.7 0 1 1-3.9 14.3l-.3-.2-2.8.8.8-2.7-.2-.3A7.7 7.7 0 0 1 12 4.3zM8.9 7.6c-.2 0-.5 0-.7.3-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4l-2-.9c-.3-.1-.5-.2-.7.1l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.5z" />
        </svg>
      </span>
    </a>
  );
}
