(function () {
  const DRAG_MIN_X = 10;
  const DRAG_MIN_Y = 44;
  const DRAG_BOUNDARY_OFFSET = 80;

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  // تابع درگ دستی که هوشمندانه آفست را در لحظه حرکت محاسبه می‌کند
  function startManualDrag(el, ignoredX, ignoredY, onFocus, isLocked) {
    if (!el) return;
    if (isLocked && isLocked()) return;

    if (onFocus) onFocus();

    // متغیرهایی برای ذخیره فاصله موس تا گوشه پنجره
    let startOffsetX = 0;
    let startOffsetY = 0;
    let isInitialized = false; // آیا درگ شروع شده؟

    function onMove(e) {
      // فقط در اولین لحظه حرکت، مختصات را فیکس می‌کنیم
      if (!isInitialized) {
        // 1. حذف انیمیشن برای جلوگیری از لگ
        el.style.setProperty('transition', 'none', 'important');

        // 2. تبدیل موقعیت از حالت Transform (وسط‌چین) به مختصات ثابت پیکسلی
        // این کار باعث می‌شود پنجره دقیقاً همان‌جا که هست بماند
        const r = el.getBoundingClientRect();
        el.style.left = r.left + "px";
        el.style.top = r.top + "px";
        el.style.transform = "none";

        // 3. محاسبه فاصله دقیق موس تا گوشه پنجره در همین لحظه
        startOffsetX = e.clientX - r.left;
        startOffsetY = e.clientY - r.top;

        isInitialized = true;
      }

      // محاسبه موقعیت جدید بر اساس فاصله محاسبه شده
      const minLeft = DRAG_MIN_X;
      const minTop = DRAG_MIN_Y;
      const maxLeft = window.innerWidth - DRAG_BOUNDARY_OFFSET;
      const maxTop = window.innerHeight - DRAG_BOUNDARY_OFFSET;

      const x = e.clientX - startOffsetX;
      const y = e.clientY - startOffsetY;

      el.style.left = clamp(x, minLeft, maxLeft) + "px";
      el.style.top = clamp(y, minTop, maxTop) + "px";
    }

    function end() {
      // بازگرداندن تنظیمات ترنزیشن (اختیاری)
      el.style.removeProperty('transition');

      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    }

    // شروع گوش دادن به حرکت موس
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }

  const SoheilDrag = {
    startManualDrag: startManualDrag,
    makeDraggable: function(opts){
       // این بخش برای پنجره‌های عادی (مثل Finder) است
       const el = opts.el;
       const handle = opts.handle;
       if(!el || !handle) return;
       
       handle.addEventListener("pointerdown", (e) => {
         if (opts.isLocked && opts.isLocked()) return;
         // برای پنجره‌های عادی هم از همین منطق هوشمند استفاده می‌کنیم
         startManualDrag(el, 0, 0, opts.onFocus, opts.isLocked);
         
         try { handle.setPointerCapture(e.pointerId); } catch (err) {}
       });
    }
  };

  if (typeof window !== "undefined") {
    window.SoheilDrag = SoheilDrag;
  }
})();