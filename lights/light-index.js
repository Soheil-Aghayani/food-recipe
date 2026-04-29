(function () {
  /**
   * ME FIX: baseTransform must return the CURRENT transform state 
   * to prevent jumping when animation starts.
   */
  function getCurrentTransform(el) {
    if (!el) return "translate(0,0)";
    
    // If it's maximized, it's always at 0,0 relative to its top/left
    if (el.classList.contains("is-maximized")) return "translate(0,0)";
    
    // If it has inline left/top, it's likely been dragged.
    // In our system, drag sets transform to 'none' or 'translate(0,0)'
    if (el.style.left && el.style.top) {
      return "translate(0,0)";
    }
    
    // Default windows in CSS use left:50%, top:50%, transform:translate(-50%,-50%)
    return "translate(-50%,-50%)";
  }

  function animateOpen(el) {
    if (!el) return;
    const base = getCurrentTransform(el);
    try {
      el.animate(
        [
          { opacity: 0, filter: "blur(5px)", transform: base + " scale(0.95)" },
          { opacity: 1, filter: "blur(0px)", transform: base + " scale(1)" }
        ],
        { duration: 250, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" }
      ).finished.finally(function () {
        el.style.opacity = "";
        el.style.filter = "";
        el.style.transform = "";
      });
    } catch (_) {}
  }

  function animateClose(el) {
    if (!el) return Promise.resolve();
    const base = getCurrentTransform(el);
    try {
      return el.animate(
        [
          { opacity: 1, filter: "blur(0px)", transform: base + " scale(1)" },
          { opacity: 0, filter: "blur(5px)", transform: base + " scale(0.94)" }
        ],
        { duration: 200, easing: "ease-in", fill: "forwards" }
      ).finished;
    } catch (_) {
      return Promise.resolve();
    }
  }

  function animateMinimizeTo(el, targetRect) {
    if (!el || !targetRect) return Promise.resolve();

    const base = getCurrentTransform(el);
    const w = el.getBoundingClientRect();
    
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;
    const winX = w.left + w.width / 2;
    const winY = w.top + w.height / 2;

    const dx = targetX - winX;
    const dy = targetY - winY;

    try {
      return el.animate(
        [
          { opacity: 1, filter: "blur(0px)", transform: base + " translate(0,0) scale(1)" },
          { opacity: 0, filter: "blur(8px)", transform: base + " translate(" + dx + "px," + dy + "px) scale(0.05)" }
        ],
        { duration: 350, easing: "cubic-bezier(0.47, 0, 0.745, 0.715)", fill: "forwards" }
      ).finished;
    } catch (_) {
      return Promise.resolve();
    }
  }

  window.SoheilLights = {
    animateOpen: animateOpen,
    animateClose: animateClose,
    animateMinimizeTo: animateMinimizeTo
  };
})();
