/* ==========================================================================
   The Coach Collection — interaction layer
   - Eclipse™ tint slider (interactive lens motion; numeric + text state)
   - Reservation product selector (Vantage Pro / Ace) sync
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
      name: "Vantage Pro",
      meta: "Black / Smoke / Audio",
      spec: "Acetate aviator · Smoke Eclipse™ lenses · Open-ear audio",
      cta: "Reserve my Vantage Pro for $20"
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
  // Continuous slider: value 0..1 crossfades the tint-change overlay image in
  // (0 = clear scene, 1 = full tinted overlay).
  var TINT_LIGHT = 0.29, TINT_DARK = 0.50;

  function initSlider() {
    var slider = $("#tintSlider");
    if (!slider) return;
    var lens = $("#eclipseLens");
    function apply(v) {
      if (isNaN(v)) v = 0;
      var t = TINT_LIGHT + v * (TINT_DARK - TINT_LIGHT);
      lens.style.setProperty("--tint", t.toFixed(3));
    }
    slider.addEventListener("input", function () { apply(parseFloat(slider.value)); });
    apply(parseFloat(slider.value));
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

  /* ---------------- Product image carousels ---------------- */
  function initCarousels() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $all("[data-carousel]").forEach(function (c) {
      var slides = $(".slides", c);
      var imgs = $all("img", slides);
      var dotsWrap = $(".dots", c);
      if (!slides || !dotsWrap || imgs.length < 2) { if (dotsWrap) dotsWrap.style.display = "none"; return; }

      var dots = imgs.map(function (_, i) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("role", "tab");
        b.setAttribute("aria-label", "Show image " + (i + 1) + " of " + imgs.length);
        b.addEventListener("click", function () {
          idx = i; slides.scrollTo({ left: slides.clientWidth * i, behavior: "smooth" });
        });
        dotsWrap.appendChild(b); return b;
      });
      var idx = 0;
      function setActive(i) { dots.forEach(function (d, k) { d.setAttribute("aria-selected", String(k === i)); }); }
      setActive(0);

      var raf = false;
      slides.addEventListener("scroll", function () {
        if (raf) return; raf = true;
        (window.requestAnimationFrame || function (f) { setTimeout(f, 16); })(function () {
          raf = false; idx = Math.round(slides.scrollLeft / slides.clientWidth); setActive(idx);
        });
      }, { passive: true });

      if (!reduce) {
        var timer = setInterval(function () {
          idx = (idx + 1) % imgs.length;
          slides.scrollTo({ left: slides.clientWidth * idx, behavior: "smooth" });
        }, 4500);
        var stop = function () { clearInterval(timer); };
        c.addEventListener("mouseenter", stop);
        c.addEventListener("touchstart", stop, { passive: true });
        c.addEventListener("focusin", stop);
      }
    });
  }

  /* ---------------- Hero background video pause/play ---------------- */
  function initHeroVideo() {
    var v = $("#heroVideo"), btn = $("#heroToggle");
    if (!v || !btn) return;
    var setState = function (paused) {
      btn.classList.toggle("is-paused", paused);
      btn.setAttribute("aria-pressed", String(!paused));
      btn.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
    };
    // Don't autoplay for visitors who prefer reduced motion — show the poster.
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { try { v.autoplay = false; v.pause(); } catch (e) {} }
    else { try { v.muted = true; var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } catch (e) {} }
    btn.addEventListener("click", function () {
      if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else { v.pause(); }
    });
    v.addEventListener("play", function () { setState(false); });
    v.addEventListener("pause", function () { setState(true); });
    setState(v.paused);
  }

  // NOTE: scroll-reveal is handled by the self-contained inline script in
  // <head> (see coach-collection.html) so that hiding and revealing share the
  // same fate — if that script can't run, nothing is ever hidden.

  document.addEventListener("DOMContentLoaded", function () {
    initSlider();
    initSelector();
    initSticky();
    initHeroVideo();
    initCarousels();
    setProduct("vantage");
  });
})();
