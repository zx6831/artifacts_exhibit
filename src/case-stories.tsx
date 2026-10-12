import { ArrowUpRight, Database, FileText, Network, ShieldAlert, Workflow } from "lucide-react";

export const caseEditorial = {
  pharmagent: { context: "科研问题", implementation: "数据、模型与编排，分别承担什么", decisions: "让建议保留来源，也保留验证缺口" },
  xuanji: { context: "研究入口", implementation: "研究工具背后的数据与算法", decisions: "候选发现之后，仍需独立验证" },
  "sso-platform": { context: "身份权威", implementation: "登录链路与读取接口，各守一道边界", decisions: "数据归属、可选依赖与证书信任" },
  v2t: { context: "长任务体验", implementation: "让进度可见，让中断可恢复", decisions: "以中间结果复用控制任务重跑范围" },
  eliminate: { context: "主体保护", implementation: "从人物判定到可回溯的修补工件", decisions: "拿不准时，保留画面中的人" },
} as const;

type CaseId = keyof typeof caseEditorial;
type Entry = readonly [string, string, string];

function StoryHeading({ label, title, children }: { label: string; title: string; children: string }) {
  return <div className="detail-section__heading"><p className="mono-label">{label}</p><h2>{title}</h2><p>{children}</p></div>;
}

