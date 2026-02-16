(function () {
  function isInteractiveTarget(target) {
    if (!target) return false;
    if (target.closest && target.closest(".traffic")) return true;
    const tag = (target.tagName || "").toUpperCase();
    if (tag === "INPUT" || tag === "BUTTON" || tag === "A" || tag === "TEXTAREA" || tag === "SELECT" || tag === "LABEL") return true;
    return false;
  }

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function makeDraggable(opts) {
    const el = opts && opts.el;
    const handle = opts && opts.handle;
    const onFocus = (opts && opts.onFocus) || function () {};
    const isLocked = (opts && opts.isLocked) || function () { return false; };

    if (!el || !handle) return;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let raf = 0;
    let nextX = 0;
    let nextY = 0;

    function applyMove() {
      raf = 0;

      const minLeft = 10;
      const minTop = 44;
      const maxLeft = window.innerWidth - 80;
      const maxTop = window.innerHeight - 80;

      const x = clamp(nextX, minLeft, maxLeft);
      const y = clamp(nextY, minTop, maxTop);

      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.transform = "translate(0,0)";
    }

    function onMove(e) {
      if (!dragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      nextX = startLeft + dx;
      nextY = startTop + dy;

      if (!raf) raf = requestAnimationFrame(applyMove);
    }

    function end() {
      dragging = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;

      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    }

    handle.addEventListener("pointerdown", function (e) {
      if (isLocked()) return;
      if (isInteractiveTarget(e.target)) return;

      dragging = true;
      onFocus();

      const r = el.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = r.left;
      startTop = r.top;

      el.style.left = startLeft + "px";
      el.style.top = startTop + "px";
      el.style.transform = "translate(0,0)";

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);

      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
    });
  }

  window.SoheilDrag = { makeDraggable: makeDraggable };
})();
