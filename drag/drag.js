(function () {
  const DRAG_MIN_X = 10;
  const DRAG_MIN_Y = 28; // ارتفاع منوبار
  const DRAG_BOUNDARY_OFFSET = 50;

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function startManualDrag(el, initialMouseX, initialMouseY, onFocus, isLocked) {
    if (!el) return;
    if (isLocked && isLocked()) return;

    if (onFocus) onFocus();

    // 1. ایجاد یک لایه نامرئی روی کل صفحه (Overlay)
    // این لایه باعث می‌شود موس هرچقدر هم سریع حرکت کند، از پنجره جا نماند
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '999999'; // بالاترین لایه
    overlay.style.cursor = 'default';
    document.body.appendChild(overlay);

    // 2. محاسبه آفست دقیق (فاصله موس تا گوشه پنجره)
    // ما از مختصاتی که از iframe آمده (initialMouseX/Y) استفاده می‌کنیم چون دقیق‌ترین است
    const rect = el.getBoundingClientRect();
    
    // آفست ما دقیقا همان جایی است که کاربر داخل iframe کلیک کرده
    const startOffsetX = initialMouseX; 
    const startOffsetY = initialMouseY;

    // حذف انیمیشن برای روانی حرکت
    el.style.setProperty('transition', 'none', 'important');
    
    // تبدیل به مختصات ثابت
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";
    el.style.transform = "none";

    function onMove(e) {
      const minLeft = DRAG_MIN_X;
      const minTop = DRAG_MIN_Y;
      const maxLeft = window.innerWidth - DRAG_BOUNDARY_OFFSET;
      const maxTop = window.innerHeight - DRAG_BOUNDARY_OFFSET;

      // محاسبه مکان جدید: مکان موس در صفحه اصلی منهای فاصله کلیک شده
      const x = e.clientX - startOffsetX;
      const y = e.clientY - startOffsetY;

      el.style.left = clamp(x, minLeft, maxLeft) + "px";
      el.style.top = clamp(y, minTop, maxTop) + "px";
    }

    function end() {
      // حذف لایه نامرئی
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      
      el.style.removeProperty('transition');

      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    }

    // ایونت‌ها را به پنجره اصلی وصل می‌کنیم (چون overlay آنجاست)
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }

  const SoheilDrag = {
    startManualDrag: startManualDrag,
    makeDraggable: function(opts){
       const el = opts.el;
       const handle = opts.handle;
       if(!el || !handle) return;
       
       handle.addEventListener("pointerdown", (e) => {
         if (opts.isLocked && opts.isLocked()) return;
         
         const r = el.getBoundingClientRect();
         const offX = e.clientX - r.left;
         const offY = e.clientY - r.top;

         startManualDrag(el, offX, offY, opts.onFocus, opts.isLocked);
         
         try { handle.setPointerCapture(e.pointerId); } catch (err) {}
       });
    }
  };

  if (typeof window !== "undefined") {
    window.SoheilDrag = SoheilDrag;
  }
})();