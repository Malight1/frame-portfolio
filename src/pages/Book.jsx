import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SITE } from "../content.js";
import { Icon, usePageTitle } from "../components/ui.jsx";

const OPTIONS = [...SITE.kinds.map((k) => [k.id, k.name]), ["other", "Something else"]];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function check(v) {
  return {
    kind: v.kind ? "" : "Choose what you want to shoot.",
    client: v.client.trim() ? "" : "Please add your name.",
    email: !v.email.trim() ? "Please add your email so I can reply." : EMAIL.test(v.email.trim()) ? "" : "That email looks incomplete, for example name@example.com.",
    message: v.message.trim().length >= 10 ? "" : "Add a sentence or two about the shoot.",
  };
}

export default function Book() {
  usePageTitle("Book a shoot, Riah Visuals");
  const [params] = useSearchParams();
  const pre = OPTIONS.find(([id]) => id === params.get("kind"));
  const [v, setV] = useState({ kind: pre ? pre[1] : "", client: "", email: "", date: "", where: "", message: "" });
  const [err, setErr] = useState({});
  const [done, setDone] = useState(false);
  const refs = { kind: useRef(null), client: useRef(null), email: useRef(null), message: useRef(null) };
  const doneRef = useRef(null);

  const set = (k) => (e) => { const next = { ...v, [k]: e.target.value }; setV(next); if (err[k]) setErr((x) => ({ ...x, [k]: check(next)[k] })); };
  const blur = (k) => () => v[k] && setErr((x) => ({ ...x, [k]: check(v)[k] }));
  const submit = (e) => {
    e.preventDefault();
    const found = check(v); setErr(found);
    const first = ["kind", "client", "email", "message"].find((k) => found[k]);
    if (first) { (first === "kind" ? refs.kind.current.querySelector("input") : refs[first].current).focus(); return; }
    const body = [`Name: ${v.client.trim()}`, `Email: ${v.email.trim()}`, `Shoot: ${v.kind}`, `Date: ${v.date || "Not set yet"}`, `Where: ${v.where.trim() || "Not set yet"}`, "", v.message.trim()].join("\n");
    setDone(true);
    setTimeout(() => doneRef.current?.focus(), 0);
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Booking: ${v.kind}`)}&body=${encodeURIComponent(body)}`;
  };
  const field = (k) => ({ "aria-invalid": !!err[k], "aria-describedby": `e-${k}` });

  return (
    <div className="wrap">
      <header className="page-head">
        <h1 className="display h1">Book a shoot</h1>
        <p className="lead">Tell me what you're planning and I'll reply with a plan and a price. Prefer to chat? Message me on Instagram.</p>
      </header>
      <section className="book">
        <div>
          {!done ? (
            <form className="form" noValidate onSubmit={submit}>
              <fieldset ref={refs.kind} data-invalid={err.kind ? "" : undefined} aria-describedby="e-kind">
                <legend>What do you want to shoot?</legend>
                <div className="choices">
                  {OPTIONS.map(([id, name]) => (
                    <label key={id} className="choice"><input type="radio" name="kind" value={name} checked={v.kind === name} onChange={(e) => { setV({ ...v, kind: e.target.value }); setErr((x) => ({ ...x, kind: "" })); }} />{name}</label>
                  ))}
                </div>
                <p className="err" id="e-kind" style={{ marginTop: 8 }}>{err.kind}</p>
              </fieldset>
              <div className="field" data-invalid={err.client ? "" : undefined}><label htmlFor="f-name">Your name</label><input id="f-name" ref={refs.client} autoComplete="name" value={v.client} onChange={set("client")} onBlur={blur("client")} {...field("client")} /><p className="err" id="e-client">{err.client}</p></div>
              <div className="field" data-invalid={err.email ? "" : undefined}><label htmlFor="f-email">Email</label><input id="f-email" ref={refs.email} type="email" autoComplete="email" value={v.email} onChange={set("email")} onBlur={blur("email")} {...field("email")} /><p className="err" id="e-email">{err.email}</p></div>
              <div className="field"><label htmlFor="f-date">Date <small>(if you know it)</small></label><input id="f-date" type="date" value={v.date} onChange={set("date")} /></div>
              <div className="field"><label htmlFor="f-where">Where <small>(area or venue)</small></label><input id="f-where" value={v.where} onChange={set("where")} /></div>
              <div className="field field--full" data-invalid={err.message ? "" : undefined}><label htmlFor="f-msg">Tell me about it</label><textarea id="f-msg" ref={refs.message} placeholder="What it is, how many people, photos, reels or both" value={v.message} onChange={set("message")} onBlur={blur("message")} {...field("message")} /><p className="err" id="e-message">{err.message}</p></div>
              <div className="form__foot"><button className="btn btn--accent" type="submit">Send booking request</button><p>This opens your email app with everything filled in. Nothing is sent until you press send.</p></div>
            </form>
          ) : (
            <div className="done" role="status" tabIndex={-1} ref={doneRef}>
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
        <aside className="panel" aria-label="Quicker ways to book">
          <h2 className="h3">Quicker on Instagram?</h2>
          <p>Most bookings start with a DM. Send the date, the place and the idea.</p>
          <a className="btn btn--accent" href={SITE.instagram} target="_blank" rel="noopener"><Icon name="ig" />Message {SITE.handle}</a>
          <h2 className="h3" style={{ marginTop: 12 }}>What happens next</h2>
          <ol>{SITE.about.steps.slice(1).map((s, i) => <li key={s.name}><span>{i + 1}</span><span><b>{s.name}</b>{s.note}</span></li>)}</ol>
        </aside>
      </section>
    </div>
  );
}
