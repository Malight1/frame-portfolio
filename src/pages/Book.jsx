import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SITE } from "../content.js";
import { Icon, usePageTitle } from "../components/ui.jsx";

const NEEDS = [
  { id: "photo", name: "Photography", note: "Edited photos", icon: "camera" },
  { id: "video", name: "Videography", note: "A film or reels", icon: "video" },
  { id: "both", name: "Both", note: "Photos and video", icon: "both" },
];
const PHOTO = SITE.services.filter((s) => s.type === "photo");
const VIDEO = SITE.services.filter((s) => s.type === "video");
const ALL = SITE.services;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameOf = (id) => (id === "other" ? "Something else" : (ALL.find((s) => s.id === id) || {}).name || "");

function check(v) {
  return {
    need: v.need ? "" : "Choose photography, videography or both.",
    service: v.service ? "" : "Choose the kind of shoot.",
    client: v.client.trim() ? "" : "Please add your name.",
    email: !v.email.trim() ? "Please add your email so I can reply." : EMAIL.test(v.email.trim()) ? "" : "That email looks incomplete, for example name@example.com.",
    message: v.message.trim().length >= 10 ? "" : "Add a sentence or two about the shoot.",
  };
}
const ORDER = ["need", "service", "client", "email", "message"];
const fmtDate = (d) => (d ? new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "");

