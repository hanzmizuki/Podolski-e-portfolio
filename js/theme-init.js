/* Loaded in <head> (not deferred) so the saved theme is applied before the
   page is drawn, with no flash of the wrong theme. Kept as a separate file
   because the Content-Security-Policy does not allow inline scripts. */
(function () {
  var root = document.documentElement, saved = null;
  root.classList.add("js");
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", dark ? "dark" : "light");
})();
