"""Exercise the project evidence image viewer against the local Vite server.

Start Vite on http://127.0.0.1:5173 before running this script.
"""

from playwright.sync_api import sync_playwright


def check_viewer(browser, browser_name: str, width: int, height: int) -> None:
    context = browser.new_context(
        viewport={"width": width, "height": height},
        is_mobile=width < 600,
        has_touch=width < 600,
        reduced_motion="no-preference",
    )
    page = context.new_page()
    errors: list[str] = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto("http://127.0.0.1:5173/?project=pharmagent", wait_until="domcontentloaded")
    page.wait_for_function("document.documentElement.dataset.fontStatus !== 'loading'")
    trigger = page.locator(".source-figure__asset").first
    trigger.wait_for()
    trigger.scroll_into_view_if_needed()
    page.wait_for_timeout(600)
    page.evaluate("""() => {
      window.figureTransitions = [];
      if (!document.startViewTransition) return;
      const original = document.startViewTransition.bind(document);
      const names = () => [...document.querySelectorAll(".source-figure__asset img, .source-image-dialog__stage img")]
        .filter(element => getComputedStyle(element).viewTransitionName === "figure-image")
        .map(element => element.closest(".source-image-dialog") ? "dialog" : "thumbnail");
      document.startViewTransition = update => {
        const record = { before: names(), after: [] };
        window.figureTransitions.push(record);
        return original(() => {
          update();
          record.after = names();
        });
      };
    }""")
    trigger.evaluate("element => element.addEventListener('click', () => { window.figureClickScroll = scrollY; }, { capture: true, once: true })")
    trigger.click()
    original_scroll = page.evaluate("window.figureClickScroll")
    dialog = page.locator(".source-image-dialog")
    page.wait_for_function("document.querySelector('.source-image-dialog')?.open")
    assert dialog.locator("img").get_attribute("src") == "/project-evidence/pharmagent-system-architecture.png"
    assert dialog.get_attribute("aria-label") == "项目图片浏览器"
    assert dialog.locator(".source-image-dialog__close").evaluate("(element) => element === document.activeElement")
    if page.evaluate("Boolean(document.startViewTransition)"):
        first = page.evaluate("window.figureTransitions[0]")
        assert first == {"before": ["thumbnail"], "after": ["dialog"]}, (browser_name, width, first)
        page.wait_for_function("!document.documentElement.classList.contains('figure-view-transition')")
    if width < 600:
        stage = dialog.locator(".source-image-dialog__stage")
        box = stage.bounding_box()
        assert box is not None
        mid_y = box["y"] + box["height"] / 2
        page.mouse.move(box["x"] + box["width"] * 0.75, mid_y)
        page.mouse.down()
        page.mouse.move(box["x"] + box["width"] * 0.25, mid_y, steps=8)
        page.mouse.up()
        assert dialog.locator("img").get_attribute("src") == "/project-evidence/pharmagent-fastgpt-workflow.png"
        dialog.get_by_role("button", name="上一张图片").click()
    dialog.get_by_role("button", name="下一张图片").click()
    assert dialog.locator("img").get_attribute("src") == "/project-evidence/pharmagent-fastgpt-workflow.png"
    dialog.get_by_role("button", name="放大图片").click()
    assert dialog.get_by_text("150%").count() == 1
    dialog.get_by_role("button", name="缩小图片").click()
    assert dialog.get_by_text("100%").count() == 1
    if width < 600:
        box = dialog.locator(".source-image-dialog__stage").bounding_box()
        assert box is not None
        x, y = box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
        page.touchscreen.tap(x, y)
        page.touchscreen.tap(x, y)
        assert dialog.get_by_text("250%").count() == 1
        page.wait_for_timeout(450)
        page.touchscreen.tap(x, y)
        page.touchscreen.tap(x, y)
        assert dialog.get_by_text("100%").count() == 1
        if browser_name == "chromium":
            cdp = context.new_cdp_session(page)
            mid_y = int(y)
            cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": 150, "y": mid_y, "id": 1}, {"x": 240, "y": mid_y, "id": 2}]})
            cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": 110, "y": mid_y, "id": 1}, {"x": 280, "y": mid_y, "id": 2}]})
            cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
            assert int(dialog.locator(".source-image-dialog__tools span").inner_text().rstrip("%")) > 150
            dialog.get_by_role("button", name="缩小图片").click()
            dialog.get_by_role("button", name="缩小图片").click()
            assert dialog.get_by_text("100%").count() == 1
    dialog.press("ArrowLeft")
    assert dialog.locator("img").get_attribute("src") == "/project-evidence/pharmagent-system-architecture.png"
    assert dialog.get_by_role("link", name="打开原图").get_attribute("target") == "_blank"
    before_close_scroll = page.evaluate("scrollY")
    visual_scale = page.evaluate("visualViewport.scale")
    dialog.get_by_role("button", name="关闭图片浏览器").click()
    page.wait_for_function("!document.querySelector('.source-image-dialog').open")
    if page.evaluate("Boolean(document.startViewTransition)"):
        second = page.evaluate("window.figureTransitions[1]")
        assert second == {"before": ["dialog"], "after": ["thumbnail"]}, (browser_name, width, second)
        page.wait_for_function("!document.documentElement.classList.contains('figure-view-transition')")
    assert trigger.evaluate("(element) => element === document.activeElement")
    final_scroll = page.evaluate("scrollY")
    assert abs(final_scroll - original_scroll) <= 2, (browser_name, width, original_scroll, before_close_scroll, final_scroll, visual_scale)
    assert page.evaluate("document.body.style.overflow") == ""

    trigger.click()
    page.wait_for_function("document.querySelector('.source-image-dialog')?.open")
    page.wait_for_function("!document.documentElement.classList.contains('figure-view-transition')")
    page.keyboard.press("Escape")
    page.wait_for_function("!document.querySelector('.source-image-dialog').open")
    assert trigger.evaluate("(element) => element === document.activeElement")
    page.evaluate("document.startViewTransition = undefined")
    trigger.click()
    assert dialog.evaluate("(element) => element.open")
    assert not page.evaluate("document.documentElement.classList.contains('figure-view-transition')")
    dialog.get_by_role("button", name="关闭图片浏览器").click()
    assert not dialog.evaluate("(element) => element.open")
    assert not errors, (browser_name, width, errors)
    context.close()
    print(f"{browser_name} {width}x{height}: viewer, shared transition, navigation, zoom, focus, Escape passed", flush=True)


