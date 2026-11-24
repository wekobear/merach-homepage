/* ==========================================================================
   MERACH Homepage — Interactive Behaviors
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Toast & Modal Helpers
     ------------------------------------------------------------------------ */
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 3000);
  }

  const infoModal = document.getElementById("infoModal");
  const infoModalTitle = document.getElementById("infoModalTitle");
  const infoModalBody = document.getElementById("infoModalBody");
  const searchModal = document.getElementById("searchModal");
  const mobileMenuDrawer = document.getElementById("mobileMenuDrawer");

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeAllModals() {
    [infoModal, searchModal, mobileMenuDrawer].forEach((m) => {
      if (m) m.hidden = true;
    });
    const menuBtn = document.getElementById("openMobileMenuBtn");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  [infoModal, searchModal, mobileMenuDrawer].forEach((backdrop) => {
    if (!backdrop) return;
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });

  /* ------------------------------------------------------------------------
     2. Sticky Header (White Background + Black Text on Scroll) & Actions
     ------------------------------------------------------------------------ */
  const siteHeader = document.getElementById("siteHeader");
  function syncHeaderScrollState() {
    if (!siteHeader) return;
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", syncHeaderScrollState, { passive: true });
  syncHeaderScrollState();

  const openSearchBtn = document.getElementById("openSearchBtn");
  const openCartBtn = document.getElementById("openCartBtn");
  const openAccountBtn = document.getElementById("openAccountBtn");
  const openMobileMenuBtn = document.getElementById("openMobileMenuBtn");
  const closeMobileMenuBtn = document.getElementById("closeMobileMenuBtn");
  const searchInput = document.getElementById("searchInput");

  if (openSearchBtn) {
    openSearchBtn.addEventListener("click", () => {
      openModal(searchModal);
      setTimeout(() => searchInput && searchInput.focus(), 50);
    });
  }

  if (openCartBtn) {
    openCartBtn.addEventListener("click", () => {
      infoModalTitle.textContent = "Your Cart";
      infoModalBody.textContent =
        "Your MERACH cart is currently empty. Explore our walking pads, treadmills, rowers, and strength systems to get started.";
      openModal(infoModal);
    });
  }

  if (openAccountBtn) {
    openAccountBtn.addEventListener("click", () => {
      infoModalTitle.textContent = "MERACH Account";
      infoModalBody.textContent =
        "Sign in to track orders, sync your MERACH App training data, and manage warranty coverage.";
      openModal(infoModal);
    });
  }

  if (openMobileMenuBtn) {
    openMobileMenuBtn.addEventListener("click", () => {
      openMobileMenuBtn.setAttribute("aria-expanded", "true");
      openModal(mobileMenuDrawer);
    });
  }

  if (closeMobileMenuBtn) {
    closeMobileMenuBtn.addEventListener("click", closeAllModals);
  }

  document.querySelectorAll(".drawer-link").forEach((link) => {
    link.addEventListener("click", closeAllModals);
  });

  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = (searchInput.value || "").trim();
      closeAllModals();
      showToast(q ? `Showing results for “${q}”` : "Enter a product name to search");
    });
  }

  document.querySelectorAll(".search-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = tag.dataset.searchTerm || tag.textContent;
        searchInput.focus();
      }
    });
  });

  /* ------------------------------------------------------------------------
     3. Hero Carousel
     ------------------------------------------------------------------------ */
  const heroSlides = [
    {
      title: "Merach UltraWalk W60 Plus",
      subtitle: "Your First and Last Walking Pad. One Machine Built to Last",
      bgPc: "./assets/hero-bg-pc.png",
      bgMobile: "./assets/hero-bg-mobile.png",
      progress: "62.18%",
    },
    {
      title: "MERACH P16 Strength System",
      subtitle: "Heavy-Duty Steel Foundation Built for Full-Body Home Training",
      bgPc: "./assets/system-banner-pc.png",
      bgMobile: "./assets/system-banner-mobile.png",
      progress: "100%",
    },
    {
      title: "NovaRow 950 Water Rower",
      subtitle: "Engage Over 86% of Your Muscles in Just 20 Minutes at Home",
      bgPc: "./assets/moment-1.png",
      bgMobile: "./assets/moment-1.png",
      progress: "100%",
    },
    {
      title: "S26 Aura Exercise Bike",
      subtitle: "Whisper-Quiet Magnetic Resistance Built for High-Intensity Intervals",
      bgPc: "./assets/blog-1.png",
      bgMobile: "./assets/blog-1.png",
      progress: "100%",
    },
    {
      title: "Leading the Future of Fitness",
      subtitle: "AI Motion Algorithms and AR Connected Training for Every Home",
      bgPc: "./assets/future-bg-pc.png",
      bgMobile: "./assets/future-bg-mobile.png",
      progress: "100%",
    },
    {
      title: "After-Work Cardio Reset",
      subtitle: "Commercial-Grade Cushioned Decks Designed for Quiet Daily Runs",
      bgPc: "./assets/moment-2.png",
      bgMobile: "./assets/moment-2.png",
      progress: "100%",
    },
  ];

  let currentHeroSlide = 0;
  const heroTitleEl = document.getElementById("heroTitle");
  const heroSubtitleEl = document.getElementById("heroSubtitle");
  const heroBgMedia = document.getElementById("heroBgMedia");
  const heroBgImg = document.getElementById("heroBgImg");
  const heroSourceMobile = heroBgMedia ? heroBgMedia.querySelector("source") : null;
  const heroContent = document.getElementById("heroSlideContent");
  const heroIndicatorBtns = Array.from(document.querySelectorAll("#heroIndicators .hero-indicator"));

  function setHeroSlide(index) {
    const count = window.innerWidth <= 767 ? 5 : heroSlides.length;
    currentHeroSlide = ((index % count) + count) % count;
    const slide = heroSlides[currentHeroSlide];

    if (heroContent) heroContent.style.opacity = "0";
    setTimeout(() => {
      if (heroTitleEl) heroTitleEl.textContent = slide.title;
      if (heroSubtitleEl) heroSubtitleEl.textContent = slide.subtitle;
      if (heroBgImg) heroBgImg.src = slide.bgPc;
      if (heroSourceMobile) heroSourceMobile.srcset = slide.bgMobile;
      if (heroContent) heroContent.style.opacity = "1";
    }, 140);

    heroIndicatorBtns.forEach((btn, i) => {
      const fill = btn.querySelector(".hero-indicator-fill");
      const active = i === currentHeroSlide;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
      if (fill) {
        fill.style.width = active ? slide.progress : "0%";
      }
    });
  }

  const heroPrevBtn = document.getElementById("heroPrevBtn");
  const heroNextBtn = document.getElementById("heroNextBtn");
  if (heroPrevBtn) heroPrevBtn.addEventListener("click", () => setHeroSlide(currentHeroSlide - 1));
  if (heroNextBtn) heroNextBtn.addEventListener("click", () => setHeroSlide(currentHeroSlide + 1));

  heroIndicatorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.slide || 0);
      setHeroSlide(idx);
    });
  });

  /* ------------------------------------------------------------------------
     4. Tab Switchers (Animated Underline + Filtering)
     ------------------------------------------------------------------------ */
  function positionTabBar(switcher) {
    const activeBtn = switcher.querySelector(".tab-btn.is-active");
    const bar = switcher.querySelector(".tab-active-bar");
    const list = switcher.querySelector(".tab-list");
    const track = switcher.querySelector(".tab-track");
    if (!activeBtn || !bar || !list) return;

    if (track) {
      track.style.width = `${list.scrollWidth}px`;
    }
    const left = activeBtn.offsetLeft;
    const width = activeBtn.offsetWidth;
    bar.style.width = `${width}px`;
    bar.style.transform = `translateX(${left}px)`;
  }

  const categoryCardsEquipment = [
    { title: "Treadmills", img: "./assets/cat-treadmills.png", frameClass: "frame-treadmills", cropClass: "crop-treadmills" },
    { title: "Walking Pad", img: "./assets/cat-walkingpad.png", frameClass: "frame-walkingpad", cropClass: "crop-walkingpad" },
    { title: "Rowers", img: "./assets/cat-rowers.png", frameClass: "frame-rowers", cropClass: "crop-rowers" },
    { title: "Bikes", img: "./assets/cat-bikes.png", frameClass: "frame-bikes", cropClass: "crop-bikes" },
    { title: "Essential", img: "./assets/cat-essential.png", frameClass: "frame-essential", cropClass: "crop-essential" },
  ];

  const categoryCardsGoal = [
    { title: "Cardio Endurance", img: "./assets/cat-treadmills.png", frameClass: "frame-treadmills", cropClass: "crop-treadmills" },
    { title: "Daily Steps", img: "./assets/cat-walkingpad.png", frameClass: "frame-walkingpad", cropClass: "crop-walkingpad" },
    { title: "Full-Body Rowing", img: "./assets/cat-rowers.png", frameClass: "frame-rowers", cropClass: "crop-rowers" },
    { title: "Fat Burn HIIT", img: "./assets/cat-bikes.png", frameClass: "frame-bikes", cropClass: "crop-bikes" },
    { title: "Active Recovery", img: "./assets/cat-essential.png", frameClass: "frame-essential", cropClass: "crop-essential" },
  ];

  function renderCategoryTab(tabName) {
    const grid = document.getElementById("categoryGrid");
    if (!grid) return;
    grid.setAttribute("data-active-tab", tabName);
    const items = tabName === "goal" ? categoryCardsGoal : categoryCardsEquipment;
    const titles = grid.querySelectorAll(".category-card-title");
    titles.forEach((el, i) => {
      if (items[i]) el.textContent = items[i].title;
    });
  }

  const momentsBySpace = {
    garage: [
      { title: "Morning Wake-up", desc: "Ease into the day with a little movement." },
      { title: "After-work Reset", desc: "Ease into the day with a little movement." },
      { title: "After-work Reset", desc: "Ease into the day with a little movement." },
    ],
    bedroom: [
      { title: "Quiet Morning Walk", desc: "Whisper-quiet under-desk stride before your first meeting." },
      { title: "Evening Wind-Down", desc: "Low-impact cardio that clears the mind without disturbing the home." },
      { title: "Compact Stowaway", desc: "Slide smoothly beneath the bed frame in seconds." },
    ],
    "living-room": [
      { title: "Living Room Studio", desc: "Furniture-grade wood and sleek matte steel crafted for modern interiors." },
      { title: "Family Challenge", desc: "Sync live leaderboards to your TV through the MERACH App." },
      { title: "Weekend Endurance", desc: "Scenic interactive routes from the comfort of your sofa view." },
    ],
  };

  function renderMomentsTab(space) {
    const data = momentsBySpace[space] || momentsBySpace.garage;
    const cards = document.querySelectorAll("#momentsTrack .moment-card");
    cards.forEach((card, i) => {
      if (!data[i]) return;
      const titleDesktop = card.querySelector(".moment-title .label-desktop") || card.querySelector(".moment-title");
      const desc = card.querySelector(".moment-desc");
      if (titleDesktop) titleDesktop.textContent = data[i].title;
      if (desc) desc.textContent = data[i].desc;
    });
  }

  const allTabSwitchers = Array.from(document.querySelectorAll(".tab-switcher"));
  allTabSwitchers.forEach((switcher) => {
    const group = switcher.dataset.tabs;
    const buttons = Array.from(switcher.querySelectorAll(".tab-btn"));

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        positionTabBar(switcher);

        const tabVal = btn.dataset.tab;
        if (group === "category") {
          renderCategoryTab(tabVal);
        } else if (group === "moments") {
          renderMomentsTab(tabVal);
        } else if (group === "reviews") {
          const track = document.getElementById("reviewsTrack");
          if (track) {
            track.style.transform = tabVal === "consumers" ? "translateX(-120px)" : "translateX(0)";
          }
        } else if (group === "guidance") {
          const cards = document.querySelectorAll("#guidanceTrack .blog-card");
          cards.forEach((card) => {
            const cat = card.dataset.blogCategory;
            const visible = tabVal === "all" || tabVal === "getting-started" || cat === tabVal;
            card.style.display = visible ? "" : "none";
          });
        }
      });
    });

    positionTabBar(switcher);
  });

  window.addEventListener("resize", () => {
    allTabSwitchers.forEach(positionTabBar);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      allTabSwitchers.forEach(positionTabBar);
    });
  }

  /* ------------------------------------------------------------------------
     5. Section 03 — P16 System Showcase Interactive Features
     ------------------------------------------------------------------------ */
  const systemFeatures = [
    {
      title: "Rock-Solid Safety",
      lead: "Heavy-duty steel.",
      desc: "A substantial steel foundation for your home strength setup.",
    },
    {
      title: "Natural Biomechanics",
      lead: "Precision cable geometry.",
      desc: "Dual independent arms follow your natural joint path for safer, deeper muscle activation.",
    },
    {
      title: "Gym-Grade Fluidity",
      lead: "Commercial pulley bearings.",
      desc: "Whisper-quiet, frictionless resistance engineered to stay smooth across every rep.",
    },
  ];

  let activeSystemIdx = 0;
  const featureItems = Array.from(document.querySelectorAll("#systemFeatureList .system-feature-item"));

  function setSystemFeature(idx) {
    activeSystemIdx = ((idx % systemFeatures.length) + systemFeatures.length) % systemFeatures.length;
    featureItems.forEach((item, i) => {
      const expanded = i === activeSystemIdx;
      item.classList.toggle("is-expanded", expanded);
      item.setAttribute("aria-expanded", String(expanded));
    });
  }

  featureItems.forEach((item, idx) => {
    item.addEventListener("click", () => setSystemFeature(idx));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSystemFeature(idx);
      }
    });
  });

  const systemPrevBtn = document.getElementById("systemPrevBtn");
  const systemNextBtn = document.getElementById("systemNextBtn");
  if (systemPrevBtn) systemPrevBtn.addEventListener("click", () => setSystemFeature(activeSystemIdx - 1));
  if (systemNextBtn) systemNextBtn.addEventListener("click", () => setSystemFeature(activeSystemIdx + 1));

  // Mobile pills toggle detail popover (starts hidden to match Figma mobile initial view)
  const mobilePills = Array.from(document.querySelectorAll("#systemMobilePills .system-mobile-pill"));
  const mobileFeatureDetail = document.getElementById("mobileFeatureDetail");
  const mobileFeatureLead = document.getElementById("mobileFeatureLead");
  const mobileFeatureDesc = document.getElementById("mobileFeatureDesc");
  let activeMobilePill = null;

  mobilePills.forEach((pill, idx) => {
    pill.addEventListener("click", () => {
      if (activeMobilePill === idx) {
        activeMobilePill = null;
        pill.classList.remove("is-active");
        if (mobileFeatureDetail) mobileFeatureDetail.hidden = true;
        return;
      }
      activeMobilePill = idx;
      mobilePills.forEach((p, i) => p.classList.toggle("is-active", i === idx));
      if (mobileFeatureLead) mobileFeatureLead.textContent = systemFeatures[idx].lead;
      if (mobileFeatureDesc) mobileFeatureDesc.textContent = systemFeatures[idx].desc;
      if (mobileFeatureDetail) mobileFeatureDetail.hidden = false;
    });
  });

  /* ------------------------------------------------------------------------
     6. Horizontal Carousels with Progress & Arrows (Sections 05 & 11)
     ------------------------------------------------------------------------ */
  function setupHorizontalCarousel(viewportId, prevBtnId, nextBtnId, progressId, cardSelector) {
    const viewport = document.getElementById(viewportId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const indicator = document.getElementById(progressId);
    if (!viewport || !prevBtn || !nextBtn || !indicator) return;

    function getStep() {
      const card = viewport.querySelector(cardSelector);
      return card ? card.offsetWidth + 16 : 540;
    }

    function updateState() {
      const maxScroll = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
      const ratio = Math.min(1, Math.max(0, viewport.scrollLeft / maxScroll));
      const trackWidth = indicator.parentElement ? indicator.parentElement.clientWidth : 792;
      const barWidth = indicator.offsetWidth || 177;
      const maxShift = Math.max(0, trackWidth - barWidth);
      indicator.style.transform = `translateX(${ratio * maxShift}px)`;

      prevBtn.classList.toggle("is-muted", viewport.scrollLeft <= 2);
      nextBtn.classList.toggle("is-muted", viewport.scrollLeft >= maxScroll - 2);
    }

    prevBtn.addEventListener("click", () => {
      viewport.scrollBy({ left: -getStep(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      viewport.scrollBy({ left: getStep(), behavior: "smooth" });
    });

    viewport.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    updateState();
  }

  setupHorizontalCarousel("momentsViewport", "momentsPrevBtn", "momentsNextBtn", "momentsProgress", ".moment-card");
  setupHorizontalCarousel("guidanceViewport", "guidancePrevBtn", "guidanceNextBtn", "guidanceProgress", ".blog-card:not(.blog-card-featured)");

  /* ------------------------------------------------------------------------
     7. Review Video Play Buttons & Guide Preview Buttons
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-play-reviewer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      infoModalTitle.textContent = `${btn.dataset.playReviewer} — Video Story`;
      infoModalBody.textContent = btn.dataset.playQuote || "";
      openModal(infoModal);
    });
  });

  document.querySelectorAll(".blog-read-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      infoModalTitle.textContent = btn.dataset.guideTitle || "Training Guide";
      infoModalBody.textContent = btn.dataset.guideSummary || "";
      openModal(infoModal);
    });
  });

  /* ------------------------------------------------------------------------
     8. Footer Newsletter Form & Mobile Accordions
     ------------------------------------------------------------------------ */
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterConsent = document.getElementById("newsletterConsent");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (newsletterEmail.value || "").trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email address.");
        newsletterEmail.focus();
        return;
      }
      if (!newsletterConsent.checked) {
        showToast("Please confirm the privacy policy consent checkbox.");
        return;
      }
      newsletterEmail.value = "";
      newsletterConsent.checked = false;
      showToast("Thanks for subscribing to MERACH updates!");
    });
  }

  document.querySelectorAll("[data-accordion]").forEach((col) => {
    const headingBtn = col.querySelector(".footer-col-heading");
    if (!headingBtn) return;
    headingBtn.addEventListener("click", () => {
      if (window.innerWidth > 767) return;
      const isOpen = col.classList.toggle("is-open");
      headingBtn.setAttribute("aria-expanded", String(isOpen));
    });
  });

  const localeBtn = document.getElementById("localeBtn");
  if (localeBtn) {
    localeBtn.addEventListener("click", () => {
      showToast("Current region: United States (English)");
    });
  }
})();
