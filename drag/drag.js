(function () {
  const DRAG_MIN_X = 10;
  const DRAG_MIN_Y = 44;
  const DRAG_BOUNDARY_OFFSET = 80;

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
    // Drag functionality disabled
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
