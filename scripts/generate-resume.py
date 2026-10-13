from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "wang-zexian-resume.pdf"
FONT_REGULAR = Path(r"C:\Windows\Fonts\msyh.ttc")
FONT_BOLD = Path(r"C:\Windows\Fonts\msyhbd.ttc")

INK = HexColor("#142124")
MUTED = HexColor("#5c6b6c")
TEAL = HexColor("#2d8b83")
PALE = HexColor("#edf5f2")
LINE = HexColor("#cad8d3")
WHITE = HexColor("#f7fbf8")


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("ResumeCN", str(FONT_REGULAR)))
    pdfmetrics.registerFont(TTFont("ResumeCNBold", str(FONT_BOLD)))


def split_lines(text: str, max_width: float, font: str, size: float) -> list[str]:
    lines: list[str] = []
    current = ""
    for char in text:
        candidate = current + char
        if current and pdfmetrics.stringWidth(candidate, font, size) > max_width:
            lines.append(current.rstrip())
            current = char.lstrip()
        else:
            current = candidate
    if current:
        lines.append(current.rstrip())
    return lines


def draw_wrapped(c: canvas.Canvas, text: str, x: float, y: float, width: float,
                 font: str = "ResumeCN", size: float = 9.2, leading: float = 15,
                 color=MUTED) -> float:
    c.setFont(font, size)
    c.setFillColor(color)
    for line in split_lines(text, width, font, size):
        c.drawString(x, y, line)
        y -= leading
    return y


def section_title(c: canvas.Canvas, title: str, x: float, y: float, width: float) -> float:
    c.setFillColor(TEAL)
    c.setFont("ResumeCNBold", 10.3)
    c.drawString(x, y, title)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.7)
    c.line(x, y - 6, x + width, y - 6)
    return y - 22


def draw_bullet(c: canvas.Canvas, text: str, x: float, y: float, width: float,
                size: float = 8.7, leading: float = 13.5) -> float:
    c.setFillColor(TEAL)
    c.circle(x + 2.5, y + 3, 1.8, fill=1, stroke=0)
    return draw_wrapped(c, text, x + 10, y, width - 10, size=size, leading=leading)


def draw_project(c: canvas.Canvas, title: str, meta: str, text: str,
                 x: float, y: float, width: float) -> float:
    c.setFillColor(INK)
    c.setFont("ResumeCNBold", 10.2)
    c.drawString(x, y, title)
    c.setFillColor(TEAL)
    c.setFont("ResumeCN", 7.7)
    c.drawRightString(x + width, y + 1, meta)
    y -= 15
    y = draw_wrapped(c, text, x, y, width, size=8.55, leading=13.3)
    c.setStrokeColor(HexColor("#dce6e2"))
    c.line(x, y + 3, x + width, y + 3)
    return y - 10


