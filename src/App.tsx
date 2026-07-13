import { ArrowLeft, ArrowUpRight, Bot, BrainCircuit, BriefcaseBusiness, Download, ExternalLink, Github, House, Mail, Moon, Orbit, Search, Sun, UserRound, Wrench } from "lucide-react";
import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  { id: "molecule", icon: Orbit, type: "生成式 AI · 计算生物学", title: "面向特定生物靶点的生成式分子设计与虚拟筛选平台", short: "将靶点条件、分子生成与虚拟筛选串联为可追踪的候选分子发现流程。", stack: ["生成模型", "虚拟筛选", "Python", "任务编排"], role: "负责模块与量化结果待补充", challenge: "如何把生成质量、靶点约束和筛选效率放进一条可复现的工程流水线。" },
  { id: "translation", icon: Bot, type: "多智能体 · RAG", title: "多智能体协同的检索增强跨语种互译与一致性校验系统", short: "通过检索增强与多智能体协作，完成翻译、核验和一致性修订闭环。", stack: ["Multi-Agent", "RAG", "跨语种检索", "一致性校验"], role: "负责模块与评测数据待补充", challenge: "在跨语种信息损失与模型幻觉之间建立可检查、可回溯的校验机制。" },
  { id: "v2t", icon: BrainCircuit, type: "ASR · LLM · 全栈", title: "基于 ASR-LLM 协同架构的课程视频转写与考点结构化摘要系统", short: "把课程音视频转为清洗后的文本与结构化 Markdown 考点，支持长任务进度反馈。", stack: ["FunASR", "Next.js 16", "Python API", "SSE"], role: "全栈设计与实现", challenge: "长音视频任务的稳定处理、进度可见性，以及转写结果到学习材料的可靠转换。", live: "https://v2t.206831.xyz" },
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

function Shell({ children, dark, setDark }: { children: React.ReactNode; dark: boolean; setDark: (v: boolean) => void }) {
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
    <div className="site-top-controls candidate-old-nav">
      <div className="site-top-controls__nav"><TubelightNavBar items={navItems} activeId={activeId} className="site-floating-nav" onNavigate={(id) => navigate(id)} /></div>
      <div className="site-top-controls__theme"><LiquidGlassButton className="site-theme-toggle" variant="icon" type="button" aria-label="切换主题" aria-pressed={dark} onClick={() => setDark(!dark)}>{dark ? <Sun size={16}/> : <Moon size={16}/>}<span>主题</span></LiquidGlassButton></div>
    </div>
    <div className="candidate-shell">{children}<footer><span>{profile.name} · 大模型应用工程师</span><span>© {new Date().getFullYear()}</span></footer></div>
  </AuroraBackground>;
}

function ProjectDetail({ id }: { id: string }) {
  const project = projects.find(p => p.id === id) ?? projects[2]; const Icon = project.icon;
  return <main className="detail-page"><a className="back-link" href="/"><ArrowLeft size={16}/> 返回作品集</a><section className="detail-hero glass-panel"><div><p className="mono-label">{project.type}</p><h1>{project.title}</h1><p>{project.short}</p><div className="tag-row">{project.stack.map(x => <span key={x}>{x}</span>)}</div></div><div className="project-glyph"><Icon size={72}/><span>CASE / {project.id.toUpperCase()}</span></div></section><section className="detail-grid"><article><p className="mono-label">项目目标</p><h2>从模型能力走向可使用的系统</h2><p>{project.challenge}</p></article><article className="glass-panel detail-facts"><div><span>个人职责</span><strong>{project.role}</strong></div><div><span>项目状态</span><strong>案例资料整理中</strong></div><div><span>结果指标</span><strong>数据待补充</strong></div></article></section><section className="placeholder-evidence"><Search size={24}/><div><h2>项目证据待完善</h2><p>后续将在此补充架构图、关键界面、技术取舍、评测方法与量化结果。</p></div></section>{project.live && <div className="detail-actions"><LiquidGlassButton variant="primary" href={project.live} target="_blank">在线体验 <ExternalLink size={16}/></LiquidGlassButton><LiquidGlassButton href="/?status=offline">服务异常说明</LiquidGlassButton></div>}</main>;
}

