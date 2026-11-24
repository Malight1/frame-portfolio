/* Questions that open smoothly, one at a time. */
import { useId, useState } from "react";
import { SITE } from "../content.js";
import { Icon } from "./ui.jsx";

export default function Faq({ items = SITE.faq }) {
  const [open, setOpen] = useState(0);
  const id = useId();
  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <div key={q} className={`faq__item rv${open === i ? " is-open" : ""}`}>
          <h3>
            <button type="button" id={`${id}-q${i}`} aria-expanded={open === i} aria-controls={`${id}-a${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{q}</span><i aria-hidden="true"><Icon name="plus" /></i>
            </button>
          </h3>
          <div className="faq__a" id={`${id}-a${i}`} role="region" aria-labelledby={`${id}-q${i}`}>
            <div><p>{a}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}
