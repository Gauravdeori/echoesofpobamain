import { useState, useEffect, useRef, type ReactNode } from "react";
import { ChevronDown, Leaf } from "lucide-react";

interface CollapsibleSectionProps {
  id: string;
  title: string;
  badge?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({
  id,
  title,
  badge,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* Listen for programmatic "open-section" events dispatched by nav / CTAs */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ sectionId: string }>).detail;
      if (detail?.sectionId === id) {
        setIsOpen(true);
        /* Small delay so the content has time to expand before we scroll */
        setTimeout(() => {
          wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    };

    window.addEventListener("open-section", handler);
    return () => window.removeEventListener("open-section", handler);
  }, [id]);

  return (
    <div ref={wrapperRef} id={id} className="scroll-mt-20">
      {/* ── Clickable header bar ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full group flex items-center justify-between gap-4 px-5 py-4 md:px-8 md:py-5
          bg-gradient-to-r from-primary/[0.06] via-transparent to-primary/[0.04]
          border-b border-border/60 hover:from-primary/[0.10] hover:to-primary/[0.07]
          transition-all duration-300 cursor-pointer select-none"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-300
            ${isOpen ? "bg-primary/20 rotate-12" : "group-hover:bg-primary/15"}`}
          >
            <Leaf className="w-4 h-4 text-primary" />
          </div>

          <div className="flex items-center gap-3">
            <h3 className="font-display text-lg md:text-xl font-semibold text-brown-deep tracking-wide">
              {title}
            </h3>
            {badge && (
              <span className="hidden sm:inline-block text-[11px] font-medium uppercase tracking-wider text-primary bg-primary/10 rounded-full px-3 py-0.5">
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-xs text-muted-foreground/70">
            {isOpen ? "Tap to close" : "Tap to open"}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* ── Collapsible body with CSS Grid transition ── */}
      <div
        id={`${id}-content`}
        className="grid transition-[grid-template-rows] duration-500 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
