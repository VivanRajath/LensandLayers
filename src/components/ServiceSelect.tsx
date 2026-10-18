import { useEffect, useId, useRef, useState } from "react";

type Props = {
  label: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
};

/**
 * Multi-select dropdown styled like the form's floating-label fields.
 * Custom (not a native <select>) so the open list is always dark with
 * readable text, on every OS.
 */
export default function ServiceSelect({ label, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  const toggle = (opt: string) => onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted option in view
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, options.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(options[active]); }
    else if (e.key === "Escape" || e.key === "Tab") { setOpen(false); if (e.key === "Escape") btnRef.current?.focus(); }
  };

  const summary =
    value.length === 0 ? "" : value.length <= 2 ? value.join(", ") : `${value.slice(0, 2).join(", ")} +${value.length - 2} more`;

  return (
    <div className={`cf-field cf-select${open ? " is-open" : ""}${value.length ? " has-value" : ""}`} ref={rootRef}>
      <button
        ref={btnRef}
        type="button"
        className="cf-select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className="cf-select-value" id={`${id}-value`}>{summary || " "}</span>
        <svg className="cf-select-caret" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" /></svg>
      </button>
      <span className="cf-select-label" id={`${id}-label`}>{label}</span>
      <span className="cf-line" />

      <ul className="cf-select-list" id={`${id}-list`} role="listbox" aria-multiselectable="true" ref={listRef} hidden={!open} data-lenis-prevent>
        {options.map((opt, i) => {
          const on = value.includes(opt);
          return (
            <li
              key={opt}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={on}
              className={`${on ? "is-on" : ""}${i === active ? " is-active" : ""}`}
              onPointerEnter={() => setActive(i)}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => toggle(opt)}
            >
              <span className="cf-check-box" aria-hidden="true">
                <svg viewBox="0 0 12 10"><path d="M1 5l3.5 3.5L11 1" /></svg>
              </span>
              {opt}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
