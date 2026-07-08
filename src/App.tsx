import {
  ArrowUpRight,
  AudioLines,
  BriefcaseBusiness,
  ExternalLink,
  Github,
  House,
  Mail,
  Moon,
  Server,
  Sun,
  UserRound,
  Waypoints,
} from "lucide-react";
import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";

const projects = [
  {
    year: "2026",
    discipline: "Full-stack product",
    title: "v2t",
    copy:
      "A classroom lecture processing pipeline that turns uploaded video or audio into cleaned transcripts and structured exam key-points in Markdown.",
    materialClass: "plate-signal",
    scope: "Python API, Next.js 16 frontend, SSE streaming",
    emphasis: "Live project",
    href: "https://v2t.206831.xyz",
  },
  {
    year: "Ongoing",
    discipline: "More selected work",
    title: "Additional projects",
    copy:
      "This portfolio is still being expanded. More finished projects and experiments will be added here as the archive is organized and written up properly.",
    materialClass: "plate-afterimage",
    scope: "In preparation",
    emphasis: "Portfolio update",
    href: "#contact",
  },
  {
    year: "Now",
    discipline: "Open-source profile",
    title: "GitHub work",
    copy:
      "Code, experiments, and smaller utilities live on GitHub. Until each project gets its own case study page, the profile works as the broader index of active work.",
    materialClass: "plate-frame",
    scope: "Repositories, commits, and experiments",
    emphasis: "GitHub profile",
    href: "https://github.com/zx6831",
  },
];

const methods = [
  {
    step: "01",
    title: "Build practical tools",
    copy:
      "Projects start from a real workflow problem, then get shaped into something that reduces manual steps and makes the result easier to use.",
  },
  {
    step: "02",
    title: "Keep the interface readable",
    copy:
      "Even when the underlying system is technical, the UI should explain state clearly, surface progress, and stay usable during longer-running tasks.",
  },
  {
    step: "03",
    title: "Write up the system honestly",
    copy:
      "A portfolio entry should show what the project actually does, what stack it uses, and what tradeoffs shaped the implementation.",
  },
];

const capabilities = [
  {
    title: "Full-stack implementation",
    note: "I build across frontend, backend, and integration layers instead of treating the interface and the system as separate worlds.",
  },
  {
    title: "Workflow design",
    note: "The strongest projects are usually about reducing friction in a repeated task, not just adding features to a screen.",
  },
  {
    title: "AI-assisted tooling",
    note: "Recent work includes speech recognition, LLM summarization, and interfaces that make these capabilities usable in practice.",
  },
  {
    title: "Case-study writing",
    note: "I am still expanding this portfolio, with current work being gradually rewritten into clearer public-facing project pages.",
  },
];

const studioProfile = {
  name: "WZX",
  role: "Personal portfolio / Full-stack builder",
  location: "China / Remote",
  availability: "Open to collaboration and feedback",
  response: "Replies by email",
  email: "wzx6831@gmail.com",
  github: "https://github.com/zx6831",
  projectUrl: "https://v2t.206831.xyz",
};

const featuredProject = {
  label: "Featured project",
  title: "v2t",
  summary:
    "v2t turns classroom lecture recordings into cleaner study material. Upload a file, run transcription and cleanup, then generate a structured Markdown summary through a DeepSeek-compatible API.",
  tags: ["FunASR", "Next.js 16", "Python API", "Markdown summary"],
  metrics: [
    { label: "Input", value: "Video / Audio" },
    { label: "Stack", value: "Python / Next.js / SSE" },
    { label: "Output", value: "Transcript + key points" },
  ],
};

const sectionNotes = {
  method: "A small personal workflow for turning technical experiments into usable products and then into readable portfolio entries.",
  work: "v2t is one shipped project inside a broader body of work that is still being documented.",
  profile:
    "This is a personal portfolio first: one real project is live now, and more case studies will be added as they are prepared properly.",
};

const navItems = [
  { href: "#top", label: "Home", id: "top", icon: House },
  { href: "#method", label: "Process", id: "method", icon: Waypoints },
  { href: "#work", label: "Work", id: "work", icon: BriefcaseBusiness },
  { href: "#profile", label: "Studio", id: "profile", icon: UserRound },
  { href: "#contact", label: "Contact", id: "contact", icon: Mail },
];

