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

  const HERO_AUTOPLAY_MS = 6000;
  let currentHeroSlide = 0;
  let heroElapsedMs = 0;
  let heroLastTick = 0;
  let heroRafId = null;
  let heroSwapTimer = null;

  const heroTitleEl = document.getElementById("heroTitle");
  const heroSubtitleEl = document.getElementById("heroSubtitle");
  const heroBgMedia = document.getElementById("heroBgMedia");
  const heroBgImg = document.getElementById("heroBgImg");
  const heroSourceMobile = heroBgMedia ? heroBgMedia.querySelector("source") : null;
  const heroContent = document.getElementById("heroSlideContent");
  const heroIndicatorBtns = Array.from(document.querySelectorAll("#heroIndicators .hero-indicator"));

  function resetHeroIndicators(activeIdx) {
    heroIndicatorBtns.forEach((btn, i) => {
      const fill = btn.querySelector(".hero-indicator-fill");
      const active = i === activeIdx;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
      if (fill) {
        fill.style.width = "0%";
      }
    });
  }

  function setHeroSlide(index, instant = false) {
    const count = window.innerWidth <= 767 ? 5 : heroSlides.length;
    currentHeroSlide = ((index % count) + count) % count;
    const slide = heroSlides[currentHeroSlide];

    heroElapsedMs = 0;
    heroLastTick = performance.now();
    resetHeroIndicators(currentHeroSlide);

    clearTimeout(heroSwapTimer);
    if (instant) {
      if (heroTitleEl) heroTitleEl.textContent = slide.title;
      if (heroSubtitleEl) heroSubtitleEl.textContent = slide.subtitle;
      if (heroBgImg) heroBgImg.src = slide.bgPc;
      if (heroSourceMobile) heroSourceMobile.srcset = slide.bgMobile;
      if (heroContent) heroContent.style.opacity = "1";
    } else {
      if (heroContent) heroContent.style.opacity = "0";
      heroSwapTimer = setTimeout(() => {
        if (heroTitleEl) heroTitleEl.textContent = slide.title;
        if (heroSubtitleEl) heroSubtitleEl.textContent = slide.subtitle;
        if (heroBgImg) heroBgImg.src = slide.bgPc;
        if (heroSourceMobile) heroSourceMobile.srcset = slide.bgMobile;
        if (heroContent) heroContent.style.opacity = "1";
      }, 140);
    }
  }

  function tickHeroAutoplay(now) {
    if (!heroLastTick) heroLastTick = now;
    const dt = now - heroLastTick;
    heroLastTick = now;

    if (!document.hidden && heroIndicatorBtns.length) {
      heroElapsedMs += Math.min(dt, 100);
      const pct = Math.min((heroElapsedMs / HERO_AUTOPLAY_MS) * 100, 100);
      const activeBtn = heroIndicatorBtns[currentHeroSlide];
      const activeFill = activeBtn ? activeBtn.querySelector(".hero-indicator-fill") : null;
      if (activeFill) {
        activeFill.style.width = `${pct.toFixed(2)}%`;
      }
      if (heroElapsedMs >= HERO_AUTOPLAY_MS) {
        setHeroSlide(currentHeroSlide + 1);
      }
    }

    heroRafId = requestAnimationFrame(tickHeroAutoplay);
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

  if (heroIndicatorBtns.length) {
    resetHeroIndicators(0);
    heroLastTick = performance.now();
    heroRafId = requestAnimationFrame(tickHeroAutoplay);
  }

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
      {
        title: "Morning Wake-up",
        desc: "Kickstart the day with a full-body rowing session in your garage studio.",
        img: "./assets/moment-garage-1.jpg",
      },
      {
        title: "After-work Reset",
        desc: "Shake off the day with high-intensity treadmill intervals on cushioned decks.",
        img: "./assets/moment-garage-2.jpg",
      },
      {
        title: "Weekend Strength",
        desc: "Build real power with heavy-duty compound lifts on your home Smith rack.",
        img: "./assets/moment-garage-3.jpg",
      },
    ],
    bedroom: [
      {
        title: "Quiet Morning Walk",
        desc: "Whisper-quiet under-desk stride before your first meeting.",
        img: "./assets/moment-bedroom-1.jpg",
      },
      {
        title: "Evening Wind-Down",
        desc: "Low-impact cycling that clears the mind without disturbing the home.",
        img: "./assets/moment-bedroom-2.jpg",
      },
      {
        title: "Active Recovery",
        desc: "Loosen tight muscles with gentle vibration recovery before sleep.",
        img: "./assets/moment-bedroom-3.jpg",
      },
    ],
    "living-room": [
      {
        title: "Living Room Studio",
        desc: "Furniture-grade wood and sleek matte steel crafted for modern interiors.",
        img: "./assets/cat-lifestyle-rowers.jpg",
      },
      {
        title: "Family Challenge",
        desc: "Sync live leaderboards to your TV through the MERACH App.",
        img: "./assets/cat-lifestyle-bikes.jpg",
      },
      {
        title: "Weekend Endurance",
        desc: "Scenic interactive routes from the comfort of your sofa view.",
        img: "./assets/cat-lifestyle-walkingpad.jpg",
      },
    ],
  };

  function renderMomentsTab(space) {
    const data = momentsBySpace[space] || momentsBySpace.garage;
    const cards = document.querySelectorAll("#momentsTrack .moment-card");
    cards.forEach((card, i) => {
      if (!data[i]) return;
      card.setAttribute("data-space", space);
      const titleEl = card.querySelector(".moment-title");
      const desc = card.querySelector(".moment-desc");
      const img = card.querySelector(".moment-img");
      if (titleEl) titleEl.textContent = data[i].title;
      if (desc) desc.textContent = data[i].desc;
      if (img && data[i].img) {
        img.src = data[i].img;
        img.alt = data[i].title;
      }
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

  // Showcase Variant Switcher (Variant A / Variant B / Original)
  const showcaseSection = document.getElementById("system-showcase");
  if (showcaseSection) {
    const variantBtns = Array.from(showcaseSection.querySelectorAll(".variant-chip"));
    const variantPanels = Array.from(showcaseSection.querySelectorAll(".system-variant-panel"));

    variantBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.variant;
        showcaseSection.setAttribute("data-showcase-variant", target);
        variantBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", String(active));
        });
        variantPanels.forEach((panel) => {
          panel.classList.toggle("is-active", panel.dataset.panel === target);
        });
      });
    });

    // Variant A: Interactive Hardware Hotspots + Bottom Spec Dock
    const svaData = [
      {
        index: "01 / 03",
        metric: "1,200 LB Load",
        title: "Rock-Solid Safety",
        desc: "Heavy-duty 11-gauge commercial steel frame engineered as a permanent foundation for home strength training.",
        transform: "scale(1.03) translate(-1.5%, 0%)",
      },
      {
        index: "02 / 03",
        metric: "180° Dual Arc",
        title: "Natural Biomechanics",
        desc: "Dual independent swivel arms follow your natural joint path for safer, deeper muscle activation across 100+ exercises.",
        transform: "scale(1.06) translate(1.5%, -1%)",
      },
      {
        index: "03 / 03",
        metric: "<42 dB Glide",
        title: "Gym-Grade Fluidity",
        desc: "Precision-machined CNC aluminum pulleys and sealed bearings deliver whisper-quiet, frictionless travel on every rep.",
        transform: "scale(1.08) translate(-2.5%, 3.5%)",
      },
    ];

    const svaSpots = Array.from(showcaseSection.querySelectorAll(".sva-hotspot"));
    const svaTabs = Array.from(showcaseSection.querySelectorAll(".sva-tab"));
    const svaBgWrap = document.getElementById("svaBgWrap");
    const svaCalloutIndex = document.getElementById("svaCalloutIndex");
    const svaCalloutMetric = document.getElementById("svaCalloutMetric");
    const svaCalloutTitle = document.getElementById("svaCalloutTitle");
    const svaCalloutDesc = document.getElementById("svaCalloutDesc");

    function setVariantASpot(idx) {
      const item = svaData[idx] || svaData[0];
      svaSpots.forEach((el, i) => el.classList.toggle("is-active", i === idx));
      svaTabs.forEach((el, i) => {
        el.classList.toggle("is-active", i === idx);
        el.setAttribute("aria-selected", String(i === idx));
      });
      if (svaCalloutIndex) svaCalloutIndex.textContent = item.index;
      if (svaCalloutMetric) svaCalloutMetric.textContent = item.metric;
      if (svaCalloutTitle) svaCalloutTitle.textContent = item.title;
      if (svaCalloutDesc) svaCalloutDesc.textContent = item.desc;
      if (svaBgWrap) svaBgWrap.style.transform = item.transform;
    }

    svaSpots.forEach((btn) => btn.addEventListener("click", () => setVariantASpot(Number(btn.dataset.spot || 0))));
    svaTabs.forEach((btn) => btn.addEventListener("click", () => setVariantASpot(Number(btn.dataset.spot || 0))));
    setVariantASpot(0);

    // Variant B: Split Dark Engineering Showcase
    const svbData = [
      { label: "Frame Load Capacity", value: "1,200 LB", transform: "scale(1.02) translate(0, 0)" },
      { label: "Cable Articulation", value: "180° Dual Arc", transform: "scale(1.07) translate(3%, -2%)" },
      { label: "Pulley Acoustic Rating", value: "<42 dB Whisper", transform: "scale(1.1) translate(-4%, 4%)" },
    ];

    const svbItems = Array.from(showcaseSection.querySelectorAll(".svb-item"));
    const svbMediaWrap = document.getElementById("svbMediaWrap");
    const svbSpecLabel = document.getElementById("svbSpecLabel");
    const svbSpecValue = document.getElementById("svbSpecValue");

    function setVariantBStep(idx) {
      const item = svbData[idx] || svbData[0];
      svbItems.forEach((el, i) => {
        el.classList.toggle("is-active", i === idx);
        el.setAttribute("aria-selected", String(i === idx));
      });
      if (svbSpecLabel) svbSpecLabel.textContent = item.label;
      if (svbSpecValue) svbSpecValue.textContent = item.value;
      if (svbMediaWrap) svbMediaWrap.style.transform = item.transform;
    }

    svbItems.forEach((btn) => btn.addEventListener("click", () => setVariantBStep(Number(btn.dataset.step || 0))));
  }

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
