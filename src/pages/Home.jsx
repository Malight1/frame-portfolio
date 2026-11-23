import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../content.js";
import { Icon, Pic, ReelCard, LazyLoop, baseOf, canHover, reduceMotion, useTrackArrows, usePageTitle } from "../components/ui.jsx";
import { useViewers } from "../components/Viewers.jsx";
import { useReady } from "../components/Layout.jsx";
import { initFluid } from "../components/fluid-engine.js";

const R = (id) => SITE.reels.find((r) => r.id === id);
const FAN = [R("this-very-day"), R("everyone-gets-fazzy"), R("bloopers")];
const WORDS = ["Street style", "Convocation", "Final-year week", "Portraits", "Brand films", "Short films", "Behind the scenes"];

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
            {SITE.role}, and official photographer for <a href="https://www.instagram.com/fazzy_d__/" target="_blank" rel="noopener">@fazzy_d_</a>. {SITE.line}
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

function Reels() {
  const { openReels } = useViewers();
  const { track, state, prev, next } = useTrackArrows();
  return (
    <section className="section" aria-labelledby="reels-title">
      <div className="wrap">
        <div className="sec-head rv">
          <div><h2 className="display h2" id="reels-title">Latest reels</h2><p className="lead">Tap any reel to watch it with sound.</p></div>
          <div className="arrows" hidden={!state.show}>
            <button className="arrow" type="button" aria-label="Scroll reels left" disabled={state.start} onClick={prev}><Icon name="left" /></button>
            <button className="arrow" type="button" aria-label="Scroll reels right" disabled={state.end} onClick={next}><Icon name="right" /></button>
          </div>
        </div>
        <div className="reels" ref={track}>{SITE.reels.map((r, i) => <ReelCard key={r.id} reel={r} onOpen={() => openReels(SITE.reels, i)} />)}</div>
      </div>
    </section>
  );
}

function Photos() {
  const { openPhotos } = useViewers();
  const picks = [0, 1, 4, 3, 2].map((i) => SITE.photos[i]);
  return (
    <section className="section" aria-labelledby="photos-title">
      <div className="wrap">
        <div className="sec-head rv">
          <div><h2 className="display h2" id="photos-title">Photos</h2><p className="lead">Tap a photo to see it full size.</p></div>
          <Link className="btn btn--line btn--sm" to="/portfolio#photos">See all photos<Icon name="arrow" /></Link>
        </div>
        <div className="bento">
          {picks.map((p, n) => (
            <div key={p.src} className={`b${n + 1} rv`}>
              <button type="button" aria-label={`View ${p.title} full size`} onClick={() => openPhotos(picks, n)}>
                <Pic base={baseOf(p)} alt={p.title} sizes={n === 0 ? "(max-width: 860px) 100vw, 34vw" : "(max-width: 860px) 50vw, 34vw"} />
              </button>
            </div>
          ))}
          <Link className="b6 rv" to="/portfolio#photos"><p>{SITE.photos.length} photos: street style, portraits, convocations and final-year week.</p><span className="link">See all photos<Icon name="arrow" /></span></Link>
        </div>
      </div>
    </section>
  );
}

function ShootMedia({ k, className }) {
  if (k.video) return <video className={className} src={k.video} poster={`${k.img}.jpg`} muted loop playsInline preload="none" aria-hidden="true" />;
  return <Pic base={k.img} alt={k.name} sizes="(max-width: 860px) 100vw, 40vw" className={className} />;
}

function WhatIShoot() {
  const [active, setActive] = useState(0);
  const screen = useRef(null);
  useEffect(() => { [...screen.current.children].forEach((m, j) => { if (m.tagName === "VIDEO") { if (j === active) m.play().catch(() => {}); else m.pause(); } }); }, [active]);
  return (
    <section className="section" aria-labelledby="svc-title">
      <div className="wrap">
        <div className="sec-head rv">
          <div><h2 className="display h2" id="svc-title">What I shoot</h2><p className="lead">Four kinds of shoot. Pick one to see the work, then book it.</p></div>
          <Link className="btn btn--line btn--sm" to="/services">All services</Link>
        </div>
        <div className="shoot">
          <div className="shoot__screen" ref={screen} aria-hidden="true">{SITE.kinds.map((k, i) => <ShootMedia key={k.id} k={k} className={i === active ? "on" : ""} />)}</div>
          <ol className="shoot__list">
            {SITE.kinds.map((k, i) => (
              <li key={k.id} className={`srow${i === active ? " on" : ""}`} onPointerEnter={() => canHover() && setActive(i)} onFocus={() => setActive(i)}>
                <span className="srow__media">{k.video ? <LazyLoop src={k.video} poster={`${k.img}.jpg`} /> : <Pic base={k.img} alt={k.name} sizes="100vw" />}</span>
                <Link className="srow__name" to={`/services#${k.id}`}>{k.name}</Link>
                <Link className="srow__go" to={`/services#${k.id}`} aria-label={`See ${k.name}`}><Icon name="arrow" /></Link>
                <div className="srow__body">
                  <p>{k.line}</p>
                  <div className="srow__chips">{k.gets.map((g) => <span key={g}>{g}</span>)}</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Link className="btn btn--accent btn--sm" to={`/book?kind=${k.id}`}>Book this</Link>
                    <Link className="btn btn--line btn--sm" to={`/portfolio?k=${k.id}#photos`}>See examples</Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Credit() {
  return (
    <section className="section" aria-label={`About ${SITE.name}`}>
      <div className="wrap"><div className="credit rv">
        <span className="credit__img"><img src="/media/riah/profile.jpg" alt={SITE.name} loading="lazy" /></span>
        <div><p className="small" style={{ fontWeight: 700 }}>Who you'll work with</p><h2 className="display h2" style={{ marginTop: 8 }}>{SITE.name}, official photographer for @fazzy_d_</h2></div>
        <Link className="btn btn--ink" to="/about">About {SITE.name}</Link>
      </div></div>
    </section>
  );
}

export function Steps() {
  return <ol className="steps">{SITE.about.steps.map((s) => <li key={s.name} className="rv"><h3 className="h3">{s.name}</h3><p>{s.note}</p></li>)}</ol>;
}

export default function Home() {
  usePageTitle("Riah Visuals, mobile photographer and videographer");
  const seq = WORDS.map((w) => <span key={w}>{w}<i aria-hidden="true">/</i></span>);
  return (
    <>
      <Hero />
      <div className="ticker" aria-hidden="true"><div className="ticker__row">{seq}{WORDS.map((w) => <span key={w + "2"}>{w}<i>/</i></span>)}</div></div>
      <Reels />
      <Photos />
      <WhatIShoot />
      <Credit />
      <section className="section" aria-labelledby="how-title">
        <div className="wrap">
          <div className="sec-head rv"><div><h2 className="display h2" id="how-title">How booking works</h2><p className="lead">Four easy steps from first message to finished photos.</p></div></div>
          <Steps />
        </div>
      </section>
    </>
  );
}
