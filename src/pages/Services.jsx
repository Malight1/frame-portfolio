import { Link } from "react-router-dom";
import { SITE } from "../content.js";
import { Icon, Pic, LazyLoop, usePageTitle } from "../components/ui.jsx";
import { Steps } from "./Home.jsx";

const FAQ = [
  ["Do you really shoot on a phone?", "Yes. A phone lets me move fast and get close, and with the right light and editing the photos and films hold up anywhere you post them."],
  ["Can I get photos and a reel from the same shoot?", "Yes. Most shoots include both. Tell me what you need when you book and we plan the day around it."],
  ["Where do you shoot?", "Around campus and the city, at your venue, or a location we pick together. Send me the area when you book."],
  ["How do I book?", "Send a booking request on this site or message me on Instagram with the date, the place and the idea. I'll reply with a plan and a price."],
];

function Media({ k }) {
  const alt = `${k.name}, shot by ${SITE.name}`;
  return (
    <div className="svcard__media">
      <span>{k.video ? <LazyLoop src={k.video} poster={`${k.img}.jpg`} /> : <Pic base={k.img} alt={alt} sizes="(max-width: 900px) 50vw, 25vw" />}</span>
      {k.img2 && <span><Pic base={k.img2} alt={alt} sizes="(max-width: 900px) 50vw, 25vw" /></span>}
    </div>
  );
}

export default function Services() {
  usePageTitle("Services, Riah Visuals");
  return (
    <div className="wrap">
      <header className="sv-head">
        <h1 className="display">Services</h1>
        <div>
          <p className="lead">Four kinds of shoot, each with photos, video or both. Pick one, see what you get, and book it.</p>
          <div className="hero__ctas" style={{ marginTop: 22 }}>
            <Link className="btn btn--accent" to="/book">Book a shoot</Link>
            <Link className="btn btn--line" to="/portfolio">See the portfolio<Icon name="arrow" /></Link>
          </div>
        </div>
      </header>
      <nav className="sv-index" aria-label="Services on this page">{SITE.kinds.map((k) => <a key={k.id} className="tab" href={`#${k.id}`}>{k.name}</a>)}</nav>
      <div className="stack">
        {SITE.kinds.map((k, i) => (
          <article key={k.id} className="svcard" id={k.id} style={{ "--i": i }} aria-labelledby={`t-${k.id}`}>
            <Media k={k} />
            <div className="svcard__body">
              <h2 id={`t-${k.id}`}>{k.name}</h2>
              <p className="lead">{k.line}</p>
              <div className="svcard__cols">
                <div><h3>What you get</h3><ul>{k.gets.map((g) => <li key={g}>{g}</li>)}</ul></div>
                <div><h3>Good for</h3><ul>{k.good.map((g) => <li key={g}>{g}</li>)}</ul></div>
              </div>
              <div className="svcard__btns">
                <Link className="btn btn--accent" to={`/book?kind=${k.id}`}>Book {k.short.toLowerCase()}</Link>
                <Link className="btn btn--line" to={`/portfolio?k=${k.id}#photos`}>See examples<Icon name="arrow" /></Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <section className="section" aria-labelledby="how-title">
        <div className="sec-head rv"><div><h2 className="display h2" id="how-title">How booking works</h2><p className="lead">Four steps from first message to finished photos.</p></div></div>
        <Steps />
      </section>
      <section className="section" aria-labelledby="faq-title">
        <div className="sec-head rv"><div><h2 className="display h2" id="faq-title">Good to know</h2></div></div>
        <div className="faq">{FAQ.map(([q, a]) => <details key={q} className="rv"><summary>{q}<i aria-hidden="true">+</i></summary><p>{a}</p></details>)}</div>
      </section>
    </div>
  );
}
