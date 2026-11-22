/* Shared shell: header, footer, page transitions, smooth scroll, reveals, players. */
(() => {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motion = !reduce && !!window.gsap;
  const page = document.body.dataset.page;
  const ARROW = '<svg class="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>';
  const mailto = `mailto:${S.email}?subject=${encodeURIComponent("Booking a shoot")}`;
  window.FX = { $, $$, reduce, motion, ARROW, mailto };

  /* ── Header, menu, closing call, footer ── */
  const nav = [["work.html", "Work", "work"], ["photography.html", "Photography", "photography"], ["about.html", "About", "about"], ["contact.html", "Contact", "contact"]];
  const navLinks = nav.map(([h, l, p]) => `<a href="${h}"${p === page ? ' aria-current="page"' : ""}>${l}</a>`).join("");
  const head = $("[data-head]");
  if (head) head.outerHTML = `
    <header class="head" data-header>
      <a class="head__mark" href="index.html" aria-label="${S.name}, home">${S.name}</a>
      <nav class="head__nav" aria-label="Main">${navLinks}</nav>
      <a class="btn btn--flare" href="contact.html">Book a shoot</a>
      <button class="head__menu" type="button" aria-expanded="false" aria-controls="menu" data-menu-open>Menu</button>
    </header>
    <div class="menu" id="menu" data-menu><button class="menu__close" type="button" data-menu-close>Close</button><a href="index.html">Home</a>${nav.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}</div>`;

  FX.renderClose = () => { const close = $("[data-close]");
  // the contact page is the booking page: it ends on the footer, not a second call to book
  const call = page === "contact" ? "" : `
      <h2 class="display close__title" id="close-title" data-desq>Have something<br />to shoot?</h2>
      <div class="close__row">
        <a class="btn btn--flare btn--lg" href="contact.html">Book a shoot ${ARROW}</a>
        <a class="link close__mail" href="${mailto}">${S.email}</a>
      </div>`;
  if (close) close.outerHTML = `
    <section class="close${call ? "" : " close--foot"}"${call ? ' aria-labelledby="close-title"' : ' aria-label="Footer"'}>${call}
      <footer class="foot">
        <span>© ${new Date().getFullYear()} ${S.name}</span>
        <nav aria-label="Footer">${nav.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}</nav>
        <nav aria-label="Social">${S.socials.map((s) => `<a href="${s.url}">${s.label}</a>`).join("")}</nav>
        <span class="foot__note">Demo site by Evotekra. Names, clients and credits are illustrative. Footage and photographs from Mixkit.</span>
      </footer>
    </section>`; };
  FX.renderClose();

  const menu = $("[data-menu]"), openBtn = $("[data-menu-open]");
  openBtn && openBtn.addEventListener("click", () => { menu.classList.add("is-open"); openBtn.setAttribute("aria-expanded", "true"); $("a", menu).focus(); });
  $("[data-menu-close]") && $("[data-menu-close]").addEventListener("click", () => { menu.classList.remove("is-open"); openBtn.setAttribute("aria-expanded", "false"); openBtn.focus(); });

  /* ── Grain + wipe layers ── */
  document.body.insertAdjacentHTML("beforeend", '<div class="grain" aria-hidden="true"></div><div class="wipe" aria-hidden="true"><div class="wipe__fill"></div><div class="wipe__streak"></div></div>');

  /* ── Players ── */
  document.body.insertAdjacentHTML("beforeend", `
    <dialog class="viewer" data-player aria-label="Film player"><button class="viewer__close" type="button" data-close>Close</button><video controls playsinline></video><p class="viewer__cap"></p></dialog>`);
  const player = $("[data-player]"), pv = $("video", player);
  window.openPlayer = (src, poster, cap) => {
    pv.src = src; pv.poster = poster || ""; $(".viewer__cap", player).textContent = cap || "";
    player.showModal(); FX.lenis && FX.lenis.stop(); pv.currentTime = 0; pv.play().catch(() => {});
  };
  player.addEventListener("close", () => { pv.pause(); FX.lenis && FX.lenis.start(); });
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-close]"); if (c) c.closest("dialog").close();
    if (e.target.tagName === "DIALOG") e.target.close();
  });

  /* ── Autoplay videos only on screen ── */
  const io = new IntersectionObserver((es) => es.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting) { if (v.preload === "none") v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.1 });
  FX.watch = (v) => io.observe(v);
  $$("video[data-autoplay]").forEach(FX.watch);

  /* ── Static path ── */
  if (!motion) {
    document.documentElement.classList.remove("is-entering");
    FX.ready = Promise.resolve();
    return;
  }

  /* ── Motion ── */
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: 0.09 });
  FX.lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const header = $("[data-header]");
  lenis.on("scroll", ({ scroll, direction }) => {
    header.classList.toggle("is-solid", scroll > 40);
    header.classList.toggle("is-hidden", direction === 1 && scroll > 200 && !menu.classList.contains("is-open"));
  });

  // De-squeeze: display type arrives anamorphically stretched and settles to true width
  FX.desqueeze = (el, opts = {}) => {
    if (el.dataset.fx) return; el.dataset.fx = "1";
    if (!el.querySelector(":scope > .desq")) el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map((l) => `<span class="line-mask"><span class="desq">${l}</span></span>`).join("");
    const parts = $$(".desq", el);
    return gsap.fromTo(parts, { scaleX: 2.4, opacity: 0, filter: "blur(10px)" }, {
      scaleX: 1, opacity: 1, filter: "blur(0px)", duration: opts.duration || 1.6, ease: "expo.out", stagger: 0.12, delay: opts.delay || 0,
      scrollTrigger: opts.now ? undefined : { trigger: el, start: "top 88%", once: true },
    });
  };
  // Letterbox: media opens from a thin horizontal slit
  FX.letterbox = (el, opts = {}) => {
    if (el.dataset.fx) return; el.dataset.fx = "1";
    return gsap.fromTo(el, { clipPath: "inset(48% 0% 48% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut", delay: opts.delay || 0,
      scrollTrigger: opts.now ? undefined : { trigger: el, start: "top 88%", once: true },
    });
  };
  FX.fade = (el) => { if (el.dataset.fx) return; el.dataset.fx = "1"; gsap.from(el, { opacity: 0, y: 24, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }); };
  FX.closeStreak = () => { const cl = $(".close"); if (!cl || cl.dataset.fx) return; cl.dataset.fx = "1"; gsap.fromTo(cl, { "--streak": 0 }, { "--streak": 0.9, ease: "none", scrollTrigger: { trigger: cl, start: "top bottom", end: "center center", scrub: true } }); };

  // Page transitions: a flare streak wipes the frame
  const wipe = $(".wipe"), fill = $(".wipe__fill", wipe), streak = $(".wipe__streak", wipe);
  const entering = document.documentElement.classList.contains("is-entering");
  FX.ready = new Promise((res) => {
    if (!entering) return res();
    gsap.set(fill, { scaleY: 1 }); gsap.set(streak, { scaleX: 1, opacity: 1 });
    document.documentElement.classList.remove("is-entering");
    gsap.timeline({ onComplete: res })
      .to(fill, { scaleY: 0, duration: 0.9, ease: "expo.inOut" })
      .to(streak, { scaleX: 0, opacity: 0, duration: 0.7, ease: "expo.in" }, 0.35);
  });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname) || a.getAttribute("href").startsWith("#") || url.href === location.href) return;
    e.preventDefault();
    try { sessionStorage.setItem("wipe", "1"); } catch (_) {}
    gsap.timeline({ onComplete: () => (location.href = url.href) })
      .fromTo(streak, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.45, ease: "expo.out" })
      .fromTo(fill, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "expo.inOut" }, 0.2);
  });
  addEventListener("pageshow", (e) => { if (e.persisted) { gsap.set(fill, { scaleY: 0 }); gsap.set(streak, { scaleX: 0 }); } });

  FX.ready.then(() => {
    $$("[data-desq]").forEach((el) => FX.desqueeze(el, { now: el.hasAttribute("data-now") }));
    $$("[data-letterbox]").forEach((el) => FX.letterbox(el, { now: el.hasAttribute("data-now") }));
    $$("[data-fade]").forEach(FX.fade);
    FX.closeStreak(); // closing streak brightens as it arrives
    ScrollTrigger.refresh();
  });
  addEventListener("load", () => ScrollTrigger.refresh());
})();
