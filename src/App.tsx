import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Code2, Database, Download, ExternalLink, FileText, Github, GitBranch, HeartPulse, House, Layers3, Mail, Moon, Network, ShieldAlert, Sun, UserRound, Workflow, Wrench } from "lucide-react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";

const profile = {
  name: "姓名",
  title: "大模型应用工程师",
  email: "wzx6831@gmail.com",
  github: "https://github.com/zx6831",
};

const projects = [
  {
    id: "scholarweaver",
    icon: Database,
    type: "合作项目 · LLM 文档翻译",
    title: "ScholarWeaver PDF Essay Translator",
    short: "面向学术 PDF 的解析、术语与参考翻译辅助、双阶段 LLM 翻译流程；Dingjia 作为参考例句检索组件参与其中。",
    stack: ["FastAPI", "MinerU", "LangGraph", "FAISS / RAG"],
    repository: "https://github.com/MikeHuang2000/LLMs_Database_Translater",
    visibility: "public",
  },
  {
    id: "fubao",
    icon: HeartPulse,
    type: "Flutter · NestJS · 家庭协作",
    title: "福豹：慢病共管家庭智能体",
    short: "为子女与长辈提供双角色任务协作、健康记录与关怀提醒的跨端应用和调试后端。",
    stack: ["Flutter", "NestJS", "Prisma + PostgreSQL", "Redis"],
    repository: null,
    visibility: "private",
  },
];

const navItems = [
  { href: "/#top", label: "首页", id: "top", icon: House },
  { href: "/#work", label: "项目", id: "work", icon: BriefcaseBusiness },
  { href: "/#skills", label: "能力", id: "skills", icon: Wrench },
  { href: "/#about", label: "关于", id: "about", icon: UserRound },
];

function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); localStorage.setItem("theme", dark ? "dark" : "light"); }, [dark]);
  return [dark, setDark] as const;
}

type ScrollRevealGroup = {
  sectionSelector: string;
  itemSelector: string;
};

const scrollRevealGroups: ScrollRevealGroup[] = [
  { sectionSelector: ".proof-strip", itemSelector: ".proof-strip__content > *" },
  { sectionSelector: "#work", itemSelector: ".section-title > *, .case-row" },
  { sectionSelector: "#skills", itemSelector: ".section-title > *, .skill-track article" },
  { sectionSelector: "#about", itemSelector: ".about-resource-content > *" },
];

