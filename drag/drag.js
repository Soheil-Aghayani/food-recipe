(function () {
  const DRAG_MIN_X = 10;
  const DRAG_MIN_Y = 44;
  const DRAG_BOUNDARY_OFFSET = 80;

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  // این تابع اصلاح شده است تا آفست دقیق را بگیرد
  function startManualDrag(el, offsetX, offsetY, onFocus, isLocked) {
    if (!el) return;
    if (isLocked && isLocked()) return;

    if (onFocus) onFocus();

    // 1. حذف انیمیشن برای جلوگیری از پرش
    el.style.setProperty('transition', 'none', 'important');

    // 2. فیکس کردن موقعیت فعلی (تبدیل درصدی به پیکسلی)
    // این کار باعث می‌شود وقتی Transform را حذف می‌کنیم، پنجره نپرد
    const r = el.getBoundingClientRect();
    el.style.left = r.left + "px";
    el.style.top = r.top + "px";
    el.style.transform = "none"; 

    // 3. محاسبه حرکت بر اساس آفست ساده
    function onMove(e) {
      // فرمول طلایی: موقعیت جدید = مکان موس - فاصله موس تا لبه پنجره
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      // محدود کردن در کادر صفحه
      const minLeft = DRAG_MIN_X;
      const minTop = DRAG_MIN_Y;
      const maxLeft = window.innerWidth - DRAG_BOUNDARY_OFFSET;
      const maxTop = window.innerHeight - DRAG_BOUNDARY_OFFSET;

      el.style.left = clamp(x, minLeft, maxLeft) + "px";
      el.style.top = clamp(y, minTop, maxTop) + "px";
    }

    function end() {
      // بازگرداندن تنظیمات
      el.style.removeProperty('transition');
      
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
       // این بخش برای پنجره‌های عادی (مثل Finder) است
       const el = opts.el;
       const handle = opts.handle;
       if(!el || !handle) return;
       
       handle.addEventListener("pointerdown", (e) => {
         if (opts.isLocked && opts.isLocked()) return;
         // محاسبه فاصله موس تا لبه پنجره برای پنجره‌های عادی
         const r = el.getBoundingClientRect();
         const offsetX = e.clientX - r.left;
         const offsetY = e.clientY - r.top;
         
         startManualDrag(el, offsetX, offsetY, opts.onFocus, opts.isLocked);
         
         try { handle.setPointerCapture(e.pointerId); } catch (err) {}
       });
    }
  };

  if (typeof window !== "undefined") {
    window.SoheilDrag = SoheilDrag;
  }
})();