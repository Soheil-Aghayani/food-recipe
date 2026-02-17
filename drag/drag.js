(function () {
  const DRAG_MIN_X = 10;
  const DRAG_MIN_Y = 44;
  const DRAG_BOUNDARY_OFFSET = 80;

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function startManualDrag(el, startX, startY, onFocus, isLocked) {
    if (!el) return;
    if (isLocked && isLocked()) return;

    if (onFocus) onFocus();

    // 1. ذخیره استایل ترنزیشن قبلی (اگر وجود دارد)
    const originalTransition = el.style.transition;
    
    // 2. کشتن انیمیشن با قدرت !important برای جلوگیری از پرش
    el.style.setProperty('transition', 'none', 'important');

    const r = el.getBoundingClientRect();
    const startLeft = r.left;
    const startTop = r.top;

    // فیکس کردن موقعیت فعلی بدون انیمیشن
    el.style.left = startLeft + "px";
    el.style.top = startTop + "px";
    el.style.transform = "none";

    let nextX = startLeft;
    let nextY = startTop;
    let raf = 0;

    function applyMove() {
      raf = 0;
      const minLeft = DRAG_MIN_X;
      const minTop = DRAG_MIN_Y;
      const maxLeft = window.innerWidth - DRAG_BOUNDARY_OFFSET;
      const maxTop = window.innerHeight - DRAG_BOUNDARY_OFFSET;

      const x = clamp(nextX, minLeft, maxLeft);
      const y = clamp(nextY, minTop, maxTop);

      el.style.left = x + "px";
      el.style.top = y + "px";
    }

    function onMove(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      nextX = startLeft + dx;
      nextY = startTop + dy;

      if (!raf) raf = requestAnimationFrame(applyMove);
    }

    function end() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;

      // بازگرداندن ترنزیشن به حالت قبل (اختیاری - اگر می‌خواهید نرم باز شود)
      // el.style.transition = originalTransition; 
      // فعلاً خط بالا را کامنت کردم تا مطمئن شویم پرش نمی‌کند.
      el.style.removeProperty('transition'); 

      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }

  // اکسپورت کردن توابع
  const SoheilDrag = {
    startManualDrag: startManualDrag,
    // توابع دیگر اگر نیاز است
    makeDraggable: function(opts){
        // نسخه ساده شده برای هندل کردن درگ‌های دیگر اگر هنوز استفاده می‌کنید
        const el = opts.el;
        const handle = opts.handle;
        if(!el || !handle) return;
        handle.addEventListener("pointerdown", (e) => {
             startManualDrag(el, e.clientX, e.clientY, opts.onFocus, opts.isLocked);
        });
    }
  };

  if (typeof window !== "undefined") {
    window.SoheilDrag = SoheilDrag;
  }
})();