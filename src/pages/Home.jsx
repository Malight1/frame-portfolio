import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../content.js";
import { Icon, Pic, LazyLoop, baseOf, canHover, kindName, reduceMotion, usePageTitle } from "../components/ui.jsx";
import { useViewers } from "../components/Viewers.jsx";
import { useReady } from "../components/Layout.jsx";
import { initFluid } from "../components/fluid-engine.js";
import Faq from "../components/Faq.jsx";
import { ServiceMedia } from "../components/ServiceMedia.jsx";

export const R = (id) => SITE.reels.find((r) => r.id === id);
const FAN = [R("estaz"), R("waterfront"), R("welum")];
const WORDS = ["Fashion", "Lifestyle", "Portraits", "Birthdays", "Convocation", "Events", "Conferences", "Video coverage", "Fashion films", "Documentaries"];

function Hero() {
  const ready = useReady();
  const { openReels } = useViewers();
  const hero = useRef(null), fan = useRef(null), canvas = useRef(null), title = useRef(null), line = useRef(null), ctas = useRef(null);
  const cards = useRef([]);

  // the liquid behind the reels
  useEffect(() => {
    if (reduceMotion()) return;
    const stop = initFluid(canvas.current, hero.current);
    if (!stop) canvas.current.style.display = "none";
    return () => stop && stop();
  }, []);

  // after the loading sequence: the name rises line by line, then the line and buttons
  useEffect(() => {
    if (!ready || reduceMotion()) return;
    [...title.current.querySelectorAll(".ln > span")].forEach((el, i) => el.animate([{ transform: "translateY(105%)" }, { transform: "none" }], { duration: 1100, delay: 120 + i * 120, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }));
    [line.current, ctas.current].forEach((el, i) => el.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 900, delay: 450 + i * 90, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }));
  }, [ready]);

  // the reels float on springs: each has its own depth, drifts on its own, leans toward the pointer and spreads in on load
  useEffect(() => {
    if (!ready || reduceMotion()) return;
    const narrow = innerWidth <= 860, hover = canHover();
    const rest = narrow ? [[-112, -46, -8], [-50, -54, 0], [12, -46, 8]] : [[-128, -46, -8], [-50, -54, 0], [28, -46, 8]];
    const depth = [0.6, 1, 0.75];
    const st = cards.current.map(() => ({ x: 0, y: 40, r: 0, vx: 0, vy: 0, vr: 0, s: 0.85, vs: 0 }));
    const aim = { x: 0, y: 0 }; let over = -1;
    const h = hero.current;
    const onMove = (e) => { const b = fan.current.getBoundingClientRect(); aim.x = ((e.clientX - b.left) / b.width - 0.5) * 2; aim.y = ((e.clientY - b.top) / b.height - 0.5) * 2; };
    const onLeave = () => { aim.x = 0; aim.y = 0; };
    h.addEventListener("pointermove", onMove); h.addEventListener("pointerleave", onLeave);
    const enters = cards.current.map((c, i) => { const en = () => (over = i), le = () => (over = -1); c.addEventListener("pointerenter", en); c.addEventListener("pointerleave", le); return [en, le]; });
    const t0 = performance.now() + 300; let raf = 0;
    const step = (now) => {
      raf = requestAnimationFrame(step);
      const t = (now - t0) / 1000, k = 120, d = 14, dt = 1 / 60;
      cards.current.forEach((c, i) => {
        const s = st[i], on = Math.min(1, Math.max(0, (t - 0.3 - i * 0.12) / 0.9));
        const drift = Math.sin(t * (0.8 + i * 0.17) + i * 2) * 8, driftR = Math.sin(t * (0.6 + i * 0.2) + i) * 1.4;
        const tx = hover ? aim.x * 26 * depth[i] : 0;
        const ty = (hover ? aim.y * 18 * depth[i] : 0) + drift + (1 - on) * 60;
        const tr = (hover ? aim.x * 4 * depth[i] : 0) + driftR;
        const ts = over === i ? 1.06 : on < 1 ? 0.85 + 0.15 * on : 1;
        s.vx += ((tx - s.x) * k - s.vx * d) * dt; s.x += s.vx * dt;
        s.vy += ((ty - s.y) * k - s.vy * d) * dt; s.y += s.vy * dt;
        s.vr += ((tr - s.r) * k - s.vr * d) * dt; s.r += s.vr * dt;
        s.vs += ((ts - s.s) * 160 - s.vs * 16) * dt; s.s += s.vs * dt;
        const [bx, by, br] = rest[i];
        c.style.transform = `translate(${bx}%, ${by}%) translate(${s.x}px, ${s.y}px) rotate(${br + s.r}deg) scale(${s.s})`;
        c.style.opacity = String(Math.min(1, on * 1.4));
        c.style.zIndex = over === i ? 4 : i === 1 ? 2 : 1;
      });
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); h.removeEventListener("pointermove", onMove); h.removeEventListener("pointerleave", onLeave); cards.current.forEach((c, i) => { c?.removeEventListener("pointerenter", enters[i][0]); c?.removeEventListener("pointerleave", enters[i][1]); }); };
  }, [ready]);

  const hidden = !ready ? { opacity: 0 } : undefined;
  return (
    <section className="hero" ref={hero} aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div>
          <h1 className="display" id="hero-title" ref={title} style={hidden}><span className="ln"><span>Riah</span></span><span className="ln"><span>Visuals<span className="hl">.</span></span></span></h1>
          <p className="lead hero__line" ref={line} style={hidden}>
            {SITE.role}. {SITE.line}
          </p>
          <div className="hero__ctas" ref={ctas} style={hidden}>
            <Link className="btn btn--accent" to="/book">Book a shoot</Link>
            <Link className="btn btn--line" to="/portfolio">See the portfolio<Icon name="arrow" /></Link>
          </div>
        </div>
        <div className="fan" ref={fan}>
          <canvas className="fan__fluid" ref={canvas} aria-hidden="true" />
          {FAN.map((r, i) => (
            <button key={r.id} ref={(el) => (cards.current[i] = el)} className="fan__card" type="button" aria-label={`Watch ${r.title}`} onClick={() => openReels(FAN, i)}>
              <img src={r.poster} alt="" />
              <video src={r.loop} muted loop playsInline autoPlay preload="auto" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* A short statement about Seraiah. Each line lights up as it scrolls into view. */
function Intro() {
  const words = `I'm ${SITE.name}. I shoot fashion, lifestyle, portraits, convocations, events and documentary films, and I plan the colour around every look so your photos come out bold and true to you.`.split(" ");
  return (
    <section className="intro section" aria-labelledby="intro-title">
      <div className="wrap intro__grid">
        <figure className="intro__me rv">
          <img src={SITE.about.photo} alt={`Portrait of ${SITE.name}`} loading="lazy" />
        </figure>
        <div>
          <h2 className="sr" id="intro-title">About {SITE.name}</h2>
          <p className="intro__text">{words.map((w, i) => <span key={i}>{w} </span>)}</p>
          <Link className="btn btn--line" to="/about" style={{ marginTop: 32 }}>More about {SITE.name}<Icon name="arrow" /></Link>
        </div>
      </div>
    </section>
  );
}

/* Films: one plays at a time on a big screen, in full (never cropped), and the next takes over on its own. */
const FILMS = ["welum", "estaz", "waterfront", "white-dress"].map(R);
const FILM_MS = 7000;
function Films() {
  const { openReels } = useViewers();
  const [cur, setCur] = useState(0);
  const [hold, setHold] = useState(false);
  const [seen, setSeen] = useState(false);
  const root = useRef(null), vids = useRef([]);
  useEffect(() => { const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 }); io.observe(root.current); return () => io.disconnect(); }, []);
  useEffect(() => {
    vids.current.forEach((v, i) => { if (!v) return; if (i === cur && seen) { if (!v.src) v.src = FILMS[i].loop; v.play().catch(() => { }); } else v.pause(); });
  }, [cur, seen]);
  useEffect(() => {
    if (!seen || hold || reduceMotion()) return;
    const t = setTimeout(() => setCur((c) => (c + 1) % FILMS.length), FILM_MS);
    return () => clearTimeout(t);
  }, [cur, seen, hold]);
  const f = FILMS[cur];
  return (
    <section className="section" aria-labelledby="films-title" ref={root}>
      <div className="wrap">
        <div className="sec-head rv">
          <h2 className="display h2" id="films-title">Films</h2>
          <Link className="btn btn--line btn--sm" to="/portfolio#films">All films<Icon name="arrow" /></Link>
        </div>
        <div className={`stage rv${hold ? " is-held" : ""}`} onPointerEnter={() => canHover() && setHold(true)} onPointerLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
          {FILMS.map((x, i) => <img key={x.id} className={`stage__bg${i === cur ? " on" : ""}`} src={x.poster} alt="" aria-hidden="true" loading="lazy" />)}
          <div className="stage__screen">
            {FILMS.map((x, i) => (
              <video key={x.id} ref={(el) => (vids.current[i] = el)} className={i === cur ? "on" : ""} poster={x.poster} muted loop playsInline preload="none" aria-hidden="true" />
            ))}
          </div>
          <div className="stage__info" key={f.id}>
            <p className="stage__kind">{kindName(f.kind)} / {f.length}</p>
            <h3>{f.title}</h3>
            <p>{f.note}</p>
            <button className="btn btn--white" type="button" onClick={() => openReels(FILMS, cur)}><Icon name="play" />Watch with sound</button>
          </div>
          <div className="stage__list" role="group" aria-label="Choose a film">
            {FILMS.map((x, i) => (
              <button key={x.id} type="button" aria-pressed={i === cur} onClick={() => setCur(i)}>
                <span className="stage__bar"><i key={`${cur}-${i}`} /></span>
                <b>{x.title}</b>
                <span>{kindName(x.kind)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Fashion and lifestyle photos in three columns that drift at different speeds as you scroll. */
function Photos() {
  const { openPhotos } = useViewers();
  const picks = SITE.photos.filter((p) => p.kind === "fashion").slice(0, 12);
  const cols = [0, 1, 2].map((c) => picks.filter((_, i) => i % 3 === c));
  return (
    <section className="section" aria-labelledby="photos-title">
      <div className="wrap">
        <div className="sec-head rv">
          <div><h2 className="display h2" id="photos-title">Fashion & lifestyle</h2><p className="lead">Colour is the point. Tap any photo to see it full size.</p></div>
          <Link className="btn btn--line btn--sm" to="/portfolio?k=fashion#photos">All photos<Icon name="arrow" /></Link>
        </div>
        <div className="drift">
          {cols.map((col, c) => (
            <div key={c} className={`drift__col drift__col--${c}`}>
              {col.map((p) => (
                <button key={p.src} type="button" className="drift__tile" aria-label={`View ${p.title} full size`} onClick={() => openPhotos(picks, picks.indexOf(p))}>
                  <Pic base={baseOf(p)} alt={p.title} sizes="(max-width: 700px) 50vw, 33vw" width={p.w} height={p.h} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* What I shoot: every service on its own card, with the work, what it covers and two plain buttons. */
function WhatIShoot() {
  return (
    <section className="section" aria-labelledby="svc-title">
      <div className="wrap">
        <div className="sec-head rv">
          <div><h2 className="display h2" id="svc-title">What I shoot</h2><p className="lead">Six services in photos and video. Book one straight away, or see the work first.</p></div>
          <Link className="btn btn--line btn--sm" to="/services">All service details<Icon name="arrow" /></Link>
        </div>
        <div className="offer">
          {SITE.services.map((s, i) => (
            <article key={s.id} className="offer__card rv" aria-labelledby={`o-${s.id}`}>
              <Link className="offer__media" to={`/services#${s.id}`} tabIndex={-1} aria-hidden="true">
                <ServiceMedia s={s} className="offer__pics" sizes="(max-width: 700px) 50vw, 17vw" />
              </Link>
              <div className="offer__body">
                <p className="offer__type"><Icon name={s.type === "video" ? "video" : "camera"} />{s.type === "video" ? "Video" : "Photography"}</p>
                <h3 id={`o-${s.id}`}>{s.name}</h3>
                <p className="offer__covers">{s.covers}</p>
                <div className="offer__btns">
                  <Link className="btn btn--accent btn--sm" to={`/book?service=${s.id}`}>Book</Link>
                  <Link className="btn btn--line btn--sm" to={s.see}>See the work<Icon name="arrow" /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Steps() {
  return <ol className="steps">{SITE.about.steps.map((s) => <li key={s.name} className="rv"><h3 className="h3">{s.name}</h3><p>{s.note}</p></li>)}</ol>;
}

function Questions() {
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="wrap faq-split">
        <div className="rv">
          <h2 className="display h2" id="faq-title">Questions</h2>
          <p className="lead" style={{ marginTop: 14 }}>Something else on your mind? Ask me on Instagram.</p>
          <a className="btn btn--line" href={SITE.instagram} target="_blank" rel="noopener" style={{ marginTop: 26 }}><Icon name="ig" />{SITE.handle}</a>
        </div>
        <Faq />
      </div>
    </section>
  );
}

export default function Home() {
  usePageTitle("Riah Visuals, photographer and videographer");
  const seq = WORDS.map((w) => <span key={w}>{w}<i aria-hidden="true">/</i></span>);
  return (
    <>
      <Hero />
      <div className="ticker" aria-hidden="true"><div className="ticker__row">{seq}{WORDS.map((w) => <span key={w + "2"}>{w}<i>/</i></span>)}</div></div>
      <Intro />
      <Films />
      <Photos />
      <WhatIShoot />
      <section className="section" aria-labelledby="how-title">
        <div className="wrap">
          <div className="sec-head rv"><div><h2 className="display h2" id="how-title">How booking works</h2><p className="lead">From first message to finished photos.</p></div></div>
          <Steps />
        </div>
      </section>
      <Questions />
    </>
  );
}
