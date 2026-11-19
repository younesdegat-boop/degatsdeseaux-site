/* Bandeau cookies + Consent Mode Google + Microsoft Clarity (chargé seulement après accord) */
(function () {
  var CLARITY_ID = "zfr6e4n8sf";
  var KEY = "dde-consent"; // "yes" | "no"

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var granted = saved === "yes";

  // Par défaut : rien n'est stocké tant que le visiteur n'a pas accepté
  gtag("consent", "default", {
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
    analytics_storage: granted ? "granted" : "denied",
    wait_for_update: 500
  });

  // Google Analytics 4 (respecte le Consent Mode ci-dessus)
  var GA_ID = "G-GDLR9PPD9E";
  function loadGA() {
    if (window.__ddeGA) return; window.__ddeGA = true;
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      var s = document.createElement("script"); s.async = 1;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
      document.head.appendChild(s);
      gtag("js", new Date());
    }
    gtag("config", GA_ID);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", loadGA); else loadGA();

  function loadClarity() {
    if (window.clarity && window.clarity.loaded) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
    window.clarity("consent");
    window.clarity.loaded = true;
  }

  function accept() {
    try { localStorage.setItem(KEY, "yes"); } catch (e) {}
    gtag("consent", "update", {
      ad_storage: "granted", ad_user_data: "granted",
      ad_personalization: "granted", analytics_storage: "granted"
    });
    loadClarity();
    hide();
  }
  function refuse() {
    try { localStorage.setItem(KEY, "no"); } catch (e) {}
    hide();
  }
  function hide() {
    var b = document.getElementById("dde-cookie");
    if (b) b.parentNode.removeChild(b);
  }

  if (granted) { loadClarity(); return; }
  if (saved === "no") return;

  var T = {
    fr: { t: "Nous utilisons des cookies pour mesurer l'audience du site et améliorer nos annonces.", ok: "Accepter", no: "Refuser", more: "En savoir plus", link: "/privacy-policy.html" },
    nl: { t: "Wij gebruiken cookies om het bezoek aan de site te meten en onze advertenties te verbeteren.", ok: "Accepteren", no: "Weigeren", more: "Meer info", link: "/nl/privacy-policy.html" },
    en: { t: "We use cookies to measure site traffic and improve our ads.", ok: "Accept", no: "Decline", more: "Learn more", link: "/en/privacy-policy.html" }
  };

  function show() {
    var lang = (document.documentElement.lang || "fr").slice(0, 2);
    var x = T[lang] || T.fr;
    var d = document.createElement("div");
    d.id = "dde-cookie";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-label", "Cookies");
    d.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;max-width:560px;margin:0 auto;" +
      "background:#fff;color:#1f2937;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.18);padding:14px 16px;" +
      "font:14px/1.45 Poppins,system-ui,sans-serif";
    d.innerHTML = '<p style="margin:0 0 10px">' + x.t + ' <a href="' + x.link + '" style="color:#0056b3">' + x.more + '</a></p>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end">' +
      '<button type="button" id="dde-no" style="border:1px solid #d1d5db;background:#fff;color:#374151;border-radius:999px;padding:8px 16px;font:inherit;cursor:pointer">' + x.no + '</button>' +
      '<button type="button" id="dde-ok" style="border:0;background:#0056b3;color:#fff;border-radius:999px;padding:8px 18px;font:inherit;font-weight:600;cursor:pointer">' + x.ok + '</button></div>';
    document.body.appendChild(d);
    document.getElementById("dde-ok").onclick = accept;
    document.getElementById("dde-no").onclick = refuse;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show);
  else show();
})();
