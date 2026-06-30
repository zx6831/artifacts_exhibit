import {
  ArrowDown,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Moon,
  MousePointer2,
  Sun,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { PointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

const projects = [
  {
    discipline: "Editorial system",
    title: "Signal Atlas",
    copy: "把研究型内容整理成安静、可浏览、节奏明确的网页系统，保留研究本身的呼吸。",
    material: "signal",
  },
  {
    discipline: "Interactive archive",
    title: "Afterimage Room",
    copy: "用裁切、悬停和短文案建立带有展览感的作品浏览方式，让作品像被装入灯箱。",
    material: "afterimage",
  },
  {
    discipline: "Interface system",
    title: "Plain Frame",
    copy: "面向个人品牌站的轻量前端框架，优先保证版式、可维护性和真实上线状态。",
    material: "frame",
  },
];

const capabilities = [
  "视觉方向",
  "React 实现",
  "动效节奏",
  "设计系统整理",
];

const navItems = [
  { href: "#work", label: "Projects", id: "work" },
  { href: "#profile", label: "Profile", id: "profile" },
  { href: "#contact", label: "Contact", id: "contact" },
];

const auroraMedia = {
  enabled: false,
  poster: "/media/aurora-poster.jpg",
  sources: [
    { src: "/media/aurora-loop.webm", type: "video/webm" },
    { src: "/media/aurora-loop.mp4", type: "video/mp4" },
  ],
};

export function App() {
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState("work");
  const prefersReducedMotion = useReducedMotion();
  const pointerFrame = useRef<number | null>(null);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(stored === "dark" || (!stored && prefersDark));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
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
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.24, 0.48, 0.72], rootMargin: "-24% 0px -48% 0px" }
    );

    sections.forEach((section) => navObserver.observe(section));
    return () => navObserver.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (pointerFrame.current !== null) {
        window.cancelAnimationFrame(pointerFrame.current);
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

  return (
    <AuroraBackground
      className="site-stage"
      backgroundMedia={auroraMedia}
      onPointerMove={onPointerMove}
    >
      <div className="site-shell">
        <header className="site-header glass-chrome">
          <a className="brand" href="#top" aria-label="返回首页">
            <span className="brand-mark" aria-hidden="true" />
            <span>Lin Studio</span>
          </a>

          <nav className="site-nav" aria-label="主导航">
            {navItems.map((item) => (
              <LiquidGlassButton
                key={item.id}
                href={item.href}
                variant="nav"
                isActive={activeSection === item.id}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                {item.label}
              </LiquidGlassButton>
            ))}
          </nav>

          <LiquidGlassButton
            className="theme-toggle"
            variant="icon"
            type="button"
            aria-label="切换明暗主题"
            aria-pressed={dark}
            onClick={() => setDark((value) => !value)}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            <span>Theme</span>
          </LiquidGlassButton>
        </header>

        <main id="top">
          <section className="hero section">
            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow">Portfolio for designed interfaces</p>
              <h1>把作品放进一块会呼吸的光学玻璃。</h1>
              <p className="hero-text">
                我做面向个人品牌与小型产品的视觉型前端：先确定气质，再把版式、动效和组件收束成稳定可上线的网页。
              </p>
              <div className="hero-actions">
                <LiquidGlassButton variant="primary" href="#work">
                  查看作品
                  <ArrowDown size={16} />
                </LiquidGlassButton>
                <LiquidGlassButton variant="ghost" href="mailto:hello@example.com">
                  写信联系
                  <Mail size={16} />
                </LiquidGlassButton>
              </div>
            </motion.div>

            <motion.aside
              className="optical-stage glass-panel"
              aria-label="作品集视觉摘要"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="lens-orbit" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="hero-lens glass-plate">
                <span className="lens-label">Live surface</span>
                <strong>Optical portfolio</strong>
                <p>鼠标经过时，背景光场以很低的幅度响应，像在移动一块薄玻璃。</p>
              </div>
              <div className="stage-meta">
                <span>
                  <MousePointer2 size={14} />
                  responsive light field
                </span>
                <span>React / shadcn path / Aurora</span>
              </div>
            </motion.aside>
          </section>

          <section className="intro-strip reveal" aria-label="作品集说明">
            <p>每个页面都应该留下一个明确的视觉记忆点，然后把其余部分做得足够克制。</p>
          </section>

          <section className="section work-section" id="work">
            <div className="section-heading reveal">
              <p className="eyebrow">Selected projects</p>
              <h2>三组作品，分别展示叙事、陈列和系统化能力。</h2>
            </div>

            <div className="project-grid">
              {projects.map((project) => (
                <article
                  className="project-card glass-panel reveal"
                  key={project.title}
                >
                  <div
                    className={`project-plate glass-plate plate-${project.material}`}
                    aria-hidden="true"
                  >
                    <span />
                    <span />
                  </div>
                  <p className="card-kicker">{project.discipline}</p>
                  <h3>{project.title}</h3>
                  <p className="card-copy">{project.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section profile-section" id="profile">
            <div className="section-heading reveal">
              <p className="eyebrow">Profile</p>
              <h2>我偏爱那些能同时被观看与被使用的东西。</h2>
            </div>

            <div className="profile-grid">
              <p className="profile-text glass-panel reveal">
                我的工作方式从气质开始，但不会停在概念。页面如何进入、文本如何停顿、交互如何回应，最终都要通过实现验证。对我来说，设计感不是装饰密度，而是每个选择都能被解释。
              </p>
              <div className="capability-list reveal" aria-label="能力范围">
                {capabilities.map((item) => (
                  <span className="glass-plate" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="section contact-section" id="contact">
            <div className="contact-card glass-panel reveal">
              <p className="eyebrow">Contact</p>
              <h2>如果你也在做值得被认真呈现的东西，可以联系我。</h2>
              <div className="contact-links" aria-label="联系方式">
                <LiquidGlassButton href="mailto:hello@example.com" variant="ghost">
                  <Mail size={16} />
                  hello@example.com
                </LiquidGlassButton>
                <LiquidGlassButton
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  variant="ghost"
                >
                  <Github size={16} />
                  GitHub
                  <ExternalLink size={14} />
                </LiquidGlassButton>
                <LiquidGlassButton
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  variant="ghost"
                >
                  <Linkedin size={16} />
                  LinkedIn
                  <ExternalLink size={14} />
                </LiquidGlassButton>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <p>© {year} Lin Studio</p>
          <p>Designed surfaces, shipped carefully.</p>
        </footer>
      </div>
    </AuroraBackground>
  );
}