export function CaseTaskStory({ id }: { id: CaseId }) {
  if (id === "xuanji") return <section className="detail-section case-story case-story--discovery">
    <StoryHeading label="DISCOVERY / 研究入口" title="同一座分子地图，三种发现路径">iDrugMap 将预测、筛选与检索区分为不同任务。下面按项目介绍材料说明每个入口回答的问题，便于理解它们的分工。</StoryHeading>
    <div className="discovery-hub"><Database size={22}/><div><strong>iDrugMap</strong><span>多模态研发数据与算法能力</span></div><span className="story-source">项目材料所述</span></div>
    <div className="discovery-grid">
      {[
        ["活性预测", "这个分子是否值得进一步研究？", "分子结构与目标类别", "辅助识别潜在有效分子"],
        ["虚拟筛选", "哪些候选适合当前筛选任务？", "特定靶点或细胞系的筛选需求", "缩小候选化合物的研究范围"],
        ["相似性检索", "还可以从哪些相似结构继续探索？", "参考分子与相似结构需求", "扩展可研究的候选集合"],
      ].map(([title, question, input, output]) => <article key={title}><p className="mono-label">{title}</p><h3>{question}</h3><dl><div><dt>研究输入</dt><dd>{input}</dd></div><div><dt>辅助输出</dt><dd>{output}</dd></div></dl></article>)}
    </div>
    <p className="story-caption">依据：项目介绍材料中的平台定位与功能范围。候选发现不替代后续实验，也不代表药效或临床结论。</p>
  </section>;

  if (id === "sso-platform") return <section className="detail-section case-story case-story--trust">
    <StoryHeading label="TRUST / 认证与数据归属" title="一次登录，三处明确的信任边界">CAS 统一认证，两端客户端分别维持会话与业务边界。拓扑中的重点是身份权威和业务资料归属，而非把所有数据集中在登录服务。</StoryHeading>
    <div className="trust-topology">
      <div className="trust-center"><Network size={28}/><p className="mono-label">HTTPS · CAS 3.0</p><h3>CAS 认证中心</h3><p>用户、主部门与角色的权威来源</p><span>一次性 Service Ticket</span></div>
      <div className="trust-clients"><article><span className="mono-label">CLIENT A</span><h3>客户端会话与业务页面</h3><p>通过 CAS 认证，并经内部 HTTPS 聚合资料。</p></article><article><span className="mono-label">CLIENT B</span><h3>岗位与工号的业务归属</h3><p>持有自己的业务档案，区分副本查询与主库更新。</p></article></div>
      <div className="trust-storage"><Database size={18}/><p><strong>MySQL</strong> 保存权威数据</p><span>·</span><p><strong>Redis</strong> 保存会话与防重放技术状态</p></div>
    </div>
    <div className="trust-checks"><article><span>SSO 认证</span><strong>Service Ticket 一次性使用</strong></article><article><span>指定 GET 接口</span><strong>HMAC challenge + Redis 原子 claim</strong></article></div>
    <p className="story-caption">依据：README、IAM 文档、部署拓扑与 replay 测试。此处为结构说明；此前审查未启动完整服务拓扑。</p>
  </section>;

  if (id === "v2t") return <section className="detail-section case-story case-story--jobs">
    <StoryHeading label="JOBS / 处理与恢复" title="视频处理需要一条看得见的时间线">处理可能耗时，也可能中断。V2T 将转写、文本清洗和摘要拆成独立步骤，让界面状态和磁盘产物对应到同一项任务。</StoryHeading>
    <div className="job-layout"><ol className="job-timeline">
      {[
        ["视频上传", "安全文件名与任务创建", "任务入口"],
        ["音频与分段", "FFmpeg 提取音频，按区间切分", "音频片段"],
        ["FunASR 转写", "识别、VAD 与标点；回写时间偏移", "带时间轴的文本"],
        ["清洗与合并", "处理相邻片段重叠，整理时间轴", "可复用的转写结果"],
        ["课程摘要", "按学习提纲组织文本，按需流式生成", "摘要与下载结果"],
      ].map(([title, text, output], index) => <li key={title}><span className="job-step">{index + 1}</span><div><h3>{title}</h3><p>{text}</p><small>{output}</small></div></li>)}
    </ol><aside className="job-observability"><div><Workflow size={24}/><h3>处理时：持续反馈</h3><p>SSE 将进度、摘要 token、完成或错误传回前端，无需长轮询猜测任务状态。</p><div className="event-tags"><span>progress</span><span>token</span><span>done</span><span>error</span></div></div><div><Database size={24}/><h3>中断后：找回状态</h3><p>任务元数据与产物落盘。服务启动时扫描输出目录，恢复任务记录与可用结果。</p></div></aside></div>
    <p className="story-caption">依据：tools/api_server.py、transcribe_video.py 与 BACKEND.md。时间线说明步骤顺序，不展示模拟进度或处理耗时。</p>
  </section>;

  if (id === "eliminate") return <section className="detail-section case-story case-story--masks">
    <StoryHeading label="MASKS / 人物决策" title="检测到人物之后，先做三态判断">移除管线要先回答“谁应留在照片里”。分割实例由面积、位置、置信度等规则辅助判定，再决定哪些区域进入删除掩码。</StoryHeading>
    <div className="mask-decisions">
      {[
        ["keep", "主体", "保护", "汇入保护掩码，扩张边界以降低误伤风险。"],
        ["remove", "路人", "移除候选", "汇入删除掩码，随后扣除主体保护区域。"],
        ["uncertain", "不确定", "保留并标记", "在覆盖层中标记，默认不强行纳入删除掩码。"],
      ].map(([state, title, action, text]) => <article className={`mask-state mask-state--${state}`} key={state}><div className="mask-state__mark" aria-hidden="true"><i/><b/></div><span className="mono-label">{action}</span><h3>{title}</h3><p>{text}</p></article>)}
    </div>
    <div className="mask-equation"><span>路人删除区域</span><b aria-hidden="true">−</b><span>主体保护区域</span><b aria-hidden="true">=</b><strong>最终修补掩码</strong></div>
    <div className="mask-artifacts"><FileText size={21}/><div><h3>每一次决定，都留下工件</h3><p>删除 / 保护掩码、覆盖层、结果图和 JSON 记录用于回溯；dry-run 也产出决策工件，实际修补由 IOPaint / LaMa 等后端接入。</p></div></div>
    <p className="story-caption">依据：subject.py、masks.py 与轻量测试。图形为判定规则示意，不代表实际图像修补质量。</p>
  </section>;

  return null;
}

