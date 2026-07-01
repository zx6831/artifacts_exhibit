import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  ExternalLink,
  Github,
  House,
  Linkedin,
  Mail,
  Moon,
  Sun,
  UserRound,
  Waypoints,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { PointerEvent } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";

const projects = [
  {
    year: "2026",
    discipline: "Editorial system",
    title: "Signal Atlas",
    copy:
      "A research archive translated into a readable longform system with calmer pacing, stronger hierarchy, and cleaner scanning on every viewport.",
    materialClass: "plate-signal",
    scope: "Content model, responsive type, reading flow",
  },
  {
    year: "2025",
    discipline: "Interactive archive",
    title: "Afterimage Room",
    copy:
      "An exhibition-like browsing experience built around image rhythm, hover timing, and compact labels that do not interrupt the work.",
    materialClass: "plate-afterimage",
    scope: "Hover choreography, archive browsing, visual pacing",
  },
  {
    year: "2025",
    discipline: "Interface system",
    title: "Plain Frame",
    copy:
      "A lightweight frontend framework for personal sites that prioritizes maintainability, resilient layout, and a clear visual grammar.",
    materialClass: "plate-frame",
    scope: "Design system, Vite workflow, maintainable UI",
  },
];

const methods = [
  {
    title: "Define the visual thesis first",
    copy:
      "The page should leave one clear memory. Layout, motion, and component density follow that decision instead of competing with it.",
  },
  {
    title: "Reduce into a reusable language",
    copy:
      "Headlines, cards, navigation, and calls to action should feel made from the same material rather than assembled from unrelated fragments.",
  },
  {
    title: "Validate inside a real browser",
    copy:
      "Scroll behavior, section state, motion, and theme switching only count once they hold up in an actual responsive interface.",
  },
];

const capabilities = [
  "Visual direction",
  "React implementation",
  "Motion tuning",
  "System cleanup",
];

const studioProfile = {
  name: "Lin Studio",
  role: "Visual frontend / Portfolio systems",
  location: "Shanghai / Remote",
  availability: "Open for selected commissions",
  response: "Replies within 48 hours",
  email: "hello@example.com",
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",
};

const featuredProject = {
  label: "Featured case",
  title: "Signal Atlas",
  summary:
    "A longform editorial interface designed to keep dense content calm. The priority is pacing: type rhythm, modular density, and an entry point that feels deliberate instead of overloaded.",
  tags: ["Editorial UI", "Responsive type", "Archive rhythm"],
  metrics: [
    { label: "Format", value: "Longform system" },
    { label: "Stack", value: "React / Motion / CSS" },
    { label: "Focus", value: "Reading flow" },
  ],
};

const navItems = [
  { href: "#top", label: "Home", id: "top", icon: House },
  { href: "#method", label: "Method", id: "method", icon: Waypoints },
  { href: "#work", label: "Projects", id: "work", icon: BriefcaseBusiness },
  { href: "#profile", label: "Profile", id: "profile", icon: UserRound },
  { href: "#contact", label: "Contact", id: "contact", icon: Mail },
];

