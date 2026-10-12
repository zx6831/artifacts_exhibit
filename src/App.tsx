import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Code2, Database, Dna, ExternalLink, FileText, Github, GitBranch, HeartPulse, House, Layers3, Mail, Medal, Moon, Network, ShieldAlert, Sun, UserRound, Workflow, Wrench } from "lucide-react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";

const profile = {
  email: "wzx6831@gmail.com",
  github: "https://github.com/zx6831",
};

const projects = [
  {
    id: "pharmagent",
    icon: HeartPulse,
    type: "挑战杯 · 智能药物研发",
    title: "PharmAgent 智能药物发现与递送助手",
    short: "以知识库、插件与工作流组织药物信息检索、ADMET 解析、分子生成与递送策略建议的科研智能体。",
    stack: ["FastGPT", "FastAPI", "ChEMBL / openFDA", "DrugEx"],
    repository: null,
    visibility: "private",
  },
  {
    id: "xuanji",
    icon: Dna,
    type: "AI 制药 · 智能决策",
    title: "玄玑——全球新药发现智能加速平台",
    short: "以 iDrugMap 组织多模态药物研发数据与算法能力，支持活性预测、虚拟筛选和相似性检索等研究辅助任务。",
    stack: ["iDrugMap", "多模态数据", "活性预测", "虚拟筛选"],
    repository: null,
    visibility: "private",
  },
  {
    id: "sso-platform",
    icon: Network,
    type: "Spring Boot · CAS · IAM",
    title: "CAS 单点登录与 IAM 平台",
    short: "以 Apereo CAS 为认证中心，组合双客户端、身份权限边界、Redis 会话、防重放与读写分离的 HTTPS SSO 平台。",
    stack: ["Apereo CAS 7.2", "Spring Boot", "MySQL + Redis", "Docker Compose"],
    repository: "https://github.com/zx6831/sso-platform/tree/master",
    visibility: "public",
  },
  {
    id: "v2t",
    icon: FileText,
    type: "ASR · 视频处理 · Web",
    title: "V2T 视频转写与课程摘要",
    short: "把视频拆解为语音识别、时间轴文本清洗和流式课程摘要任务，并通过 Web 界面呈现进度与结果。",
    stack: ["FunASR", "Next.js", "SSE", "DeepSeek API"],
    repository: null,
    visibility: "private",
  },
  {
    id: "eliminate",
    icon: Layers3,
    type: "计算机视觉 · 图像处理",
    title: "主体保护式路人移除管线",
    short: "基于分割检测、三态主体判定与掩码约束，批量移除背景路人并保护画面主体的图像处理基线。",
    stack: ["YOLO-seg", "OpenCV", "IOPaint / LaMa", "Python CLI"],
    repository: "https://github.com/zx6831/eliminate/tree/feature/person-removal-baseline",
    visibility: "public",
  },
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

const auditedCaseStudies = {
  "pharmagent": {
    position: { title: "把药物研发问题组织成可追溯的智能体链路", text: "PharmAgent 是第十九届“挑战杯”全国大学生课外学术科技作品竞赛“人工智能+”挑战赛项目；用户确认其已入围国赛决赛。项目书围绕药物—靶点信息、ADMET 性质、分子生成与递送策略，将科研检索与方案辅助拆分为可组合的知识库、插件和工作流。" },
    facts: [["项目身份", "第十九届“挑战杯”人工智能+挑战赛国赛决赛入围作品"], ["交付形态", "FastGPT 智能体、FastAPI 本地插件与科研工作流"], ["数据与模型", "ChEMBL、openFDA、ADMETlab 3.0 与 DrugEx"], ["材料边界", "仅依据本地项目书与用户提供的竞赛状态展示；不提供代码链接"]],
    flow: [["研究问题", "疾病或靶点输入"], ["知识与数据", "药物、标签与性质查询"], ["模型插件", "ADMET 解析与分子生成"], ["工作流", "检索、调用与方案编排"], ["结构化建议", "递送策略与验证框架"]],
    note: "项目书将每条建议限制在“基础分析—方案设计—可行性验证”的结构中，避免把生成内容表述为临床结论。",
    implementation: [["多源科研数据插件", "通过本地 HTTP 服务封装 ChEMBL、openFDA 与 ADMET 相关能力，让工作流可按自然语言问题选择检索与解析路径。", "证据：项目书“多源数据插件整合”与插件接口说明"], ["分子生成接口", "项目书描述以 DrugEx 的序列模型生成 SMILES，并将模型加载、参数校验和结果返回封装为 FastAPI 插件。", "证据：项目书“靶向特定疾病或靶点的新分子生成插件”"], ["可视化工作流", "FastGPT 将输入、插件调用、模型调用与结构化输出放入可配置流程，保留面向科研任务的复用边界。", "证据：项目书“工作流设计”"]],
    decisions: ["以外部数据库与本地插件分工，避免把数据获取、模型调用和生成逻辑耦合在单一提示词中。", "输出模板覆盖药物特性、递送策略与验证事项，便于审阅方案的依据与缺口。", "面向科研辅助而非诊断或处方：项目书也将模型、数据质量与部署风险列为需要独立控制的边界。"],
    limitation: { title: "竞赛项目材料不等同于临床验证", text: "本次审查未获得独立的临床、实验或部署评测材料；页面不声称系统能够提供医疗诊断、治疗建议，或证明任何候选分子与递送方案的有效性。" },
    resources: { title: "项目材料按竞赛与隐私边界呈现", text: "项目书记录了系统构想、插件设计与风险控制。源代码、模型配置和内部运行环境未对外公开，因此本页不提供仓库或演示链接。" },
  },
  "xuanji": {
    position: { title: "将数据、算法与筛选入口组织成新药发现的研究辅助平台", text: "项目材料将“玄玑”描述为面向新药发现的智能加速平台：以 iDrugMap 汇集多模态药物研发数据与自主算法能力，并将活性预测、虚拟筛选、相似性检索等操作收束到可访问的研究入口。" },
    facts: [["竞赛成果", "第十五届“挑战杯”建设银行中国大学生创业计划竞赛三等奖"], ["平台形态", "iDrugMap 一体化多模型药物发现平台"], ["材料所述能力", "活性预测、虚拟筛选、相似性检索"], ["展示边界", "依据项目介绍材料整理；不提供代码链接或临床结论"]],
    flow: [["分子与任务输入", "分子结构、目标类别或筛选需求"], ["数据与模型", "多模态研发数据与算法能力"], ["活性预测", "辅助识别潜在有效分子"], ["虚拟筛选", "面向特定靶点或细胞系筛选"], ["相似性检索", "扩展候选化合物范围"]],
    note: "项目材料将这三类操作呈现为研究工具入口；页面只说明其任务分工，不将算法输出表述为药效、临床成功率或真实世界疗效。",
    implementation: [["一体化研究入口", "项目材料展示 iDrugMap 将活性预测、虚拟筛选与相似性检索配置为面向不同研发问题的操作模块。", "证据：项目介绍材料“项目概述”"], ["多模态数据与算法协同", "材料描述平台把公开与合作数据经过清洗、标注、补全和增强后，与多套药物发现算法共同支撑研究任务。", "证据：项目介绍材料“项目优势”"], ["筛选结果的研究边界", "页面将平台输出限定为候选发现与研究辅助；后续实验、验证与转化仍需由独立流程完成。", "证据：项目介绍材料的研发流程与应用描述"]],
    decisions: ["将不同发现任务拆为明确入口，避免把分子预测、靶点筛选和相似结构检索混成单一结论。", "按材料原意保留数据与算法的协作关系，但不复述未经独立审计的规模、效果或临床进展数字。", "竞赛荣誉与项目介绍材料分开陈述：前者说明获奖事实，后者只支撑平台定位与功能范围。"],
    limitation: { title: "项目材料不是独立技术或临床验收", text: "本次仅审查用户提供的项目介绍材料，未获得源代码、原始数据集、模型评测报告或独立实验/临床验证。因此页面不声称平台性能、候选分子有效性、药物临床进展或商业合作已被本次审查独立确认。" },
    resources: { title: "竞赛项目，按材料范围展示", text: "页面仅使用项目名称、竞赛成果、平台定位与功能范围等可公开说明的信息；源代码、数据和内部运行环境不对外提供。" },
  },
  "sso-platform": {
    position: { title: "把认证、身份边界和业务资料拆成独立服务", text: "该平台基于 Apereo CAS 7.2.7 构建 HTTPS 单点登录演示环境：CAS 负责统一身份，两个客户端各自维持会话与业务边界，并通过内部 HTTPS 调用聚合资料。公开 `master` 分支的单一可见作者为 zx，包含完整源码、部署文件与测试。" },
    facts: [["公开分支", "zx6831/sso-platform 的 master（非默认分支）"], ["认证机制", "CAS 3.0 Service Ticket、Redis Session 与 SM2 登录凭据加密"], ["数据边界", "CAS 管 IAM；Client B 管岗位/工号；Redis 仅保存技术状态"], ["运行条件", "Java 21、Docker Compose、MySQL、Redis；可选 Nacos"]],
    flow: [["浏览器", "三个 HTTPS 入口"], ["CAS 认证中心", "统一登录与 IAM"], ["Client A / B", "会话与业务页面"], ["MySQL + Redis", "权威数据与技术状态"], ["可选 Nacos", "配置加载与注册"]],
    note: "项目的安全重点是分层：CAS Ticket 一次性使用，指定 GET 接口再通过 HMAC challenge 与 Redis 原子 claim 做额外防重放。",
    implementation: [["认证与身份模型", "CAS 管理用户、主部门与角色；客户端只保存自己的业务资料，从数据模型上明确身份权威来源。", "证据：README、数据库迁移与 IAM V9 文档"], ["双层防重放", "CAS Service Ticket 的一次性语义覆盖 SSO 流程；客户端对指定读取接口叠加 HMAC challenge 和 Redis 原子 claim。", "证据：README、replay/ 源码与测试"], ["可复现的运行拓扑", "Compose 将 CAS、两个客户端、主库与 Redis 组合；Client B 的读写路径区分副本查询和主库更新。", "证据：docker-compose.yml、运行手册与检查脚本"]],
    decisions: ["让 IAM 与 Client B 的业务档案各自拥有数据权威，降低跨服务资料写入的歧义。", "把 Nacos 设计成可选构建能力，避免开发环境强依赖服务发现。", "要求使用项目 CA 验证 HTTPS，而不是用跳过证书校验的方式掩盖部署问题。"],
    limitation: { title: "源码与测试齐全，但本次未启动完整拓扑", text: "仓库要求 Java 21、Docker、数据库、Redis、证书、hosts 和本地 Gradle 发行包。本次审查未配置上述环境，因此不宣称三个服务已在本机联通或完成端到端验收。" },
    resources: { title: "查看公开的 master 分支", text: "该分支含服务端、两个客户端、迁移、证书/部署脚本、OpenAPI 文档和测试。链接明确指向实际含源码的 master，而非默认 main。", action: "查看 GitHub 分支" },
  },
  "v2t": {
    position: { title: "将长视频处理拆为可恢复、可观察的任务", text: "V2T 是本地部署的视频转写与课程摘要工具：先从视频提取音频并按区间转写，再清洗、合并时间轴文本，最后按需流式生成学习摘要。Next.js 前端通过任务 API 和 SSE 展示每一步状态。" },
    facts: [["运行形态", "本地 Python API 服务 + Next.js 前端 + Cloudflare Tunnel 配置"], ["语音处理", "FunASR Paraformer、VAD 与标点模型的本地模型目录"], ["任务交互", "上传、任务创建、SSE 进度、结果下载与磁盘恢复"], ["本次验证", "Next.js 生产构建通过；pytest 23 项通过"]],
    flow: [["视频上传", "安全文件名与任务创建"], ["音频与分段", "FFmpeg 提取、区间切分"], ["FunASR", "识别、VAD 与标点"], ["文本处理", "时间轴合并与清洗"], ["SSE / 摘要", "实时状态与课程整理"]],
    note: "服务端会把任务元数据和产物落到输出目录，并在启动时扫描恢复，这让中断后的任务状态不会只存在于进程内存。",
    implementation: [["长音频分段与边界合并", "转写模块根据时长生成分段，回写偏移后的时间戳，并处理相邻片段文本重叠，减少长视频边界重复。", "证据：tools/transcribe_video.py"], ["可观察的任务 API", "API 提供上传、创建、查询、SSE progress/token/done/error 与下载端点，并维护每步状态和可恢复元数据。", "证据：BACKEND.md、tools/api_server.py"], ["结构化课程摘要", "管线将清洗后的转写文本填入固定学习提纲，支持流式调用摘要服务；密钥从环境变量读取而非写入页面。", "证据：tools/pipeline.py、BACKEND.md"]],
    decisions: ["转写、清洗和摘要被拆分，方便只复用已完成的中间结果或定位失败环节。", "前端通过 SSE 接收状态，不需要长轮询来猜测后台进度。", "公开 Tunnel 在审查时返回 Cloudflare 1033，因而本页不放置失效的在线演示链接。"],
    limitation: { title: "可验证本地构建，不等同于在线服务可用", text: "本地 Next.js 构建与 23 项测试均通过；但 `v2t.206831.xyz` 在本次审查返回 Cloudflare Tunnel Error 1033。转写还依赖本地模型、FFmpeg 与可选摘要服务，页面不承诺当前公共访问或处理性能。" },
    resources: { title: "本地项目，暂不公开代码或演示", text: "项目源位于用户提供的本地目录，未提供公开代码仓库。线上 Tunnel 当前不可用，所以仅展示已核验的本地架构与测试信息。" },
  },
  "eliminate": {
    position: { title: "先保护画面主体，再决定哪些人物可移除", text: "该基线将人像分割结果分为主体、路人和不确定三种状态：只将可安全移除的路人并入删除掩码，并用扩张后的主体保护掩码做减法，随后交给可替换的修补后端。公开分支的可见作者为 zx。" },
    facts: [["公开分支", "zx6831/eliminate 的 feature/person-removal-baseline"], ["检测与判定", "YOLO-seg 人像实例 + 基于面积、位置、置信度的三态规则"], ["输出工件", "删除/保护掩码、可视化覆盖层、结果图与 JSON 记录"], ["本次验证", "unittest 12 项通过（无模型权重的轻量测试）"]],
    flow: [["输入图像", "单图或目录批处理"], ["实例分割", "YOLO-seg 或空检测回退"], ["主体判定", "主体 / 路人 / 不确定"], ["掩码约束", "删除并减去保护区域"], ["修补与记录", "IOPaint/LaMa 或 dry-run 工件"]],
    note: "不确定人物会在覆盖层中标记，但不会强制进入删除掩码；这比“检测到人就移除”的策略更符合保护主体的目标。",
    implementation: [["三态主体决策", "把面积、中心性、置信度、完整度与可选的主体框/索引结合，输出可序列化的主体、路人或不确定结果。", "证据：src/eliminate/subject.py、tests/test_subject.py"], ["保护优先的掩码构建", "删除掩码先汇合路人实例并膨胀，再减去膨胀后的主体保护区；覆盖层显示三类实例供人工复核。", "证据：src/eliminate/masks.py、tests/test_masks.py"], ["可替换修补与批处理", "dry-run 会完整产出工件；实际修补可接 IOPaint/LaMa 或命令模板。批处理遇到单项失败仍生成汇总。", "证据：pipeline.py、cli.py、tests/test_pipeline.py"]],
    decisions: ["在不确定时默认保护，而不是为了产出结果强行删除可能的主体。", "把检测器和修补后端设为适配层，方便在缺少权重或修补工具时仍审阅掩码决策。", "每次运行写出 JSON、掩码和叠加图，便于回溯为何删除或保护某个实例。"],
    limitation: { title: "单元验证不等同于真实图像质量评估", text: "12 项测试覆盖规则、掩码、dry-run 与批处理行为，未加载 YOLO 权重或 LaMa 模型，也未对真实数据集的修补自然度做主观或定量评测。" },
    resources: { title: "查看公开的功能分支", text: "项目的可运行基线位于 feature/person-removal-baseline；链接明确指向该分支，避免默认 main 分支造成误判。", action: "查看 GitHub 分支" },
  },
} as const;

const navItems = [
  { href: "/#top", label: "首页", id: "top", icon: House },
  { href: "/#awards", label: "荣誉", id: "awards", icon: Medal },
  { href: "/#work", label: "项目", id: "work", icon: BriefcaseBusiness },
  { href: "/#skills", label: "能力", id: "skills", icon: Wrench },
  { href: "/#about", label: "关于", id: "about", icon: UserRound },
];

type FontGateStatus = "loading" | "ready" | "fallback";
type TextFontStatus = FontGateStatus | "idle";

const fontLoadTimeoutMs = 4500;
const fontLatinSample = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 · / - + : , .";
const fontFaceRequests = [
  '400 16px "Manrope"',
  '500 16px "Manrope"',
  '600 16px "Manrope"',
  '700 16px "Manrope"',
  '400 16px "Noto Sans SC"',
  '500 16px "Noto Sans SC"',
  '600 16px "Noto Sans SC"',
  '400 16px "IBM Plex Mono"',
  '500 16px "IBM Plex Mono"',
  '500 16px "Cormorant Garamond"',
  '600 16px "Cormorant Garamond"',
  '700 16px "Cormorant Garamond"',
];

function collectText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(collectText).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(collectText).join(" ");
  return "";
}