const revealOrder = (order: number): CSSProperties =>
  ({
    "--reveal-order": order,
  }) as CSSProperties;

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(query.matches);

    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
};

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
  const prefersReducedMotion = usePrefersReducedMotion();
  const pointerFrame = useRef<number | null>(null);
  const navFrame = useRef<number | null>(null);
  const navSettleTimeout = useRef<number | null>(null);
  const pendingNavTarget = useRef<string | null>(null);
  const pendingNavTimeout = useRef<number | null>(null);
  const activeSectionRef = useRef("top");
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
    const revealScopes = document.querySelectorAll<HTMLElement>("[data-reveal-scope]");

    if (!("IntersectionObserver" in window)) {
      revealScopes.forEach((scope) => scope.classList.add("is-visible"));
      return;
    }

    revealScopes.forEach((scope) => {
      scope.querySelectorAll<HTMLElement>(".reveal").forEach((item, index) => {
        item.style.setProperty("--reveal-order", String(index));
      });
    });

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
      { threshold: 0.14, rootMargin: "0px 0px -12% 0px" }
    );

    revealScopes.forEach((scope) => revealObserver.observe(scope));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const setSection = (id: string) => {
      if (activeSectionRef.current === id) {
        return;
      }

      activeSectionRef.current = id;
      setActiveSection(id);
    };

    const updateActiveSection = () => {
      const pageBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      const pendingTarget = pendingNavTarget.current;

      if (pendingTarget) {
        const target = document.getElementById(pendingTarget);
        const targetRect = target?.getBoundingClientRect();
        const targetReached =
          !targetRect ||
          Math.abs(targetRect.top - 112) <= 18 ||
          (pageBottom && target === sections[sections.length - 1]);

        setSection(pendingTarget);

        if (targetReached) {
          pendingNavTarget.current = null;

          if (pendingNavTimeout.current !== null) {
            window.clearTimeout(pendingNavTimeout.current);
            pendingNavTimeout.current = null;
          }
        }

        return;
      }

      if (pageBottom) {
        setSection(sections[sections.length - 1].id);
        return;
      }

      const probeY = Math.min(window.innerHeight * 0.42, 360);
      let current = sections[0];

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= probeY) {
          current = section;
        }

        if (rect.top <= probeY && rect.bottom > probeY) {
          current = section;
          break;
        }
      }

      setSection(current.id);
    };

    const requestUpdate = () => {
      if (navFrame.current !== null) {
        if (navSettleTimeout.current !== null) {
          window.clearTimeout(navSettleTimeout.current);
        }

        navSettleTimeout.current = window.setTimeout(updateActiveSection, 90);
        return;
      }

      navFrame.current = window.requestAnimationFrame(() => {
        updateActiveSection();
        navFrame.current = null;
      });

      if (navSettleTimeout.current !== null) {
        window.clearTimeout(navSettleTimeout.current);
      }

      navSettleTimeout.current = window.setTimeout(() => {
        updateActiveSection();
        navSettleTimeout.current = null;
      }, 90);
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("scrollend", updateActiveSection);
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("scrollend", updateActiveSection);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("load", requestUpdate);

      if (navFrame.current !== null) {
        window.cancelAnimationFrame(navFrame.current);
        navFrame.current = null;
      }

      if (navSettleTimeout.current !== null) {
        window.clearTimeout(navSettleTimeout.current);
        navSettleTimeout.current = null;
      }

      if (pendingNavTimeout.current !== null) {
        window.clearTimeout(pendingNavTimeout.current);
        pendingNavTimeout.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pointerFrame.current !== null) {
        window.cancelAnimationFrame(pointerFrame.current);
      }

      if (navFrame.current !== null) {
        window.cancelAnimationFrame(navFrame.current);
      }

      if (navSettleTimeout.current !== null) {
        window.clearTimeout(navSettleTimeout.current);
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
    activeSectionRef.current = id;
    setActiveSection(id);

    if (pendingNavTimeout.current !== null) {
      window.clearTimeout(pendingNavTimeout.current);
    }

    pendingNavTimeout.current = window.setTimeout(() => {
      pendingNavTarget.current = null;
      pendingNavTimeout.current = null;
    }, prefersReducedMotion ? 120 : 1400);

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
          <section className="hero section" id="top" data-reveal-scope>
            <div className="hero-copy">
              <div className="hero-topline reveal" style={revealOrder(0)}>
                <a className="brand" href="#top" aria-label="Back to top">
                  <span className="brand-mark" aria-hidden="true" />
                  <span>{studioProfile.name}</span>
                </a>
                <span className="hero-topline-note">Video-to-text learning workflow</span>
              </div>
              <div className="hero-intro reveal" style={revealOrder(1)}>
                <p className="hero-kicker">
                  Personal projects across full-stack product work, AI-assisted tooling, and practical workflow design.
                </p>
                <p className="hero-side-note">
                  v2t is the first featured case here, with additional projects being organized into clearer portfolio entries.
                </p>
              </div>
              <h1 className="reveal" style={revealOrder(2)}>
                WZX builds useful software.
              </h1>
              <p className="hero-text reveal" style={revealOrder(3)}>
                This is a personal portfolio focused on implementation-heavy
                projects. Current work includes `v2t`, a lecture
                video-to-text pipeline, alongside other projects that are still
                being written up into full case studies.
              </p>

              <div className="hero-actions reveal" style={revealOrder(4)}>
                <LiquidGlassButton variant="primary" href={studioProfile.projectUrl}>
                  Open v2t
                  <ExternalLink size={16} />
                </LiquidGlassButton>
                <LiquidGlassButton
                  variant="ghost"
                  href={`mailto:${studioProfile.email}`}
                >
                  Email me
                  <Mail size={16} />
                </LiquidGlassButton>
              </div>

              <div
                className="hero-facts reveal"
                aria-label="Studio facts"
                style={revealOrder(5)}
              >
                <div className="glass-plate fact-pill">
                  <span className="fact-label">Site</span>
                  <strong>{studioProfile.role}</strong>
                </div>
                <div className="glass-plate fact-pill">
                  <span className="fact-label">Featured</span>
                  <strong>v2t</strong>
                </div>
                <div className="glass-plate fact-pill">
                  <span className="fact-label">Contact</span>
                  <strong>{studioProfile.email}</strong>
                </div>
              </div>
            </div>

            <aside
              className="optical-stage glass-panel reveal"
              aria-label="Featured interface preview"
              style={revealOrder(6)}
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
            </aside>
          </section>

          <section
            className="intro-strip reveal"
            aria-label="Studio note"
            data-reveal-scope
            style={revealOrder(0)}
          >
            <div className="intro-grid">
              <p className="reveal" style={revealOrder(1)}>
                The goal of this portfolio is to show real working systems,
                not just polished surfaces. Each entry should make the problem,
                stack, and outcome legible at a glance.
              </p>
              <span className="reveal" style={revealOrder(2)}>
                v2t is live now; more projects will follow as they are properly
                documented and added.
              </span>
            </div>
          </section>

          <section className="section method-section" id="method" data-reveal-scope>
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">Process</p>
                <h2>How I approach project work before it becomes a portfolio case study.</h2>
              </div>
              <p className="section-note">{sectionNotes.method}</p>
            </div>

            <div className="method-grid">
              {methods.map((method) => (
                <article key={method.title} className="method-card glass-panel reveal">
                  <span className="method-card-step">{method.step}</span>
                  <h3>{method.title}</h3>
                  <p className="method-card-copy">{method.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section work-section" id="work" data-reveal-scope>
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2>One shipped project, one portfolio in progress, and one broader code archive.</h2>
              </div>
              <p className="section-note">{sectionNotes.work}</p>
            </div>

            <div className="project-grid">
              {projects.map((project, index) => (
                <article
                  key={project.title}
                  className={`project-card glass-panel reveal${index === 0 ? " project-card--featured" : ""}`}
                >
                  <div className={`project-plate ${project.materialClass}`} aria-hidden="true">
                    {index === 0 ? <Server size={52} /> : <AudioLines size={52} />}
                  </div>
                  <div className="project-copy-block">
                    <p className="card-kicker">
                      {project.year} / {project.discipline}
                    </p>
                    <h3>{project.title}</h3>
                    <p className="card-copy">{project.copy}</p>
                    <a className="project-meta" href={project.href}>
                      <span className="project-scope">{project.scope}</span>
                      <span className="project-emphasis">{project.emphasis}</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section profile-section" id="profile" data-reveal-scope>
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">Studio</p>
                <h2>A personal body of work shaped around practical systems and readable interfaces.</h2>
              </div>
              <p className="section-note">{sectionNotes.profile}</p>
            </div>

            <div className="profile-grid">
              <p className="profile-text reveal">
                I care most about projects that solve a real workflow problem
                and then explain themselves clearly. This site is meant to grow
                into a fuller archive, with `v2t` as one current example rather
                than the entire story.
              </p>

              <div className="profile-side">
                <div className="capability-list reveal" aria-label="Capabilities">
                  {capabilities.map((capability) => (
                    <article key={capability.title} className="capability-card">
                      <strong>{capability.title}</strong>
                      <p>{capability.note}</p>
                    </article>
                  ))}
                </div>

                <div className="availability-card glass-panel reveal">
                  <span className="availability-label">Project access</span>
                  <strong>{studioProfile.availability}</strong>
                  <p>{studioProfile.response}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section contact-section" id="contact" data-reveal-scope>
            <div className="contact-card reveal">
              <p className="eyebrow">Contact</p>
              <h2>If you want to try v2t, look through the code, or ask about other projects, start here.</h2>

              <div className="contact-summary">
                <p>{studioProfile.role}</p>
                <p>{studioProfile.location}</p>
                <p>{studioProfile.response}</p>
              </div>

              <div className="contact-links">
                <LiquidGlassButton variant="primary" href={studioProfile.projectUrl}>
                  Live project
                  <ExternalLink size={16} />
                </LiquidGlassButton>
                <LiquidGlassButton variant="primary" href={`mailto:${studioProfile.email}`}>
                  Email
                  <Mail size={16} />
                </LiquidGlassButton>
                <LiquidGlassButton variant="ghost" href={studioProfile.github}>
                  GitHub
                  <Github size={16} />
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
