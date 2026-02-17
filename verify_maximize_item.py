from playwright.sync_api import sync_playwright

def verify_item_and_maximize(page):
    # Block external requests to avoid timeouts
    page.route("**/*", lambda route: route.abort() if not route.request.url.startswith("http://127.0.0.1") and not route.request.url.startswith("http://localhost") else route.continue_())

    page.goto("http://127.0.0.1:3000/index.html", wait_until="domcontentloaded")

    # Wait for Finder to load (it's open by default)
    page.wait_for_selector("#finderWin")

    # Wait for the garlic bread item (button with class 'item')
    # The item text might be 'Recipe' or 'نان سیر پنیری'
    page.wait_for_selector(".item")

    # Take a screenshot of the Finder window initially
    page.locator("#finderWin").screenshot(path="finder_initial.png")
    print("Screenshot taken: finder_initial.png")

    # Check item dimensions
    item = page.locator(".item").first
    box = item.bounding_box()
    print(f"Item dimensions: {box['width']}x{box['height']}")

    # Try maximize button (green light)
    # The green light has class 'light max' and data-action='maximize'
    max_btn = page.locator("#finderWin .light.max")
    max_btn.click()

    # Wait for transition/animation
    page.wait_for_timeout(500)

    # Check if window is maximized
    finder_win = page.locator("#finderWin")
    classes = finder_win.get_attribute("class")

    if "is-maximized" in classes:
        print("✅ Maximize works: Window has 'is-maximized' class.")
        # Check dimensions roughly (should be near viewport size)
        win_box = finder_win.bounding_box()
        vp = page.viewport_size
        print(f"Window size: {win_box['width']}x{win_box['height']}, Viewport: {vp['width']}x{vp['height']}")
        if win_box['width'] > vp['width'] * 0.9 and win_box['height'] > vp['height'] * 0.8:
             print("✅ Window dimensions look maximized.")
        else:
             print("❌ Window dimensions do not look maximized.")
    else:
        print("❌ Maximize failed: Window does not have 'is-maximized' class.")

    # Screenshot maximized state
    page.screenshot(path="finder_maximized.png")

    # Restore (click again)
    max_btn.click()
    page.wait_for_timeout(500)
    classes_restored = finder_win.get_attribute("class")
    if "is-maximized" not in classes_restored:
        print("✅ Restore works: Window is no longer maximized.")
    else:
        print("❌ Restore failed: Window is still maximized.")


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    try:
        verify_item_and_maximize(page)
    except Exception as e:
        print(f"Error: {e}")
        exit(1)
    browser.close()
