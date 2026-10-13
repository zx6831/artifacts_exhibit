"""Check the browser-controlled underlay during the circular theme reveal.

Run Vite at http://127.0.0.1:5173 first. WebKit here emulates the web page,
not iPhone Safari's translucent native toolbar.
"""

import math
import re

from playwright.sync_api import sync_playwright


def state(page):
    return page.evaluate("""() => ({
      canvas: getComputedStyle(document.body).backgroundColor,
      themeColor: document.querySelector('meta[name="theme-color"]')?.content,
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
      clip: getComputedStyle(document.documentElement, '::view-transition-new(root)').clipPath,
      rootImage: getComputedStyle(document.documentElement).backgroundImage,
      bodyImage: getComputedStyle(document.body).backgroundImage,
      canvasRadius: getComputedStyle(document.documentElement).getPropertyValue('--theme-canvas-radius').trim(),
      canvasY: getComputedStyle(document.documentElement).getPropertyValue('--theme-canvas-y').trim(),
      scrollY: window.scrollY,
      transitioning: document.documentElement.classList.contains('theme-reveal-transition'),
    })""")


with sync_playwright() as playwright:
    browser = playwright.webkit.launch(headless=True)
    failures = []
    for starting_theme in ("light", "dark"):
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
            has_touch=True,
            color_scheme=starting_theme,
        )
        page = context.new_page()
        page.goto("http://127.0.0.1:5173/", wait_until="domcontentloaded")
        page.wait_for_function("document.documentElement.classList.contains('app-ready')")
        if starting_theme == "dark":
            page.locator("#work").scroll_into_view_if_needed()
        old = state(page)
        page.locator(".site-theme-toggle").click()
        page.wait_for_function("""() => {
          const clip = getComputedStyle(document.documentElement, '::view-transition-new(root)').clipPath;
          return document.documentElement.classList.contains('theme-reveal-transition') && clip.startsWith('circle(');
        }""")
        during = state(page)
        radius_match = re.search(r"circle\(([\d.]+)px at ([\d.]+)px ([\d.]+)px", during["clip"])
        assert radius_match is not None, during
        radius, _, origin_y = map(float, radius_match.groups())
        assert radius < 844 - origin_y, (starting_theme, "circle has already reached the bottom", radius)
        print(f"{starting_theme} -> {'dark' if starting_theme == 'light' else 'light'}: old browser underlay retained at radius {radius:.1f}px", flush=True)
        for key in ("canvas", "themeColor", "colorScheme"):
            if during[key] != old[key]:
                failures.append(f"{starting_theme}: {key} changed before bottom coverage")
        assert during["rootImage"].startswith("radial-gradient(")
        assert during["bodyImage"].startswith("radial-gradient(")
        assert abs(float(during["canvasY"].removesuffix("px")) - (origin_y + during["scrollY"])) < 2
        page.wait_for_timeout(180)
        mid = state(page)
        mid_match = re.search(r"circle\(([\d.]+)px", mid["clip"])
        assert mid_match is not None, mid
        mid_clip_radius = float(mid_match.group(1))
        mid_canvas_radius = float(mid["canvasRadius"].removesuffix("px"))
        print(f"{starting_theme} mid: page circle={mid_clip_radius:.1f}px, canvas circle={mid_canvas_radius:.1f}px", flush=True)
        assert 0 < mid_canvas_radius < 900, (starting_theme, mid)
        assert abs(mid_canvas_radius - mid_clip_radius) < 3, (starting_theme, mid_canvas_radius, mid_clip_radius)
        assert mid["canvas"] == old["canvas"] and mid["themeColor"] == old["themeColor"]
        page.wait_for_function("!document.documentElement.classList.contains('theme-reveal-transition')")
        after = state(page)
        assert after["canvas"] != old["canvas"]
        assert after["themeColor"] != old["themeColor"]
        assert after["colorScheme"] != old["colorScheme"]
        context.close()

    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        is_mobile=True,
        has_touch=True,
        color_scheme="light",
    )
    page = context.new_page()
    page.goto("http://127.0.0.1:5173/", wait_until="domcontentloaded")
    page.wait_for_function("document.documentElement.classList.contains('app-ready')")
    page.locator(".site-theme-toggle").evaluate("element => element.click()")
    page.wait_for_function("document.documentElement.classList.contains('theme-reveal-transition')")
    page.set_viewport_size({"width": 390, "height": 730})
    page.wait_for_function("!document.documentElement.classList.contains('theme-reveal-transition')", timeout=5000)
    resized = state(page)
    assert resized["canvas"] == "rgb(15, 20, 22)" and resized["rootImage"] == "none"
    assert resized["themeColor"] == "#10191b" and resized["colorScheme"] == "dark"
    assert resized["canvasY"] == ""
    print("viewport resize during reveal: final dark canvas and browser theme restored", flush=True)
    context.close()

    context = browser.new_context(
        viewport={"width": 390, "height": 730},
        is_mobile=True,
        has_touch=True,
        color_scheme="light",
    )
    page = context.new_page()
    page.add_init_script("""(() => {
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (frames, options) {
        const animation = animate.call(this, frames, options);
        if (options?.pseudoElement === '::view-transition-new(root)') window.themeClipAnimation = animation;
        return animation;
      };
    })();""")
    page.goto("http://127.0.0.1:5173/", wait_until="domcontentloaded")
    page.wait_for_function("document.documentElement.classList.contains('app-ready')")
    page.locator(".site-theme-toggle").evaluate("element => element.click()")
    page.wait_for_function("window.themeClipAnimation !== undefined")
    page.set_viewport_size({"width": 390, "height": 844})
    final_clip = page.evaluate("window.themeClipAnimation.effect.getKeyframes().at(-1).clipPath")
    final_match = re.search(r"circle\(([\d.]+)px at ([\d.]+)px ([\d.]+)px", final_clip)
    assert final_match is not None, final_clip
    final_radius, origin_x, origin_y = map(float, final_match.groups())
    expanded_farthest = max(
        math.hypot(cx - origin_x, cy - origin_y)
        for cx, cy in ((0, 0), (390, 0), (0, 844), (390, 844))
    )
    assert final_radius >= expanded_farthest - 1, (final_radius, expanded_farthest)
    page.wait_for_function("!document.documentElement.classList.contains('theme-reveal-transition')", timeout=5000)
    context.close()
    print("viewport expansion during reveal: radius still reaches the new bottom corners", flush=True)
    browser.close()
    assert not failures, failures
