(() => {
  const S = window.SITE, { $, $$, motion, ARROW } = window.FX;
  const proj = (id) => S.projects.find((p) => p.id === id);
  const kindName = (k) => S.kinds.find((x) => x.id === k).name;

  $("[data-intro]").textContent = S.intro;
  $("[data-reel-length]").textContent = S.reel.length;
  $$("[data-play-reel]").forEach((b) => b.addEventListener("click", () => openPlayer(S.reel.video, S.reel.poster, `Showreel, ${S.reel.length}`)));

  /* Selected work: titles fill the measure; a letterboxed preview follows the pointer */
  const picks = ["golden-hour", "blue-room", "vows", "red-studio", "salt-flats", "main-stage"].map(proj);
  $("[data-reel-list]").innerHTML = picks.map((p) => `
    <li><a class="reel-row" href="project.html?p=${p.id}" data-video="${p.video}">
      <img class="reel-row__thumb" src="${p.poster}" alt="" loading="lazy" />
      <span class="display reel-row__title">${p.title}</span>
      <span class="reel-row__meta"><span class="label">${p.type}</span><span class="label">${p.ratio}</span><span class="label">${p.year}</span></span>
    </a></li>`).join("");

  // Disciplines
  const kv = { brand: "no-7", music: "arena", wedding: "the-morning-of", fashion: "before-the-walk" };
  $("[data-kinds]").innerHTML = S.kinds.map((k, i) => {
    const p = proj(kv[k.id]), n = S.projects.filter((x) => x.kind === k.id).length;
    return `<div class="kind${i === 0 ? " is-active" : ""}" data-kind="${i}">
      <h3 class="display kind__name">${k.name}</h3><p>${k.line}</p>
      <video src="${p.video}" poster="${p.poster}" muted loop playsinline preload="none" aria-hidden="true" data-autoplay></video>
      <a class="link" href="work.html?k=${k.id}">See ${n} ${n > 1 ? "films" : "film"} ${ARROW}</a></div>`;
  }).join("");
  $("[data-kinds-frame]").innerHTML = S.kinds.map((k, i) => { const p = proj(kv[k.id]); return `<video src="${p.video}" poster="${p.poster}" muted loop playsinline preload="${i === 0 ? "auto" : "none"}" class="${i === 0 ? "is-on" : ""}"></video>`; }).join("");
  $$(".kind video").forEach(FX.watch);
  const screenVids = $$("[data-kinds-frame] video");
  const setKind = (i) => {
    $$(".kind").forEach((el, j) => el.classList.toggle("is-active", i === j));
    screenVids.forEach((v, j) => { v.classList.toggle("is-on", i === j); if (i === j) { if (v.preload === "none") v.preload = "auto"; v.play().catch(() => {}); } else v.pause(); });
    $("[data-kinds-cap]").textContent = proj(kv[S.kinds[i].id]).title;
    $("[data-kinds-count]").textContent = kindName(S.kinds[i].id);
  };
  setKind(0);
  FX.setKind = setKind;

  // Photo teaser
  const tp = [S.photos[0], S.photos[2], S.photos[3]];
  $("[data-teaser]").innerHTML = tp.map((p) => `<figure data-letterbox><img src="${p.src}" alt="${p.title}, ${p.kind.toLowerCase()} photograph" loading="lazy" /></figure>`).join("");

  /* Hero */
  const hero = $("[data-hero]"), canvas = $(".hero__gl", hero), video = $(".hero__fallback", hero);
  const name = $("[data-hero-name]"), meta = $("[data-hero-meta]");
  let gl = null;
  if (motion) { try { gl = HeroGL.init(canvas, video, hero); } catch (e) { console.warn(e); } }
  if (!gl) hero.classList.add("no-gl");
  video.play().catch(() => {});

  // Selected work titles: each sized to fill the measure (hatch-show-print bands)
  const fitTitles = () => $$(".reel-row__title").forEach((t) => {
    t.style.fontSize = "100px";
    const w = t.parentElement.clientWidth, tw = t.scrollWidth;
    t.style.fontSize = Math.min(150, Math.max(30, (100 * w) / tw * 0.98)) + "px";
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fitTitles);
  addEventListener("resize", fitTitles);

  if (!motion) {
    const kio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setKind(+e.target.dataset.kind); }), { rootMargin: "-45% 0px -45% 0px" });
    $$(".kind").forEach((el) => kio.observe(el));
    return;
  }
  $$(".kind").forEach((el) => ScrollTrigger.create({ trigger: el, start: "top center", end: "bottom center", onToggle: (st) => st.isActive && setKind(+el.dataset.kind) }));

  // pointer preview for the work list
  const peek = $("[data-peek]"), pv = $("video", peek);
  if (matchMedia("(hover: hover)").matches) {
    const xTo = gsap.quickTo(peek, "x", { duration: 0.6, ease: "power3" }), yTo = gsap.quickTo(peek, "y", { duration: 0.6, ease: "power3" });
    addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });
    $$(".reel-row").forEach((row) => {
      row.addEventListener("mouseenter", () => {
        if (pv.getAttribute("src") !== row.dataset.video) { pv.src = row.dataset.video; }
        pv.play().catch(() => {});
        gsap.to(peek, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out", overwrite: "auto" });
      });
      row.addEventListener("mouseleave", () => gsap.to(peek, { opacity: 0, scale: 0.85, duration: 0.4, ease: "expo.out", overwrite: "auto", onComplete: () => pv.pause() }));
    });
  }

  // name arrives squeezed; meta and header follow
  name.innerHTML = `<span class="desq">${name.textContent}</span>`;
  const desq = $(".desq", name);
  gsap.set(desq, { scaleX: 2.6, opacity: 0, filter: "blur(14px)" });
  gsap.set([meta, "[data-header]"], { opacity: 0 });
  if (!gl) gsap.set(video, { clipPath: "inset(50% 0% 50% 0%)" });

  FX.ready.then(() => {
    const tl = gsap.timeline({ delay: 0.15 });
    if (gl) {
      tl.to(gl, { sweep: 1, flare: 1, duration: 1.0, ease: "expo.out" })
        .to(gl, { open: 1, duration: 1.8, ease: "expo.inOut" }, 0.55);
    } else {
      tl.to(video, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" });
    }
    tl.to(desq, { scaleX: 1, opacity: 1, filter: "blur(0px)", duration: 1.9, ease: "expo.out" }, 1.1)
      .to(meta, { opacity: 1, duration: 1, ease: "power2.out" }, 1.7)
      .to("[data-header]", { opacity: 1, duration: 1, ease: "power2.out" }, 1.7)
      .add(() => {
        // scroll: the letterbox opens to the full frame, the name drifts up and squeezes away
        const st = { trigger: hero, start: "top top", end: "+=70%", scrub: 0.8, pin: true };
        const s = gsap.timeline({ scrollTrigger: st });
        if (gl) s.to(gl, { full: 1, flare: 0.5, ease: "none" }, 0);
        s.to(desq, { scaleX: 0.92, yPercent: -40, opacity: 0, ease: "power1.in" }, 0).to(meta, { opacity: 0, y: -20, ease: "none", duration: 0.5 }, 0);
        ScrollTrigger.refresh();
      });
  });
})();
