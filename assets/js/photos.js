(() => {
  const S = window.SITE, { $, $$, motion } = window.FX;
  const kinds = ["All", ...new Set(S.photos.map((p) => p.kind))];
  $("[data-photo-filters]").innerHTML = kinds.map((k, i) => `<button class="filter" type="button" data-f="${k}" aria-pressed="${i === 0}">${k}</button>`).join("");
  $("[data-masonry]").innerHTML = S.photos.map((p, i) => `
    <figure class="shot" data-k="${p.kind}"><button type="button" data-i="${i}" aria-label="Open ${p.title}" style="display:block;width:100%">
      <span class="shot__img" style="display:block" data-letterbox><img src="${p.src}" alt="${p.title}, ${p.kind.toLowerCase()} photograph" width="${p.w}" height="${p.h}" loading="lazy" /></span></button>
      <figcaption><span>${p.title}</span><span class="label">${p.kind}</span></figcaption></figure>`).join("");

  $$("[data-f]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-f]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $$(".shot").forEach((s) => (s.hidden = !(b.dataset.f === "All" || s.dataset.k === b.dataset.f)));
    if (motion) ScrollTrigger.refresh();
  }));

  const lb = $("[data-lightbox]"), img = $("img", lb);
  let at = 0;
  const show = (i) => {
    const vis = $$(".shot:not([hidden]) [data-i]").map((b) => +b.dataset.i);
    const k = vis.indexOf(i) === -1 ? 0 : vis.indexOf(i);
    at = vis[k]; const p = S.photos[at];
    img.src = p.src; img.alt = `${p.title}, ${p.kind.toLowerCase()} photograph`;
    $(".viewer__cap", lb).textContent = `${p.title}, ${p.kind}`;
    if (motion) gsap.fromTo(img, { clipPath: "inset(48% 0 48% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 0.9, ease: "expo.inOut" });
  };
  const step = (d) => { const vis = $$(".shot:not([hidden]) [data-i]").map((b) => +b.dataset.i); show(vis[(vis.indexOf(at) + d + vis.length) % vis.length]); };
  $$("[data-i]").forEach((b) => b.addEventListener("click", () => { show(+b.dataset.i); lb.showModal(); FX.lenis && FX.lenis.stop(); }));
  $("[data-prev]", lb).addEventListener("click", () => step(-1));
  $("[data-next]", lb).addEventListener("click", () => step(1));
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });
  lb.addEventListener("close", () => FX.lenis && FX.lenis.start());
})();
