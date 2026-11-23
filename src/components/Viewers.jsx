/* Full-screen viewers shared by every page:
   reels open like Stories (progress bars, sound, tap to pause, swipe, auto-advance),
   photos open over a blurred backdrop with thumbnails, swipe and tap to zoom. */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Icon, kindName, baseOf, srcset, reduceMotion } from "./ui.jsx";

const Ctx = createContext({ openReels: () => {}, openPhotos: () => {} });
export const useViewers = () => useContext(Ctx);

const lock = (on) => (document.documentElement.style.overflow = on ? "hidden" : "");
function useSwipe(fn) {
  const start = useRef(null);
  return {
    onTouchStart: (e) => (start.current = [e.touches[0].clientX, e.touches[0].clientY]),
    onTouchEnd: (e) => {
      if (!start.current) return;
      const dx = e.changedTouches[0].clientX - start.current[0], dy = e.changedTouches[0].clientY - start.current[1];
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 50) fn(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : (dy < 0 ? 1 : -1));
      start.current = null;
    },
  };
}

function StoryViewer({ state, setState }) {
  const dlg = useRef(null), vid = useRef(null), bars = useRef(null), flash = useRef(null);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const { list, index, open } = state;
  const r = list[index];
  const go = useCallback((d) => setState((s) => ({ ...s, index: (s.index + d + s.list.length) % s.list.length })), [setState]);

  useEffect(() => { const d = dlg.current; if (open && !d.open) { d.showModal(); lock(true); } else if (!open && d.open) d.close(); }, [open]);
  useEffect(() => { const v = vid.current; if (!open || !v) return; v.muted = muted; v.currentTime = 0; v.play().catch(() => {}); setPaused(false); }, [open, index]);
  useEffect(() => { if (vid.current) vid.current.muted = muted; }, [muted]);
  // caption beside a tall video when there is room, over the bottom otherwise
  const place = useCallback(() => requestAnimationFrame(() => { const v = vid.current; if (!v) return; const b = v.getBoundingClientRect(); setOver(!(innerWidth > 760 && b.width > 0 && b.left > 340)); }), []);
  useEffect(() => { if (!open) return; place(); window.addEventListener("resize", place); return () => window.removeEventListener("resize", place); }, [open, index, place]);

  const onTime = () => { const v = vid.current, b = bars.current?.children[index]; if (b && v.duration) b.firstChild.style.transform = `scaleX(${v.currentTime / v.duration})`; };
  const onEnded = () => (index < list.length - 1 ? go(1) : setState((s) => ({ ...s, open: false })));
  const toggle = () => {
    const v = vid.current; if (v.paused) { v.play(); setPaused(false); } else { v.pause(); setPaused(true); }
    const f = flash.current; f.classList.remove("on"); void f.offsetWidth; f.classList.add("on");
  };
  const onKey = (e) => {
    if (["ArrowLeft", "ArrowUp"].includes(e.key)) { e.preventDefault(); go(-1); }
    if (["ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); go(1); }
    if (e.key === " ") { e.preventDefault(); toggle(); }
  };
  const swipe = useSwipe(go);

  return (
    <dialog ref={dlg} className={`story${over ? " info-over" : ""}`} aria-label="Reel viewer" style={r ? { "--ratio": r.ratio || 0.5625 } : undefined}
      onClose={() => { vid.current?.pause(); lock(false); setState((s) => ({ ...s, open: false })); }}
      onKeyDown={onKey} onClick={(e) => { if (e.target === dlg.current || e.target.classList.contains("story__stage")) dlg.current.close(); }} {...swipe}>
      {r && <>
        <video className="story__bg" src={r.loop} muted autoPlay loop playsInline aria-hidden="true" />
        <div className="story__bars" ref={bars}>{list.map((_, j) => <span key={j}><i style={{ transform: `scaleX(${j < index ? 1 : 0})` }} /></span>)}</div>
        <div className="story__top">
          <span className="story__count">{index + 1} of {list.length}</span>
          <button className="story__btn" type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Turn sound on" : "Mute"}><Icon name={muted ? "mute" : "sound"} /></button>
          <button className="story__btn story__btn--close" type="button" onClick={() => dlg.current.close()} aria-label="Close"><Icon name="close" /><span>Close</span></button>
        </div>
        <div className="story__stage">
          <video ref={vid} className="story__vid" src={r.video} poster={r.poster} playsInline onClick={toggle} onTimeUpdate={onTime} onEnded={onEnded} onLoadedMetadata={place} />
          <span className="story__flash" ref={flash} aria-hidden="true"><Icon name={paused ? "pause" : "play"} /></span>
        </div>
        <div className="story__info">
          <span className="story__kind">{kindName(r.kind)}</span>
          <h2 className="h3">{r.title}</h2>
          <p>{r.note}</p>
          {r.post && <a className="story__ig" href={r.post} target="_blank" rel="noopener">View project on Instagram<Icon name="ext" /></a>}
        </div>
        <button className="story__nav story__nav--prev" type="button" aria-label="Previous reel" onClick={() => go(-1)}><Icon name="left" /></button>
        <button className="story__nav story__nav--next" type="button" aria-label="Next reel" onClick={() => go(1)}><Icon name="right" /></button>
      </>}
    </dialog>
  );
}

function Lightbox({ state, setState }) {
  const dlg = useRef(null), img = useRef(null), thumbs = useRef(null);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const { list, index, open } = state;
  const p = list[index];
  const go = useCallback((d) => setState((s) => ({ ...s, index: (s.index + d + s.list.length) % s.list.length })), [setState]);

  useEffect(() => { const d = dlg.current; if (open && !d.open) { d.showModal(); lock(true); } else if (!open && d.open) d.close(); }, [open]);
  useEffect(() => {
    setZoom(false);
    const t = thumbs.current?.children[index]; t && t.scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion() ? "auto" : "smooth" });
    if (img.current && !reduceMotion()) img.current.animate([{ opacity: 0, transform: "scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.22,1,.36,1)" });
  }, [index, open]);
  const at = (e, el) => { const b = el.getBoundingClientRect(); return `${((e.clientX - b.left) / b.width) * 100}% ${((e.clientY - b.top) / b.height) * 100}%`; };
  const swipe = useSwipe((d) => !zoom && go(d));

  return (
    <dialog ref={dlg} className={`lightbox${zoom ? " is-zoom" : ""}`} aria-label="Photo viewer"
      onClose={() => { lock(false); setState((s) => ({ ...s, open: false })); }}
      onKeyDown={(e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); }}
      onClick={(e) => { if (e.target === dlg.current || e.target.classList.contains("lightbox__stage")) dlg.current.close(); }}>
      {p && <>
        <img className="lightbox__bg" src={`${baseOf(p)}-s.jpg`} alt="" aria-hidden="true" />
        <div className="story__top">
          <span className="story__count" aria-live="polite">{index + 1} of {list.length}</span>
          <button className="story__btn story__btn--close" type="button" onClick={() => dlg.current.close()} aria-label="Close"><Icon name="close" /><span>Close</span></button>
        </div>
        <div className="lightbox__stage" {...swipe} onPointerMove={(e) => { if (zoom && e.pointerType === "mouse") setOrigin(at(e, e.currentTarget)); }}>
          <img ref={img} className="lightbox__img" src={p.src} srcSet={srcset(baseOf(p))} sizes="100vw" alt={p.title}
            style={{ transform: zoom ? "scale(2.2)" : "", transformOrigin: origin }}
            onClick={(e) => { setOrigin(at(e, e.currentTarget)); setZoom((z) => !z); }} />
        </div>
        <div className="lightbox__info">
          <b>{p.title}</b>
          <span>{[kindName(p.kind), p.credit].filter(Boolean).join(" / ")}</span>
          {p.post && <a className="story__ig" href={p.post} target="_blank" rel="noopener">View project on Instagram<Icon name="ext" /></a>}
          <span className="lightbox__hint"><Icon name="zoom" />Tap the photo to zoom</span>
        </div>
        <div className="lightbox__thumbs" ref={thumbs}>
          {list.map((t, j) => <button key={t.src} type="button" aria-current={j === index} aria-label={`Photo ${j + 1}: ${t.title}`} onClick={() => setState((s) => ({ ...s, index: j }))}><img src={`${baseOf(t)}-s.jpg`} alt="" loading="lazy" /></button>)}
        </div>
        <button className="story__nav story__nav--prev" type="button" aria-label="Previous photo" onClick={() => go(-1)}><Icon name="left" /></button>
        <button className="story__nav story__nav--next" type="button" aria-label="Next photo" onClick={() => go(1)}><Icon name="right" /></button>
      </>}
    </dialog>
  );
}

export function ViewerProvider({ children }) {
  const [reels, setReels] = useState({ list: [], index: 0, open: false });
  const [photos, setPhotos] = useState({ list: [], index: 0, open: false });
  const api = {
    openReels: useCallback((list, index = 0) => setReels({ list, index, open: true }), []),
    openPhotos: useCallback((list, index = 0) => setPhotos({ list, index, open: true }), []),
  };
  return (
    <Ctx.Provider value={api}>
      {children}
      <StoryViewer state={reels} setState={setReels} />
      <Lightbox state={photos} setState={setPhotos} />
    </Ctx.Provider>
  );
}
