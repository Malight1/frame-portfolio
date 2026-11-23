import { Link } from "react-router-dom";
import { SITE } from "../content.js";
import { Icon, Pic, ReelCard, baseOf, usePageTitle } from "../components/ui.jsx";
import { useViewers } from "../components/Viewers.jsx";
import { Steps } from "./Home.jsx";

export default function About() {
  usePageTitle(`About ${SITE.name}, Riah Visuals`);
  const { openReels } = useViewers();
  const A = SITE.about;
  return (
    <div className="wrap" style={{ paddingTop: "clamp(40px,6vw,80px)" }}>
      <section className="about">
        <figure className="about__art">
          <Pic base={baseOf(SITE.photos[0])} alt={`${SITE.photos[0].title}, shot by ${SITE.name}`} sizes="(max-width: 860px) 60vw, 26vw" />
          <Pic base={baseOf(SITE.photos[3])} alt={`${SITE.photos[3].title}, shot by ${SITE.name}`} sizes="(max-width: 860px) 60vw, 26vw" />
          <span className="about__me"><img src={A.photo} alt={SITE.name} /></span>
        </figure>
        <div>
          <p className="about__role">{SITE.role}</p>
          <h1 className="display h1">I'm {SITE.name}.</h1>
          <p className="lead">{A.lead}</p>
          {A.text.map((t) => <p key={t} style={{ color: "var(--ink-2)" }}>{t}</p>)}
          <div className="hero__ctas">
            <Link className="btn btn--accent" to="/book">Book a shoot</Link>
            <a className="btn btn--line" href={SITE.instagram} target="_blank" rel="noopener"><Icon name="ig" />{SITE.handle}</a>
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="svc-title">
        <div className="sec-head rv"><div><h2 className="display h2" id="svc-title">What I shoot</h2><p className="lead">Photos and reels for each of these, edited and ready to post. Open one to see what you get.</p></div></div>
        <ul className="klist">{SITE.kinds.map((k) => <li key={k.id} className="rv"><Link to={`/services#${k.id}`}><span><b>{k.name}</b><small>{k.line}</small></span><Icon name="arrow" /></Link></li>)}</ul>
      </section>
      <section className="section" aria-labelledby="how-title">
        <div className="sec-head rv"><div><h2 className="display h2" id="how-title">How booking works</h2></div></div>
        <Steps />
      </section>
      <section className="section" aria-labelledby="r-title">
        <div className="sec-head rv"><div><h2 className="display h2" id="r-title">A few reels</h2></div><Link className="btn btn--line btn--sm" to="/portfolio">See the portfolio<Icon name="arrow" /></Link></div>
        <div className="reel-grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))" }}>{SITE.reels.map((r, i) => <ReelCard key={r.id} reel={r} onOpen={() => openReels(SITE.reels, i)} />)}</div>
      </section>
    </div>
  );
}
