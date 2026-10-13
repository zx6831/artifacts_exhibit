"""Check system theme, hero navigation, and the visible project count.

Start Vite on http://127.0.0.1:5173 before running this script.
"""

from playwright.sync_api import sync_playwright


def check_browser(playwright, browser_name: str) -> None:
    browser = getattr(playwright, browser_name).launch(headless=True)
    for scheme in ("light", "dark"):
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
            color_scheme=scheme,
        )
        if scheme == "light":
            context.add_init_script("localStorage.setItem('theme', 'dark')")
        page = context.new_page()
        errors: list[str] = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto("http://127.0.0.1:5173/", wait_until="domcontentloaded")
        page.wait_for_function("document.documentElement.classList.contains('app-ready')", timeout=15000)

        initial_dark = page.evaluate("document.documentElement.classList.contains('dark')")
        assert initial_dark == (scheme == "dark"), (browser_name, scheme, "initial theme")

        page.locator("#proof").scroll_into_view_if_needed()
        page.wait_for_function(
            "document.querySelector('#proof .section-resource__content strong')?.textContent === '07'",
            timeout=12000,
        )
        summary = page.locator("#proof .section-resource__content").inner_text()
        page.locator("#work").scroll_into_view_if_needed()
        page.wait_for_function(
            "document.querySelectorAll('#work .case-row:not(.case-row--skeleton)').length === 7",
            timeout=12000,
        )
        assert "当前作品集" in summary and "个面向真实场景的应用项目" in summary

        page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
        page.locator('.hero-actions a[href="#about"]').evaluate("element => element.click()")
        page.wait_for_function(
            "location.hash === '#about' && document.querySelector('.tubelight-nav-link[href=\"/#about\"]')?.classList.contains('is-active')",
            timeout=10000,
        )
        page.wait_for_timeout(2200)
        about_bounds = page.locator("#about").bounding_box()
        assert about_bounds is not None and 0 <= about_bounds["y"] <= 844, (browser_name, scheme, about_bounds)
        lamp_offset = page.evaluate("""() => {
            const link = document.querySelector('.tubelight-nav-link[href="/#about"]');
            const lamp = document.querySelector('.tubelight-nav-lamp');
            return Math.abs(parseFloat(lamp.style.getPropertyValue('--nav-lamp-x')) - link.offsetLeft);
        }""")
        assert lamp_offset <= 1, (browser_name, scheme, "lamp offset", lamp_offset)
        assert not errors, (browser_name, scheme, errors)

        if scheme == "light":
            page.emulate_media(color_scheme="dark")
            page.wait_for_function("document.documentElement.classList.contains('dark')")
            page.locator(".site-theme-toggle").evaluate("element => element.click()")
            page.wait_for_function("!document.documentElement.classList.contains('dark')")
            assert page.evaluate("localStorage.getItem('theme-preference-v2')") == "light"
            page.reload(wait_until="domcontentloaded")
            page.wait_for_function("document.documentElement.classList.contains('app-ready')", timeout=15000)
            assert not page.evaluate("document.documentElement.classList.contains('dark')")

        print(f"{browser_name} {scheme}: 7 projects, About active at {about_bounds['y']:.0f}px, no page errors", flush=True)
        context.close()
    browser.close()


with sync_playwright() as playwright:
    for name in ("chromium", "webkit"):
        check_browser(playwright, name)