function OfflinePage() { return <main className="status-page"><div className="status-code">503</div><p className="mono-label">DEMO SERVICE / TEMPORARILY OFFLINE</p><h1>演示服务暂时不可用</h1><p>部分项目后端按需启动。当前异常不影响项目案例浏览，你仍可查看技术说明或源代码。</p><div className="detail-actions"><LiquidGlassButton variant="primary" href="/?project=v2t">查看项目案例</LiquidGlassButton><LiquidGlassButton href={profile.github}>访问 GitHub <Github size={16}/></LiquidGlassButton></div></main>; }

function Home() { return <main>
  <section className="candidate-hero" id="top"><div className="hero-main"><div className="availability"><span/> 求职中 · 接受大模型应用工程实习</div><p className="mono-label">AI APPLICATION ENGINEER / 2026</p><h1><span>姓名</span>，把大模型能力<br/>交付成<span className="accent-word">可用系统。</span></h1><p className="hero-lead">聚焦 RAG、多智能体、ASR 与生成式 AI 应用，关注模型能力如何进入真实工作流，并以清晰、稳定的产品形态完成交付。</p><div className="hero-actions"><LiquidGlassButton variant="primary" href="#work">查看项目 <ArrowUpRight size={16}/></LiquidGlassButton><LiquidGlassButton href="/resume-mock.pdf" download>下载简历 <Download size={16}/></LiquidGlassButton></div></div><aside className="identity-panel glass-panel"><div className="avatar-mock"><UserRound size={54}/><span>头像待替换</span></div><div className="identity-copy"><strong>{profile.title}</strong><p>候选人简介待补充：教育背景、技术兴趣与求职时间。</p></div><div className="signal-line"><i/><i/><i/><i/><i/></div><div className="identity-meta"><span>方向</span><b>LLM · Agent · RAG</b><span>意向</span><b>实习 / 校招</b></div></aside></section>
  <section className="proof-strip"><span>当前作品集</span><strong>03</strong><p>个面向真实场景的大模型应用项目</p><span>从检索、协同推理到结构化交付</span></section>
  <section className="portfolio-section" id="work"><div className="section-title"><p className="mono-label">SELECTED WORK</p><h2>代表项目</h2><p>围绕三个不同领域，展示从模型组合到应用交付的工程能力。</p></div><div className="case-list">{projects.map((p, i) => { const Icon=p.icon; return <a href={`/?project=${p.id}`} className="case-row glass-panel" key={p.id}><span className="case-index">0{i+1}</span><div className="case-icon"><Icon size={28}/></div><div><p className="mono-label">{p.type}</p><h3>{p.title}</h3><p>{p.short}</p><div className="tag-row">{p.stack.map(x=><span key={x}>{x}</span>)}</div></div><ArrowUpRight className="case-arrow"/></a>})}</div></section>
  <section className="portfolio-section skills-section" id="skills"><div className="section-title"><p className="mono-label">CAPABILITY MAP</p><h2>能力不是关键词列表，<br/>而是一条交付链路。</h2></div><div className="skill-track">{[["01","问题建模","将业务目标拆成模型、检索与工具调用边界"],["02","系统编排","组合 RAG、Agent、ASR 与异步任务流程"],["03","产品交付","构建可理解的状态反馈、异常兜底与前后端接口"],["04","评测迭代","建立效果、延迟与一致性的验证方式（指标待补充）"]].map(x=><article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></section>
  <section className="portfolio-section about-section" id="about"><div><p className="mono-label">PROFILE</p><h2>关于我</h2><p>这里将补充真实姓名、头像、教育背景与个人简介。当前版本先以项目本身作为能力证据，所有待验证的数据均明确保留为占位内容。</p></div><aside className="contact-panel glass-panel"><p className="mono-label">CONTACT</p><h3>正在寻找大模型应用工程方向的实习机会</h3><div className="contact-actions"><LiquidGlassButton variant="primary" href={`mailto:${profile.email}`}>发送邮件 <Mail size={16}/></LiquidGlassButton><LiquidGlassButton href={profile.github}>GitHub <Github size={16}/></LiquidGlassButton><LiquidGlassButton href="/resume-mock.pdf" download>简历 <Download size={16}/></LiquidGlassButton></div><small>{profile.email}</small></aside></section>
 </main>; }

export function App() { const [dark,setDark]=useTheme(); const params=new URLSearchParams(location.search); const content=params.has("status")?<OfflinePage/>:params.get("project")?<ProjectDetail id={params.get("project")!}/>:<Home/>; return <Shell dark={dark} setDark={setDark}>{content}</Shell>; }
