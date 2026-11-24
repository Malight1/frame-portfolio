import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../content.js";
import { Icon, usePageTitle } from "../components/ui.jsx";
import { ServiceMedia } from "../components/ServiceMedia.jsx";
import { Steps } from "./Home.jsx";
import Faq from "../components/Faq.jsx";

const GROUPS = [["photography", "Photography", "photo"], ["videography", "Videography", "video"]];

export default function Services() {
  usePageTitle("Services, Riah Visuals");
  // highlight the section currently under the switcher
  const [active, setActive] = useState("photography");
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    GROUPS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <div className="wrap">
      <header className="sv-head">
        <h1 className="display">Services</h1>
        <div>
          <p className="lead">Photo and video services for people, brands and events. Pick one to see what you get, then book it.</p>
        </div>
      </header>
      <nav className="sv-switch" aria-label="Jump to a section">
        <div className="sv-switch__in">
          {GROUPS.map(([id, title, type]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>
              <Icon name={type === "video" ? "video" : "camera"} />{title}<span>{SITE.services.filter((s) => s.type === type).length}</span>
            </a>
          ))}
        </div>
      </nav>
      {GROUPS.map(([id, title, type]) => (
        <section key={id} id={id} className="sv-sec" aria-labelledby={`${id}-title`}>
          <h2 className="display h2 sv-sec__title" id={`${id}-title`}>{title}</h2>
          <div className="stack">
            {SITE.services.filter((s) => s.type === type).map((s, i) => (
              <article key={s.id} className="svcard" id={s.id} style={{ "--i": Math.min(i, 6) }} aria-labelledby={`t-${s.id}`}>
                <ServiceMedia s={s} />
                <div className="svcard__body">
                  <h3 className="svcard__name" id={`t-${s.id}`}>{s.name}</h3>
                  <p className="lead">{s.line}</p>
                  <p className="svcard__covers"><b>Includes</b>{s.covers}</p>
                  <ul className="svcard__gets">{s.gets.map((g) => <li key={g}>{g}</li>)}</ul>
                  <div className="svcard__btns">
                    <Link className="btn btn--accent" to={`/book?service=${s.id}`}>Book this</Link>
                    <Link className="btn btn--line" to={s.see}>See the work<Icon name="arrow" /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
      <section className="section" aria-labelledby="how-title">
        <div className="sec-head rv"><div><h2 className="display h2" id="how-title">How booking works</h2><p className="lead">From first message to finished photos.</p></div></div>
        <Steps />
      </section>
      <section className="section" aria-labelledby="faq-title">
        <div className="faq-split">
          <div className="rv"><h2 className="display h2" id="faq-title">Questions</h2><p className="lead" style={{ marginTop: 14 }}>Something else? Ask me on Instagram.</p></div>
          <Faq />
        </div>
      </section>
    </div>
  );
}
