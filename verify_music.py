import time
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})

    # Mock fonts API to prevent waiting
    page.add_init_script("""
        Object.defineProperty(document, 'fonts', {
            get: function() { return { ready: Promise.resolve(), status: 'loaded', check: () => true, add: () => {}, delete: () => {}, clear: () => {} }; }
        });
    """)

    def route_handler(route):
        if route.request.resource_type in ["font", "image", "media"]:
            route.abort()
        elif "cdn.jsdelivr.net" in route.request.url or "fonts.googleapis.com" in route.request.url or "cdnjs.cloudflare.com" in route.request.url:
            route.abort()
        else:
            route.continue_()

    page.route("**/*", route_handler)

    try:
        page.goto("http://localhost:3000/index.html", wait_until="domcontentloaded", timeout=10000)

        # Wait for dock
        page.wait_for_selector(".dock", timeout=5000)

        # Click music
        page.click("#dockMusic")

        # Wait for window
        page.wait_for_selector("#musicWin:not(.is-hidden)", timeout=5000)

        time.sleep(2)

        page.screenshot(path="verification_music.png", animations="disabled", caret="hide")
        print("Screenshot taken successfully")

    except Exception as e:
        print(f"Error: {e}")
        try:
            page.screenshot(path="verification_error.png")
        except:
            pass

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
