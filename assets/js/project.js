(() => {
  const S = window.SITE, { $, $$, motion, ARROW } = window.FX;
  const id = new URLSearchParams(location.search).get("p");
  const i = Math.max(0, S.projects.findIndex((p) => p.id === id));
  const p = S.projects[i], next = S.projects[(i + 1) % S.projects.length];
  const kind = S.kinds.find((k) => k.id === p.kind).name;
  document.title = `${p.title}, ${p.type} by ${S.name}`;
  const vertical = p.ratio === "4:5";

  $("[data-project]").innerHTML = `
    <header class="proj-head">
      <h1 class="display h1" data-desq data-now>${p.title}</h1>
      <div class="proj-meta">
        <dl><dt class="label">Kind</dt><dd><a class="link" href="work.html?k=${p.kind}">${kind}</a></dd></dl>
        <dl><dt class="label">Client</dt><dd>${p.client}</dd></dl>
        <dl><dt class="label">Work</dt><dd>${p.type}</dd></dl>
        <dl><dt class="label">Role</dt><dd>${p.role}</dd></dl>
        <dl><dt class="label">Year</dt><dd>${p.year}</dd></dl>
        <dl><dt class="label">Format</dt><dd>${p.ratio}, ${p.length}</dd></dl>
      </div>
    </header>
    <section class="proj-film" aria-label="Film">
      <div class="proj-film__frame lbx${vertical ? " is-vertical" : ""}" data-letterbox data-now>
        <video src="${p.video}" poster="${p.poster}" muted loop playsinline autoplay preload="auto" data-autoplay aria-hidden="true"></video>
        <button class="proj-film__play" type="button" data-watch aria-label="Watch ${p.title} full screen"><span>Watch film ${ARROW}</span></button>
      </div>
    </section>
    <section class="section proj-body" aria-label="About this film">
      <p class="lede" data-fade>${p.text}</p>
      <dl class="credits" data-fade>${p.credits.filter(([k]) => k !== "Client" && k !== "Format").map(([k, v]) => `<dt class="label">${k}</dt><dd>${v}</dd>`).join("")}</dl>
    </section>
    <section class="stills" aria-label="Stills">${p.stills.map((s, n) => `<figure class="lbx" data-letterbox><img src="${s}" alt="Still ${n + 1} from ${p.title}" loading="lazy" /></figure>`).join("")}</section>
    <a class="next" href="project.html?p=${next.id}" style="margin-top:clamp(96px,15vh,180px)">
      <span class="next__bg"><img src="${next.poster}" alt="" loading="lazy" /></span>
      <span class="next__inner"><span class="display h1" style="display:block" data-desq>${next.title}</span><span class="next__go">Next film ${ARROW}</span></span>
    </a>
    <div data-close></div>`;

  // site.js already ran; render the closing block and wire this page's elements
  const close = document.createElement("div"); close.setAttribute("data-close", "");
  $("[data-project] [data-close]").replaceWith(close);
  window.FX.renderClose && window.FX.renderClose();
  $$("[data-watch]").forEach((b) => b.addEventListener("click", () => openPlayer(p.video, p.poster, `${p.title}. ${p.type} for ${p.client}, ${p.year}`)));
  $$("video[data-autoplay]").forEach(FX.watch);
  if (!motion) return;
  FX.ready.then(() => {
    $$("[data-project] [data-desq]").forEach((el) => FX.desqueeze(el, { now: el.hasAttribute("data-now") }));
    $$("[data-project] [data-letterbox]").forEach((el) => FX.letterbox(el, { now: el.hasAttribute("data-now"), delay: el.hasAttribute("data-now") ? 0.3 : 0 }));
    $$("[data-project] [data-fade]").forEach(FX.fade);
    $$("[data-desq]").forEach((el) => FX.desqueeze(el));
    FX.closeStreak();
    ScrollTrigger.refresh();
  });
})();
