(function () {
  const DRAG_MIN_X = 0;
  const DRAG_MIN_Y = 28; // Menubar
  const DRAG_BOUNDARY_OFFSET = 60;

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
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

  const SoheilDrag = {
    startManualDrag: startManualDrag,
    makeDraggable: function(opts){
       const el = opts.el;
       const handle = opts.handle;
       if(!el || !handle) return;

       handle.style.cursor = 'grab';

       handle.addEventListener("pointerdown", (e) => {
         // ME SMART: If user click button or something interactive, don't drag!
         const t = e.target;
         if (t.closest('button') || t.closest('input') || t.closest('a') || t.closest('.light')) {
           return;
         }
         
         if (opts.isLocked && opts.isLocked()) return;

         startManualDrag(el, e.clientX, e.clientY, opts.onFocus, opts.isLocked);
         
         try { handle.setPointerCapture(e.pointerId); } catch (_) {}
       });
    }
  };

  if (typeof window !== "undefined") {
    window.SoheilDrag = SoheilDrag;
  }
})();
