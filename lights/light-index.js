(function () {
  function baseTransform(el) {
    if (!el) return "translate(-50%,-50%)";
    if (el.classList.contains("is-maximized")) return "translate(0,0)";
    const hasPos = !!(el.style.left && el.style.top);
    if (hasPos) return "translate(0,0)";
    return "translate(-50%,-50%)";
  }

  function animateOpen(el) {
    if (!el) return;
    const base = baseTransform(el);
    try {
      el.animate(
        [
          { opacity: 0, filter: "blur(2px)", transform: base + " scale(0.96)" },
          { opacity: 1, filter: "blur(0px)", transform: base + " scale(1)" }
        ],
        { duration: 220, easing: "cubic-bezier(0.2,0.8,0.2,1)", fill: "forwards" }
      ).finished.finally(function () {
        el.style.opacity = "";
        el.style.filter = "";
        el.style.transform = "";
      });
    } catch (_) {}
  }

  function animateClose(el) {
    if (!el) return Promise.resolve();
    const base = baseTransform(el);
    try {
      return el.animate(
        [
          { opacity: 1, filter: "blur(0px)", transform: base + " scale(1)" },
          { opacity: 0, filter: "blur(2px)", transform: base + " scale(0.92)" }
        ],
        { duration: 210, easing: "cubic-bezier(0.22,0.61,0.36,1)", fill: "forwards" }
      ).finished;
    } catch (_) {
      return Promise.resolve();
    }
  }

  function animateMinimizeTo(el, targetRect) {
    if (!el || !targetRect) return Promise.resolve();

    const base = baseTransform(el);

    const w = el.getBoundingClientRect();
    const dx = (targetRect.left + targetRect.width / 2) - (w.left + w.width / 2);
    const dy = (targetRect.top + targetRect.height / 2) - (w.top + w.height / 2);

    try {
      return el.animate(
        [
          { opacity: 1, filter: "blur(0px)", transform: base + " translate(0px,0px) scale(1)" },
          { opacity: 0, filter: "blur(2px)", transform: base + " translate(" + dx + "px," + dy + "px) scale(0.08)" }
        ],
        { duration: 300, easing: "cubic-bezier(0.22,0.61,0.36,1)", fill: "forwards" }
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
