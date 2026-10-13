"""Check mobile section navigation and stale About JSON without a page crash.

Run with: python scripts/check-webkit-navigation.py --browser webkit --target work --stale-about
"""

import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--browser", choices=["webkit", "chromium"], default="webkit")
    parser.add_argument("--target", choices=["work", "skills", "awards", "about"], default="work")
    parser.add_argument("--delay", type=int, default=4000)
    parser.add_argument("--reduced-motion", action="store_true")
    parser.add_argument("--mode", choices=["click", "scroll", "direct"], default="click")
    parser.add_argument("--stale-about", action="store_true")
    args = parser.parse_args()

    with sync_playwright() as playwright:
        browser = getattr(playwright, args.browser).launch(headless=True)
        context = browser.new_context(
            viewport={"width": 402, "height": 874},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
            reduced_motion="reduce" if args.reduced_motion else "no-preference",
        )
        context.add_init_script(
            """(() => {
              const delay = __DELAY__;
              const originalFetch = window.fetch.bind(window);
              window.fetch = (...args) => {
                const input = args[0];
                const url = typeof input === 'string' ? input : input.url;
                if (!url.includes('/data/home-')) return originalFetch(...args);
                return new Promise(resolve => setTimeout(resolve, delay))
                  .then(() => originalFetch(...args));
              };
            })();""".replace("__DELAY__", str(args.delay)),
        )
        page = context.new_page()
        errors: list[str] = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        if args.stale_about:
            old_about = (Path(__file__).parent / "fixtures" / "home-about-old.json").read_text(encoding="utf-8")
            page.route(
                "**/data/home-about.json*",
                lambda route: route.fulfill(status=200, content_type="application/json", body=old_about),
            )
        suffix = f"#{args.target}" if args.mode == "direct" else ""
        page.goto(f"http://127.0.0.1:5173/{suffix}", wait_until="domcontentloaded")
        if args.mode == "click":
            page.wait_for_function("document.documentElement.classList.contains('app-ready')", timeout=12000)
            bounds = page.locator(f'a[href="#{args.target}"]').first.bounding_box()
            if bounds is None:
                raise AssertionError(f"Navigation link #{args.target} has no visible bounds")
            page.touchscreen.tap(bounds["x"] + bounds["width"] / 2, bounds["y"] + bounds["height"] / 2)
        elif args.mode == "scroll":
            page.wait_for_timeout(6500 + args.delay)
            target_y = page.locator(f"#{args.target}").evaluate(
                "element => element.getBoundingClientRect().top + scrollY"
            )
            while page.evaluate("scrollY") < target_y - 200:
                page.evaluate("window.scrollBy({top: 500, behavior: 'instant'})")
                page.wait_for_timeout(120)

        for elapsed in (650, 4500, 10000):
            page.wait_for_timeout(elapsed - (0 if elapsed == 650 else previous))
            previous = elapsed
            state = page.evaluate(
                """() => {
                  const onscreen = element => {
                    const rect = element.getBoundingClientRect();
                    const style = getComputedStyle(element);
                    return rect.bottom > 0 && rect.top < innerHeight &&
                      rect.right > 0 && rect.left < innerWidth &&
                      style.display !== 'none' && style.visibility !== 'hidden' &&
                      Number(style.opacity) > 0.05;
                  };
                  const content = [...document.querySelectorAll('main h1, main h2, main h3, main p, main .case-row')]
                    .filter(element => onscreen(element) && element.innerText.trim().length > 0);
                  const skeletons = [...document.querySelectorAll('#boot-skeleton, main .section-resource__skeleton')]
                    .filter(onscreen);
                  const target = document.getElementById(location.hash.slice(1));
                  const stage = document.querySelector('.aurora-background');
                  const navigation = document.querySelector('.site-top-controls');
                  return {
                    hash: location.hash,
                    scrollY: Math.round(scrollY),
                    stageScrollTop: stage && Math.round(stage.scrollTop),
                    stageTop: stage && Math.round(stage.getBoundingClientRect().top),
                    targetTop: target && Math.round(target.getBoundingClientRect().top),
                    visibleContent: content.length,
                    visibleSkeletons: skeletons.length,
                    resourceErrors: document.querySelectorAll('.section-resource__error').length,
                    navTop: navigation && Math.round(navigation.getBoundingClientRect().top),
                    navVisibility: navigation && getComputedStyle(navigation).visibility,
                    rootVisibility: getComputedStyle(document.getElementById('root')).visibility,
                    classes: document.documentElement.className,
                    documentHeight: document.documentElement.scrollHeight
                  };
                }"""
            )
            print(json.dumps({"browser": args.browser, "target": args.target, "ms": elapsed, **state, "errors": errors}, ensure_ascii=False))
            if not state["navVisibility"] or errors:
                screenshot = Path.cwd() / f"debug-{args.browser}-{args.target}-{elapsed}.png"
                page.screenshot(path=str(screenshot))
                raise AssertionError(f"APP_CRASH at {elapsed}ms; screenshot: {screenshot}")

        if args.mode == "click" and state["hash"] != f"#{args.target}":
            raise AssertionError(f"Navigation did not update hash to #{args.target}")
        if args.stale_about and state["resourceErrors"] == 0:
            raise AssertionError("Stale About payload was not rejected")
        if not args.stale_about and state["resourceErrors"]:
            raise AssertionError("Fresh data unexpectedly entered a resource error state")
        if args.mode == "click" and (state["targetTop"] is None or not 0 <= state["targetTop"] <= 874):
            raise AssertionError(f"Navigation target is outside the viewport: {state['targetTop']}")

        browser.close()


if __name__ == "__main__":
    main()
