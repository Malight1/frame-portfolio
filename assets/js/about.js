(() => {
  const S = window.SITE, A = S.about, { $ } = window.FX;
  $("[data-about-lead]").textContent = A.lead;
  $("[data-about-text]").innerHTML = A.text.map((t) => `<p>${t}</p>`).join("");
  $("[data-services]").innerHTML = A.services.map(([n, d]) => `<li><h3 class="display h3">${n}</h3><p>${d}</p></li>`).join("");
  $("[data-steps]").innerHTML = A.steps.map((s) => `<li><h3 class="display h3">${s.name}</h3><p>${s.note}</p></li>`).join("");
  $("[data-kit]").innerHTML = A.kit.map((k) => `<li><span>${k}</span></li>`).join("");
})();
