"""Verify the theme reveal geometry and fallbacks against the local Vite server.

Start Vite on http://127.0.0.1:5173 before running this script.
"""

import math
import re

from playwright.sync_api import sync_playwright


def check_reveal(browser, browser_name: str, width: int, height: int) -> None:
    context = browser.new_context(
        viewport={"width": width, "height": height},
        is_mobile=width < 600,
        has_touch=width < 600,
        color_scheme="light",
    )
    page = context.new_page()
    errors: list[str] = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.add_init_script("""(() => {
      window.themeRevealAnimations = [];
      const original = Element.prototype.animate;
      Element.prototype.animate = function (frames, options) {
        if (options?.pseudoElement === '::view-transition-new(root)') {
          window.themeRevealAnimations.push({ frames, options });
        }
        return original.call(this, frames, options);
      };
    })();""")
    page.goto("http://127.0.0.1:5173/", wait_until="domcontentloaded")
    page.wait_for_function("document.documentElement.classList.contains('app-ready')")
    button = page.locator(".site-theme-toggle")
    button.evaluate("element => element.addEventListener('click', () => { window.themeToggleBounds = element.getBoundingClientRect().toJSON(); }, { capture: true })")
    button.click()
    bounds = page.evaluate("window.themeToggleBounds")
    x = bounds["left"] + bounds["width"] / 2
    y = bounds["top"] + bounds["height"] / 2
    expected_radius = max(
        math.hypot(cx - x, cy - y)
        for cx, cy in ((0, 0), (width, 0), (0, height), (width, height))
    )

    page.wait_for_function("window.themeRevealAnimations.length === 1", timeout=5000)
    animation = page.evaluate("window.themeRevealAnimations[0]")
    start, end = animation["frames"]["clipPath"]
    start_match = re.fullmatch(r"circle\(0px at ([\d.]+)px ([\d.]+)px\)", start)
    assert start_match is not None, (browser_name, width, start)
    start_x, start_y = map(float, start_match.groups())
    assert math.isclose(start_x, x, abs_tol=0.01) and math.isclose(start_y, y, abs_tol=0.01)
    match = re.fullmatch(r"circle\(([\d.]+)px at ([\d.]+)px ([\d.]+)px\)", end)
    assert match is not None, (browser_name, width, end)
    radius, end_x, end_y = map(float, match.groups())
    assert math.isclose(radius, expected_radius, abs_tol=0.01), (browser_name, width, radius, expected_radius)
    assert math.isclose(end_x, x, abs_tol=0.01) and math.isclose(end_y, y, abs_tol=0.01)
    assert animation["options"]["duration"] == 680
    page.wait_for_timeout(100)
    active_clip = page.evaluate("getComputedStyle(document.documentElement, '::view-transition-new(root)').clipPath")
    assert active_clip.startswith("circle("), (browser_name, width, active_clip)
    assert page.evaluate("document.documentElement.classList.contains('dark')")
    page.wait_for_function("!document.documentElement.classList.contains('theme-reveal-transition')")
    assert page.evaluate("localStorage.getItem('theme-preference-v2')") == "dark"

    button.click()
    page.wait_for_function("window.themeRevealAnimations.length === 2", timeout=5000)
    page.wait_for_function("!document.documentElement.classList.contains('theme-reveal-transition')")
    assert not page.evaluate("document.documentElement.classList.contains('dark')")

    page.evaluate("Object.defineProperty(document, 'startViewTransition', { value: undefined, configurable: true })")
    button.click()
    page.wait_for_function("document.documentElement.classList.contains('dark')")
    assert len(page.evaluate("window.themeRevealAnimations")) == 2
    assert not page.evaluate("document.documentElement.classList.contains('theme-reveal-transition')")
    assert not errors, (browser_name, width, errors)
    print(f"{browser_name} {width}x{height}: center=({x:.1f},{y:.1f}), radius={expected_radius:.1f}px", flush=True)
    context.close()


def check_reduced_motion(browser, browser_name: str) -> None:
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        color_scheme="light",
        reduced_motion="reduce",
    )
    page = context.new_page()
    page.goto("http://127.0.0.1:5173/", wait_until="domcontentloaded")
    page.wait_for_function("document.documentElement.classList.contains('app-ready')")
    page.locator(".site-theme-toggle").click()
    page.wait_for_function("document.documentElement.classList.contains('dark')")
    assert not page.evaluate("document.documentElement.classList.contains('theme-reveal-transition')")
    context.close()
    print(f"{browser_name} reduced motion: immediate switch", flush=True)


with sync_playwright() as playwright:
    for name in ("chromium", "webkit"):
        browser = getattr(playwright, name).launch(headless=True)
        for viewport in ((390, 844), (1440, 900)):
            check_reveal(browser, name, *viewport)
        check_reduced_motion(browser, name)
        browser.close()