def check_reduced_motion(browser) -> None:
    context = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, reduced_motion="reduce")
    page = context.new_page()
    page.goto("http://127.0.0.1:5173/?project=pharmagent", wait_until="domcontentloaded")
    trigger = page.locator(".source-figure__asset").first
    trigger.click()
    assert page.locator(".source-image-dialog").evaluate("(element) => element.open")
    assert not page.evaluate("document.documentElement.classList.contains('figure-view-transition')")
    page.locator(".source-image-dialog__close").click()
    assert not page.locator(".source-image-dialog").evaluate("(element) => element.open")
    context.close()
    print("Chromium reduced motion: immediate open and close passed", flush=True)


def check_other_galleries(browser) -> None:
    context = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = context.new_page()
    for project in ("scholarweaver", "fubao"):
        page.goto(f"http://127.0.0.1:5173/?project={project}", wait_until="domcontentloaded")
        images = page.locator(".source-figure__asset")
        assert images.count() == 2, project
        images.last.click()
        dialog = page.locator(".source-image-dialog")
        page.wait_for_function("document.querySelector('.source-image-dialog')?.open")
        assert dialog.locator("img").get_attribute("src").startswith(f"/project-evidence/{project}-")
        page.wait_for_function("!document.documentElement.classList.contains('figure-view-transition')")
        dialog.get_by_role("button", name="关闭图片浏览器").click()
        page.wait_for_function("!document.querySelector('.source-image-dialog').open")
    context.close()
    print("Chromium mobile: ScholarWeaver and Fubao galleries passed", flush=True)


with sync_playwright() as playwright:
    for browser_name in ("chromium", "webkit"):
        browser = getattr(playwright, browser_name).launch()
        for size in ((1440, 900), (390, 844)):
            check_viewer(browser, browser_name, *size)
        if browser_name == "chromium":
            check_reduced_motion(browser)
            check_other_galleries(browser)
        browser.close()
