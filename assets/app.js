(function () {
  "use strict";

  var f = function (n) {
    return "assets/photos/p" + n + ".jpg";
  };
  var fMobile = function (n) {
    return "assets/photos-mobile/p" + n + ".jpg";
  };

  // Authored running order, with titles — matches the Claude Design handoff spec.
  var FRAMES = [
    { n: 6, title: "Mila" },
    { n: 11, title: "Water", series: "portraits" },
    { n: 21, title: "Mighty ocean", series: "ocean" },
    { n: 32, title: "Venice basketball", series: "street" },
    { n: 3, title: "Beaky", series: "wildlife" },
    { n: 4, title: "Barber in Porto", series: "street" },
    { n: 5, title: "Charles bridge", series: "street" },
    { n: 29, title: "Eye of the gorilla", series: "wildlife" },
    { n: 12, title: "Ouky Douky", series: "portraits" },
    { n: 9, title: "Spring coming", series: "portraits" },
    { n: 15, title: "Oakley", series: "portraits" },
    { n: 23, title: "Orca", series: "wildlife" },
    { n: 18, title: "Nazaré", series: "ocean" },
    { n: 20, title: "Blue moon", series: "ocean" },
    { n: 8, title: "Orloj", series: "street" },
    { n: 28, title: "Ginger", series: "wildlife" },
    { n: 1, title: "Aurora Australis", series: "landscape" },
    { n: 22, title: "Wave", series: "ocean" },
    { n: 16, title: "Basket napping" },
    { n: 19, title: "Porto church", series: "street" },
    { n: 24, title: "Lighthouse", series: "landscape" },
    { n: 13, title: "Picnic at the beach", series: "ocean" },
    { n: 2, title: "Xmass Bay", series: "ocean" },
    { n: 30, title: "Wellington on a good day", series: "landscape" },
    { n: 25, title: "Lyall Bay lineup", series: "ocean" },
    { n: 31, title: "McKinnon Pass", series: "landscape" },
    { n: 7, title: "Picturesque", series: "portraits" },
    { n: 27, title: "Dubai", series: "landscape" },
    { n: 26, title: "Tiny home by the beach", series: "landscape" }
  ].map(function (x) {
    return { src: f(x.n), srcMobile: fMobile(x.n), title: x.title, series: x.series };
  });

  var SERIES = [
    { id: "portraits", label: "Portraits", title: "Portraits" },
    { id: "ocean", label: "Ocean", title: "Ocean" },
    { id: "street", label: "Street photography", title: "Street photography" },
    { id: "wildlife", label: "Wildlife", title: "Wildlife" },
    { id: "landscape", label: "Landscape", title: "Landscape" }
  ];

  var TITLES = { all: "Selected work", about: "About", contact: "Contact" };

  var BIO_LEDE =
    "I capture moments and give them a place in history: photos that bring you right back to that instant, every time you look at them.";

  var BODIES = {
    about: [
      "I grew up drawn to photography and visual art long before I could afford a camera of my own, so I studied the craft in theory first, waiting for the day I could put it into practice. When that day came, I worked my way through a string of old film cameras and lenses, learning by feel. A trip to Tokyo finally settled it: I picked up a Sony A7III there, and it's been my camera since.",
      "That pull toward images turned out to shape more than a hobby. It led me into a Master's degree in User Experience Design, while portraits and landscapes stayed a constant thread of their own alongside it. Series are released when they're finished rather than on a schedule; Portraits, Ocean, Street photography, Wildlife and Landscape are the running bodies of work.",
      "The peak of it so far was photographing a Czech presidential delegation on its visit to Wellington, New Zealand, where I'm now based.",
      "Available for commissions, editorial assignments and prints."
    ],
    contact: [
      "For commissions, prints and licensing — hello@jansvaty.com",
      '<a href="https://www.instagram.com/jan.svaty/" target="_blank" rel="noopener">Instagram</a> · <a href="https://www.linkedin.com/in/jansvaty/?skipRedirect=true" target="_blank" rel="noopener">LinkedIn</a>',
      "Based in Wellington, New Zealand. Working worldwide."
    ]
  };

  var THEME_KEY = "jansvaty-photography-theme";

  var els = {
    sidebar: document.querySelector(".sidebar"),
    nav: document.querySelector(".nav"),
    themeToggle: document.querySelector(".theme-toggle"),
    menuToggle: document.querySelector(".menu-toggle"),
    scrim: document.querySelector(".sidebar-scrim"),
    main: document.querySelector(".main"),
    viewTitle: null,
    strip: document.querySelector(".strip"),
    stripControls: document.querySelector(".strip-controls"),
    textView: document.querySelector(".text-view"),
    galleryView: document.querySelector(".gallery-view"),
    lightbox: document.querySelector(".lightbox"),
    lightboxImg: document.querySelector(".lightbox img")
  };

  var state = { view: "all", floating: false, lightbox: null };

  function currentFrames() {
    var s = SERIES.filter(function (x) {
      return x.id === state.view;
    })[0];
    return s ? FRAMES.filter(function (x) { return x.series === s.id; }) : FRAMES;
  }

  function isText() {
    return state.view === "about" || state.view === "contact";
  }

  function renderNav() {
    var items = [{ id: "all", label: "Selected work" }].concat(
      SERIES.map(function (s) {
        return { id: s.id, label: s.label };
      })
    );
    els.nav.innerHTML = items
      .map(function (item) {
        var active = state.view === item.id ? " active" : "";
        return (
          '<a href="#' +
          item.id +
          '" data-view="' +
          item.id +
          '" class="' +
          active.trim() +
          '">' +
          item.label +
          "</a>"
        );
      })
      .join("");

    document.querySelectorAll(".sub-links a").forEach(function (a) {
      a.classList.toggle("active", a.dataset.view === state.view);
    });
  }

  var MOBILE_MQ = window.matchMedia("(max-width: 720px)");

  function renderGallery() {
    var frames = currentFrames();
    els.strip.innerHTML =
      frames
        .map(function (photo) {
          var src = MOBILE_MQ.matches ? photo.srcMobile : photo.src;
          return (
            '<figure class="frame">' +
            '<img src="' +
            src +
            '" alt="' +
            photo.title +
            '" loading="lazy">' +
            '<figcaption>' +
            photo.title +
            "</figcaption>" +
            "</figure>"
          );
        })
        .join("") + '<div class="strip-spacer"></div>';

    els.strip.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("click", function () {
        openLightbox(img.currentSrc || img.src);
      });
    });

    els.strip.scrollTo({ left: 0 });
    state.floating = false;
    els.sidebar.classList.remove("is-floating");
  }

  function renderTextView() {
    var series = SERIES.filter(function (x) {
      return x.id === state.view;
    })[0];
    var title = series ? series.title : TITLES[state.view];
    var body = BODIES[state.view] || [];

    var html = "<h1>" + title + "</h1>";
    if (state.view === "about") {
      html += '<p class="lede">' + BIO_LEDE + "</p>";
    }
    html += body.map(function (p) { return '<p class="body">' + p + "</p>"; }).join("");
    els.textView.innerHTML = html;
  }

  function render() {
    renderNav();

    var text = isText();
    els.textView.hidden = !text;
    els.galleryView.hidden = text;

    if (text) {
      renderTextView();
    } else {
      renderGallery();
    }
  }

  function go(view) {
    state.view = view;
    state.lightbox = null;
    closeLightbox();
    window.location.hash = view === "all" ? "" : view;
    render();
  }

  function onHashChange() {
    var hash = window.location.hash.replace("#", "");
    var valid = ["all", "portraits", "ocean", "street", "wildlife", "landscape", "about", "contact"];
    state.view = valid.indexOf(hash) !== -1 ? hash : "all";
    render();
  }

  function openLightbox(src) {
    els.lightboxImg.src = src;
    els.lightbox.hidden = false;
  }

  function closeLightbox() {
    els.lightbox.hidden = true;
    els.lightboxImg.src = "";
  }

  // Mobile menu (hamburger drawer — hidden entirely above the 720px breakpoint)
  function openMobileMenu() {
    els.sidebar.classList.add("mobile-open");
    els.scrim.classList.add("visible");
  }
  function closeMobileMenu() {
    els.sidebar.classList.remove("mobile-open");
    els.scrim.classList.remove("visible");
  }
  els.menuToggle.addEventListener("click", function () {
    if (els.sidebar.classList.contains("mobile-open")) closeMobileMenu();
    else openMobileMenu();
  });
  els.scrim.addEventListener("click", closeMobileMenu);

  // Nav clicks (delegated — nav is re-rendered)
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-view]");
    if (a) {
      e.preventDefault();
      go(a.dataset.view);
      closeMobileMenu();
    }
  });

  els.lightbox.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeLightbox();
      closeMobileMenu();
    }
  });

  els.strip.addEventListener("scroll", function () {
    var floating = els.strip.scrollLeft > 16;
    if (floating !== state.floating) {
      state.floating = floating;
      els.sidebar.classList.toggle("is-floating", floating);
    }
  });

  els.stripControls.querySelector('[data-nudge="-1"]').addEventListener("click", function () {
    els.strip.scrollBy({ left: -Math.max(320, els.strip.clientWidth * 0.7), behavior: "smooth" });
  });
  els.stripControls.querySelector('[data-nudge="1"]').addEventListener("click", function () {
    els.strip.scrollBy({ left: Math.max(320, els.strip.clientWidth * 0.7), behavior: "smooth" });
  });

  // Theme
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    els.themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
  }

  function toggleTheme() {
    var theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  els.themeToggle.addEventListener("click", toggleTheme);

  var savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light");

  // Re-pick desktop/mobile image sources if the viewport crosses the
  // breakpoint (e.g. rotating a phone, resizing a window).
  MOBILE_MQ.addEventListener("change", function () {
    if (!isText()) renderGallery();
  });

  window.addEventListener("hashchange", onHashChange);
  onHashChange();
})();
