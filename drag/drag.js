(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SoheilDrag = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  function clamp(v, min, max) {
    if (min > max) return max;
    if (v < min) return min;
    if (v > max) return max;
    return v;
  }

  function isInteractiveTarget(target) {
    if (!target) return false;

    // Check if target or parent is .traffic
    if (target.closest && target.closest('.traffic')) return true;

    // Check tag names
    if (!target.tagName) return false;
    const tags = ['INPUT', 'BUTTON', 'A', 'TEXTAREA', 'SELECT', 'LABEL'];
    if (tags.includes(target.tagName.toUpperCase())) return true;

    return false;
  }

  function makeDraggable({ el, handle, onFocus, isLocked }) {
    if (!el || !handle) return;

    handle.addEventListener('pointerdown', (e) => {
      if (isInteractiveTarget(e.target)) return;
      if (isLocked && isLocked()) return;
      if (onFocus) onFocus();

      try {
        handle.setPointerCapture(e.pointerId);
      } catch (err) {}

      const startX = e.clientX;
      const startY = e.clientY;
      const rect = el.getBoundingClientRect();
      const startLeft = rect.left;
      const startTop = rect.top;

      function onMove(ev) {
        if (ev.pointerId !== e.pointerId) return;

        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        el.style.left = (startLeft + dx) + 'px';
        el.style.top = (startTop + dy) + 'px';
        el.style.transform = 'none';
      }

      function onUp(ev) {
        if (ev.pointerId !== e.pointerId) return;

        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);

        try {
          if (handle.hasPointerCapture(ev.pointerId)) {
            handle.releasePointerCapture(ev.pointerId);
          }
        } catch (e) {}
      }

      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
    });
  }

  function startManualDrag(el, startScreenX, startScreenY, onFocus, isLocked) {
    if (isLocked && isLocked()) return;
    if (onFocus) onFocus();

    const rect = el.getBoundingClientRect();
    const startLeft = rect.left;
    const startTop = rect.top;

    function onMove(ev) {
      // Use screen coordinates for robust cross-frame dragging
      const dx = ev.screenX - startScreenX;
      const dy = ev.screenY - startScreenY;

      el.style.left = (startLeft + dx) + 'px';
      el.style.top = (startTop + dy) + 'px';
      el.style.transform = 'none';
    }

    // Attach to main window and all accessible iframe windows
    const targets = [window];
    document.querySelectorAll('iframe').forEach(f => {
      try {
        if (f.contentWindow) targets.push(f.contentWindow);
      } catch(e) {}
    });

    function onUp(ev) {
      targets.forEach(t => {
        t.removeEventListener('pointermove', onMove);
        t.removeEventListener('pointerup', onUp);
      });
    }

    targets.forEach(t => {
      t.addEventListener('pointermove', onMove);
      t.addEventListener('pointerup', onUp);
    });
  }

  return {
    clamp,
    isInteractiveTarget,
    makeDraggable,
    startManualDrag
  };

}));