const staticFontCorpus = [
  collectText([profile, projects, auditedCaseStudies, navItems]),
  "项目链接已失效 项目清单已经更新 返回项目列表重新选择 演示服务暂时不可用 项目案例仍可浏览 源码接口文档 查看项目案例 访问 GitHub 返回项目 主题 正在求职 大模型应用工程实习 让模型能力进入可用工作流 围绕多智能体生成式 AI 应用 模型工具界面边界 可理解可核验 推进交付 浏览案例 联系我 案例档案 有来源的代表案例 项目事实为主线 源码测试项目材料",
].join(" ");

function waitForFinalFonts(text: string, timeoutMs = fontLoadTimeoutMs): Promise<FontGateStatus> {
  if (!("fonts" in document)) return Promise.resolve("fallback");
  const sample = `${text} ${fontLatinSample}`.trim();
  if (!sample) return Promise.resolve("ready");

  return new Promise((resolve) => {
    let settled = false;
    let retry: number | null = null;
    const finish = (status: FontGateStatus) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      if (retry !== null) window.clearTimeout(retry);
      resolve(status);
    };
    const timeout = window.setTimeout(() => finish("fallback"), timeoutMs);
    const fontSet = document.fonts;
    const requestFonts = () => {
      if (settled) return;
      const requests = fontFaceRequests.map((descriptor) => fontSet.load(
        descriptor,
        descriptor.includes("Noto Sans SC") ? sample : fontLatinSample,
      ));

      void Promise.all(requests)
        .then((faces) => {
          if (faces.some((match) => !match.length)) {
            retry = window.setTimeout(requestFonts, 80);
            return;
          }
          return fontSet.ready.then(() => finish("ready"));
        })
        .catch(() => { retry = window.setTimeout(requestFonts, 80); });
    };

    requestFonts();
  });
}

