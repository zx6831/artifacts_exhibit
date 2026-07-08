import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TubelightNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

type TubelightNavBarProps = {
  items: TubelightNavItem[];
  activeId: string;
  className?: string;
  onNavigate?: (id: string, href: string) => void;
};

export function TubelightNavBar({
  items,
  activeId,
  className,
  onNavigate,
}: TubelightNavBarProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [lampMetrics, setLampMetrics] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const updateLamp = () => {
      const activeLink = linkRefs.current[activeId];

      if (!activeLink) {
        setLampMetrics((metrics) => ({ ...metrics, ready: false }));
        return;
      }

      setLampMetrics({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        ready: true,
      });
    };

    updateLamp();

    const observer = new ResizeObserver(updateLamp);
    observer.observe(track);

    const activeLink = linkRefs.current[activeId];
    if (activeLink) {
      observer.observe(activeLink);
    }

    window.addEventListener("resize", updateLamp);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateLamp);
    };
  }, [activeId, items]);

  const lampStyle = {
    "--nav-lamp-x": `${lampMetrics.left}px`,
    "--nav-lamp-width": `${lampMetrics.width}px`,
  } as CSSProperties;

  return (
    <nav className={cn("tubelight-nav-shell", className)} aria-label="Primary">
      <div className="tubelight-nav-track" ref={trackRef}>
        <span
          className={cn("tubelight-nav-lamp", lampMetrics.ready && "is-ready")}
          style={lampStyle}
          aria-hidden="true"
        >
          <span className="tubelight-nav-beam" />
          <span className="tubelight-nav-glow tubelight-nav-glow--wide" />
          <span className="tubelight-nav-glow tubelight-nav-glow--core" />
        </span>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              className={cn("tubelight-nav-link", isActive && "is-active")}
              ref={(element) => {
                linkRefs.current[item.id] = element;
              }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onNavigate?.(item.id, item.href);
              }}
            >
              <span className="tubelight-nav-label">{item.label}</span>
              <span className="tubelight-nav-icon" aria-hidden="true">
                <Icon size={18} strokeWidth={2.35} />
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
