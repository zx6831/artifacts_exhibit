import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
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
  return (
    <nav className={cn("tubelight-nav-shell", className)} aria-label="Primary">
      <div className="tubelight-nav-track">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              className={cn("tubelight-nav-link", isActive && "is-active")}
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

              {isActive ? (
                <motion.span
                  layoutId="tubelight-nav-lamp"
                  className="tubelight-nav-lamp"
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 28,
                  }}
                >
                  <span className="tubelight-nav-beam" />
                  <span className="tubelight-nav-glow tubelight-nav-glow--wide" />
                  <span className="tubelight-nav-glow tubelight-nav-glow--core" />
                </motion.span>
              ) : null}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
