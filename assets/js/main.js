(function () {
  "use strict";

  var body = document.body;
  /* Device pages live one folder deep (/fm-radio/), so every in-site path is
     written relative to this base. Root pages leave it empty. */
  var base = window.SSLL_BASE || "";
  document.documentElement.setAttribute("data-theme", "dark");
  localStorage.removeItem("theme");

  /* Replace the old fold-out navigation with a compact, persistent top bar. */
  var oldDrawer = document.querySelector(".drawer");
  if (oldDrawer) {
    var current = window.SSLL_NAV || location.pathname.split("/").pop() || "index.html";
    var top = document.createElement("header");
    top.className = "site-header";
    top.innerHTML = '<a class="site-brand" href="' + base + 'index.html"><span>SSLL</span><small>DSP</small></a>' +
      '<nav class="top-nav" aria-label="Main navigation">' +
      '<a href="' + base + 'devices.html">Devices</a><a href="' + base + 'tutorials.html">Tutorials</a><a href="' + base + 'publications.html">Publications</a><a href="' + base + 'about.html">About</a></nav>' +
      '<div class="header-actions"><a class="header-contact" href="mailto:henrik.forssell1@gmail.com">Contact</a></div>';
    body.insertBefore(top, body.firstChild);
    top.querySelectorAll(".top-nav a").forEach(function (link) {
      if (link.getAttribute("href") === base + current) link.classList.add("active");
    });
  }

  /* ------------------------------------------------- fold-out menu ----- */
  var toggle = document.querySelector(".menu-toggle");
  var scrim = document.querySelector(".scrim");

  function setNav(open) {
    body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setNav(!body.classList.contains("nav-open"));
    });
  }
  if (scrim) scrim.addEventListener("click", function () { setNav(false); });

  /* -------------------------------------------------- contact menu ----- */
  var contactToggle = document.querySelector(".contact-toggle");
  var contactMenu = document.querySelector(".contact-menu");

  function setContact(open) {
    if (!contactMenu) return;
    contactMenu.classList.toggle("open", open);
    if (contactToggle) contactToggle.setAttribute("aria-expanded", String(open));
  }

  if (contactToggle) {
    contactToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setContact(!contactMenu.classList.contains("open"));
    });
    document.addEventListener("click", function (e) {
      if (contactMenu && !contactMenu.contains(e.target)) setContact(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { setNav(false); setContact(false); }
  });

  /* --------------------------------------------------------- theme ----- */
  document.querySelectorAll(".theme-toggle").forEach(function (themeToggle) { themeToggle.remove(); });

  /* Software cards behave as full, keyboard-accessible catalogue links. */
  document.querySelectorAll(".list-item[data-project]").forEach(function (card) {
    var slug = card.dataset.project;
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", "View " + card.querySelector("h2").textContent);
    function openProject(e) {
      if (e.type === "click" && e.target.closest("a")) return;
      if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
      if (e.type === "keydown") e.preventDefault();
      location.href = base + encodeURIComponent(slug) + "/";
    }
    card.addEventListener("click", openProject);
    card.addEventListener("keydown", openProject);
  });

  /* Consistent icon-only social links in every footer. */
  document.querySelectorAll(".social-links").forEach(function (links) {
    links.innerHTML =
      '<a href="https://github.com/hefo" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub"><img src="https://cdn.simpleicons.org/github/ECEBE5" alt=""></a>' +
      '<a href="https://www.youtube.com/@ssll-dsp" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube"><img src="https://cdn.simpleicons.org/youtube/ECEBE5" alt=""></a>' +
      '<a href="https://www.instagram.com/ssll_dsp/" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram"><img src="https://cdn.simpleicons.org/instagram/ECEBE5" alt=""></a>';
  });

  /* ---------------------------------------------------- feed filter ---- */
  /* Drives the landing-page feed and the software list alike: any element
     with .feed-item or .list-item is matched on its data-cat. */
  var filters = document.querySelectorAll(".filter");
  var items = document.querySelectorAll(".feed-item, .list-item");
  var empty = document.querySelector(".feed-empty");

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.dataset.filter;
      filters.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });

      var shown = 0;
      items.forEach(function (item) {
        var match = cat === "all" || item.dataset.cat === cat;
        item.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  });

  /* ------------------------------------------------ expandable posts --- */
  document.querySelectorAll(".read-more").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".feed-item");
      var open = item.classList.toggle("expanded");
      btn.textContent = open ? "Show less" : "Read more";
    });
  });

  /* ---------------------------------------------------------- misc ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