def generate() -> None:
    register_fonts()
    width, height = A4
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("王泽贤 - 个人简历")
    c.setAuthor("王泽贤")
    c.setSubject("AI 应用工程、智能体系统与软件工程实习简历")

    c.setFillColor(WHITE)
    c.rect(0, 0, width, height, fill=1, stroke=0)
    c.setFillColor(INK)
    c.rect(0, height - 154, width, 154, fill=1, stroke=0)
    c.setFillColor(HexColor("#24383a"))
    c.circle(width - 72, height - 64, 82, fill=1, stroke=0)

    c.setFillColor(HexColor("#7fe0d1"))
    c.setFont("ResumeCN", 8.5)
    c.drawString(47, height - 42, "AI APPLICATIONS / AGENT SYSTEMS / SOFTWARE ENGINEERING")
    c.setFillColor(WHITE)
    c.setFont("ResumeCNBold", 30)
    c.drawString(45, height - 84, "王泽贤")
    c.setFont("ResumeCN", 12)
    c.setFillColor(HexColor("#dce9e5"))
    c.drawString(47, height - 108, "华南理工大学软件工程本科生 · 大模型应用工程实习")
    c.setFont("ResumeCN", 8.5)
    c.drawString(47, height - 132, "wzx6831@gmail.com  ·  github.com/zx6831  ·  206831.xyz")

    left_x = 47
    left_w = 158
    gutter = 27
    right_x = left_x + left_w + gutter
    right_w = width - right_x - 47
    content_top = height - 185

    left_y = section_title(c, "教育背景", left_x, content_top, left_w)
    c.setFillColor(INK)
    c.setFont("ResumeCNBold", 10)
    c.drawString(left_x, left_y, "华南理工大学软件学院")
    left_y -= 16
    left_y = draw_wrapped(c, "软件工程专业（工业软件卓越班）本科生", left_x, left_y, left_w, size=8.7, leading=13)
    left_y -= 11

    left_y = section_title(c, "研究兴趣", left_x, left_y, left_w)
    for item in ["大语言模型推理能力", "智能体系统", "专业领域中的可靠 AI 应用", "计算机体系结构"]:
        left_y = draw_bullet(c, item, left_x, left_y, left_w)
        left_y -= 3
    left_y -= 8

    left_y = section_title(c, "技术能力", left_x, left_y, left_w)
    for title, text in [
        ("语言", "Python · C++"),
        ("AI / 后端", "PyTorch · FastAPI · FastGPT"),
        ("工程", "Docker · Git · REST API"),
        ("系统", "Vivado · Verilator · RISC-V"),
    ]:
        c.setFillColor(INK)
        c.setFont("ResumeCNBold", 8.7)
        c.drawString(left_x, left_y, title)
        left_y -= 13
        left_y = draw_wrapped(c, text, left_x, left_y, left_w, size=8.2, leading=12)
        left_y -= 7
    left_y -= 4

    left_y = section_title(c, "竞赛与荣誉", left_x, left_y, left_w)
    awards = [
        "第十五届“挑战杯”中国大学生创业计划竞赛国家级三等奖",
        "第十九届“挑战杯”人工智能+挑战赛国赛决赛入围",
        "第八届中青杯全国大学生数学建模竞赛本科生组二等奖",
        "2026 全国大学生数学建模竞赛广东赛区三等奖",
        "2025 华南理工大学软件学院鼎甲杯三等奖",
    ]
    for item in awards:
        left_y = draw_bullet(c, item, left_x, left_y, left_w, size=8.0, leading=12.2)
        left_y -= 4

    right_y = section_title(c, "个人简介", right_x, content_top, right_w)
    profile = (
        "主要关注人工智能、大语言模型、智能体系统与计算机系统技术，具有跨领域的软件研发与科研实践经历。"
        "曾参与 AI 药物研发智能体、RISC-V 处理器设计及 AI4Finance 相关研究工作，涉及大模型应用开发、"
        "多源数据集成、智能体工作流、计算机体系结构及科研建模。"
    )
    right_y = draw_wrapped(c, profile, right_x, right_y, right_w, size=9.0, leading=15)
    right_y -= 12

    right_y = section_title(c, "代表项目", right_x, right_y, right_w)
    projects = [
        (
            "PharmAgent 智能药物发现与递送助手",
            "个人项目 · 国赛决赛入围",
            "团队唯一成员。独立负责系统设计、FastGPT 工作流、Python/FastAPI 插件、ChEMBL 与 openFDA 接入、知识构建和部署实施。",
        ),
        (
            "ScholarWeaver PDF Essay Translator",
            "团队项目 · 鼎甲杯三等奖",
            "负责参考翻译库的搭建与维护，完成语料梳理、分类入库、准确性核验和持续迭代；Dingjia RAG Toolkit 提供参考例句检索。",
        ),
        (
            "CAS 单点登录与 IAM 平台",
            "个人工程 · 公开源码",
            "实现 Apereo CAS 认证、IAM 数据边界、Redis 会话、HMAC 防重放、主从读写路径与 Docker Compose 部署拓扑。",
        ),
        (
            "主体保护式路人移除管线",
            "个人工程 · 公开源码",
            "实现主体/路人/不确定三态判定、保护优先掩码、可替换修补后端和批处理 CLI；轻量单元测试 12 项通过。",
        ),
        (
            "福豹：慢病共管家庭智能体",
            "跨端产品与系统设计",
            "围绕双角色家庭协作、Family 对象级权限、本地 OCR 数据边界与受控 AgentRun 生命周期构建 V1.4 产品和系统基线。",
        ),
    ]
    for title, meta, text in projects:
        right_y = draw_project(c, title, meta, text, right_x, right_y, right_w)

    right_y -= 1
    right_y = section_title(c, "其他研究与工程实践", right_x, right_y, right_w)
    for item in [
        "参与 RISC-V 处理器设计及计算机体系结构相关实践。",
        "参与 AI4Finance 相关研究与科研建模工作。",
        "V2T：构建长视频分段转写、SSE 任务进度与结果恢复链路，pytest 23 项通过。",
    ]:
        right_y = draw_bullet(c, item, right_x, right_y, right_w, size=8.35, leading=12.8)
        right_y -= 3

    c.setStrokeColor(LINE)
    c.line(47, 32, width - 47, 32)
    c.setFillColor(MUTED)
    c.setFont("ResumeCN", 7.3)
    c.drawString(47, 20, "公开版简历 · 项目详情、源码与证据边界见 206831.xyz")
    c.drawRightString(width - 47, 20, "更新于 2026-10")

    c.showPage()
    c.save()


if __name__ == "__main__":
    generate()
