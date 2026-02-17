
import os
import time
from playwright.sync_api import sync_playwright

def verify_drag():
    os.makedirs("verification", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the local index.html via server
        page.goto("http://localhost:3000", wait_until="domcontentloaded")

        # Wait for desktop icons
        page.wait_for_selector(".desktop-icons")

        # --- Safari ---
        page.click("#dockSafari")
        safari_win = page.locator("#safariWin")
        safari_win.wait_for(state="visible")
        time.sleep(1) # Wait for animation

        handle = page.locator('[data-drag-handle="safari"]')
        box_handle = handle.bounding_box()

        # Drag Safari
        start_x = box_handle['x'] + 200
        start_y = box_handle['y'] + 5

        page.mouse.move(start_x, start_y)
        page.mouse.down()
        page.mouse.move(start_x + 100, start_y + 100)
        page.mouse.up()

        time.sleep(0.5)

        # --- Music ---
        page.click("#dockMusic")
        music_win = page.locator("#musicWin")
        music_win.wait_for(state="visible")
        time.sleep(1) # Wait for animation

        music_frame = page.frame_locator("#musicFrame")
        drag_header = music_frame.locator("#dragHeader")
        header_box = drag_header.bounding_box()

        # Drag Music
        start_x = header_box['x'] + header_box['width'] - 30
        start_y = header_box['y'] + header_box['height'] / 2

        page.mouse.move(start_x, start_y)
        page.mouse.down()
        page.mouse.move(start_x - 200, start_y - 200) # Move it somewhere else
        page.mouse.up()

        time.sleep(0.5)

        # Take screenshot
        page.screenshot(path="verification/drag_verification.png")
        print("Screenshot saved to verification/drag_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_drag()
