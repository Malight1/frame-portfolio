import { SITE } from "../content.js";
import { Pic, LazyLoop } from "./ui.jsx";

/* One or two pictures (or silent films) for a service. */
export function ServiceMedia({ s, className = "svcard__media", sizes = "(max-width: 900px) 50vw, 25vw" }) {
  const alt = `${s.name}, shot by ${SITE.name}`;
  const one = (img, video) => (video ? <LazyLoop src={video} poster={`${img}.jpg`} /> : <Pic base={img} alt={alt} sizes={sizes} />);
  return (
    <div className={className}>
      <span>{one(s.img, s.video)}</span>
      {s.img2 && <span>{one(s.img2, s.video2)}</span>}
    </div>
  );
}

