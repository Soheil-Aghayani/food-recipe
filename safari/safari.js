(function () {
  function safariResolve(input) {
    const raw = String(input || "").trim();
    const low = raw.toLowerCase();

    if (!raw || low === "start" || low === "start page" || low === "new tab") return "safari/start.html";
    if (low === "sohgle" || low === "google" || low.includes("google.")) return "safari/sohgle.html";

    if (raw.startsWith("safari/") || raw.startsWith("recipes/") || raw.startsWith("music/") || raw.startsWith("igit/") || raw.startsWith("bin/") || raw.startsWith("garlic-bread/")) return raw;

    return "safari/sohgle.html?q=" + encodeURIComponent(raw);
  }

  const SoheilSafari = {
    resolve: safariResolve
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = SoheilSafari;
  }

  if (typeof window !== "undefined") {
    window.SoheilSafari = SoheilSafari;
  }
})();
