# 项目结构审计

日期：2026-06-29

## 当前结论

项目已经整理为 Vite + React + TypeScript + Tailwind + shadcn 路径约定的个人作品集。原先未接入的 Aurora 背景组件现在已经成为页面主背景容器，新增的 Liquid Glass 按钮组件统一了承载交互的按钮、导航和链接材质。`components.json`、`components/ui/*`、`lib/utils.ts` 与 `@/*` 别名形成有效链路。

当前运行入口：

```text
index.html
  -> src/main.tsx
      -> src/App.tsx
          -> components/ui/aurora-background.tsx
          -> components/ui/liquid-glass-button.tsx
          -> lib/utils.ts
      -> src/index.css
```

## 核心文件

| 路径 | 作用 | 判断 |
| --- | --- | --- |
| `package.json` | 定义 Vite、React、Tailwind、Framer Motion、Lucide 等依赖与脚本 | 核心 |
| `package-lock.json` | 锁定依赖版本 | 核心 |
| `index.html` | Vite HTML 入口、页面标题与描述 | 核心 |
| `src/main.tsx` | React 渲染入口 | 核心 |
| `src/App.tsx` | 页面结构、内容、主题切换、滚动 reveal、Aurora 指针响应 | 核心 |
| `src/index.css` | 视觉 token、Aurora 光场、玻璃材质、响应式与动效 | 核心 |
| `components/ui/aurora-background.tsx` | shadcn 路径下的可复用 Aurora 背景容器 | 核心 |
| `components/ui/liquid-glass-button.tsx` | 本地 Liquid Glass 交互组件，用于导航、CTA、主题按钮和联系入口 | 核心 |
| `lib/utils.ts` | shadcn 风格 `cn()` 工具，被 Aurora 组件使用 | 核心 |
| `components.json` | shadcn/ui 配置，记录组件、utils、ui、lib 别名 | 核心 |
| `vite.config.ts` | Vite React 插件、相对 `base`、`@` 别名 | 核心 |
| `tailwind.config.js` | Tailwind 扫描范围、暗色模式、Aurora 动画配置 | 核心 |
| `postcss.config.js` | Tailwind/PostCSS 构建接入 | 核心 |
| `tsconfig.json` | TypeScript 编译配置与 `@/*` 路径映射 | 核心 |
| `tsconfig.node.json` | Vite/Node 侧 TypeScript 配置 | 核心 |
| `.gitignore` | 排除依赖、构建产物、日志与本地环境文件 | 核心 |

## 当前页面结构

1. Sticky glass header
   - 品牌标识 `Lin Studio`
   - Projects / Profile / Contact 锚点导航
   - 明暗主题切换
2. Hero
   - 大号中文 display headline
   - 简短定位文案
   - 查看作品与邮件联系入口
   - Aurora 光场中的 optical stage 和 hero lens
3. Intro strip
   - 一句设计观点，作为首屏和作品区的过渡
4. Selected projects
   - 三张玻璃项目卡片
   - 每张卡片包含抽象 plate、类型、标题、说明
5. Profile
   - 工作方式说明
   - 四个能力标签
6. Contact
   - 邮件、GitHub、LinkedIn
7. Footer
   - 动态年份与一句收束文案

## 已清理内容

这些内容已从项目中删除，不再作为源码维护：

| 路径 | 删除原因 |
| --- | --- |
| `script.js` | 旧静态实现脚本，React 入口已替代 |
| `style.css` | 旧静态实现样式，`src/index.css` 已替代 |
| `prompt.txt` | 旧生成提示，不参与运行 |
| `prompt/` | 旧提示资料目录，不参与运行 |
| `src/components/AuroraBackgroundDemo.tsx` | 示例组件已无必要，Aurora 已直接融入正式页面 |
| `dist/` | 构建产物，可由 `npm.cmd run build` 再生成 |
| `vite-dev.out.log` / `vite-dev.err.log` | 临时启动日志 |
| `qa-screenshots/` | 临时浏览器验证文件与截图 |

## 设计集成判断

这次没有把 Aurora 当作整页装饰层堆满，而是把它定义成“光学工作台”的页面材料，并把交互控件统一成 liquid glass。后续性能优化做了材质分层，避免滚动时所有元素都使用真实高成本滤镜：

- Aurora 背景作为最底层光场，响应指针位置。
- Hero 右侧的 `optical-stage` 是首屏记忆点。
- Project cards 继承同一玻璃材质，但降低复杂度，避免所有区域都抢注意力。
- 导航、主题按钮、CTA、联系入口使用同一个 `LiquidGlassButton`，具备内折射层、内阴影、hover 高光和 active 压感。
- Intro strip、项目卡片、能力标签、Contact card 都补齐同源的液态玻璃表面。
- 明暗主题复用同一结构，只切换材质亮度、文字对比和 Aurora 强度。
- `prefers-reduced-motion` 下会压低动效，避免不可控运动。
- 指针响应不再进入 React state，而是通过 `requestAnimationFrame` 直接写 CSS 变量，避免鼠标移动导致整页重渲染。
- SVG displacement filter 已从滚动区移除，大面积面板改为轻量 blur、渐变、内阴影模拟。
- 移动端关闭大面积 `backdrop-filter` 和 Aurora 动画，保留静态 liquid glass 观感。

## 验证记录

- `npm.cmd run build` 通过，包含 TypeScript 检查和 Vite 生产构建。
- 使用 Chrome DevTools 对构建产物生成的 QA 页面做了快照检查，确认导航、主题按钮、Hero、Projects、Profile、Contact 都正常挂载。
- 视觉截图检查覆盖了亮色首屏、暗色首屏、移动首屏与作品卡片区域；修正了移动端主题按钮因旧 `span` 隐藏规则导致材质层消失的问题。
- 浏览器控制台检查无运行时错误。
- 性能优化后再次运行 `npm.cmd run build` 通过。后续一次 DevTools 截图复查被当前环境审批器拦截，未继续绕过。

## 后续建议

1. 把 `hello@example.com`、GitHub、LinkedIn 替换成真实信息。
2. 将三张项目卡片替换为真实作品，并补充真实链接或详情页。
3. 若要继续加强 shadcn/ui 体系，可下一步抽出 `Button`、`ProjectCard`、`GlassPanel` 等本地组件。
