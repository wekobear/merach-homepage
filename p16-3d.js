import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js";

(function initP16Showroom() {
  const stage = document.getElementById("p16ThreeStage");
  const canvas = document.getElementById("p16ThreeCanvas");
  if (!stage || !canvas) return;

  // Scene & Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0d12, 0.055);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const camera = new THREE.PerspectiveCamera(36, 16 / 9, 0.1, 100);

  // Studio 3-Point Lighting (High-Contrast Product Showcase)
  const hemiLight = new THREE.HemisphereLight(0xf0f6ff, 0x1e2430, 1.15);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
  keyLight.position.set(5.5, 8.5, 6.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const rimCyan = new THREE.DirectionalLight(0x14c3ff, 2.1);
  rimCyan.position.set(-6, 5, -5.5);
  scene.add(rimCyan);

  const rimWhite = new THREE.DirectionalLight(0xdbe8ff, 1.5);
  rimWhite.position.set(5, 3, -5);
  scene.add(rimWhite);

  const fillLight = new THREE.PointLight(0xa8ccff, 1.35, 18);
  fillLight.position.set(-3.2, 2.4, 4.8);
  scene.add(fillLight);

  // Subtle dark contact shadow disc (transparent background, clean orbital look)
  const shadowFloor = new THREE.Mesh(
    new THREE.CircleGeometry(2.3, 48),
    new THREE.ShadowMaterial({ opacity: 0.35 })
  );
  shadowFloor.rotation.x = -Math.PI / 2;
  shadowFloor.position.y = 0.01;
  shadowFloor.receiveShadow = true;
  scene.add(shadowFloor);

  // Materials for MERACH P16 Strength System
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x262b34,
    roughness: 0.32,
    metalness: 0.78,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x16191f,
    roughness: 0.45,
    metalness: 0.52,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf2f6fa,
    roughness: 0.14,
    metalness: 0.95,
  });
  const cyanMat = new THREE.MeshStandardMaterial({
    color: 0x14c3ff,
    emissive: 0x0b5e7c,
    emissiveIntensity: 0.65,
    roughness: 0.22,
    metalness: 0.65,
  });
  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x232730,
    roughness: 0.62,
    metalness: 0.14,
  });
  const cableMat = new THREE.MeshStandardMaterial({
    color: 0xb4c0d0,
    roughness: 0.25,
    metalness: 0.88,
  });

  const allP16Materials = [steelMat, darkMat, chromeMat, cyanMat, leatherMat, cableMat];

  // Build Detailed MERACH P16 Procedural 3D Model
  const rack = new THREE.Group();
  rack.position.y = 0.08;
  scene.add(rack);

  function addBox(w, h, d, x, y, z, mat = steelMat, rx = 0, ry = 0, rz = 0) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    rack.add(mesh);
    return mesh;
  }

  function addCyl(rt, rb, h, x, y, z, mat = chromeMat, rx = 0, ry = 0, rz = 0, seg = 24) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    rack.add(mesh);
    return mesh;
  }

  const rackW = 1.65;
  const rackD = 1.28;
  const rackH = 2.22;

  // 1. Heavy-Duty Base Rails
  addBox(0.09, 0.075, rackD + 0.34, -rackW / 2, 0.038, 0.06, steelMat);
  addBox(0.09, 0.075, rackD + 0.34, rackW / 2, 0.038, 0.06, steelMat);
  addBox(rackW + 0.09, 0.075, 0.09, 0, 0.038, -rackD / 2, steelMat);

  // 2. 4 Main 11-Gauge Vertical Uprights (Front slightly angled subtly or clean commercial vertical)
  const colPositions = [
    [-rackW / 2, rackD / 2 - 0.12],
    [rackW / 2, rackD / 2 - 0.12],
    [-rackW / 2, -rackD / 2],
    [rackW / 2, -rackD / 2],
  ];
  colPositions.forEach(([cx, cz]) => {
    addBox(0.082, rackH, 0.082, cx, rackH / 2, cz, steelMat);
    // Top cap
    addBox(0.09, 0.02, 0.09, cx, rackH + 0.01, cz, darkMat);
  });

  // Laser-cut upright adjustment holes (front uprights)
  for (let i = 0; i < 16; i++) {
    const hy = 0.35 + i * 0.105;
    addCyl(0.009, 0.009, 0.086, -rackW / 2, hy, rackD / 2 - 0.12, chromeMat, 0, 0, Math.PI / 2, 10);
    addCyl(0.009, 0.009, 0.086, rackW / 2, hy, rackD / 2 - 0.12, chromeMat, 0, 0, Math.PI / 2, 10);
  }

  // 3. Top Crossbeams & Cyan Brand Trim
  addBox(rackW + 0.08, 0.09, 0.09, 0, rackH - 0.045, rackD / 2 - 0.12, steelMat);
  addBox(rackW + 0.08, 0.09, 0.09, 0, rackH - 0.045, -rackD / 2, steelMat);
  addBox(0.085, 0.085, rackD, -rackW / 2, rackH - 0.045, -0.06, steelMat);
  addBox(0.085, 0.085, rackD, rackW / 2, rackH - 0.045, -0.06, steelMat);
  // Signature MERACH cyan accent strip on front top beam
  addBox(0.46, 0.018, 0.096, 0, rackH - 0.045, rackD / 2 - 0.12, cyanMat);

  // Multi-Grip Pull-Up Bar
  addCyl(0.018, 0.018, rackW - 0.12, 0, rackH + 0.08, rackD / 2 + 0.08, darkMat, 0, 0, Math.PI / 2);
  addCyl(0.016, 0.016, 0.24, -0.42, rackH + 0.03, rackD / 2, steelMat, Math.PI / 3.5, 0, 0);
  addCyl(0.016, 0.016, 0.24, 0.42, rackH + 0.03, rackD / 2, steelMat, Math.PI / 3.5, 0, 0);

  // 4. Twin Weight Stacks (Left & Right Rear Towers)
  const animatedStacks = [];
  [-rackW / 2 + 0.22, rackW / 2 - 0.22].forEach((sx) => {
    // Chrome Guide Rods
    addCyl(0.011, 0.011, rackH - 0.2, sx - 0.08, rackH / 2, -rackD / 2 + 0.14, chromeMat);
    addCyl(0.011, 0.011, rackH - 0.2, sx + 0.08, rackH / 2, -rackD / 2 + 0.14, chromeMat);

    // Weight plates stack
    const stackGroup = new THREE.Group();
    for (let p = 0; p < 12; p++) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.044, 0.14), darkMat);
      plate.position.set(sx, 0.14 + p * 0.052, -rackD / 2 + 0.14);
      plate.castShadow = true;
      stackGroup.add(plate);
      if (p === 6) {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 12), cyanMat);
        pin.rotation.x = Math.PI / 2;
        pin.position.set(sx, 0.14 + p * 0.052, -rackD / 2 + 0.23);
        stackGroup.add(pin);
      }
    }
    rack.add(stackGroup);
    animatedStacks.push(stackGroup);
  });

  // 5. CNC Cyan Aluminum Pulleys (Top + Dual Adjustable Front Trolleys)
  const pulleys = [];
  function addPulley(x, y, z, rotZ = 0) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.026, 28), cyanMat);
    wheel.rotation.z = Math.PI / 2;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.034, 16), chromeMat);
    hub.rotation.z = Math.PI / 2;
    g.add(wheel, hub);
    g.rotation.y = rotZ;
    rack.add(g);
    pulleys.push(wheel);
  }

  // Top CNC Pulley Cluster
  addPulley(-rackW / 2 + 0.22, rackH - 0.11, -rackD / 2 + 0.14);
  addPulley(rackW / 2 - 0.22, rackH - 0.11, -rackD / 2 + 0.14);
  addPulley(-rackW / 2 + 0.06, rackH - 0.11, rackD / 2 - 0.08);
  addPulley(rackW / 2 - 0.06, rackH - 0.11, rackD / 2 - 0.08);

  // Dual Front 180° Swivel Cable Trolleys & Cables
  [-1, 1].forEach((side) => {
    const tx = (side * rackW) / 2;
    const ty = 1.24;
    const tz = rackD / 2 - 0.12;
    // Sliding carriage sleeve
    addBox(0.115, 0.22, 0.125, tx, ty, tz, darkMat);
    // Cyan pop-pin knob
    addCyl(0.022, 0.022, 0.05, tx + side * 0.07, ty, tz, cyanMat, 0, 0, Math.PI / 2);
    // Swivel Pulley
    addPulley(tx, ty, tz + 0.11, side * 0.25);
    // Vertical Steel Cable from top pulley to trolley
    addCyl(0.004, 0.004, rackH - ty - 0.11, tx, (rackH - 0.11 + ty) / 2, tz + 0.07, cableMat, 0, 0, 0, 8);
    // Ergonomic Cable Handle
    addCyl(0.012, 0.012, 0.13, tx, ty - 0.14, tz + 0.16, darkMat, 0, 0, Math.PI / 2);
  });

  // 6. Chrome Smith Machine Guide Rails + Loaded Olympic Barbell
  [-rackW / 2 + 0.09, rackW / 2 - 0.09].forEach((rx) => {
    addCyl(0.015, 0.015, rackH - 0.15, rx, rackH / 2, 0.12, chromeMat);
  });

  const smithBarGroup = new THREE.Group();
  smithBarGroup.position.set(0, 1.32, 0.12);
  const barShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, rackW + 0.85, 24), chromeMat);
  barShaft.rotation.z = Math.PI / 2;
  barShaft.castShadow = true;
  smithBarGroup.add(barShaft);

  // Linear Bearing Carriages on Smith Bar
  [-rackW / 2 + 0.09, rackW / 2 - 0.09].forEach((cx) => {
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.16, 20), darkMat);
    sleeve.position.set(cx, 0, 0);
    smithBarGroup.add(sleeve);
  });

  // Loaded Olympic Bumper Plates (Left & Right) with Cyan Ring
  [-1, 1].forEach((side) => {
    const px = side * (rackW / 2 + 0.18);
    const bigPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.048, 36), darkMat);
    bigPlate.rotation.z = Math.PI / 2;
    bigPlate.position.set(px, 0, 0);
    bigPlate.castShadow = true;

    const cyanTrim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.008, 12, 36), cyanMat);
    cyanTrim.rotation.y = Math.PI / 2;
    cyanTrim.position.set(px + side * 0.025, 0, 0);

    const medPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.175, 0.036, 32), steelMat);
    medPlate.rotation.z = Math.PI / 2;
    medPlate.position.set(px + side * 0.055, 0, 0);
    medPlate.castShadow = true;

    smithBarGroup.add(bigPlate, cyanTrim, medPlate);
  });
  rack.add(smithBarGroup);

  // 7. Adjustable Training Bench inside Rack
  addBox(0.32, 0.07, 0.86, 0, 0.48, 0.22, leatherMat);
  addBox(0.30, 0.07, 0.42, 0, 0.62, -0.36, leatherMat, -0.58, 0, 0);
  addBox(0.06, 0.06, 1.05, 0, 0.36, 0.06, steelMat);
  addBox(0.06, 0.36, 0.06, 0, 0.18, 0.52, steelMat);
  addBox(0.06, 0.36, 0.06, 0, 0.18, -0.38, steelMat);
  addBox(0.46, 0.05, 0.06, 0, 0.03, 0.52, darkMat);
  addBox(0.52, 0.05, 0.06, 0, 0.03, -0.38, darkMat);

  // Center the model cleanly inside the orbital ring
  rack.position.x = 0;

  // Interactive Orbital Camera Presets
  const presetOrder = ["overview", "safety", "biomechanics", "fluidity"];
  const presets = {
    overview: {
      theta: 0.58,
      phi: 1.14,
      radius: 4.35,
      target: new THREE.Vector3(0, 1.08, 0),
      hotspot: { left: "61%", top: "24%" },
      title: "Unlock More Power",
      desc: "<strong>Switch Ratios</strong> seamlessly between <strong>1:1 &amp; 2:1 Modes</strong> for versatile home training control.",
    },
    safety: {
      theta: -0.78,
      phi: 1.24,
      radius: 4.15,
      target: new THREE.Vector3(0, 1.0, 0),
      hotspot: { left: "38%", top: "54%" },
      title: "Rock-Solid Safety",
      desc: "<strong>11-Gauge Steel</strong> laser-cut uprights rated to <strong>1,200 LB</strong> for zero-wobble commercial stability.",
    },
    biomechanics: {
      theta: 0.12,
      phi: 1.2,
      radius: 4.05,
      target: new THREE.Vector3(0, 1.15, 0.15),
      hotspot: { left: "58%", top: "48%" },
      title: "Natural Biomechanics",
      desc: "<strong>Dual 180° Cable Towers</strong> with <strong>20+ Height Positions</strong> follow your natural joint path on every rep.",
    },
    fluidity: {
      theta: 2.38,
      phi: 1.05,
      radius: 4.2,
      target: new THREE.Vector3(0, 1.25, 0),
      hotspot: { left: "54%", top: "22%" },
      title: "Gym-Grade Fluidity",
      desc: "<strong>CNC Aluminum Pulleys</strong> and twin weight stacks deliver <strong>&lt;42 dB</strong> whisper-quiet resistance.",
    },
  };

  let activePresetIdx = 0;
  let curTheta = presets.overview.theta;
  let curPhi = presets.overview.phi;
  let curRadius = presets.overview.radius;
  const curTarget = presets.overview.target.clone();

  let tgtTheta = curTheta;
  let tgtPhi = curPhi;
  let tgtRadius = curRadius;
  const tgtTarget = curTarget.clone();

  let autoRotate = true;
  let xrayMode = false;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  // UI Elements
  const hudTitle = document.getElementById("svcHudTitle");
  const hudDesc = document.getElementById("svcHudDesc");
  const angleReadout = document.getElementById("svcAngleReadout");
  const autoRotateBtn = document.getElementById("svcAutoRotateBtn");
  const xrayBtn = document.getElementById("svcXrayBtn");
  const prevOrbitBtn = document.getElementById("svcOrbitPrev");
  const nextOrbitBtn = document.getElementById("svcOrbitNext");
  const hotspotEl = document.getElementById("svcMachineHotspot");
  const orbitDots = Array.from(stage.querySelectorAll(".svc-orbit-dot"));
  const seriesTabs = Array.from(document.querySelectorAll(".svc-series-tab"));
  const heroSubEl = document.getElementById("svcHeroSub");
  const modelCaptionEl = document.getElementById("svcModelCaption");

  const seriesMeta = {
    pro: {
      sub: 'Precision-built 11-gauge steel, crate-shipped, and now <span class="svc-accent">$300 OFF</span> launch offer.',
      caption: "MERACH P16 Pro Series All-In-One Rack",
    },
    standard: {
      sub: 'Compact footprint, dual cable towers, and now <span class="svc-accent">$200 OFF</span> home studio bundle.',
      caption: "MERACH P16 Standard Home Strength System",
    },
    accessories: {
      sub: 'Commercial attachments, leg press plates, and <span class="svc-accent">25% OFF</span> with any P16 system.',
      caption: "MERACH P16 Pro Attachment Ecosystem",
    },
  };

  seriesTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.series || "pro";
      seriesTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      const info = seriesMeta[key] || seriesMeta.pro;
      if (heroSubEl) heroSubEl.innerHTML = info.sub;
      if (modelCaptionEl) modelCaptionEl.textContent = info.caption;
    });
  });

  function applyPreset(name, stopAuto = false) {
    const idx = presetOrder.indexOf(name);
    activePresetIdx = idx >= 0 ? idx : 0;
    const p = presets[presetOrder[activePresetIdx]];
    tgtTheta = p.theta;
    tgtPhi = p.phi;
    tgtRadius = p.radius;
    tgtTarget.copy(p.target);
    if (hudTitle) hudTitle.textContent = p.title;
    if (hudDesc) hudDesc.innerHTML = p.desc;
    if (hotspotEl && p.hotspot) {
      hotspotEl.style.left = p.hotspot.left;
      hotspotEl.style.top = p.hotspot.top;
    }

    orbitDots.forEach((b) => {
      const active = b.dataset.cam === presetOrder[activePresetIdx];
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", String(active));
    });

    if (stopAuto) {
      autoRotate = false;
      if (autoRotateBtn) {
        autoRotateBtn.classList.remove("is-active");
        autoRotateBtn.setAttribute("aria-pressed", "false");
      }
    }
  }

  orbitDots.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyPreset(btn.dataset.cam, true);
    });
  });

  if (prevOrbitBtn) {
    prevOrbitBtn.addEventListener("click", () => {
      const nextIdx = (activePresetIdx - 1 + presetOrder.length) % presetOrder.length;
      applyPreset(presetOrder[nextIdx], true);
    });
  }

  if (nextOrbitBtn) {
    nextOrbitBtn.addEventListener("click", () => {
      const nextIdx = (activePresetIdx + 1) % presetOrder.length;
      applyPreset(presetOrder[nextIdx], true);
    });
  }

  if (autoRotateBtn) {
    autoRotateBtn.addEventListener("click", () => {
      autoRotate = !autoRotate;
      autoRotateBtn.classList.toggle("is-active", autoRotate);
      autoRotateBtn.setAttribute("aria-pressed", String(autoRotate));
    });
  }

  if (xrayBtn) {
    xrayBtn.addEventListener("click", () => {
      xrayMode = !xrayMode;
      xrayBtn.classList.toggle("is-active", xrayMode);
      xrayBtn.setAttribute("aria-pressed", String(xrayMode));
      allP16Materials.forEach((m) => {
        m.wireframe = xrayMode;
      });
      steelMat.emissive.setHex(xrayMode ? 0x0a6c8f : 0x000000);
      steelMat.emissiveIntensity = xrayMode ? 0.85 : 0;
    });
  }

  // Pointer Drag 360° Orbit
  canvas.addEventListener("pointerdown", (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    autoRotate = false;
    if (autoRotateBtn) {
      autoRotateBtn.classList.remove("is-active");
      autoRotateBtn.setAttribute("aria-pressed", "false");
    }
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    tgtTheta -= dx * 0.008;
    tgtPhi = Math.max(0.55, Math.min(1.48, tgtPhi - dy * 0.005));
  });

  canvas.addEventListener("pointerup", () => {
    isDragging = false;
  });

  canvas.addEventListener("pointercancel", () => {
    isDragging = false;
  });

  // Resize Handling
  function handleResize() {
    const w = stage.clientWidth || 920;
    const h = stage.clientHeight || 420;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    rack.position.x = 0;
  }

  const ro = new ResizeObserver(handleResize);
  ro.observe(stage);
  handleResize();

  // Animation Loop
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    if (stage.offsetParent === null) return;

    t += 0.016;
    if (autoRotate && !isDragging) {
      tgtTheta += 0.0038;
    }

    // Smooth camera damping
    curTheta += (tgtTheta - curTheta) * 0.08;
    curPhi += (tgtPhi - curPhi) * 0.08;
    curRadius += (tgtRadius - curRadius) * 0.08;
    curTarget.lerp(tgtTarget, 0.08);

    camera.position.set(
      curTarget.x + curRadius * Math.sin(curPhi) * Math.sin(curTheta),
      curTarget.y + curRadius * Math.cos(curPhi),
      curTarget.z + curRadius * Math.sin(curPhi) * Math.cos(curTheta)
    );
    camera.lookAt(curTarget);

    // Subtle mechanical motion on Smith bar & CNC pulleys
    smithBarGroup.position.y = 1.32 + Math.sin(t * 1.1) * 0.045;
    pulleys.forEach((p) => {
      p.rotation.x = Math.sin(t * 1.1) * 0.8;
    });

    if (angleReadout) {
      const deg = ((Math.round((curTheta * 180) / Math.PI) % 360) + 360) % 360;
      angleReadout.textContent = `${deg}°`;
    }

    renderer.render(scene, camera);
  }

  animate();
})();