function useDocumentFontGate() {
  const [status, setStatus] = useState<FontGateStatus>("loading");

  useEffect(() => {
    let active = true;
    const frame = window.requestAnimationFrame(() => {
      const visibleText = document.getElementById("root")?.textContent ?? "";
      void waitForFinalFonts(`${staticFontCorpus} ${visibleText}`).then((nextStatus) => {
        if (active) setStatus(nextStatus);
      });
    });
    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return status;
}

function useTextFontGate(text: string | undefined, parentStatus: FontGateStatus): TextFontStatus {
  const textKey = text ?? "";
  const key = `${parentStatus}\u0000${textKey}`;
  const [resolution, setResolution] = useState<{ key: string; status: TextFontStatus }>({ key: "", status: "idle" });
  const currentStatus: TextFontStatus = resolution.key === key
    ? resolution.status
    : !textKey
      ? "idle"
      : parentStatus === "fallback"
        ? "fallback"
        : "loading";

  useEffect(() => {
    let active = true;
    if (!textKey) {
      setResolution({ key, status: "idle" });
      return () => { active = false; };
    }
    if (parentStatus === "loading") {
      setResolution({ key, status: "loading" });
      return () => { active = false; };
    }
    if (parentStatus === "fallback") {
      setResolution({ key, status: "fallback" });
      return () => { active = false; };
    }

    setResolution({ key, status: "loading" });
    void waitForFinalFonts(textKey).then((nextStatus) => {
      if (active) setResolution({ key, status: nextStatus });
    });
    return () => { active = false; };
  }, [key, parentStatus, textKey]);

  return currentStatus;
}

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
  { sectionSelector: "#awards", itemSelector: ".section-title > *, .award-certificate > *" },
  { sectionSelector: "#work", itemSelector: ".section-title > *, .case-row" },
  { sectionSelector: "#skills", itemSelector: ".section-title > *, .skill-track article" },
  { sectionSelector: "#about", itemSelector: ".about-resource-content > *" },
];

const scrollRevealItemDuration = 620;
const scrollRevealItemStagger = 90;

function useScrollReveal(groups: ScrollRevealGroup[], contentVersion = "", enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const itemsBySection = new Map<HTMLElement, HTMLElement[]>();
    const sections = groups.flatMap(({ sectionSelector, itemSelector }) => {
      const section = document.querySelector<HTMLElement>(sectionSelector);
      if (!section) return [];

      const items = Array.from(section.querySelectorAll<HTMLElement>(itemSelector)).filter((item) => !item.closest(".section-resource__skeleton"));
      const unrevealedItems = items.filter((item) => item.dataset.scrollRevealCompleted !== "true");
      unrevealedItems.forEach((item, index) => {
        item.classList.add("scroll-reveal-item");
        item.style.setProperty("--scroll-reveal-delay", `${index * scrollRevealItemStagger}ms`);
      });
      itemsBySection.set(section, unrevealedItems);

      return [section];
    });

    if (!sections.length) return;

    const delayResetTimers: number[] = [];
    const reveal = (section: HTMLElement) => {
      section.classList.add("is-visible");
      const items = itemsBySection.get(section) ?? [];
      if (!items.length) return;
      items.forEach((item) => { item.dataset.scrollRevealCompleted = "true"; });
      const finish = () => items.forEach((item) => {
        item.style.removeProperty("--scroll-reveal-delay");
        item.classList.remove("scroll-reveal-item");
      });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }
      const duration = scrollRevealItemDuration + Math.max(0, items.length - 1) * scrollRevealItemStagger;
      delayResetTimers.push(window.setTimeout(() => {
        finish();
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

    sections.forEach((section) => {
      if (section.classList.contains("is-visible")) reveal(section);
      else observer.observe(section);
    });
    return () => {
      observer.disconnect();
    };
  }, [contentVersion, enabled, groups]);
}

type ResourceStatus = "idle" | "loading" | "ready" | "error";
type ResourceState<T> = { status: ResourceStatus; data?: T; message?: string };
type PreloadTarget = { selector: string; load: () => void };
type SummaryData = { label: string; count: string; description: string; note: string };
type AwardsData = { eyebrow: string; heading: string; description: string; awards: Array<{ edition: string; badge: string; level: string; title: string; result: string; project?: string; projectId?: string; category: string; evidence: string }> };
type WorkData = { eyebrow: string; heading: string; description: string; projects: Array<{ id: string; type: string; title: string; short: string; stack: string[] }> };
type SkillsData = { eyebrow: string; heading: string; skills: Array<{ index: string; title: string; description: string }> };
type AboutData = { eyebrow: string; heading: string; description: string; contactEyebrow: string; contactTitle: string; email: string };

function useJsonResource<T>(url: string, timeoutMs = 7000, initialCache: RequestCache = "force-cache") {
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
    const request = fetch(requestUrl, { signal: controller.signal, cache: forceRefresh ? "reload" : initialCache })
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

function ResourceBoundary({ state, fontStatus, retry, skeleton, children }: { state: ResourceState<unknown>; fontStatus: TextFontStatus; retry: () => void; skeleton: ReactNode; children: ReactNode }) {
  const isReady = state.status === "ready" && (fontStatus === "ready" || fontStatus === "fallback");
  const visualStatus = state.status === "ready" && !isReady ? "font-loading" : state.status;
  return <div className={`section-resource section-resource--${visualStatus}${fontStatus === "fallback" ? " section-resource--font-fallback" : ""}`} aria-busy={!isReady && state.status !== "error"}>
    {state.status !== "error" && <div className="section-resource__skeleton" aria-hidden={isReady}>{skeleton}</div>}
    {isReady && <div className="section-resource__content">{children}</div>}
    {state.status === "error" && <div className="section-resource__error" role="status"><span>{state.message}</span><button type="button" onClick={retry}>重新加载</button></div>}
  </div>;
}

function SummarySkeleton() { return <div className="proof-strip__content proof-strip__skeleton"><i/><b/><i/><i/></div>; }
function AwardsSkeleton() { return <><div className="section-title section-title--skeleton"><i/><b/><i/></div><div className="award-ledger award-ledger--skeleton"><i/><div><b/><i/><i/><i/></div></div></>; }
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
    <div className={`candidate-shell${showNavigation ? "" : " candidate-shell--detail"}`}>{children}<footer><span>AI 应用工程 · 项目作品集</span><span>© {new Date().getFullYear()}</span></footer></div>
  </AuroraBackground>;
}

type Project = typeof projects[number];

function CaseSignature({ project }: { project: Project }) {
  const Icon = project.icon;
  switch (project.id) {
    case "pharmagent":
      return <div className="case-signature case-signature--pharmagent" aria-label="药物研发工作流示意">
        <span className="signature-kicker">RESEARCH ROUTE</span>
        <div className="molecule-map" aria-hidden="true"><i/><i/><i/><i/><b/><b/><b/></div>
        <div className="signature-foot"><span>靶点</span><em>→</em><span>性质</span><em>→</em><span>方案</span></div>
      </div>;
    case "xuanji":
      return <div className="case-signature case-signature--xuanji" aria-label="新药发现研究入口示意">
        <span className="signature-kicker">DISCOVERY ATLAS</span>
        <div className="screening-atlas" aria-hidden="true"><b>iDrugMap</b><i>预测</i><i>筛选</i><i>检索</i></div>
        <div className="signature-foot"><span>数据</span><em>→</em><span>算法</span><em>→</em><span>研究入口</span></div>
      </div>;
    case "sso-platform":
      return <div className="case-signature case-signature--sso" aria-label="单点登录访问关系示意">
        <span className="signature-kicker">TRUST TOPOLOGY</span>
        <div className="access-board"><strong>CAS</strong><i/><span>Client A</span><span>Client B</span><b>ticket · session · claim</b></div>
        <div className="signature-foot"><span>HTTPS</span><em>↔</em><span>身份权威</span></div>
      </div>;
    case "v2t":
      return <div className="case-signature case-signature--v2t" aria-label="视频转写时间轴示意">
        <span className="signature-kicker">TRANSCRIPT IN MOTION</span>
        <div className="transcript-track"><small>00:03</small><div aria-hidden="true">{[18, 31, 46, 24, 53, 38, 65, 29, 44, 20, 58, 35].map((height, index) => <i key={index} style={{ height }} />)}</div><small>47:12</small></div>
        <div className="caption-line"><b>识别</b><span>清洗 · 合并 · 摘要</span></div>
      </div>;
    case "eliminate":
      return <div className="case-signature case-signature--eliminate" aria-label="主体保护掩码示意">
        <span className="signature-kicker">MASK BEFORE REMOVE</span>
        <div className="mask-stage" aria-hidden="true"><i/><i/><i/><b>主体</b><span>路人</span></div>
        <div className="signature-foot"><span>保护区域</span><em>−</em><span>删除掩码</span></div>
      </div>;
    case "scholarweaver":
      return <div className="case-signature case-signature--scholarweaver" aria-label="学术文档翻译示意">
        <span className="signature-kicker">ANNOTATED MANUSCRIPT</span>
        <div className="paper-spread" aria-hidden="true"><article><b>ABSTRACT</b><i/><i/><i/><em/></article><article><b>译文</b><i/><i/><i/><em/></article></div>
        <div className="signature-foot"><span>原文</span><em>⇄</em><span>可审阅译稿</span></div>
      </div>;
    case "fubao":
      return <div className="case-signature case-signature--fubao" aria-label="家庭共管任务示意">
        <span className="signature-kicker">SHARED CARE DAY</span>
        <div className="care-board"><article><b>子女</b><span>安排计划</span></article><i>↔</i><article><b>长辈</b><span>完成记录</span></article></div>
        <div className="signature-foot"><span>同一日程</span><em>·</em><span>两种角色</span></div>
      </div>;
    default:
      return <div className="case-signature"><Icon size={64}/></div>;
  }
}

function CaseMasthead({ project, isTransitionTarget = false }: { project: Project; isTransitionTarget?: boolean }) {
  const caseLabel = project.visibility === "private" ? "PRIVATE PROJECT CASE STUDY" : "REPOSITORY CASE STUDY";
  return <section className={`case-masthead case-masthead--${project.id}${isTransitionTarget ? " case-masthead--transition-target" : ""}`}>
    <div className="case-masthead__copy">
      <p className="mono-label">{project.type} / {caseLabel}</p>
      <h1>{project.title}</h1>
      <p>{project.short}</p>
      <div className="tag-row">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
    </div>
    <CaseSignature project={project}/>
  </section>;
}

function EvidenceLabel({ status, source }: { status: string; source: string }) {
  return <div className="evidence-label"><span>{status}</span><p>{source}</p></div>;
}

type SourceFigure = {
  src: string;
  alt: string;
  kind: string;
  title: string;
  description: string;
};

function SourceFigureGallery({ title, description, figures }: { title: string; description: string; figures: SourceFigure[] }) {
  return <div className="source-figures">
    <div className="source-figures__heading"><div><p className="mono-label">DOCUMENT FIGURES</p><h3>{title}</h3></div><p>{description}</p></div>
    <div className="source-figure-grid">
      {figures.map((figure) => <figure className="source-figure" key={figure.src}>
        <a className="source-figure__asset" href={figure.src} target="_blank" rel="noreferrer" aria-label={`在新标签页查看原图：${figure.title}`}>
          <img src={figure.src} alt={figure.alt} loading="lazy" decoding="async" />
          <span>查看原图 <ArrowUpRight size={14} aria-hidden="true" /></span>
        </a>
        <figcaption><p>{figure.kind}</p><h4>{figure.title}</h4><span>{figure.description}</span></figcaption>
      </figure>)}
    </div>
  </div>;
}

function PharmAgentEvidence() {
  const steps = [
    ["研究起点", "疾病、靶点或候选药物"],
    ["可信信息", "ChEMBL、openFDA 与知识库"],
    ["插件分析", "分子生成与 ADMET 解析"],
    ["工作流编排", "FastGPT 路由、检索与调用"],
    ["方案输出", "递送策略与验证框架"],
  ];

  return <section className="detail-section evidence-section evidence-section--pharmagent">
    <div className="detail-section__heading"><p className="mono-label">02 / KEY EVIDENCE</p><h2>从研究问题到递送策略，不让建议脱离输入</h2><p>这条链路从项目书中提炼模块之间的输入与交接关系，说明方案如何被组织；它不是模型准确率、临床有效性或线上性能的证明。</p></div>
    <EvidenceLabel status="项目材料所述模块" source="依据：药物—靶点、ADMET、分子生成与递送策略的工作流描述"/>
    <ol className="research-trace" aria-label="PharmAgent 研究证据链">
      {steps.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{description}</p></li>)}
    </ol>
    <div className="detail-callout"><GitBranch size={18}/><p>网页只保留每一步的职责与可追溯交接：外部数据、模型插件和工作流共同支撑研究辅助，而非把任何单一数据源或生成结果包装为结论。</p></div>
    <SourceFigureGallery title="原始项目图：部署边界与智能体编排" description="两张原图分别回答“请求从哪里进入”与“工作流内部怎样调度”。点击任一图可在新标签页查看原始分辨率。" figures={[
      { src: "/project-evidence/pharmagent-system-architecture.png", alt: "PharmAgent 原始系统架构图，展示微信端、Giiso 私域部署、主 API、FastGPT 工作流及插件层。", kind: "系统架构原图", title: "从微信端到 ChEMBL、ADMET 与分子生成插件", description: "项目书把交互端、私域部署、主 API、FastGPT 编排层和插件层放在同一调用图中。" },
      { src: "/project-evidence/pharmagent-fastgpt-workflow.png", alt: "PharmAgent 原始 FastGPT 工作流截图，包含知识检索、分子生成和 ADMET 节点。", kind: "工作流原图", title: "知识检索、分子生成与 ADMET 的节点编排", description: "原始画布保留了插件节点及其连线，作为上方五段流程的实现层补充。" },
    ]}/>
  </section>;
}

function ScholarWeaverEvidence() {
  const steps = [
    ["论文输入", "PDF 的页面、文本与结构"],
    ["可读结构", "解析、占位保护与全文摘要"],
    ["领域辅助", "术语归一与参考例句检索"],
    ["两阶段翻译", "初稿、反思与结构化修订"],
    ["审阅输出", "原译对照与可定位阅读"],
  ];

  return <section className="detail-section evidence-section evidence-section--scholarweaver">
    <div className="detail-section__heading"><p className="mono-label">02 / KEY EVIDENCE</p><h2>把学术翻译拆成可审阅的处理链</h2><p>页面将解析、术语、参考例句与翻译修订明确分开，强调文档结构为何能保留，而不将 Demo 描述成已完成的质量评测。</p></div>
    <EvidenceLabel status="DEMO WORKFLOW" source="依据：项目书、公开 README 与已审查的工作流目录"/>
    <div className="translation-evidence">
      <ol className="translation-flow" aria-label="ScholarWeaver 文档翻译链路">
        {steps.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}
      </ol>
      <aside className="translation-proof" aria-label="原文与译文对照的网页原生示意">
        <div className="translation-proof__header"><strong>输出结构示意</strong><span>网页原生重绘</span></div>
        <div className="translation-proof__pages" aria-hidden="true">
          <article><b>ORIGINAL</b><i/><i/><i/><em>TableFormer</em><i className="is-short"/><i/></article>
          <article><b>译文</b><i/><i/><i/><em>术语锚点</em><i className="is-short"/><i/></article>
        </div>
        <p>术语提示、表格占位与参考文献保留是输出结构的设计重点；此处不是竞品对比或准确率展示。</p>
      </aside>
    </div>
    <div className="detail-callout"><GitBranch size={18}/><p>zx6831 的可见提交聚焦服务端到本地检索服务的联通层和端点测试；因此页面把贡献叙述限定为可见的转发与联调工作，不替代其他协作者的实现归属。</p></div>
    <SourceFigureGallery title="原始项目图：解析管道与双栏工作台" description="原图把处理管道和用户最终看到的阅读界面并置：前者解释为何能保留结构，后者说明成果以怎样的形态交付。" figures={[
      { src: "/project-evidence/scholarweaver-processing-pipeline.png", alt: "ScholarWeaver 项目书中的文档解析处理管道图，展示 PDF 页面、OCR、版面分析、表格结构及 JSON 或 Markdown 输出。", kind: "处理管道原图", title: "PDF 页面经 OCR、版面与表格处理后组装输出", description: "原始技术报告图直观呈现文档拆解、模型管道与结构化结果之间的关系。" },
      { src: "/project-evidence/scholarweaver-translation-workbench.png", alt: "ScholarWeaver 原始工作台截图，左侧目录，中间原文，右侧译文。", kind: "工作台截图", title: "原文、译文与文件目录同屏审阅", description: "原始界面把文件管理与双栏阅读并列，补足“审阅输出”在真实产品中的落点。" },
    ]}/>
  </section>;
}

function FubaoEvidence() {
  const roles = [
    ["01", "子女", "制定计划，查看进度"],
    ["02", "同一家庭事实", "计划与任务按家庭边界记录"],
    ["03", "长辈", "以少步骤完成和确认任务"],
    ["04", "关怀反馈", "火花、提醒与可追溯状态"],
  ];

  return <section className="detail-section evidence-section evidence-section--fubao">
    <div className="detail-section__heading"><p className="mono-label">02 / KEY EVIDENCE</p><h2>一日共管，不是同一界面的两种配色</h2><p>核心体验由角色分工与同一家庭事实源共同构成：子女配置、长辈确认、系统再呈现可解释的进度与关怀反馈。</p></div>
    <EvidenceLabel status="V1.4 架构边界" source="依据：双角色产品流程、Family 聚合、OCR 与 Agent 执行说明"/>
    <ol className="role-loop" aria-label="福豹家庭共管闭环">
      {roles.map(([order, title, description]) => <li key={order}><span>{order}</span><strong>{title}</strong><p>{description}</p></li>)}
    </ol>
    <div className="privacy-rail" aria-label="福豹 OCR、健康档案与 AI 的数据边界">
      <article className="privacy-rail__node privacy-rail__node--local"><span>本地编辑</span><strong>OCR 候选</strong><p>原图与识别原文停留在设备</p></article><i aria-hidden="true">→</i>
      <article className="privacy-rail__node"><span>用户确认</span><strong>家庭业务事实</strong><p>由 NestJS 与 Family 授权管理</p></article><i aria-hidden="true">→</i>
      <article className="privacy-rail__node privacy-rail__node--service"><span>受控服务</span><strong>最小上下文</strong><p>AI 仅处理筛选后的请求</p></article>
    </div>
    <div className="detail-callout"><ShieldAlert size={18}/><p>健康事件等级由确定性规则形成；本地 OCR 的候选必须经用户确认，AI 不持有原图或完整档案，也不替代诊断或用药决策。</p></div>
    <SourceFigureGallery title="原始项目图：家庭闭环与分层系统上下文" description="业务图呈现子女端与长辈端围绕 Family 协作的完整闭环；系统图则把前端、业务权威层、内部 AI 与外部依赖的边界展开。" figures={[
      { src: "/project-evidence/fubao-family-loop.png", alt: "福豹 V1.4 产品总体业务闭环图，围绕 Family 展示子女端和长辈端的健康共管流程。", kind: "业务闭环原图", title: "Family 连接两端角色与九个持续共管环节", description: "从创建家庭、档案和 DailyTask，到健康报告、建议与互动，原图完整呈现产品的业务叙事。" },
      { src: "/project-evidence/fubao-system-context.png", alt: "福豹系统上下文图，展示 Flutter 双角色 App、NestJS Core、Python AI Service 和外部 Provider 的安全分区。", kind: "系统上下文原图", title: "Flutter、NestJS、内部 AI 与 Provider 的分层边界", description: "图中保留客户端、业务权威层、内网 AI 和外部依赖之间的调用方向与关键安全约束。" },
    ]}/>
  </section>;
}

function ScholarWeaverDetail({ project, isTransitionTarget }: { project: Project; isTransitionTarget: boolean }) {
  return <main className="detail-page detail-page--case-study case-theme--scholarweaver">
    <a className="back-link" href="/#work"><ArrowLeft size={16}/> 返回作品集</a>
    <CaseMasthead project={project} isTransitionTarget={isTransitionTarget}/>

    <section className="detail-summary">
      <article>
        <p className="mono-label">01 / 项目定位</p>
        <h2>面向学术 PDF 的可组合翻译工作流</h2>
        <p>完整项目以 FastAPI 提供文档处理接口，结合 PDF 解析、术语处理、参考例句检索与大模型工作流生成翻译结果。公开 README 明确其仍是可用但未完善的竞赛 Demo；本页因此只呈现源码和提交记录能够支持的系统结构。</p>
      </article>
      <aside className="glass-panel detail-facts">
        <div><span>公开仓库</span><strong>MikeHuang2000/LLMs_Database_Translater</strong></div>
        <div><span>项目属性</span><strong>荣誉关联项目“交叉互译”；华南理工大学鼎甲杯合作参赛作品；README 标记为 Demo</strong></div>
        <div><span>可见贡献</span><strong>zx6831 的公开记录含 2 次提交与一次 relay 分支合并</strong></div>
        <div><span>运行验证</span><strong>未在本次审查环境启动：MinerU、模型服务与 API 配置未齐备</strong></div>
      </aside>
    </section>

    <ScholarWeaverEvidence/>

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
      <div className="detail-actions"><LiquidGlassButton variant="primary" href={project.repository ?? profile.github} target="_blank">查看 GitHub 仓库 <ExternalLink size={16}/></LiquidGlassButton><LiquidGlassButton href="/#work">返回项目 <ArrowUpRight size={16}/></LiquidGlassButton></div>
    </section>
  </main>;
}

function FubaoDetail({ project, isTransitionTarget }: { project: Project; isTransitionTarget: boolean }) {
  return <main className="detail-page detail-page--case-study detail-page--fubao">
    <a className="back-link" href="/#work"><ArrowLeft size={16}/> 返回作品集</a>
    <CaseMasthead project={project} isTransitionTarget={isTransitionTarget}/>

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

    <FubaoEvidence/>

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
      <div className="detail-actions"><LiquidGlassButton variant="primary" href="/#work">返回项目 <ArrowUpRight size={16}/></LiquidGlassButton></div>
    </section>
  </main>;
}

function AuditedProjectDetail({ project, isTransitionTarget }: { project: Project; isTransitionTarget: boolean }) {
  const detail = auditedCaseStudies[project.id as keyof typeof auditedCaseStudies];
  const flowIcons = [FileText, Database, Workflow, Network, Layers3];
  const implementationIcons = [Code2, ShieldAlert, Workflow];
  const resourceAction = "action" in detail.resources ? detail.resources.action : undefined;

  return <main className={`detail-page detail-page--case-study case-theme--${project.id}`}>
    <a className="back-link" href="/#work"><ArrowLeft size={16}/> 返回作品集</a>
    <CaseMasthead project={project} isTransitionTarget={isTransitionTarget}/>

    <section className="detail-summary">
      <article><p className="mono-label">01 / 项目定位</p><h2>{detail.position.title}</h2><p>{detail.position.text}</p></article>
      <aside className="glass-panel detail-facts">{detail.facts.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</aside>
    </section>

    {project.id === "pharmagent" ? <PharmAgentEvidence/> : <section className="detail-section">
      <div className="detail-section__heading"><p className="mono-label">02 / 系统链路</p><h2>让每个输入、边界与输出都有位置</h2><p>以下链路依据已审查的仓库源码、测试、项目文档或本地工程目录整理；它描述系统结构与工作边界，不代表性能或效果承诺。</p></div>
      <div className="architecture-flow" aria-label={`${project.title} 系统链路`}>
        {detail.flow.map(([title, description], index) => {
          const FlowIcon = flowIcons[index] ?? Database;
          return <><article key={title}><FlowIcon size={23}/><strong>{title}</strong><span>{description}</span></article>{index < detail.flow.length - 1 && <i key={`${title}-arrow`} aria-hidden="true">→</i>}</>;
        })}
      </div>
      <div className="detail-callout"><GitBranch size={18}/><p>{detail.note}</p></div>
    </section>}

    <section className="detail-section detail-section--implementation">
      <div className="detail-section__heading"><p className="mono-label">03 / 核心实现</p><h2>以可验证材料收束项目描述</h2></div>
      <div className="implementation-grid">{detail.implementation.map(([title, text, evidence], index) => {
        const ImplementationIcon = implementationIcons[index] ?? Code2;
        return <article className="glass-panel" key={title}><ImplementationIcon size={22}/><h3>{title}</h3><p>{text}</p><small>{evidence}</small></article>;
      })}</div>
    </section>

    <section className="detail-section detail-section--split">
      <article><p className="mono-label">04 / 设计取舍</p><h2>优先把关键边界写进系统</h2><ul className="detail-list">{detail.decisions.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <aside className="detail-limitations glass-panel"><ShieldAlert size={21}/><p className="mono-label">05 / 验证边界</p><h3>{detail.limitation.title}</h3><p>{detail.limitation.text}</p></aside>
    </section>

    <section className="detail-resources glass-panel">
      <div><p className="mono-label">06 / 项目资源</p><h2>{detail.resources.title}</h2><p>{detail.resources.text}</p></div>
      <div className="detail-actions">{project.repository && resourceAction && <LiquidGlassButton variant="primary" href={project.repository} target="_blank">{resourceAction} <ExternalLink size={16}/></LiquidGlassButton>}<LiquidGlassButton href="/#work">返回项目 <ArrowUpRight size={16}/></LiquidGlassButton></div>
    </section>
  </main>;
}

function ProjectDetail({ id, transitionProjectId }: { id: string; transitionProjectId: string | null }) {
  const project = projects.find(p => p.id === id);
  if (!project) return <UnknownProjectPage />;
  const isTransitionTarget = transitionProjectId === project.id;
  if (project.id === "fubao") return <FubaoDetail project={project} isTransitionTarget={isTransitionTarget}/>;
  if (project.id === "scholarweaver") return <ScholarWeaverDetail project={project} isTransitionTarget={isTransitionTarget}/>;
  return <AuditedProjectDetail project={project} isTransitionTarget={isTransitionTarget}/>;
}

function UnknownProjectPage() { return <main className="status-page"><div className="status-code">404</div><p className="mono-label">PROJECT / NOT FOUND</p><h1>这个项目链接已失效</h1><p>项目清单已经更新。为避免展示错误的项目详情，请返回项目列表后重新选择。</p><div className="detail-actions"><LiquidGlassButton variant="primary" href="/#work">返回项目 <ArrowUpRight size={16}/></LiquidGlassButton></div></main>; }

function OfflinePage() { return <main className="status-page"><div className="status-code">503</div><p className="mono-label">DEMO SERVICE / TEMPORARILY OFFLINE</p><h1>演示服务暂时不可用</h1><p>项目案例仍可浏览；仓库中可核验的源码与接口文档不依赖在线演示服务。</p><div className="detail-actions"><LiquidGlassButton variant="primary" href="/?project=scholarweaver">查看项目案例</LiquidGlassButton><LiquidGlassButton href={profile.github}>访问 GitHub <Github size={16}/></LiquidGlassButton></div></main>; }

function Home({ onProjectOpen, transitionProjectId, fontStatus }: { onProjectOpen: (event: React.MouseEvent<HTMLAnchorElement>, projectId: string) => void; transitionProjectId: string | null; fontStatus: FontGateStatus }) {
  const summary = useJsonResource<SummaryData>("/data/home-summary.json");
  const awards = useJsonResource<AwardsData>("/data/home-awards.json", 7000, "no-cache");
  const work = useJsonResource<WorkData>("/data/home-work.json", 7000, "no-cache");
  const skills = useJsonResource<SkillsData>("/data/home-skills.json");
  const about = useJsonResource<AboutData>("/data/home-about.json");
  const initialSectionId = useRef(location.hash.slice(1));
  const restoredInitialSection = useRef(false);
  const preloadTargets = useMemo(() => [
    { selector: "#proof", load: summary.load },
    { selector: "#awards", load: awards.load },
    { selector: "#work", load: work.load },
    { selector: "#skills", load: skills.load },
    { selector: "#about", load: about.load },
  ], [about.load, awards.load, skills.load, summary.load, work.load]);

  useNearViewportPreload(preloadTargets, 400);

  useEffect(() => {
    if (!initialSectionId.current) return;
    summary.load();
    awards.load();
    work.load();
    skills.load();
    about.load();
  }, [about.load, awards.load, skills.load, summary.load, work.load]);

  const workData = work.state.data;
  const awardsData = awards.state.data;
  const skillsData = skills.state.data;
  const summaryData = summary.state.data;
  const aboutData = about.state.data;
  const summaryFontStatus = useTextFontGate(collectText(summaryData), fontStatus);
  const awardsFontStatus = useTextFontGate(collectText(awardsData), fontStatus);
  const workFontStatus = useTextFontGate(collectText(workData), fontStatus);
  const skillsFontStatus = useTextFontGate(collectText(skillsData), fontStatus);
  const aboutFontStatus = useTextFontGate(collectText(aboutData), fontStatus);
  const projectIcons = { pharmagent: HeartPulse, xuanji: Dna, "sso-platform": Network, v2t: FileText, eliminate: Layers3, scholarweaver: Database, fubao: HeartPulse };

  useScrollReveal(scrollRevealGroups, [summary.state.status, summaryFontStatus, awards.state.status, awardsFontStatus, work.state.status, workFontStatus, skills.state.status, skillsFontStatus, about.state.status, aboutFontStatus].join("|"), fontStatus !== "loading");

  useEffect(() => {
    const id = initialSectionId.current;
    const resourcesReady = [summary, awards, work, skills, about].every((resource) => resource.state.status === "ready");
    const textReady = [summaryFontStatus, awardsFontStatus, workFontStatus, skillsFontStatus, aboutFontStatus].every((status) => status !== "loading");
    if (!id || restoredInitialSection.current || !resourcesReady || !textReady) return;
    const target = document.getElementById(id);
    if (!target) return;
    restoredInitialSection.current = true;
    const frame = window.requestAnimationFrame(() => target.scrollIntoView({ behavior: "auto", block: "start" }));
    return () => window.cancelAnimationFrame(frame);
  }, [about, aboutFontStatus, awards, awardsFontStatus, skills, skillsFontStatus, summary, summaryFontStatus, work, workFontStatus]);

  return <main>
    <section className="candidate-hero" id="top"><div className="hero-main"><div className="availability"><span/> 正在求职 · 大模型应用工程实习</div><p className="mono-label">AI APPLICATIONS / PORTFOLIO 2026</p><h1>让模型能力<br/>进入<span className="accent-word">可用工作流。</span></h1><p className="hero-lead">围绕 RAG、多智能体、ASR 与生成式 AI 应用，梳理模型、工具与界面的边界；以可理解、可核验的方式推进交付。</p><div className="hero-actions"><LiquidGlassButton variant="primary" href="#work">浏览案例 <ArrowUpRight size={16}/></LiquidGlassButton><LiquidGlassButton href="#about">联系我 <Mail size={16}/></LiquidGlassButton></div></div><aside className="identity-panel glass-panel"><div className="casebook-stage"><p className="casebook-stage__eyebrow">CASEBOOK / 2026</p><div className="casebook-stage__count"><strong>07</strong><span>个有来源的代表案例</span></div><p className="casebook-stage__scope">AI · 全栈 · 视觉 · 产品工程</p></div><div className="identity-copy"><strong>以项目事实为主线</strong><p>仅呈现可公开的源码、测试记录与项目材料；未核验的信息不作结论。</p></div><div className="signal-line" aria-hidden="true"><i/><i/><i/><i/><i/></div><div className="identity-meta"><span>范围</span><b>AI · 全栈 · 视觉 · 产品</b><span>依据</span><b>源码 · 测试 · 项目材料</b></div></aside></section>
    <section className="proof-strip" id="proof"><ResourceBoundary state={summary.state} fontStatus={summaryFontStatus} retry={summary.retry} skeleton={<SummarySkeleton />}>{summaryData && <div className="proof-strip__content"><span>{summaryData.label}</span><strong>{summaryData.count}</strong><p>{summaryData.description}</p><span>{summaryData.note}</span></div>}</ResourceBoundary></section>
    <section className="portfolio-section awards-section" id="awards"><ResourceBoundary state={awards.state} fontStatus={awardsFontStatus} retry={awards.retry} skeleton={<AwardsSkeleton />}>{awardsData && <><div className="section-title"><p className="mono-label">{awardsData.eyebrow}</p><h2>{awardsData.heading}</h2><p>{awardsData.description}</p></div><div className="award-ledger">{awardsData.awards.map((award) => <article className="award-certificate glass-panel" key={award.title}><div className="award-certificate__edition"><span>{award.edition}</span><Medal size={28}/></div><div className="award-certificate__main"><p className="mono-label">{award.level} · {award.category} / {award.badge}</p><h3>{award.title}</h3><strong>{award.result}</strong>{award.project && award.projectId ? <a href={`/?project=${award.projectId}`} className="award-certificate__project">关联项目 · {award.project} <ArrowUpRight size={15}/></a> : <span className="award-certificate__project award-certificate__project--static">独立竞赛荣誉</span>}</div><dl className="award-certificate__facts"><div><dt>荣誉层级</dt><dd>{award.level}</dd></div><div><dt>核验材料</dt><dd>{award.evidence}</dd></div></dl></article>)}</div></>}</ResourceBoundary></section>
    <section className="portfolio-section" id="work"><ResourceBoundary state={work.state} fontStatus={workFontStatus} retry={work.retry} skeleton={<WorkSkeleton />}>{workData && <><div className="section-title"><p className="mono-label">{workData.eyebrow}</p><h2>{workData.heading}</h2><p>{workData.description}</p></div><div className="case-list">{workData.projects.map((project, index) => { const Icon = projectIcons[project.id as keyof typeof projectIcons] ?? Database; const isTransitionSource = transitionProjectId === project.id; return <a href={`/?project=${project.id}`} className={`case-row glass-panel${isTransitionSource ? " case-row--transition-source" : ""}`} key={project.id} onClick={(event) => onProjectOpen(event, project.id)}><span className="case-index">0{index + 1}</span><div className="case-icon"><Icon size={28}/></div><div><p className="mono-label">{project.type}</p><h3>{project.title}</h3><p>{project.short}</p><div className="tag-row">{project.stack.map((stack) => <span key={stack}>{stack}</span>)}</div></div><ArrowUpRight className="case-arrow"/></a>; })}</div></>}</ResourceBoundary></section>
    <section className="portfolio-section skills-section" id="skills"><ResourceBoundary state={skills.state} fontStatus={skillsFontStatus} retry={skills.retry} skeleton={<SkillsSkeleton />}>{skillsData && <><div className="section-title"><p className="mono-label">{skillsData.eyebrow}</p><h2>{skillsData.heading.split("，")[0]}，<br/>{skillsData.heading.split("，").slice(1).join("，")}</h2></div><div className="skill-track">{skillsData.skills.map((skill) => <article key={skill.index}><span>{skill.index}</span><h3>{skill.title}</h3><p>{skill.description}</p></article>)}</div></>}</ResourceBoundary></section>
    <section className="portfolio-section about-section" id="about"><ResourceBoundary state={about.state} fontStatus={aboutFontStatus} retry={about.retry} skeleton={<AboutSkeleton />}>{aboutData && <div className="about-resource-content"><div className="about-copy"><p className="mono-label">{aboutData.eyebrow}</p><h2>{aboutData.heading}</h2><p>{aboutData.description}</p></div><aside className="contact-panel glass-panel"><p className="mono-label">{aboutData.contactEyebrow}</p><h3>{aboutData.contactTitle}</h3><div className="contact-actions"><LiquidGlassButton variant="primary" href={`mailto:${aboutData.email}`}>发送邮件 <Mail size={16}/></LiquidGlassButton><LiquidGlassButton href={profile.github}>GitHub <Github size={16}/></LiquidGlassButton></div><small>{aboutData.email}</small></aside></div>}</ResourceBoundary></section>
  </main>;
}

type AppRoute = { hasStatus: boolean; projectId: string | null };
type ProjectViewTransition = { finished: Promise<unknown> };
type ProjectViewTransitionDocument = Document & { startViewTransition?: (update: () => void | Promise<void>) => ProjectViewTransition };

function readAppRoute(): AppRoute {
  const params = new URLSearchParams(location.search);
  return { hasStatus: params.has("status"), projectId: params.get("project") };
}

export function App() {
  const [dark, setDark] = useTheme();
  const [route, setRoute] = useState(readAppRoute);
  const [transitionProjectId, setTransitionProjectId] = useState<string | null>(null);
  const fontStatus = useDocumentFontGate();

  useEffect(() => {
    document.documentElement.dataset.fontStatus = fontStatus;
    document.documentElement.classList.toggle("font-loading", fontStatus === "loading");
    document.documentElement.classList.toggle("font-fallback", fontStatus === "fallback");
    if (fontStatus !== "loading") document.documentElement.classList.add("app-ready");
  }, [fontStatus]);

  useEffect(() => {
    const updateRoute = () => setRoute(readAppRoute());
    window.addEventListener("popstate", updateRoute);
    return () => window.removeEventListener("popstate", updateRoute);
  }, []);

  const openProject = useCallback((event: React.MouseEvent<HTMLAnchorElement>, projectId: string) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const transitionDocument = document as ProjectViewTransitionDocument;
    if (!transitionDocument.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    flushSync(() => setTransitionProjectId(projectId));
    document.documentElement.classList.add("project-route-transition");

    const updateRoute = () => {
      history.pushState(null, "", `/?project=${projectId}`);
      flushSync(() => setRoute(readAppRoute()));
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    try {
      const transition = transitionDocument.startViewTransition(updateRoute);
      void transition.finished.catch(() => undefined).finally(() => {
        document.documentElement.classList.remove("project-route-transition");
        setTransitionProjectId(null);
      });
    } catch {
      document.documentElement.classList.remove("project-route-transition");
      flushSync(() => setTransitionProjectId(null));
      updateRoute();
    }
  }, []);

  const content = route.hasStatus ? <OfflinePage/> : route.projectId ? <ProjectDetail id={route.projectId} transitionProjectId={transitionProjectId}/> : <Home onProjectOpen={openProject} transitionProjectId={transitionProjectId} fontStatus={fontStatus}/>;
  return <Shell dark={dark} setDark={setDark} showNavigation={!route.projectId}>{content}</Shell>;
}
