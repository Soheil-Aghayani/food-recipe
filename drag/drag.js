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
    // Dragging functionality has been disabled.
    // The implementation is kept minimal to satisfy the API contract.
    const el = opts && opts.el;
    const handle = opts && opts.handle;

    if (!el || !handle) return;
  }

  const SoheilDrag = {
    makeDraggable: makeDraggable,
    clamp: clamp,
    isInteractiveTarget: isInteractiveTarget,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = SoheilDrag;
  }

  if (typeof window !== "undefined") {
    window.SoheilDrag = SoheilDrag;
  }
})();