export default function Book() {
  usePageTitle("Book a shoot, Riah Visuals");
  const [params] = useSearchParams();
  const pre = ALL.find((s) => s.id === params.get("service"));
  const preNeed = pre ? pre.type : "";
  const [v, setV] = useState({ need: preNeed, service: pre ? pre.id : "", client: "", email: "", phone: "", date: "", where: "", message: "" });
  const [err, setErr] = useState({});
  const [done, setDone] = useState(false);
  const refs = { need: useRef(null), service: useRef(null), client: useRef(null), email: useRef(null), message: useRef(null) };
  const doneRef = useRef(null);

  const update = (k, val) => { const next = { ...v, [k]: val }; setV(next); if (err[k]) setErr((x) => ({ ...x, [k]: check(next)[k] })); };
  const set = (k) => (e) => update(k, e.target.value);
  const blur = (k) => () => v[k] && setErr((x) => ({ ...x, [k]: check(v)[k] }));
  const pickNeed = (id) => {
    const keep = id === "both" || (id === "photo" ? PHOTO : VIDEO).some((s) => s.id === v.service) || v.service === "other";
    setV({ ...v, need: id, service: keep ? v.service : "" }); setErr((x) => ({ ...x, need: "" }));
  };
  const groups = v.need === "photo" ? [["Photography", PHOTO]] : v.need === "video" ? [["Videography", VIDEO]] : [["Photography", PHOTO], ["Videography", VIDEO]];

  const submit = (e) => {
    e.preventDefault();
    const found = check(v); setErr(found);
    const first = ORDER.find((k) => found[k]);
    if (first) { (first === "need" ? refs.need.current.querySelector("input") : refs[first].current).focus(); return; }
    const need = NEEDS.find((n) => n.id === v.need).name;
    const body = [`Name: ${v.client.trim()}`, `Email: ${v.email.trim()}`, `Phone: ${v.phone.trim() || "Not given"}`, `I need: ${need}`, `Shoot: ${nameOf(v.service)}`, `Date: ${fmtDate(v.date) || "Not set yet"}`, `Where: ${v.where.trim() || "Not set yet"}`, "", v.message.trim()].join("\n");
    setDone(true);
    setTimeout(() => doneRef.current?.focus(), 0);
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Booking: ${nameOf(v.service)}`)}&body=${encodeURIComponent(body)}`;
  };
  const field = (k) => ({ "aria-invalid": !!err[k], "aria-describedby": `e-${k}` });
  const summary = [
    ["Type", (NEEDS.find((n) => n.id === v.need) || {}).name],
    ["Shoot", nameOf(v.service)],
    ["Date", fmtDate(v.date)],
    ["Where", v.where.trim()],
  ];

  return (
    <div className="wrap">
      <header className="page-head">
        <h1 className="display h1">Book a shoot</h1>
        <p className="lead">Tell me what you're planning and I'll reply with a plan and a price. It takes about a minute.</p>
      </header>
      <section className="book">
        <div>
          {!done ? (
            <form className="bform" noValidate onSubmit={submit}>
              <fieldset className="bform__part" ref={refs.need} aria-describedby="e-need">
                <legend><span className="bform__n">1</span>What do you need?</legend>
                <div className="needs">
                  {NEEDS.map((n) => (
                    <label key={n.id} className="need">
                      <input type="radio" name="need" value={n.id} checked={v.need === n.id} onChange={() => pickNeed(n.id)} />
                      <span className="need__icon" aria-hidden="true"><Icon name={n.icon} /></span>
                      <b>{n.name}</b><span className="need__note">{n.note}</span>
                      <span className="need__tick" aria-hidden="true"><Icon name="check" /></span>
                    </label>
                  ))}
                </div>
                <p className="err" id="e-need">{err.need}</p>
              </fieldset>

              <div className="bform__part">
                <h2 className="bform__h"><span className="bform__n">2</span>The shoot</h2>
                <div className="bform__grid">
                  <div className="field field--full" data-invalid={err.service ? "" : undefined}>
                    <label htmlFor="f-service">Kind of shoot</label>
                    <select id="f-service" ref={refs.service} value={v.service} onChange={set("service")} onBlur={blur("service")} {...field("service")}>
                      <option value="" disabled>Choose one</option>
                      {groups.map(([label, list]) => <optgroup key={label} label={label}>{list.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>)}
                      <option value="other">Something else</option>
                    </select>
                    <p className="err" id="e-service">{err.service}</p>
                  </div>
                  <div className="field"><label htmlFor="f-date">Date <small>(if you know it)</small></label><input id="f-date" type="date" value={v.date} onChange={set("date")} /></div>
                  <div className="field"><label htmlFor="f-where">Where <small>(area or venue)</small></label><input id="f-where" value={v.where} onChange={set("where")} /></div>
                </div>
              </div>

              <div className="bform__part">
                <h2 className="bform__h"><span className="bform__n">3</span>About you</h2>
                <div className="bform__grid">
                  <div className="field" data-invalid={err.client ? "" : undefined}><label htmlFor="f-name">Your name</label><input id="f-name" ref={refs.client} autoComplete="name" value={v.client} onChange={set("client")} onBlur={blur("client")} {...field("client")} /><p className="err" id="e-client">{err.client}</p></div>
                  <div className="field" data-invalid={err.email ? "" : undefined}><label htmlFor="f-email">Email</label><input id="f-email" ref={refs.email} type="email" autoComplete="email" value={v.email} onChange={set("email")} onBlur={blur("email")} {...field("email")} /><p className="err" id="e-email">{err.email}</p></div>
                  <div className="field field--full"><label htmlFor="f-phone">Phone or WhatsApp <small>(optional)</small></label><input id="f-phone" type="tel" autoComplete="tel" value={v.phone} onChange={set("phone")} /></div>
                  <div className="field field--full" data-invalid={err.message ? "" : undefined}><label htmlFor="f-msg">Tell me about it</label><textarea id="f-msg" ref={refs.message} placeholder="The idea, how many people, photos, video or both" value={v.message} onChange={set("message")} onBlur={blur("message")} {...field("message")} /><p className="err" id="e-message">{err.message}</p></div>
                </div>
              </div>

              <div className="form__foot"><button className="btn btn--accent" type="submit">Send booking request<Icon name="arrow" /></button><p>This opens your email app with everything filled in. Nothing is sent until you press send.</p></div>
            </form>
          ) : (
            <div className="done" role="status" tabIndex={-1} ref={doneRef}>
              <span className="done__tick" aria-hidden="true"><Icon name="check" /></span>
              <h2 className="display h2">Thanks, {v.client.trim().split(" ")[0]}. Your request is ready.</h2>
              <p>Your email app should have opened with the request written out. Press send there and I'll reply with a plan and a price.</p>
              <p>Nothing opened? Message me on Instagram instead.</p>
              <div className="row">
                <a className="btn btn--ink" href={SITE.instagram} target="_blank" rel="noopener"><Icon name="ig" />Message on Instagram</a>
                <button className="btn btn--line" type="button" onClick={() => setDone(false)}>Edit my request</button>
              </div>
            </div>
          )}
        </div>
        <aside className="book__side">
          <div className="summary" aria-live="polite">
            <h2 className="h3">Your request</h2>
            <dl>{summary.map(([k, val]) => <div key={k} className={val ? "is-set" : ""}><dt>{k}</dt><dd>{val || "Not chosen yet"}</dd></div>)}</dl>
          </div>
          <div className="panel">
            <h2 className="h3">Quicker on Instagram?</h2>
            <p>Most bookings start with a DM. Send the date, the place and the idea.</p>
            <a className="btn btn--white" href={SITE.instagram} target="_blank" rel="noopener"><Icon name="ig" />Message {SITE.handle}</a>
          </div>
        </aside>
      </section>
    </div>
  );
}
