import { Link } from "react-router-dom";
import { SITE } from "../content.js";
import { Icon, usePageTitle } from "../components/ui.jsx";
import { ServiceMedia } from "../components/ServiceMedia.jsx";
import { Steps } from "./Home.jsx";
import Faq from "../components/Faq.jsx";

export default function Services() {
  usePageTitle("Services, Riah Visuals");
  return (
    <div className="wrap">
      <header className="sv-head">
        <h1 className="display">Services</h1>
        <div>
          <p className="lead">Six services in photos and video, for people, brands and events. Pick one, see what you get, and book it.</p>
          <div className="hero__ctas" style={{ marginTop: 22 }}>
            <Link className="btn btn--accent" to="/book">Book a shoot</Link>
            <Link className="btn btn--line" to="/portfolio">See the portfolio<Icon name="arrow" /></Link>
          </div>
        </div>
      </header>
      <nav className="sv-index" aria-label="Services on this page">
        <a className="tab" href="#photography"><Icon name="camera" />Photography</a>
        <a className="tab" href="#videography"><Icon name="video" />Videography</a>
      </nav>
      {[["photography", "Photography", "photo"], ["videography", "Videography", "video"]].map(([id, title, type]) => (
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