function useScrollReveal(groups: ScrollRevealGroup[], contentVersion = "") {
  useEffect(() => {
    const itemsBySection = new Map<HTMLElement, HTMLElement[]>();
    const sections = groups.flatMap(({ sectionSelector, itemSelector }) => {
      const section = document.querySelector<HTMLElement>(sectionSelector);
      if (!section) return [];

      const items = Array.from(section.querySelectorAll<HTMLElement>(itemSelector)).filter((item) => !item.closest(".section-resource--ready .section-resource__skeleton"));
      items.forEach((item, index) => {
        item.classList.add("scroll-reveal-item");
        item.style.setProperty("--scroll-reveal-delay", `${index * 90}ms`);
      });
      itemsBySection.set(section, items);

      return [section];
    });

    if (!sections.length) return;

    const delayResetTimers: number[] = [];
    const reveal = (section: HTMLElement) => {
      section.classList.add("is-visible");
      const items = itemsBySection.get(section) ?? [];
      const duration = 560 + Math.max(0, items.length - 1) * 90;
      delayResetTimers.push(window.setTimeout(() => {
        items.forEach((item) => item.style.removeProperty("--scroll-reveal-delay"));
      }, duration));
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      sections.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      delayResetTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [contentVersion, groups]);
}

type ResourceStatus = "idle" | "loading" | "ready" | "error";
type ResourceState<T> = { status: ResourceStatus; data?: T; message?: string };
type PreloadTarget = { selector: string; load: () => void };
type SummaryData = { label: string; count: string; description: string; note: string };
type WorkData = { eyebrow: string; heading: string; description: string; projects: Array<{ id: string; type: string; title: string; short: string; stack: string[] }> };
type SkillsData = { eyebrow: string; heading: string; skills: Array<{ index: string; title: string; description: string }> };
type AboutData = { eyebrow: string; heading: string; description: string; contactEyebrow: string; contactTitle: string; email: string };

function useJsonResource<T>(url: string, timeoutMs = 7000) {
  const [state, setState] = useState<ResourceState<T>>({ status: "idle" });
  const requestRef = useRef<Promise<void> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const load = useCallback((forceRefresh = false) => {
    if (requestRef.current || (!forceRefresh && state.status === "ready")) return;
    const controller = new AbortController();
    let timedOut = false;
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
    const requestUrl = forceRefresh ? `${url}${url.includes("?") ? "&" : "?"}retry=${Date.now()}` : url;
    setState({ status: "loading" });
    const request = fetch(requestUrl, { signal: controller.signal, cache: forceRefresh ? "reload" : "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<T>;
      })
      .then((data) => setState({ status: "ready", data }))
      .catch(() => setState({ status: "error", message: timedOut ? "加载超时，请重试。" : "内容暂时无法加载。" }))
      .finally(() => {
        window.clearTimeout(timeout);
        requestRef.current = null;
      });
    requestRef.current = request;
  }, [state.status, timeoutMs, url]);

  const retry = useCallback(() => {
    if (requestRef.current) return;
    load(true);
  }, [load]);

  useEffect(() => () => controllerRef.current?.abort(), []);
  return { state, load, retry };
}

function useNearViewportPreload(targets: PreloadTarget[], distance = 400) {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      targets.forEach(({ load }) => load());
      return;
    }
    const targetByElement = new Map<HTMLElement, PreloadTarget>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        targetByElement.get(entry.target as HTMLElement)?.load();
        observer.unobserve(entry.target);
      });
    }, { rootMargin: `${distance}px 0px ${distance}px 0px`, threshold: 0 });

    targets.forEach((target) => {
      const element = document.querySelector<HTMLElement>(target.selector);
      if (!element) return;
      targetByElement.set(element, target);
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [distance, targets]);
}

function ResourceBoundary({ state, retry, skeleton, children }: { state: ResourceState<unknown>; retry: () => void; skeleton: ReactNode; children: ReactNode }) {
  const isReady = state.status === "ready";
  return <div className={`section-resource section-resource--${state.status}`} aria-busy={!isReady}>
    {state.status !== "error" && <div className="section-resource__skeleton" aria-hidden={isReady}>{skeleton}</div>}
    {isReady && <div className="section-resource__content">{children}</div>}
    {state.status === "error" && <div className="section-resource__error" role="status"><span>{state.message}</span><button type="button" onClick={retry}>重新加载</button></div>}
  </div>;
}

