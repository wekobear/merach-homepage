/* ==========================================================================
   MERACH 2.0 — Kinetic Concept Interactions
   ========================================================================== */
(function () {
  "use strict";

  /* 1. Kinetic Slot-Machine Hero Typography */
  const slotItems = [
    { icon: "⚡", label: "Fat Burn HIIT", cmd: "goal: fat-burn · space: bedroom · noise: <42dB → UltraWalk W60 Plus" },
    { icon: "🏋️", label: "Full-Body Strength", cmd: "goal: strength · load: 1,200 LB · ratio: 1:1 & 2:1 → MERACH P16 Pro" },
    { icon: "🚣", label: "Cardio Endurance", cmd: "goal: endurance · muscles: 86% · finish: walnut → NovaRow 950" },
    { icon: "🧘", label: "Active Recovery", cmd: "goal: recovery · time: 10 min · footprint: compact → Vibration Plate" },
  ];

  let slotIdx = 0;
  const slotBtn = document.getElementById("v2SlotBtn");
  const slotPrev = document.getElementById("v2SlotPrev");
  const slotActive = document.getElementById("v2SlotActive");
  const slotIcon = document.getElementById("v2SlotIcon");
  const slotLabel = document.getElementById("v2SlotLabel");
  const slotNext = document.getElementById("v2SlotNext");
  const cmdText = document.getElementById("v2CmdText");
  const cmdCycleBtn = document.getElementById("v2CmdCycleBtn");

  function renderSlot(idx) {
    slotIdx = ((idx % slotItems.length) + slotItems.length) % slotItems.length;
    const prev = slotItems[(slotIdx - 1 + slotItems.length) % slotItems.length];
    const curr = slotItems[slotIdx];
    const next = slotItems[(slotIdx + 1) % slotItems.length];

    if (slotActive) slotActive.classList.add("is-swapping");
    setTimeout(() => {
      if (slotPrev) slotPrev.textContent = prev.label;
      if (slotIcon) slotIcon.textContent = curr.icon;
      if (slotLabel) slotLabel.textContent = curr.label;
      if (slotNext) slotNext.textContent = next.label;
      if (cmdText) cmdText.textContent = curr.cmd;
      if (slotActive) slotActive.classList.remove("is-swapping");
    }, 180);
  }

  let slotTimer = setInterval(() => renderSlot(slotIdx + 1), 3200);
  function manualNextSlot() {
    clearInterval(slotTimer);
    renderSlot(slotIdx + 1);
    slotTimer = setInterval(() => renderSlot(slotIdx + 1), 3600);
  }

  if (slotBtn) slotBtn.addEventListener("click", manualNextSlot);
  if (cmdCycleBtn) cmdCycleBtn.addEventListener("click", manualNextSlot);

  /* 2. 360° Orbital Ecosystem Ring Interactive Preview */
  const orbitData = [
    { name: "Treadmills", spec: "Cushioned Deck · Auto-Incline", img: "./assets/cat-lifestyle-treadmills.jpg" },
    { name: "Walking Pad", spec: "Under-Desk · <40 dB Whisper", img: "./assets/cat-lifestyle-walkingpad.jpg" },
    { name: "Water Rowers", spec: "86% Full-Body Activation", img: "./assets/cat-lifestyle-rowers.jpg" },
    { name: "Spin Bikes", spec: "Auto-Magnetic Resistance", img: "./assets/cat-lifestyle-bikes.jpg" },
    { name: "Recovery", spec: "Daily Circulation & Mobility", img: "./assets/cat-lifestyle-essential.jpg" },
    { name: "MERACH App", spec: "Free Courses & AR Scenic Routes", img: "./assets/moment-bedroom-2.jpg" },
    { name: "P16 Smith Rack", spec: "1,200 LB · Dual 180° Towers", img: "./assets/moment-garage-3.jpg" },
    { name: "HSA / FSA", spec: "Save ~30% With Pre-Tax Funds", img: "./assets/moment-bedroom-1.jpg" },
  ];

  const orbitNodes = Array.from(document.querySelectorAll(".v2-orbit-node"));
  const orbitImg = document.getElementById("v2OrbitImg");
  const orbitName = document.getElementById("v2OrbitName");
  const orbitSpec = document.getElementById("v2OrbitSpec");

  function setOrbitFocus(idx) {
    const item = orbitData[idx] || orbitData[0];
    orbitNodes.forEach((n, i) => n.classList.toggle("is-active", i === idx));
    if (orbitImg) orbitImg.src = item.img;
    if (orbitName) orbitName.textContent = item.name;
    if (orbitSpec) orbitSpec.textContent = item.spec;
  }

  orbitNodes.forEach((node) => {
    const idx = Number(node.dataset.idx || 0);
    node.addEventListener("mouseenter", () => setOrbitFocus(idx));
    node.addEventListener("click", () => setOrbitFocus(idx));
  });

  /* 3. Scroll-Pinned Giant Counter Narrative */
  const milestones = [
    {
      badge: "M",
      label: "Global Home Workouts Synced",
      value: "2,400,000+",
      sub: "Not a concept render. Real smart cardio & strength systems running daily across North America, Europe, and Asia.",
    },
    {
      badge: "P16",
      label: "Commercial 11-Gauge Steel Frame",
      value: "1,200 LB",
      sub: "Laser-cut steel uprights, CNC aluminum pulleys, and dual 180° cable towers engineered for lifetime strength progression.",
    },
    {
      badge: "dB",
      label: "Whisper-Quiet Magnetic Engineering",
      value: "<42 dB",
      sub: "Train at 6 AM or midnight in your bedroom or apartment without ever waking the household.",
    },
  ];

  const scaleSection = document.getElementById("scale-proof");
  const scaleBadge = document.getElementById("v2ScaleBadge");
  const scaleLabel = document.getElementById("v2ScaleMetricLabel");
  const giantNum = document.getElementById("v2GiantNumber");
  const scaleSub = document.getElementById("v2ScaleSub");
  const scalePills = Array.from(document.querySelectorAll(".v2-scale-pill"));
  let currentMilestone = 0;

  function setMilestone(idx) {
    if (idx === currentMilestone && giantNum && giantNum.textContent === milestones[idx].value) return;
    currentMilestone = idx;
    const m = milestones[idx] || milestones[0];
    if (scaleBadge) scaleBadge.textContent = m.badge;
    if (scaleLabel) scaleLabel.textContent = m.label;
    if (giantNum) giantNum.textContent = m.value;
    if (scaleSub) scaleSub.textContent = m.sub;
    scalePills.forEach((p, i) => {
      p.classList.toggle("is-active", i === idx);
      p.setAttribute("aria-selected", String(i === idx));
    });
  }

  scalePills.forEach((pill) => {
    pill.addEventListener("click", () => setMilestone(Number(pill.dataset.milestone || 0)));
  });

  window.addEventListener("scroll", () => {
    if (!scaleSection) return;
    const rect = scaleSection.getBoundingClientRect();
    const total = scaleSection.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const progress = Math.max(0, Math.min(1, -rect.top / total));
    if (progress < 0.35) setMilestone(0);
    else if (progress < 0.72) setMilestone(1);
    else setMilestone(2);
  }, { passive: true });

  /* 4. Interactive Bento Room Switcher + Live Telemetry Pulse */
  const roomScenes = {
    garage: {
      img1: "./assets/moment-garage-1.jpg",
      tag1: "Garage · 07:00 AM",
      title1: "Morning Wake-Up",
      desc1: "Kickstart the day with a full-body rowing session in your sunlit garage studio.",
      img2: "./assets/moment-garage-2.jpg",
      tag2: "Garage · 06:30 PM",
      title2: "After-Work Reset",
      desc2: "Shake off the day with cushioned treadmill intervals.",
    },
    bedroom: {
      img1: "./assets/moment-bedroom-1.jpg",
      tag1: "Bedroom · 07:30 AM",
      title1: "Quiet Morning Walk",
      desc1: "Whisper-quiet under-desk stride before your first morning meeting.",
      img2: "./assets/moment-bedroom-2.jpg",
      tag2: "Bedroom · 09:00 PM",
      title2: "Evening Wind-Down",
      desc2: "Low-impact cycling that clears the mind without disturbing the home.",
    },
    living: {
      img1: "./assets/cat-lifestyle-rowers.jpg",
      tag1: "Living Room · Anytime",
      title1: "Living Room Studio",
      desc1: "Furniture-grade wood and matte steel crafted for modern interiors.",
      img2: "./assets/cat-lifestyle-bikes.jpg",
      tag2: "Living Room · Weekend",
      title2: "Family Challenge",
      desc2: "Sync live leaderboards to your TV through the free MERACH App.",
    },
  };

  const roomTabs = Array.from(document.querySelectorAll(".v2-room-tab"));
  roomTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.room || "garage";
      const d = roomScenes[key] || roomScenes.garage;
      roomTabs.forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      const setEl = (id, prop, val) => {
        const el = document.getElementById(id);
        if (el) el[prop] = val;
      };
      setEl("v2BentoImg1", "src", d.img1);
      setEl("v2BentoTag1", "textContent", d.tag1);
      setEl("v2BentoTitle1", "textContent", d.title1);
      setEl("v2BentoDesc1", "textContent", d.desc1);
      setEl("v2BentoImg2", "src", d.img2);
      setEl("v2BentoTag2", "textContent", d.tag2);
      setEl("v2BentoTitle2", "textContent", d.title2);
      setEl("v2BentoDesc2", "textContent", d.desc2);
    });
  });

  // Subtle live telemetry heartbeat
  const hrEl = document.getElementById("v2TeleHr");
  const calEl = document.getElementById("v2TeleCal");
  let calCount = 318;
  setInterval(() => {
    if (hrEl) hrEl.textContent = `${139 + Math.floor(Math.random() * 8)} bpm`;
    if (calEl) {
      calCount += 1;
      calEl.textContent = `${calCount} kcal`;
    }
  }, 2400);

  /* 5. Seamless Horizontal Auto-Scroll + Drag on Reviews */
  const vp = document.getElementById("v2ReviewsViewport");
  const track = document.getElementById("v2ReviewsTrack");
  if (vp && track) {
    Array.from(track.children).forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    let paused = false;
    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    let acc = 0;

    vp.addEventListener("mouseenter", () => { paused = true; });
    vp.addEventListener("mouseleave", () => {
      paused = false;
      dragging = false;
      vp.classList.remove("is-dragging");
    });
    vp.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX;
      startLeft = vp.scrollLeft;
      vp.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      vp.scrollLeft = startLeft - (e.clientX - startX);
    });
    window.addEventListener("pointerup", () => {
      dragging = false;
      vp.classList.remove("is-dragging");
    });

    function tick() {
      if (!paused && !dragging && !document.hidden) {
        const half = track.scrollWidth / 2;
        if (half > 0) {
          acc += 0.65;
          if (acc >= 1) {
            const step = Math.floor(acc);
            acc -= step;
            vp.scrollLeft += step;
            if (vp.scrollLeft >= half) vp.scrollLeft -= half;
          }
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
