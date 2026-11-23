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
            {r.post && <a className="btn btn--glass" href={r.post} target="_blank" rel="noopener" aria-label={`View project: ${r.title}, opens the Instagram post`}>View project<Icon name="ext" /></a>}
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

/* Photographs: filter by kind, then open any one full size or jump to its Instagram post. */
function Gallery() {
  const { openPhotos } = useViewers();
  const [params, setParams] = useSearchParams();
  const kinds = [{ id: "all", name: "All" }, ...SITE.kinds.filter((k) => SITE.photos.some((p) => p.kind === k.id))];
  const k = kinds.some((x) => x.id === params.get("k")) ? params.get("k") : "all";
  const shown = SITE.photos.filter((p) => k === "all" || p.kind === k);
  const count = (id) => (id === "all" ? SITE.photos.length : SITE.photos.filter((p) => p.kind === id).length);
  const setK = (id) => setParams(id === "all" ? {} : { k: id }, { replace: true, preventScrollReset: true });
  return (
    <>
      <div className="pf-bar">
        <div className="tabs" role="group" aria-label="Filter photographs">
          {kinds.map((x) => <button key={x.id} className="tab" type="button" aria-pressed={x.id === k} onClick={() => setK(x.id)}>{x.short || x.name}<span className="n">{count(x.id)}</span></button>)}
        </div>
        <p className="small" aria-live="polite">Showing {shown.length} of {SITE.photos.length}</p>
      </div>
      <div className="gallery">
        {shown.map((p, i) => (
          <figure key={p.src} className="tile rv in">
            <button type="button" aria-label={`View ${p.title} full size`} onClick={() => openPhotos(shown, i)}>
              <Pic base={baseOf(p)} alt={p.title} sizes="(max-width: 640px) 50vw, (max-width: 1000px) 50vw, 33vw" width={p.w} height={p.h} />
            </button>
            <figcaption className="tile__cap">
              <span><b>{p.title}</b><small>{p.credit || kindName(p.kind)}</small></span>
              {p.post && <a className="tile__project" href={p.post} target="_blank" rel="noopener" aria-label={`View project: ${p.title}, opens the Instagram post`}>View project<Icon name="ext" /></a>}
            </figcaption>
          </figure>
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
          <p className="lead" style={{ marginTop: 18, maxWidth: "48ch" }}>Films and photographs, all shot on phone. Press play on a film, or open any photo full size.</p>
          <nav className="pf-jump" aria-label="Jump to"><a className="btn btn--ink btn--sm" href="#films">Films</a><a className="btn btn--line btn--sm" href="#photos">Photographs</a></nav>
        </div>
        <div className="pf-stats">
          <div><b>{SITE.reels.length}</b><span>films</span></div>
          <div><b>{SITE.photos.length}</b><span>photographs</span></div>
          <div><b>{SITE.kinds.length}</b><span>kinds of shoot</span></div>
        </div>
      </header>
      <section id="films" aria-labelledby="films-title" style={{ scrollMarginTop: 100 }}>
        <h2 className="sr" id="films-title">Films</h2>
        <Cinema />
      </section>
      <section id="photos" className="section" aria-labelledby="photos-title" style={{ scrollMarginTop: 90 }}>
        <div className="sec-head rv"><div><h2 className="display h2" id="photos-title">Photographs</h2><p className="lead">Tap a photo to see it full size, with who it was shot for.</p></div></div>
        <Gallery />
      </section>
    </div>
  );
}
