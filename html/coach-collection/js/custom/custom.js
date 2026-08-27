/* ==========================================================================
   The Coach Collection — interaction layer
   - Eclipse™ tint slider (interactive lens motion; numeric + text state)
   - Reservation product selector (Vantage / Ace) sync
   - Sticky reserve bar reveal on scroll
   NOTE: reservation SUBMISSION is intentionally NOT wired here. The Checkout
   Champ <form>, action URL, hidden fields, and pixel are pending the reference
   integration snippet (see the TODO in coach-collection.html). Reserve buttons
   currently move the visitor to the reservation card and set the selected
   product; they must be re-pointed at the real Checkout Champ form when it is
   pasted in.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Product data (all values sourced from the two product pages) ---- */
  var PRODUCTS = {
    vantage: {
      name: "Vantage",
      meta: "Black / Smoke / Audio",
      spec: "Acetate aviator · Smoke Eclipse™ lenses · Open-ear audio",
      cta: "Reserve my Vantage for $20"
    },
    ace: {
      name: "Ace",
      meta: "Black / Blue",
      spec: "Tennis shield · High-contrast amber lens · Blue Revo mirror",
      cta: "Reserve my Ace for $20"
    }
  };
  var selected = "vantage";

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------------- Eclipse tint slider ---------------- */
  // 4 levels. Only the two endpoints have sourced VLT numbers (54% / 17%);
  // the middle stops are labelled "Level 2 / Level 3" exactly as on the
  // source pages, so no VLT value is invented.
  var LEVELS = [
    { label: "54% VLT", lvl: "Level 1 of 4", tint: 0.30 },
    { label: "Level 2", lvl: "Level 2 of 4", tint: 0.47 },
    { label: "Level 3", lvl: "Level 3 of 4", tint: 0.64 },
    { label: "17% VLT", lvl: "Level 4 of 4", tint: 0.82 }
  ];

  function initSlider() {
    var slider = $("#tintSlider");
    if (!slider) return;
    var lens = $("#eclipseLens");
    var tint = $(".tint", lens);
    var vltEl = $("#lensVlt");
    var lvlEl = $("#lensLvl");
    var ticks = $all("#tintTicks span");

    function apply(i) {
      var L = LEVELS[i];
      lens.style.setProperty("--tint", L.tint);
      if (vltEl) vltEl.textContent = L.label;
      if (lvlEl) lvlEl.textContent = L.lvl;
      ticks.forEach(function (t, k) { t.classList.toggle("on", k === i); });
      slider.setAttribute("aria-valuetext", L.lvl + ", " + L.label);
    }
    slider.addEventListener("input", function () { apply(parseInt(slider.value, 10)); });
    apply(parseInt(slider.value, 10) || 0);
  }

  /* ---------------- Reservation selector ---------------- */
  function setProduct(key, fromSticky) {
    if (!PRODUCTS[key]) return;
    selected = key;
    var p = PRODUCTS[key];

    var nameEl = $("#resName");   if (nameEl) nameEl.textContent = p.name;
    var specEl = $("#resSpec");   if (specEl) specEl.textContent = p.spec;
    var ctaEl = $("#resCta");     if (ctaEl) ctaEl.textContent = p.cta;
    var hidden = $("#resProductField"); if (hidden) hidden.value = p.name; // placeholder for CC field

    $all("[data-select]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-select") === key));
    });
    // sticky bar mirror
    var sName = $("#stkName"); if (sName) sName.textContent = p.name;
    var sMeta = $("#stkMeta"); if (sMeta) sMeta.textContent = p.meta;
    $all("[data-stk]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-stk") === key));
    });
  }

  function initSelector() {
    $all("[data-select]").forEach(function (b) {
      b.addEventListener("click", function () { setProduct(b.getAttribute("data-select")); });
    });
    $all("[data-stk]").forEach(function (b) {
      b.addEventListener("click", function () { setProduct(b.getAttribute("data-stk"), true); });
    });
    // picker + banner "Reserve <product>" buttons preselect then jump
    $all("[data-reserve]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        var key = b.getAttribute("data-reserve");
        if (PRODUCTS[key]) setProduct(key);
        var target = $("#reserve");
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          // focus the reservation card for keyboard users
          var card = $("#rescard");
          if (card) card.setAttribute("tabindex", "-1"), card.focus({ preventScroll: true });
        }
      });
    });
  }

  /* ---------------- Sticky reserve bar ---------------- */
  function initSticky() {
    var bar = $("#stickybar");
    var hero = $("#hero");
    if (!bar || !hero || !("IntersectionObserver" in window)) { if (bar) bar.classList.add("show"); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { bar.classList.toggle("show", !en.isIntersecting); });
    }, { rootMargin: "-40% 0px 0px 0px" });
    io.observe(hero);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSlider();
    initSelector();
    initSticky();
    setProduct("vantage");
  });
})();
