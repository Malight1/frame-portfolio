(() => {
  const S = window.SITE, { $, $$, motion } = window.FX;
  const ratio = (r) => { const [a, b] = r.split(":").map(Number); return a / b; };
  const kind = new URLSearchParams(location.search).get("k") || "all";

  $("[data-filters]").innerHTML = [["all", "All", S.projects.length], ...S.kinds.map((k) => [k.id, k.name, S.projects.filter((p) => p.kind === k.id).length])]
    .map(([id, n, c]) => `<button class="filter" type="button" data-f="${id}" aria-pressed="${id === kind}">${n}<span>${c}</span></button>`).join("");

  $("[data-grid]").innerHTML = S.projects.map((p) => `
    <a class="card" href="project.html?p=${p.id}" data-k="${p.kind}">
      <span class="card__media lbx" style="--r:${Math.max(ratio(p.ratio), 1.3)}" data-letterbox>
        <img src="${p.poster}" alt="" loading="lazy" />
        <video src="${p.video}" muted loop playsinline preload="none" aria-hidden="true"></video>
      </span>
      <span class="card__info">
        <span class="display card__title">${p.title}</span><span class="label">${p.ratio}</span>
        <span class="card__sub">${p.type} for ${p.client}</span><span class="label">${p.year}</span>
      </span>
    </a>`).join("");

  $$(".card").forEach((c) => {
    const v = $("video", c);
    const on = () => { if (v.preload === "none") v.preload = "auto"; v.play().catch(() => {}); };
    c.addEventListener("mouseenter", on); c.addEventListener("focus", on);
    c.addEventListener("mouseleave", () => v.pause()); c.addEventListener("blur", () => v.pause());
  });

  const apply = (k) => {
    $$("[data-f]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === k)));
    const cards = $$(".card");
    const show = () => {
      cards.forEach((c) => (c.hidden = !(k === "all" || c.dataset.k === k)));
      if (motion) { gsap.fromTo(cards.filter((c) => !c.hidden), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 }); ScrollTrigger.refresh(); }
    };
    if (motion) gsap.to(cards, { opacity: 0, duration: 0.25, onComplete: show }); else show();
    const u = new URL(location.href); k === "all" ? u.searchParams.delete("k") : u.searchParams.set("k", k); history.replaceState(null, "", u);
  };
  $$("[data-f]").forEach((b) => b.addEventListener("click", () => apply(b.dataset.f)));
  if (kind !== "all") $$(".card").forEach((c) => (c.hidden = c.dataset.k !== kind));
})();