export function App() {
  const [dark, setDark] = useState(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    try {
      const stored = localStorage.getItem("theme");
      return stored === "dark" || (!stored && prefersDark);
    } catch {
      return prefersDark;
    }
  });
  const [activeSection, setActiveSection] = useState("top");
  const prefersReducedMotion = useReducedMotion();
  const pointerFrame = useRef<number | null>(null);
  const pendingNavTarget = useRef<string | null>(null);
  const pendingNavTimeout = useRef<number | null>(null);
  const year = useMemo(() => new Date().getFullYear(), []);
  const auroraMedia = useMemo(
    () => ({
      enabled: true,
      poster: dark
        ? "/media/aurora-dark-poster.png"
        : "/media/aurora-light-poster.png",
      sources: [
        {
          src: dark
            ? "/media/aurora-dark-loop.webm"
            : "/media/aurora-light-loop.webm",
          type: "video/webm",
        },
      ],
    }),
    [dark]
  );

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // Ignore storage failures in restricted browser contexts.
    }
  }, [dark]);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const navObserver = new IntersectionObserver(
      (entries) => {
        const pendingTarget = pendingNavTarget.current;
        if (pendingTarget) {
          const pendingEntry = entries.find(
            (entry) => entry.target.id === pendingTarget && entry.isIntersecting
          );

          if (pendingEntry) {
            setActiveSection(pendingTarget);
            pendingNavTarget.current = null;
          }

          return;
        }

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.24, 0.45, 0.72], rootMargin: "-22% 0px -52% 0px" }
    );

    sections.forEach((section) => navObserver.observe(section));
    return () => navObserver.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (pointerFrame.current !== null) {
        window.cancelAnimationFrame(pointerFrame.current);
      }

      if (pendingNavTimeout.current !== null) {
        window.clearTimeout(pendingNavTimeout.current);
      }
    };
  }, []);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    const target = event.currentTarget;

    if (pointerFrame.current !== null) {
      window.cancelAnimationFrame(pointerFrame.current);
    }

    pointerFrame.current = window.requestAnimationFrame(() => {
      target.style.setProperty("--pointer-x", x.toFixed(2));
      target.style.setProperty("--pointer-y", y.toFixed(2));
      pointerFrame.current = null;
    });
  };

  const handleNavNavigate = (id: string, href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) {
      return;
    }

    pendingNavTarget.current = id;
    setActiveSection(id);

    if (pendingNavTimeout.current !== null) {
      window.clearTimeout(pendingNavTimeout.current);
    }

    pendingNavTimeout.current = window.setTimeout(() => {
      pendingNavTarget.current = null;
      pendingNavTimeout.current = null;
    }, prefersReducedMotion ? 120 : 1200);

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <AuroraBackground
      className="site-stage"
      backgroundMedia={auroraMedia}
      onPointerMove={onPointerMove}
    >
      <div className="site-top-controls">
        <div className="site-top-controls__nav">
          <TubelightNavBar
            items={navItems}
            activeId={activeSection}
            className="site-floating-nav"
            onNavigate={handleNavNavigate}
          />
        </div>

        <div className="site-top-controls__theme">
          <LiquidGlassButton
            className="site-theme-toggle"
            variant="icon"
            type="button"
            aria-label="Toggle theme"
            aria-pressed={dark}
            onClick={() => setDark((value) => !value)}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            <span>Theme</span>
          </LiquidGlassButton>
        </div>
      </div>

      <div className="site-shell">

        <main>
          <section className="hero section" id="top">
            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="hero-topline">
                <a className="brand" href="#top" aria-label="Back to top">
                  <span className="brand-mark" aria-hidden="true" />
                  <span>{studioProfile.name}</span>
                </a>
                <span className="hero-topline-note">Portfolio for designed interfaces</span>
              </div>
              <h1>Make the navigation feel as intentional as the work below it.</h1>
              <p className="hero-text">
                This portfolio pairs a glass-built interface language with a
                tubelight navigation bar that stays fixed, scrolls cleanly to
                each section, and follows the reader as the page moves.
              </p>

              <div className="hero-actions">
                <LiquidGlassButton variant="primary" href="#work">
                  View projects
                  <ArrowDown size={16} />
                </LiquidGlassButton>
                <LiquidGlassButton
                  variant="ghost"
                  href={`mailto:${studioProfile.email}`}
                >
                  Start a conversation
                  <Mail size={16} />
                </LiquidGlassButton>
              </div>

              <div className="hero-facts reveal" aria-label="Studio facts">
                <div className="glass-plate fact-pill">
                  <span className="fact-label">Role</span>
                  <strong>{studioProfile.role}</strong>
                </div>
                <div className="glass-plate fact-pill">
                  <span className="fact-label">Base</span>
                  <strong>{studioProfile.location}</strong>
                </div>
                <div className="glass-plate fact-pill">
                  <span className="fact-label">Status</span>
                  <strong>{studioProfile.availability}</strong>
                </div>
              </div>
            </motion.div>

            <motion.aside
              className="optical-stage glass-panel"
              aria-label="Featured interface preview"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="preview-topline">
                <span>{featuredProject.label}</span>
                <span>{featuredProject.metrics[1].value}</span>
              </div>

              <div className="preview-media" aria-hidden="true">
                <div className="preview-browser">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="preview-layout">
                  <div className="preview-sidebar">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="preview-canvas">
                    <div className="preview-heading">
                      <span />
                      <span />
                    </div>
                    <div className="preview-chart">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="preview-columns">
                      <div className="preview-card preview-card-wide">
                        <span />
                        <span />
                      </div>
                      <div className="preview-card">
                        <span />
                        <span />
                      </div>
                      <div className="preview-card">
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="preview-summary">
                <div className="preview-copy">
                  <h3>{featuredProject.title}</h3>
                  <p>{featuredProject.summary}</p>
                </div>

                <div className="preview-tags" aria-label="Project tags">
                  {featuredProject.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="preview-footer">
                <div className="preview-metrics">
                  {featuredProject.metrics.map((metric) => (
                    <div key={metric.label}>
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </section>

          <section className="intro-strip reveal" aria-label="Studio note">
            <div className="intro-grid">
              <p>
                The signature move on this page is the tubelight navigation:
                calm by default, bright only where the reader is, and precise in
                both click and scroll state.
              </p>
              <span>
                Fixed at the top. Smooth anchor scroll. Automatic section sync.
              </span>
            </div>
          </section>

          <section className="section method-section" id="method">
            <div className="section-heading reveal">
              <p className="eyebrow">Method</p>
              <h2>Navigation should read like orientation, not decoration.</h2>
            </div>

            <div className="method-grid">
              {methods.map((method) => (
                <article key={method.title} className="method-card glass-panel reveal">
                  <h3>{method.title}</h3>
                  <p>{method.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section work-section" id="work">
            <div className="section-heading reveal">
              <p className="eyebrow">Projects</p>
              <h2>Three interface systems tuned for reading, browsing, and recall.</h2>
            </div>

            <div className="project-grid">
              {projects.map((project) => (
                <article key={project.title} className="project-card glass-panel reveal">
                  <div className={`project-plate ${project.materialClass}`} aria-hidden="true">
                    <span />
                    <span />
                  </div>
                  <p className="card-kicker">
                    {project.year} / {project.discipline}
                  </p>
                  <h3>{project.title}</h3>
                  <p className="card-copy">{project.copy}</p>
                  <div className="project-meta">
                    <span>{project.scope}</span>
                    <ArrowUpRight size={14} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section profile-section" id="profile">
            <div className="section-heading reveal">
              <p className="eyebrow">Profile</p>
              <h2>A small studio practice focused on distinctive frontend systems.</h2>
            </div>

            <div className="profile-grid">
              <p className="profile-text reveal">
                The work sits between art direction and production UI. The goal
                is not to add more effects. It is to choose one memorable visual
                gesture, support it with clear structure, and ship something
                that still feels precise once it is responsive, themed, and
                scroll-tested.
              </p>

              <div className="profile-side">
                <div className="capability-list reveal" aria-label="Capabilities">
                  {capabilities.map((capability) => (
                    <span key={capability}>{capability}</span>
                  ))}
                </div>

                <div className="availability-card glass-panel reveal">
                  <strong>{studioProfile.availability}</strong>
                  <p>{studioProfile.response}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section contact-section" id="contact">
            <div className="contact-card reveal">
              <p className="eyebrow">Contact</p>
              <h2>Need a portfolio, archive, or product page with stronger presence?</h2>

              <div className="contact-summary">
                <p>{studioProfile.role}</p>
                <p>{studioProfile.location}</p>
                <p>{studioProfile.response}</p>
              </div>

              <div className="contact-links">
                <LiquidGlassButton variant="primary" href={`mailto:${studioProfile.email}`}>
                  Email
                  <Mail size={16} />
                </LiquidGlassButton>
                <LiquidGlassButton variant="ghost" href={studioProfile.github}>
                  GitHub
                  <Github size={16} />
                </LiquidGlassButton>
                <LiquidGlassButton variant="ghost" href={studioProfile.linkedin}>
                  LinkedIn
                  <Linkedin size={16} />
                </LiquidGlassButton>
                <LiquidGlassButton variant="ghost" href="#work">
                  Revisit projects
                  <ExternalLink size={16} />
                </LiquidGlassButton>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <p>{studioProfile.name}</p>
          <p>{year}</p>
        </footer>
      </div>
    </AuroraBackground>
  );
}
