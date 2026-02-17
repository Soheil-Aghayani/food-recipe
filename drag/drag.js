(function () {
  const DRAG_MIN_X = 10;
  const DRAG_MIN_Y = 44;
  const DRAG_BOUNDARY_OFFSET = 80;

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function startManualDrag(el, ignoredX, ignoredY, onFocus, isLocked) {
    if (!el) return;
    if (isLocked && isLocked()) return;

    if (onFocus) onFocus();

    // 1. ترفند طلایی: غیرفعال کردن کلیک روی iframe
    // این باعث می‌شود موس روی آن لیز بخورد و به سیستم عامل اصلی برسد
    const iframe = el.querySelector('iframe');
    if (iframe) {
        iframe.style.pointerEvents = 'none';
    }

    let startOffsetX = 0;
    let startOffsetY = 0;
    let isInitialized = false;

    function onMove(e) {
      if (!isInitialized) {
        // حذف انیمیشن برای جلوگیری از پرش
        el.style.setProperty('transition', 'none', 'important');

        // تبدیل موقعیت از وسط‌چین (transform) به مختصات ثابت پیکسلی (left/top)
        const r = el.getBoundingClientRect();
        el.style.left = r.left + "px";
        el.style.top = r.top + "px";
        el.style.transform = "none";

        // محاسبه فاصله دقیق موس تا گوشه پنجره در اولین لحظه حرکت
        startOffsetX = e.clientX - r.left;
        startOffsetY = e.clientY - r.top;

        isInitialized = true;
      }

      // محدود کردن پنجره در کادر صفحه
      const minLeft = DRAG_MIN_X;
      const minTop = DRAG_MIN_Y;
      const maxLeft = window.innerWidth - DRAG_BOUNDARY_OFFSET;
      const maxTop = window.innerHeight - DRAG_BOUNDARY_OFFSET;

      // محاسبه مکان جدید: مکان موس منهای فاصله اولیه
      const x = e.clientX - startOffsetX;
      const y = e.clientY - startOffsetY;

      el.style.left = clamp(x, minLeft, maxLeft) + "px";
      el.style.top = clamp(y, minTop, maxTop) + "px";
    }

    function end() {
      // پاکسازی استایل‌ها
      el.style.removeProperty('transition');
      
      // فعال کردن دوباره موس روی پلیر (تا دکمه‌های Play/Pause کار کنند)
      if (iframe) {
          iframe.style.pointerEvents = '';
      }

      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    }

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
         // شروع درگ (ورودی‌های مختصات نادیده گرفته می‌شوند چون هوشمند محاسبه می‌کنیم)
         startManualDrag(el, 0, 0, opts.onFocus, opts.isLocked);
         try { handle.setPointerCapture(e.pointerId); } catch (err) {}
       });
    }
  };

  if (typeof window !== "undefined") {
    window.SoheilDrag = SoheilDrag;
  }
})();