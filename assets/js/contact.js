(() => {
  const S = window.SITE, { $, $$, mailto } = window.FX;
  $("[data-contact-lines]").innerHTML = `
    <div><p class="label" style="margin:0 0 6px">Email</p><a class="link" href="${mailto}">${S.email}</a></div>
    <div><p class="label" style="margin:0 0 6px">Phone</p><a class="link" href="tel:${S.phone.replace(/\s/g, "")}">${S.phone}</a></div>
    <div><p class="label" style="margin:0 0 6px">Elsewhere</p>${S.socials.map((s) => `<a class="link" href="${s.url}" style="margin-right:20px">${s.label}</a>`).join("")}</div>`;

  const form = $("[data-form]");
  const rules = {
    name: (v) => (v.trim() ? "" : "Add your name so I know who to reply to."),
    email: (v) => (/^\S+@\S+\.\S+$/.test(v.trim()) ? "" : "Add an email address like name@example.com."),
    kind: (v) => (v ? "" : "Choose the kind of shoot."),
    message: (v) => (v.trim().length >= 10 ? "" : "Tell me a little about the project (a sentence is enough)."),
  };
  const check = (el) => {
    const r = rules[el.name]; if (!r) return true;
    const msg = r(el.value), field = el.closest(".field"), err = $(".field__err", field);
    err.textContent = msg; el.setAttribute("aria-invalid", msg ? "true" : "false"); el.setAttribute("aria-describedby", err.id);
    msg ? field.setAttribute("data-invalid", "") : field.removeAttribute("data-invalid");
    return !msg;
  };
  $$("input, select, textarea", form).forEach((el) => el.addEventListener("blur", () => check(el)));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const els = $$("input, select, textarea", form).filter((el) => rules[el.name]);
    const bad = els.filter((el) => !check(el));
    if (bad.length) { bad[0].focus(); return; }
    const d = Object.fromEntries(new FormData(form));
    const body = `Name: ${d.name}\nEmail: ${d.email}\nKind of shoot: ${d.kind}\nDate: ${d.date || "Not set"}\nBudget: ${d.budget || "Not sure yet"}\n\n${d.message}`;
    location.href = `mailto:${S.email}?subject=${encodeURIComponent(`Booking: ${d.kind}`)}&body=${encodeURIComponent(body)}`;
    $("[data-done]").classList.add("is-on");
    $(".form__foot", form).hidden = true;
  });
})();