function SummarySkeleton() { return <div className="proof-strip__content proof-strip__skeleton"><i/><b/><i/><i/></div>; }
function WorkSkeleton() { return <><div className="section-title section-title--skeleton"><i/><b/><i/></div><div className="case-list">{[0, 1, 2].map((item) => <div className="case-row case-row--skeleton" key={item}><i/><i/><div><b/><i/><i/></div></div>)}</div></>; }
function SkillsSkeleton() { return <><div className="section-title section-title--skeleton"><i/><b/></div><div className="skill-track">{[0, 1, 2, 3].map((item) => <article className="skill-card--skeleton" key={item}><i/><b/><i/></article>)}</div></>; }
function AboutSkeleton() { return <div className="about-resource-content about-resource-content--skeleton"><div className="about-copy"><i/><b/><i/></div><aside className="contact-panel"><i/><b/><i/><i/></aside></div>; }
function Shell({ children, dark, setDark, showNavigation = true }: { children: React.ReactNode; dark: boolean; setDark: (v: boolean) => void; showNavigation?: boolean }) {
  const frame = useRef<number | null>(null);
  const [canUsePointerHighlight, setCanUsePointerHighlight] = useState(false);
  const [activeId, setActiveId] = useState(() => location.hash.slice(1) || "top");
  const pendingNavTarget = useRef<string | null>(null);
  const pendingNavTimer = useRef<number | null>(null);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const el = event.currentTarget, b = el.getBoundingClientRect();
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => { el.style.setProperty("--pointer-x", (((event.clientX-b.left)/b.width)*100).toFixed(1)); el.style.setProperty("--pointer-y", (((event.clientY-b.top)/b.height)*100).toFixed(1)); });
  };
  const media = useMemo(() => ({ enabled: true, poster: dark ? "/media/aurora-dark-poster.png" : "/media/aurora-light-poster.png", sources: [{ src: dark ? "/media/aurora-dark-loop.webm" : "/media/aurora-light-loop.webm", type: "video/webm" }] }), [dark]);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateCapability = () => setCanUsePointerHighlight(query.matches);

    updateCapability();
    query.addEventListener("change", updateCapability);
    return () => query.removeEventListener("change", updateCapability);
  }, []);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  useEffect(() => {
    if (new URLSearchParams(location.search).size) return;
    const sections = navItems.map(item => document.getElementById(item.id)).filter((section): section is HTMLElement => section !== null);
    if (!sections.length) return;
    let scrollFrame: number | null = null;
    const update = () => {
      scrollFrame = null;
      const pending = pendingNavTarget.current;
      if (pending) {
        const target = document.getElementById(pending);
        const reached = target && Math.abs(target.getBoundingClientRect().top - 90) <= 20;
        const reachedBottom = pending === sections[sections.length - 1].id && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
        if (reached || reachedBottom) {
          pendingNavTarget.current = null;
          if (pendingNavTimer.current !== null) {
            clearTimeout(pendingNavTimer.current);
            pendingNavTimer.current = null;
          }
        } else {
          setActiveId(pending);
          return;
        }
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        setActiveId(sections[sections.length - 1].id);
        return;
      }
      const probe = Math.min(window.innerHeight * .32, 260);
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= probe) current = section.id;
      }
      setActiveId(current);
    };
    const requestUpdate = () => {
      if (scrollFrame === null) scrollFrame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
      if (pendingNavTimer.current !== null) clearTimeout(pendingNavTimer.current);
    };
  }, []);

  const navigate = (id: string) => {
    const hasPageQuery = new URLSearchParams(location.search).size > 0;
    if (hasPageQuery) {
      location.href = `/#${id}`;
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    pendingNavTarget.current = id;
    if (pendingNavTimer.current !== null) clearTimeout(pendingNavTimer.current);
    pendingNavTimer.current = window.setTimeout(() => {
      pendingNavTarget.current = null;
      pendingNavTimer.current = null;
    }, 1600);
    setActiveId(id);
    history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  return <AuroraBackground className="site-stage candidate-site" backgroundMedia={media} onPointerMove={canUsePointerHighlight ? move : undefined}>
    <div className={`site-top-controls candidate-old-nav${showNavigation ? "" : " site-top-controls--detail"}`}>
      {showNavigation && <div className="site-top-controls__nav"><TubelightNavBar items={navItems} activeId={activeId} className="site-floating-nav" onNavigate={(id) => navigate(id)} /></div>}
      <div className="site-top-controls__theme"><LiquidGlassButton className="site-theme-toggle" variant="icon" type="button" aria-label="切换主题" aria-pressed={dark} onClick={() => setDark(!dark)}>{dark ? <Sun size={16}/> : <Moon size={16}/>}<span>主题</span></LiquidGlassButton></div>
    </div>
    <div className="candidate-shell">{children}<footer><span>{profile.name} · 大模型应用工程师</span><span>© {new Date().getFullYear()}</span></footer></div>
  </AuroraBackground>;
}

type Project = typeof projects[number];

function ScholarWeaverDetail({ project }: { project: Project }) {
  const Icon = project.icon;
  return <main className="detail-page detail-page--case-study">
    <a className="back-link" href="/"><ArrowLeft size={16}/> 返回作品集</a>
    <section className="detail-hero glass-panel">
      <div>
        <p className="mono-label">{project.type} / REPOSITORY CASE STUDY</p>
        <h1>{project.title}</h1>
        <p>{project.short}</p>
        <div className="tag-row">{project.stack.map(x => <span key={x}>{x}</span>)}</div>
      </div>
      <div className="project-glyph"><Icon size={72}/><span>CASE / {project.id.toUpperCase()}</span></div>
    </section>

    <section className="detail-summary">
      <article>
        <p className="mono-label">01 / 项目定位</p>
        <h2>面向学术 PDF 的可组合翻译工作流</h2>
        <p>完整项目以 FastAPI 提供文档处理接口，结合 PDF 解析、术语处理、参考例句检索与大模型工作流生成翻译结果。公开 README 明确其仍是可用但未完善的竞赛 Demo；本页因此只呈现源码和提交记录能够支持的系统结构。</p>
      </article>
      <aside className="glass-panel detail-facts">
        <div><span>公开仓库</span><strong>MikeHuang2000/LLMs_Database_Translater</strong></div>
        <div><span>项目属性</span><strong>华南理工大学鼎甲杯合作参赛作品；README 标记为 Demo</strong></div>
        <div><span>可见贡献</span><strong>zx6831 的公开记录含 2 次提交与一次 relay 分支合并</strong></div>
        <div><span>运行验证</span><strong>未在本次审查环境启动：MinerU、模型服务与 API 配置未齐备</strong></div>
      </aside>
    </section>

    <section className="detail-section">
      <div className="detail-section__heading"><p className="mono-label">02 / 系统结构</p><h2>从论文 PDF 到可审阅的翻译输出</h2><p>以下关系根据公开仓库的 <code>server.py</code>、<code>workflow/</code>、<code>utils/</code> 和项目 README 整理；它是源码结构图，不是运行性能图。</p></div>
      <div className="architecture-flow" aria-label="ScholarWeaver 文档翻译系统结构">
        <article><FileText size={23}/><strong>PDF 输入</strong><span>论文文档与页面内容</span></article>
        <i aria-hidden="true">→</i>
        <article><Database size={23}/><strong>解析与知识辅助</strong><span>MinerU、术语与参考例句</span></article>
        <i aria-hidden="true">→</i>
        <article><Layers3 size={23}/><strong>Dingjia 组件</strong><span>参考例句检索与重排</span></article>
        <i aria-hidden="true">→</i>
        <article><Workflow size={23}/><strong>翻译工作流</strong><span>两阶段翻译与反思修订</span></article>
        <i aria-hidden="true">→</i>
        <article><Network size={23}/><strong>FastAPI 服务</strong><span>任务、文件和结果接口</span></article>
      </div>
      <div className="detail-callout"><GitBranch size={18}/><p>zx6831 的可见提交新增了服务端到本地 <code>8031</code> 端口的转发层，并为健康检查、重排、索引、任务构建和文件上传等路径增加联通性测试脚本。</p></div>
    </section>

    <section className="detail-section detail-section--implementation">
      <div className="detail-section__heading"><p className="mono-label">03 / 核心实现</p><h2>把非结构化论文处理拆成可配置环节</h2></div>
      <div className="implementation-grid">
        <article className="glass-panel"><FileText size={22}/><h3>文档解析与页面处理</h3><p>项目文档将 MinerU 作为文档识别依赖；源码还包含 PDF 转图片、OCR、文件名与压缩工具。功能开关允许在缺少某些服务时调整解析、术语或参考翻译能力。</p><small>证据：<code>server.py</code>、<code>utils/LLM_OCR.py</code></small></article>
        <article className="glass-panel"><Code2 size={22}/><h3>两阶段翻译工作流</h3><p><code>workflow/TwoStepTranslate.py</code> 与相关异步工作流将初步翻译、结构化反思和修订组织为分步调用；提示词与模型池配置留在独立目录，避免把流程逻辑写死在接口层。</p><small>证据：<code>workflow/</code>、<code>prompts/</code>、<code>llm_pool.py</code></small></article>
        <article className="glass-panel"><Workflow size={22}/><h3>检索与服务联通</h3><p>Dingjia 被 README 列为参考例句库。可见贡献新增的转发层复用 HTTP 会话，处理 JSON、表单和文件上传，再把多个检索/任务接口转发到本地服务，配套脚本覆盖联通性检查。</p><small>证据：<code>server.py</code>、<code>forward_test.py</code></small></article>
      </div>
    </section>

    <section className="detail-section detail-section--split">
      <article>
        <p className="mono-label">04 / 设计取舍</p>
        <h2>在复杂环境中保留可替换的边界</h2>
        <ul className="detail-list">
          <li><strong>解析、术语与示例库均可开关：</strong>README 通过环境变量控制 MinerU、术语标注与参考翻译能力，以适配演示和本地运行条件。</li>
          <li><strong>检索是翻译辅助，不等同于质量证明：</strong>Dingjia 负责参考例句检索；页面不将其写成已验证的翻译准确率或领域评测结论。</li>
          <li><strong>为联调保留服务间边界：</strong>可见提交中的反向转发层让外部接口在本地 <code>8010</code> 与检索服务 <code>8031</code> 之间衔接，并保留端点测试入口。</li>
        </ul>
      </article>
      <aside className="detail-limitations glass-panel">
        <ShieldAlert size={21}/><p className="mono-label">05 / 验证边界</p><h3>可用 Demo 不等于完成度或评测结论</h3>
        <p>公开 README 说明项目仍未完善，并对 Kaggle 演示环境有特化。审查环境未配置 MinerU、术语服务、模型 API 或完整依赖，因此未执行端到端 PDF 翻译，也不展示准确率、延迟、并发或线上部署结论。</p>
      </aside>
    </section>

    <section className="detail-resources glass-panel">
      <div><p className="mono-label">06 / 项目资源</p><h2>回到合作项目的可审查材料</h2><p>该公开仓库保留安装说明、服务端、工作流和可见提交历史；Dingjia 以参考例句库形式参与其中。贡献归属按公开历史陈述，未把其他作者的实现归功于 zx6831。</p></div>
      <div className="detail-actions"><LiquidGlassButton variant="primary" href={project.repository ?? profile.github} target="_blank">查看 GitHub 仓库 <ExternalLink size={16}/></LiquidGlassButton><LiquidGlassButton href="/">返回首页 <ArrowUpRight size={16}/></LiquidGlassButton></div>
    </section>
  </main>;
}

function FubaoDetail({ project }: { project: Project }) {
  const Icon = project.icon;
  return <main className="detail-page detail-page--case-study detail-page--fubao">
    <a className="back-link" href="/"><ArrowLeft size={16}/> 返回作品集</a>
    <section className="detail-hero glass-panel">
      <div>
        <p className="mono-label">{project.type} / PRIVATE PROJECT CASE STUDY</p>
        <h1>{project.title}</h1>
        <p>{project.short}</p>
        <div className="tag-row">{project.stack.map(x => <span key={x}>{x}</span>)}</div>
      </div>
      <div className="project-glyph"><Icon size={72}/><span>CASE / {project.id.toUpperCase()}</span></div>
    </section>

    <section className="detail-summary">
      <article>
        <p className="mono-label">01 / 项目定位</p>
        <h2>让两位家庭成员围绕同一日程协作</h2>
        <p>这是一个面向慢病日常共管场景的双角色应用：子女端负责建立计划、查看进度和沟通，长辈端接收任务、完成记录与关怀话题。项目把移动端体验、身份与家庭关系、任务生成和后端状态放在同一条可调试链路中。</p>
      </article>
      <aside className="glass-panel detail-facts">
        <div><span>可见范围</span><strong>私有项目；本页不提供代码仓库链接</strong></div>
        <div><span>交付形态</span><strong>Flutter 客户端 + NestJS 调试后端 + Docker Compose</strong></div>
        <div><span>工程材料</span><strong>测试、Prisma 迁移、部署与恢复说明、发布清单</strong></div>
        <div><span>产品边界</span><strong>提供关怀提醒与记录，不作诊断或治疗建议</strong></div>
      </aside>
    </section>

    <section className="detail-section">
      <div className="detail-section__heading"><p className="mono-label">02 / 系统结构</p><h2>同一领域模型服务两种使用角色</h2><p>结构依据私有仓库的 Flutter 数据层、NestJS 模块、Prisma schema 与 Compose 配置整理。代码仓库保持私有，本页只呈现必要的技术关系与可公开的项目描述。</p></div>
      <div className="architecture-flow architecture-flow--fubao" aria-label="福豹应用系统结构">
        <article><HeartPulse size={23}/><strong>双角色界面</strong><span>子女端 / 长辈端</span></article>
        <i aria-hidden="true">→</i>
        <article><Layers3 size={23}/><strong>Flutter 数据边界</strong><span>Demo / Remote Repository</span></article>
        <i aria-hidden="true">→</i>
        <article><Network size={23}/><strong>NestJS API</strong><span>认证、家庭、计划、健康</span></article>
        <i aria-hidden="true">→</i>
        <article><Database size={23}/><strong>PostgreSQL</strong><span>Prisma 迁移与领域状态</span></article>
        <i aria-hidden="true">→</i>
        <article><Workflow size={23}/><strong>Redis / 通知适配</strong><span>缓存、限流与提醒通道</span></article>
      </div>
      <div className="detail-callout"><GitBranch size={18}/><p>客户端把 <code>demo</code>、<code>dev</code> 与 <code>production</code> 的数据来源分开：演示模式便于完整交互验证，连接后端时再通过远程仓库实现处理登录、家庭与业务状态。</p></div>
    </section>

    <section className="detail-section detail-section--implementation">
      <div className="detail-section__heading"><p className="mono-label">03 / 核心实现</p><h2>从界面状态到服务端约束</h2></div>
      <div className="implementation-grid">
        <article className="glass-panel"><HeartPulse size={22}/><h3>跨端且可访问的双角色 UI</h3><p>Flutter 客户端按子女与长辈角色拆分导航与页面，同时保留共享的计划、话题和个人设置能力。仓库含响应式、放大字号与 Golden 视觉回归测试，开发时可先在 Web 目标上调试。</p><small>证据：<code>apps/fubao_app/lib/</code>、<code>test/visual/</code></small></article>
        <article className="glass-panel"><ShieldAlert size={22}/><h3>身份、家庭与会话边界</h3><p>后端以角色、家庭成员与邀请码为领域关系；认证模块覆盖访问令牌、刷新令牌轮换、退出与角色鉴权。敏感字段在 schema 与服务层中拥有独立的持久化及安全处理路径。</p><small>证据：<code>services/api/src/auth/</code>、<code>prisma/schema.prisma</code></small></article>
        <article className="glass-panel"><Workflow size={22}/><h3>计划、每日任务和提醒</h3><p>计划与每日任务使用独立状态、时区与幂等记录建模；客户端覆盖创建、进度和历史，后端按家庭与角色约束查询和写入。提醒和通知通过接口与适配器隔离，便于本地替换。</p><small>证据：<code>plans/</code>、<code>health/</code>、<code>integrations/</code></small></article>
      </div>
    </section>

    <section className="detail-section detail-section--split">
      <article>
        <p className="mono-label">04 / 工程取舍</p>
        <h2>把真实服务接入放在演示体验之后</h2>
        <ul className="detail-list">
          <li><strong>先明确数据边界：</strong>客户端由仓库接口隔离演示数据与远程 API，避免原型 UI 与真实鉴权/持久化被强耦合。</li>
          <li><strong>用领域约束表达家庭关系：</strong>Prisma 模型对家庭、成员角色、计划、任务和记录建立关系及唯一性约束；这比仅在界面层判断角色更可追溯。</li>
          <li><strong>提醒而非医疗结论：</strong>健康相关流程记录数据、生成提醒或告警状态；项目文档明确不向用户提供诊断或治疗建议。</li>
        </ul>
      </article>
      <aside className="detail-limitations glass-panel">
        <ShieldAlert size={21}/><p className="mono-label">05 / 运行与发布边界</p><h3>源码完备不等同于正式发布</h3>
        <p>仓库文档把 iOS 证书、真机安装、APNs、短信、生产域名、TestFlight 与 App Store 审核列为待完成的外部关卡。本次审查运行 <code>flutter test</code> 共执行 86 个用例，其中 1 个 <code>younger_plans</code> Golden 截图有 0.17%（574 像素）差异，故测试套件未全绿。本页不声称已上架、已连接生产医疗设备，或已通过真实用户验证。</p>
      </aside>
    </section>

    <section className="detail-resources glass-panel">
      <div><p className="mono-label">06 / 项目说明</p><h2>私有项目，按范围展示</h2><p>为保护代码与配置边界，本项目不公开 GitHub 链接、内部文档或运行环境。页面中的内容仅来自已审查的目录结构、源码、测试和项目文档。</p></div>
      <div className="detail-actions"><LiquidGlassButton variant="primary" href="/">返回首页 <ArrowUpRight size={16}/></LiquidGlassButton></div>
    </section>
  </main>;
}

function ProjectDetail({ id }: { id: string }) {
  const project = projects.find(p => p.id === id) ?? projects[0];
  return project.id === "fubao" ? <FubaoDetail project={project}/> : <ScholarWeaverDetail project={project}/>;
}

function OfflinePage() { return <main className="status-page"><div className="status-code">503</div><p className="mono-label">DEMO SERVICE / TEMPORARILY OFFLINE</p><h1>演示服务暂时不可用</h1><p>项目案例仍可浏览；仓库中可核验的源码与接口文档不依赖在线演示服务。</p><div className="detail-actions"><LiquidGlassButton variant="primary" href="/?project=scholarweaver">查看项目案例</LiquidGlassButton><LiquidGlassButton href={profile.github}>访问 GitHub <Github size={16}/></LiquidGlassButton></div></main>; }

function Home() {
  const summary = useJsonResource<SummaryData>("/data/home-summary.json");
  const work = useJsonResource<WorkData>("/data/home-work.json");
  const skills = useJsonResource<SkillsData>("/data/home-skills.json");
  const about = useJsonResource<AboutData>("/data/home-about.json");
  const preloadTargets = useMemo(() => [
    { selector: "#proof", load: summary.load },
    { selector: "#work", load: work.load },
    { selector: "#skills", load: skills.load },
    { selector: "#about", load: about.load },
  ], [about.load, skills.load, summary.load, work.load]);

  useNearViewportPreload(preloadTargets, 400);
  useScrollReveal(scrollRevealGroups, [summary.state.status, work.state.status, skills.state.status, about.state.status].join("|"));

  const workData = work.state.data;
  const skillsData = skills.state.data;
  const summaryData = summary.state.data;
  const aboutData = about.state.data;
  const projectIcons = { scholarweaver: Database, fubao: HeartPulse };

  return <main>
    <section className="candidate-hero" id="top"><div className="hero-main"><div className="availability"><span/> 求职中 · 接受大模型应用工程实习</div><p className="mono-label">AI APPLICATION ENGINEER / 2026</p><h1><span>姓名</span>，把大模型能力<br/>交付成<span className="accent-word">可用系统。</span></h1><p className="hero-lead">聚焦 RAG、多智能体、ASR 与生成式 AI 应用，关注模型能力如何进入真实工作流，并以清晰、稳定的产品形态完成交付。</p><div className="hero-actions"><LiquidGlassButton variant="primary" href="#work">查看项目 <ArrowUpRight size={16}/></LiquidGlassButton><LiquidGlassButton href="/resume-mock.pdf" download>下载简历 <Download size={16}/></LiquidGlassButton></div></div><aside className="identity-panel glass-panel"><div className="avatar-mock"><UserRound size={54}/><span>头像待替换</span></div><div className="identity-copy"><strong>{profile.title}</strong><p>候选人简介待补充：教育背景、技术兴趣与求职时间。</p></div><div className="signal-line"><i/><i/><i/><i/><i/></div><div className="identity-meta"><span>方向</span><b>LLM · Agent · RAG</b><span>意向</span><b>实习 / 校招</b></div></aside></section>
    <section className="proof-strip" id="proof"><ResourceBoundary state={summary.state} retry={summary.retry} skeleton={<SummarySkeleton />}>{summaryData && <div className="proof-strip__content"><span>{summaryData.label}</span><strong>{summaryData.count}</strong><p>{summaryData.description}</p><span>{summaryData.note}</span></div>}</ResourceBoundary></section>
    <section className="portfolio-section" id="work"><ResourceBoundary state={work.state} retry={work.retry} skeleton={<WorkSkeleton />}>{workData && <><div className="section-title"><p className="mono-label">{workData.eyebrow}</p><h2>{workData.heading}</h2><p>{workData.description}</p></div><div className="case-list">{workData.projects.map((project, index) => { const Icon = projectIcons[project.id as keyof typeof projectIcons] ?? Database; return <a href={`/?project=${project.id}`} className="case-row glass-panel" key={project.id}><span className="case-index">0{index + 1}</span><div className="case-icon"><Icon size={28}/></div><div><p className="mono-label">{project.type}</p><h3>{project.title}</h3><p>{project.short}</p><div className="tag-row">{project.stack.map((stack) => <span key={stack}>{stack}</span>)}</div></div><ArrowUpRight className="case-arrow"/></a>; })}</div></>}</ResourceBoundary></section>
    <section className="portfolio-section skills-section" id="skills"><ResourceBoundary state={skills.state} retry={skills.retry} skeleton={<SkillsSkeleton />}>{skillsData && <><div className="section-title"><p className="mono-label">{skillsData.eyebrow}</p><h2>{skillsData.heading.split("，")[0]}，<br/>{skillsData.heading.split("，").slice(1).join("，")}</h2></div><div className="skill-track">{skillsData.skills.map((skill) => <article key={skill.index}><span>{skill.index}</span><h3>{skill.title}</h3><p>{skill.description}</p></article>)}</div></>}</ResourceBoundary></section>
    <section className="portfolio-section about-section" id="about"><ResourceBoundary state={about.state} retry={about.retry} skeleton={<AboutSkeleton />}>{aboutData && <div className="about-resource-content"><div className="about-copy"><p className="mono-label">{aboutData.eyebrow}</p><h2>{aboutData.heading}</h2><p>{aboutData.description}</p></div><aside className="contact-panel glass-panel"><p className="mono-label">{aboutData.contactEyebrow}</p><h3>{aboutData.contactTitle}</h3><div className="contact-actions"><LiquidGlassButton variant="primary" href={`mailto:${aboutData.email}`}>发送邮件 <Mail size={16}/></LiquidGlassButton><LiquidGlassButton href={profile.github}>GitHub <Github size={16}/></LiquidGlassButton><LiquidGlassButton href="/resume-mock.pdf" download>简历 <Download size={16}/></LiquidGlassButton></div><small>{aboutData.email}</small></aside></div>}</ResourceBoundary></section>
  </main>;
}

export function App() { const [dark,setDark]=useTheme(); useEffect(() => { document.documentElement.classList.add("app-ready"); }, []); const params=new URLSearchParams(location.search); const projectId=params.get("project"); const content=params.has("status")?<OfflinePage/>:projectId?<ProjectDetail id={projectId}/>:<Home/>; return <Shell dark={dark} setDark={setDark} showNavigation={!projectId}>{content}</Shell>; }
