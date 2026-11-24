/* The frame around every page: header and menu, first-visit loading sequence, closing call, footer,
   scroll-to-top / scroll-to-#hash on navigation, scroll reveals, and Vercel analytics. */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { SITE } from "../content.js";
import { Icon, reduceMotion } from "./ui.jsx";
import { ViewerProvider } from "./Viewers.jsx";

const NAV = [["/", "Home"], ["/portfolio", "Portfolio"], ["/services", "Services"], ["/about", "About"]];
const ReadyCtx = createContext(true);
export const useReady = () => useContext(ReadyCtx);

/* First visit in a session: the name rises, a liquid drop grows with the count, then floods and lifts away. */
function Loader({ onDone }) {
  const root = useRef(null), blob = useRef(null), count = useRef(null);
  useEffect(() => {
    const el = root.current, letters = [...el.querySelectorAll(".loader__name span")];
    document.documentElement.style.overflow = "hidden";
    letters.forEach((l, i) => l.animate([{ transform: "translateY(110%)" }, { transform: "none" }], { duration: 900, delay: 100 + i * 40, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }));
    el.querySelector(".loader__role").animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 600, easing: "ease-out", fill: "both" });
    const t0 = performance.now(), dur = 1700; let raf = 0, t1 = 0, t2 = 0, alive = true;
    const finish = () => {
      blob.current.animate([{ transform: "translate(-50%, -50%) scale(1)" }, { transform: "translate(-50%, -50%) scale(14)" }], { duration: 750, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" });
      [...letters, el.querySelector(".loader__role"), el.querySelector(".loader__count")].forEach((n) => n.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, delay: 350, fill: "forwards" }));
      t1 = setTimeout(() => {
        const lift = el.animate([{ transform: "none" }, { transform: "translateY(-100%)" }], { duration: 800, easing: "cubic-bezier(.76,0,.24,1)", fill: "forwards" });
        t2 = setTimeout(() => alive && onDone(), 250);
        lift.onfinish = () => { document.documentElement.style.overflow = ""; if (alive) el.style.display = "none"; };
      }, 820);
      try { sessionStorage.setItem("rv-seen", "1"); } catch (e) {}
    };
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
      count.current.textContent = Math.round(e * 100);
      blob.current.style.transform = `translate(-50%, -50%) scale(${0.15 + e * 0.85})`;
      if (t < 1) raf = requestAnimationFrame(tick); else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); document.documentElement.style.overflow = ""; };
  }, [onDone]);
  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__blob" ref={blob} />
      <p className="loader__name">{SITE.brand.split("").map((c, i) => <span key={i}>{c === " " ? " " : c}</span>)}</p>
      <p className="loader__role">{SITE.role}</p>
      <p className="loader__count"><span ref={count}>0</span>%</p>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef(null), openBtn = useRef(null), closeBtn = useRef(null);
  const loc = useLocation();
  useEffect(() => { const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting)); io.observe(sentinel.current); return () => io.disconnect(); }, []);
  useEffect(() => setOpen(false), [loc.pathname]);
  const opened = useRef(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; if (open) opened.current = true; if (opened.current) (open ? closeBtn : openBtn).current?.focus({ preventScroll: true }); }, [open]);
  const onBook = loc.pathname === "/book";
  return (
    <>
      <div ref={sentinel} aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, height: 8, width: 1, pointerEvents: "none" }} />
      <header className={`head${scrolled ? " is-scrolled" : ""}`}>
        <div className="head__in">
          <Link className="head__mark" to="/">{SITE.brand}</Link>
          <nav className="head__nav" aria-label="Main">{NAV.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}</nav>
          <Link className="btn btn--accent btn--sm" to="/book" aria-current={onBook ? "page" : undefined}>Book a shoot</Link>
          <button ref={openBtn} className="head__menu" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}><Icon name="menu" />Menu</button>
        </div>
      </header>
      <div className={`menu${open ? " is-open" : ""}`} id="menu" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
        <div className="menu__top"><span className="head__mark">{SITE.brand}</span><button ref={closeBtn} type="button" onClick={() => setOpen(false)}><Icon name="close" />Close</button></div>
        <nav aria-label="Menu">{NAV.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}</nav>
        <Link className="btn btn--ink" to="/book">Book a shoot</Link>
      </div>
    </>
  );
}

function Closing() {
  return (
    <div className="wrap"><section className="cta rv" aria-labelledby="cta-title">
      <div><h2 className="display" id="cta-title">Let's shoot<br />something.</h2><p>Tell me the date, the place and the idea. I'll reply with a plan and a price.</p></div>
      <div className="cta__btns">
        <Link className="btn btn--ink" to="/book">Book a shoot</Link>
        <a className="btn btn--line" href={SITE.instagram} target="_blank" rel="noopener"><Icon name="ig" />Message on Instagram</a>
      </div>
    </section></div>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <span>© {new Date().getFullYear()} {SITE.brand}. {SITE.role}.</span>
      <nav aria-label="Footer">{NAV.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}<Link to="/book">Book a shoot</Link><a href={SITE.instagram} target="_blank" rel="noopener">Instagram</a></nav>
    </footer>
  );
}

/* Top of the page on a new route, or the #section when the link names one. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) { const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" }), 60); return () => clearTimeout(t); }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/* Elements marked .rv fade up as they come into view, including ones rendered later. */
function useReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    const scan = () => document.querySelectorAll(".rv:not(.in):not([data-rv])").forEach((el, i) => { el.dataset.rv = "1"; el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`; io.observe(el); });
    scan();
    const mo = new MutationObserver(scan); mo.observe(document.getElementById("main"), { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);
}

export default function Layout() {
  const firstVisit = (() => { try { return !sessionStorage.getItem("rv-seen") && !reduceMotion(); } catch (e) { return false; } })();
  const [ready, setReady] = useState(!firstVisit);
  const [showLoader] = useState(firstVisit);
  const { pathname } = useLocation();
  const done = useCallback(() => setReady(true), []);
  useReveal();
  return (
    <ReadyCtx.Provider value={ready}>
      <ViewerProvider>
        <a className="skip" href="#main">Skip to content</a>
        {showLoader && <Loader onDone={done} />}
        <Header />
        <ScrollManager />
        <main id="main">
          <Outlet />
          {pathname !== "/book" && <Closing />}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </ViewerProvider>
    </ReadyCtx.Provider>
  );
}
