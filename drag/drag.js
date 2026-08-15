(function () {
  const DRAG_MIN_X = 0;
  const DRAG_MIN_Y = 28; // Menubar
  const DRAG_BOUNDARY_OFFSET = 60;

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function isInteractiveTarget(target) {
    if (!target) return false;

    const tagName = typeof target.tagName === "string" ? target.tagName.toUpperCase() : "";
    const interactiveTags = ["INPUT", "BUTTON", "A", "TEXTAREA", "SELECT", "LABEL"];
    if (interactiveTags.includes(tagName)) return true;

    if (typeof target.closest !== "function") return false;
    return Boolean(target.closest(".traffic") || target.closest(".light"));
  }

  function startManualDrag(el, clientX, clientY, onFocus, isLocked) {
    if (!el) return;
    if (isLocked && isLocked()) return;

    // 1. Kill old animations
    if (el.getAnimations) {
      el.getAnimations().forEach(anim => anim.cancel());
    }

    if (onFocus) onFocus();

    const rect = el.getBoundingClientRect();
    const startOffsetX = clientX - rect.left;
    const startOffsetY = clientY - rect.top;

    // Keep the helper safe to exercise in a non-browser test environment.
    if (typeof document === "undefined") return;

    el.style.setProperty('transition', 'none', 'important');
    el.style.margin = "0";
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";
    el.style.transform = "none";
    el.style.willChange = "left, top";

    document.body.classList.add('os-is-dragging');
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(f => f.style.pointerEvents = 'none');

    function onMove(e) {
      requestAnimationFrame(() => {
        if (!document.body.classList.contains('os-is-dragging')) return;

        const x = e.clientX - startOffsetX;
        const y = e.clientY - startOffsetY;

        const minLeft = DRAG_MIN_X;
        const minTop = DRAG_MIN_Y;
        const maxLeft = window.innerWidth - DRAG_BOUNDARY_OFFSET;
        const maxTop = window.innerHeight - DRAG_BOUNDARY_OFFSET;

        el.style.left = clamp(x, minLeft, maxLeft) + "px";
        el.style.top = clamp(y, minTop, maxTop) + "px";
      });
    }

    function end() {
      document.body.classList.remove('os-is-dragging');
      iframes.forEach(f => f.style.pointerEvents = '');
      
      el.style.removeProperty('transition');
      el.style.willChange = "";
      
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }

  function makeDraggable(opts) {
       const el = opts.el;
       const handle = opts.handle;
       if(!el || !handle) return;

       if (handle.style) handle.style.cursor = 'grab';

       handle.addEventListener("pointerdown", (e) => {
         // If you click a button or something interactive, don't drag.
         const t = e.target;
         if (isInteractiveTarget(t)) {
           return;
         }
         
         if (opts.isLocked && opts.isLocked()) return;

         startManualDrag(el, e.clientX, e.clientY, opts.onFocus, opts.isLocked);
         
         try { handle.setPointerCapture(e.pointerId); } catch (error) {
           console.warn("SoheilDrag: setPointerCapture failed", error);
         }
       });
  }

  const SoheilDrag = {
    clamp: clamp,
    isInteractiveTarget: isInteractiveTarget,
    startManualDrag: startManualDrag,
    makeDraggable: makeDraggable
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = SoheilDrag;
  }

  if (typeof window !== "undefined") {
    window.SoheilDrag = SoheilDrag;
  }
})();
