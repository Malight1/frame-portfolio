/* Small shared pieces: icons, responsive photos, reel cards, helpers. */
import { useEffect, useRef, useState } from "react";
import {
  Play, Pause, ArrowRight, ArrowUpRight, CaretLeft, CaretRight, X, List,
  SpeakerHigh, SpeakerSlash, MagnifyingGlassPlus, InstagramLogo,
} from "@phosphor-icons/react";
import { SITE } from "../content.js";

const ICONS = {
  play: [Play, "fill"], pause: [Pause, "fill"], arrow: [ArrowRight, "bold"], ext: [ArrowUpRight, "bold"],
  left: [CaretLeft, "bold"], right: [CaretRight, "bold"], close: [X, "bold"], menu: [List, "bold"],
  sound: [SpeakerHigh, "bold"], mute: [SpeakerSlash, "bold"], zoom: [MagnifyingGlassPlus, "bold"], ig: [InstagramLogo, "bold"],
};
export function Icon({ name, className = "" }) {
  const [C, weight] = ICONS[name];
  return <C className={`ico ${className}`.trim()} weight={weight} aria-hidden="true" />;
}

export const kindName = (id) => (SITE.kinds.find((k) => k.id === id) || {}).name || "";
export const baseOf = (p) => p.src.replace(/\.jpg$/, "");
export const srcset = (base) => `${base}-s.jpg 640w, ${base}-m.jpg 1100w, ${base}.jpg 1650w`;
export const reduceMotion = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
export const canHover = () => typeof window !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;

/* A photo with small, medium and large sources, so every screen loads a sharp one. */
export function Pic({ base, alt, sizes = "(max-width: 760px) 100vw, 50vw", className, width, height }) {
  return <img src={`${base}-m.jpg`} srcSet={srcset(base)} sizes={sizes} alt={alt} loading="lazy" decoding="async" className={className} width={width} height={height} />;
}

/* Plays a muted clip only while it is on screen. */
export function LazyLoop({ src, poster, className, onPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current; if (!v || reduceMotion()) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!v.src) v.src = src; v.play().then(() => onPlaying && onPlaying()).catch(() => {}); } else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  return <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none" aria-hidden="true" />;
}

/* A vertical reel card: the clip plays silently on screen; tap opens the full viewer. */
export function ReelCard({ reel, onOpen }) {
  const [playing, setPlaying] = useState(false);
  return (
    <button className={`reel${playing ? " is-playing" : ""}`} type="button" onClick={onOpen} aria-label={`Watch ${reel.title}, ${kindName(reel.kind)}, ${reel.length}`}>
      <span className="reel__media">
        <img src={reel.poster} alt="" loading="lazy" />
        <LazyLoop src={reel.loop} onPlaying={() => setPlaying(true)} />
        <span className="reel__play"><Icon name="play" /></span>
      </span>
      <span className="reel__body"><b>{reel.title}</b><span>{kindName(reel.kind)} / {reel.length}</span></span>
    </button>
  );
}

/* Prev/next buttons for a horizontal track; hidden when everything fits. */
export function useTrackArrows() {
  const track = useRef(null);
  const [state, setState] = useState({ show: false, start: true, end: false });
  useEffect(() => {
    const t = track.current; if (!t) return;
    const upd = () => setState({ show: t.scrollWidth > t.clientWidth + 4, start: t.scrollLeft < 4, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 4 });
    upd(); t.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd);
    return () => { t.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); };
  }, []);
  const go = (d) => track.current.scrollBy({ left: d * track.current.clientWidth * 0.8, behavior: reduceMotion() ? "auto" : "smooth" });
  return { track, state, prev: () => go(-1), next: () => go(1) };
}

export function usePageTitle(title) {
  useEffect(() => { document.title = title; }, [title]);
}