export function CaseImplementation({ id, entries }: { id: CaseId; entries: readonly Entry[] }) {
  const editorial = caseEditorial[id];
  return <section className={`detail-section case-implementation case-implementation--${id}`}>
    <div className="detail-section__heading"><p className="mono-label">ENGINEERING / {editorial.context}</p><h2>{editorial.implementation}</h2></div>
    <div className="engineering-ledger">{entries.map(([title, text, evidence], index) => <article key={title}><div className="engineering-ledger__title"><span className="mono-label">{id === "pharmagent" ? ["数据层", "模型层", "编排层"][index] : id === "xuanji" ? ["入口", "支撑", "输出"][index] : id === "sso-platform" ? ["身份", "安全", "部署"][index] : id === "v2t" ? ["分段", "任务", "摘要"][index] : ["判定", "掩码", "后端"][index]}</span><h3>{title}</h3></div><p>{text}</p><small>{evidence}</small></article>)}</div>
  </section>;
}

export function TranslationImplementation() {
  return <section className="detail-section case-story case-story--translation-layers">
    <StoryHeading label="INTEGRATION / 工作流与贡献" title="文档处理与服务联通，分开看">完整项目解决从论文到译文的处理问题；个人可见贡献集中在检索服务的转发与联调。两者关联，但有不同的实现归属。</StoryHeading>
    <div className="translation-layers"><article><p className="mono-label">合作项目的处理层</p><h3>保留论文结构，再生成译文</h3><ul><li><strong>解析：</strong>MinerU、PDF 转图与 OCR 组织页面和文本。</li><li><strong>翻译：</strong>初稿、结构化反思与修订构成两阶段工作流。</li><li><strong>配置：</strong>解析、术语与参考例句能力可独立开关。</li></ul><small>依据：server.py、workflow/、prompts/ 与公开 README</small></article><article><p className="mono-label">zx6831 的可见贡献</p><h3>让参考例句服务接入处理链</h3><div className="relay-route"><span>服务端 :8010</span><ArrowUpRight size={18}/><span>检索服务 :8031</span></div><p>转发层复用 HTTP 会话，处理 JSON、表单与文件上传；多个检索 / 任务端点通过脚本检查联通性。</p><small>依据：server.py、forward_test.py 与公开提交记录</small></article></div>
  </section>;
}

export function FamilyImplementation() {
  return <section className="detail-section case-story case-story--family-responsibility">
    <StoryHeading label="FAMILY / 角色与业务约束" title="不同的界面职责，同一个家庭边界">双角色设计不止改变导航。谁制定计划、谁确认任务、谁能写入家庭记录，都需要同时落到界面和服务端约束上。</StoryHeading>
    <div className="family-lanes">
      <article><span className="mono-label">子女端 · 配置与关注</span><h3>制定计划，理解进度</h3><p>创建计划、查看历史与完成情况，发起关怀话题。</p><small>Flutter 角色导航与计划页面</small></article>
      <article className="family-lanes__authority"><span className="mono-label">FAMILY · 业务权威</span><h3>同一家庭的任务与记录</h3><p>成员角色、家庭关系、计划与任务由 NestJS / Prisma 建模；查询和写入遵循家庭授权。</p><small>家庭授权 · 时区 · 幂等记录</small></article>
      <article><span className="mono-label">长辈端 · 接收与确认</span><h3>少步骤完成每日任务</h3><p>接收计划、完成记录与参与关怀互动，保持可访问的操作路径。</p><small>响应式、大字号与视觉回归用例</small></article>
    </div>
    <div className="family-contract"><ShieldAlert size={22}/><div><h3>身份与会话是协作的前提</h3><p>后端处理访问令牌、刷新令牌轮换、退出与角色鉴权；提醒接口与适配器分离，让本地调试和真实服务接入各有边界。</p><small>依据：auth/、prisma/schema.prisma、plans/、health/、integrations/</small></div></div>
  </section>;
}