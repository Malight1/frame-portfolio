import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SITE } from "../content.js";
import { Icon, Pic, baseOf, kindName, reduceMotion, usePageTitle } from "../components/ui.jsx";
import { useViewers } from "../components/Viewers.jsx";

/* Films: a big stage plays the chosen film silently; "Watch with sound" opens it full screen. */
function Cinema() {
  const { openReels } = useViewers();
  const [cur, setCur] = useState(0);
  const stage = useRef(null), vid = useRef(null);
  const r = SITE.reels[cur];
  useEffect(() => {
    vid.current?.play().catch(() => {});
    if (!reduceMotion()) stage.current.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 450, easing: "ease-out" });
  }, [cur]);
  const pick = (i) => { if (matchMedia("(max-width: 960px)").matches && i === cur) openReels(SITE.reels, i); setCur(i); };
  return (
    <div className="cinema">
      <div className="cinema__stage rv" ref={stage}>
        <img className="cinema__bg" src={r.poster} alt="" aria-hidden="true" />
        <video key={r.id} ref={vid} className={`cinema__vid${r.ratio > 1.2 ? " is-wide" : ""}`} src={r.loop} poster={r.poster} muted loop playsInline autoPlay aria-label={`${r.title}, silent preview`} />
        <div className="cinema__info">
          <div><span className="cinema__kind">{kindName(r.kind)} / {r.length}</span><h3>{r.title}</h3><p>{r.note}</p></div>
          <div className="cinema__btns">
            <button className="btn btn--accent" type="button" onClick={() => openReels(SITE.reels, cur)}><Icon name="play" />Watch with sound</button>
            {r.post && <a className="btn btn--glass" href={r.post} target="_blank" rel="noopener" aria-label={`View project: ${r.title}`}>View project<Icon name="ext" /></a>}
          </div>
        </div>
      </div>
      <div className="cinema__list" role="group" aria-label="Choose a film">
        {SITE.reels.map((f, i) => (
          <button key={f.id} className="cine" type="button" aria-pressed={i === cur} onClick={() => pick(i)}>
            <span className="cine__thumb"><img src={f.poster} alt="" loading="lazy" /></span>
            <span><b>{f.title}</b><span>{kindName(f.kind)} / {f.length}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Photographs: filter by kind, then open any one full size. Photos fill balanced columns in reading order. */
const useCols = () => {
  const q = () => (innerWidth <= 640 ? 2 : innerWidth <= 1000 ? 3 : 4);
  const [n, setN] = useState(q);
  useEffect(() => { const on = () => setN(q()); addEventListener("resize", on); return () => removeEventListener("resize", on); }, []);
  return n;
};
function Gallery() {
  const { openPhotos } = useViewers();
  const [params, setParams] = useSearchParams();
  const kinds = [{ id: "all", short: "All" }, ...SITE.kinds.filter((k) => SITE.photos.some((p) => p.kind === k.id))];
  const k = kinds.some((x) => x.id === params.get("k")) ? params.get("k") : "all";
  const shown = SITE.photos.filter((p) => k === "all" || p.kind === k);
  const count = (id) => (id === "all" ? SITE.photos.length : SITE.photos.filter((p) => p.kind === id).length);
  const setK = (id) => setParams(id === "all" ? {} : { k: id }, { replace: true, preventScrollReset: true });
  const n = useCols();
  const cols = Array.from({ length: n }, () => ({ h: 0, items: [] }));
  shown.forEach((p, i) => { const c = cols.reduce((a, b) => (b.h < a.h ? b : a)); c.items.push([p, i]); c.h += p.h / p.w; });
  const idx = kinds.findIndex((x) => x.id === k);
  return (
    <>
      <div className="pf-bar">
        <div className="seg seg--wide" role="group" aria-label="Filter photographs" style={{ "--i": idx, "--n": kinds.length }}>
          <span className="seg__pill" aria-hidden="true" />
          {kinds.map((x) => <button key={x.id} type="button" aria-pressed={x.id === k} onClick={() => setK(x.id)}>{x.short}<span className="n">{count(x.id)}</span></button>)}
        </div>
      </div>
      <div className="wall" key={k + n} style={{ "--cols": n }}>
        {cols.map((c, ci) => (
          <div key={ci} className="wall__col">
            {c.items.map(([p, i]) => (
              <figure key={p.src} className="wtile" style={{ "--d": `${Math.min(i, 12) * 45}ms` }}>
                <button type="button" aria-label={`View ${p.title} full size`} onClick={() => openPhotos(shown, i)} style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                  <Pic base={baseOf(p)} alt={p.title} sizes={`(max-width: 640px) 50vw, (max-width: 1000px) 33vw, 25vw`} width={p.w} height={p.h} />
                  <span className="wtile__zoom" aria-hidden="true"><Icon name="zoom" /></span>
                </button>
                <figcaption>
                  <span><b>{p.title}</b><small>{kindName(p.kind)}</small></span>
                  {p.post && <a href={p.post} target="_blank" rel="noopener" aria-label={`View project: ${p.title}`}>View project<Icon name="ext" /></a>}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default function Portfolio() {
  usePageTitle("Portfolio, Riah Visuals");
  return (
    <div className="wrap">
      <header className="pf-head">
        <div>
          <h1 className="display">Portfolio</h1>
          <p className="lead" style={{ marginTop: 18, maxWidth: "48ch" }}>Fashion films, documentaries and photographs. Press play on a film, or open any photo full size.</p>
          <nav className="pf-jump" aria-label="Jump to"><a className="btn btn--ink btn--sm" href="#films">Films</a><a className="btn btn--line btn--sm" href="#photos">Photographs</a></nav>
        </div>
        <div className="pf-stats">
          <div><b>{SITE.reels.length}</b><span>films</span></div>
          <div><b>{SITE.photos.length}</b><span>photographs</span></div>
          <div><b>{SITE.services.length}</b><span>services</span></div>
        </div>
      </header>
      <section id="films" aria-labelledby="films-title" style={{ scrollMarginTop: 100 }}>
        <h2 className="sr" id="films-title">Films</h2>
        <Cinema />
      </section>
      <section id="photos" className="section" aria-labelledby="photos-title" style={{ scrollMarginTop: 90 }}>
        <div className="sec-head rv"><div><h2 className="display h2" id="photos-title">Photographs</h2><p className="lead">Fashion, lifestyle, portraits and events. Tap a photo to see it full size.</p></div></div>
        <Gallery />
      </section>
    </div>
  );
}
