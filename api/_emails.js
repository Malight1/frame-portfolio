// Email templates for booking requests. Files starting with "_" are not deployed as routes by Vercel.
// Built for email apps: tables, inline styles, images hosted on the live site, no layout tricks.
// Clash Display loads in Apple Mail and iOS Mail; other apps fall back to Helvetica or Arial.

const NAVY = "#142c66", INK = "#0e1525", MUTED = "#636b7c", LINE = "#e3e7ef", SOFT = "#f3f5f9", PAPER = "#ffffff";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const DISPLAY = "'Clash Display', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const first = (name) => esc(String(name).trim().split(/\s+/)[0] || "there");

function shell({ title, preheader, body, site }) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only">
<title>${esc(title)}</title>
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@600&display=swap" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:${SOFT};-webkit-text-size-adjust:100%}
  img{border:0;display:block;outline:none;text-decoration:none}
  a{color:${NAVY}}
  @media (max-width:620px){
    .wrap{width:100%!important}
    .pad{padding-left:22px!important;padding-right:22px!important}
    .h1{font-size:34px!important;line-height:36px!important}
    .strip td{padding:0 3px!important}
    .stack{display:block!important;width:100%!important}
    .btn a{padding:13px 18px!important;font-size:14px!important}
  }
</style></head>
<body style="margin:0;padding:0;background:${SOFT}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT}"><tr><td align="center" style="padding:28px 12px 40px">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px">
  <tr><td class="pad" style="padding:0 8px 18px;font-family:${DISPLAY};font-size:20px;font-weight:600;letter-spacing:-0.4px;color:${INK}">
    <a href="${site}" style="color:${INK};text-decoration:none">Riah Visuals<span style="color:${NAVY}">.</span></a>
  </td></tr>
  ${body}
  <tr><td class="pad" style="padding:22px 8px 0;font-family:${SANS};font-size:12px;line-height:18px;color:${MUTED}">
    Riah Visuals &middot; Photographer and videographer<br>
    <a href="${site}" style="color:${MUTED}">Website</a> &nbsp;&middot;&nbsp; <a href="https://www.instagram.com/riah_visuals/" style="color:${MUTED}">Instagram</a>
  </td></tr>
</table></td></tr></table></body></html>`;
}

function detailRows(rows) {
  return rows.map(([k, v], i) => `<tr>
    <td style="padding:14px 0;${i ? `border-top:1px solid ${LINE};` : ""}font-family:${SANS};font-size:13px;color:${MUTED};width:38%;vertical-align:top">${esc(k)}</td>
    <td style="padding:14px 0;${i ? `border-top:1px solid ${LINE};` : ""}font-family:${SANS};font-size:15px;color:${INK};font-weight:600;vertical-align:top">${esc(v)}</td></tr>`).join("");
}

function button(href, label, solid = true) {
  return `<td class="btn" style="padding:0 8px 8px 0"><a href="${href}" style="display:inline-block;white-space:nowrap;padding:15px 24px;border-radius:999px;font-family:${SANS};font-size:15px;font-weight:700;text-decoration:none;${solid ? `background:${NAVY};color:#ffffff;` : `background:#ffffff;color:${NAVY};border:2px solid ${NAVY};padding:13px 22px;`}">${label}</a></td>`;
}

/* The email Riah gets for every booking. Reply goes straight to the client. */
export function bookingEmail(v, site) {
  const digits = String(v.phone || "").replace(/[^\d]/g, "");
  const wa = digits.length >= 8 ? `https://wa.me/${digits.startsWith("0") ? "234" + digits.slice(1) : digits}` : "";
  const rows = [["Client", v.client], ["Email", v.email], ["Phone or WhatsApp", v.phone || "Not given"], ["Needs", v.need || "Not given"], ["Date", v.date || "Not set yet"], ["Where", v.where || "Not set yet"]];
  const body = `
  <tr><td style="background:${NAVY};border-radius:22px 22px 0 0;padding:34px 36px 30px" class="pad">
    <p style="margin:0 0 10px;font-family:${SANS};font-size:13px;font-weight:700;color:#a9b8de">New booking request</p>
    <h1 class="h1" style="margin:0;font-family:${DISPLAY};font-weight:600;font-size:42px;line-height:44px;letter-spacing:-1px;color:#ffffff">${esc(v.service)}</h1>
    <p style="margin:14px 0 0;font-family:${SANS};font-size:16px;line-height:24px;color:#dfe6f6">From <b style="color:#ffffff">${esc(v.client)}</b>${v.date ? ` for ${esc(v.date)}` : ""}</p>
  </td></tr>
  <tr><td style="background:${PAPER};padding:10px 36px 6px" class="pad">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows(rows)}</table>
  </td></tr>
  <tr><td style="background:${PAPER};padding:10px 36px 8px" class="pad">
    <p style="margin:0 0 10px;font-family:${SANS};font-size:13px;color:${MUTED}">Their message</p>
    <div style="border-left:3px solid ${NAVY};background:${SOFT};border-radius:0 14px 14px 0;padding:18px 20px;font-family:${SANS};font-size:16px;line-height:25px;color:${INK};white-space:pre-wrap">${esc(v.message)}</div>
  </td></tr>
  <tr><td style="background:${PAPER};border-radius:0 0 22px 22px;padding:22px 36px 32px" class="pad">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      ${button(`mailto:${esc(v.email)}?subject=${encodeURIComponent(`Your ${v.service} with Riah Visuals`)}`, `Reply to ${first(v.client)}`)}
      ${wa ? button(wa, "WhatsApp", false) : ""}
    </tr></table>
    <p style="margin:14px 0 0;font-family:${SANS};font-size:13px;line-height:20px;color:${MUTED}">Hitting reply on this email also goes straight to ${first(v.client)}.</p>
  </td></tr>`;
  const text = `New booking request: ${v.service}\n\n${rows.map(([k, val]) => `${k}: ${val}`).join("\n")}\n\nMessage:\n${v.message}\n\nReply to this email to answer ${v.client}.`;
  return { subject: `New booking: ${v.service} from ${v.client}`, html: shell({ title: "New booking request", preheader: `${v.client} wants to book a ${v.service}.`, body, site }), text };
}

/* The thank-you email the client gets straight after booking. */
export function confirmEmail(v, site) {
  const rows = [["Shoot", v.service], ["Type", v.need || "Not given"], ["Date", v.date || "To be agreed"], ["Where", v.where || "To be agreed"]];
  const steps = [["I read your request", "I look at the idea, the date and the place."], ["We plan it", "I reply with a plan and a price, and we agree the look, outfits and locations."], ["Shoot day", "Quick and relaxed. I help with poses and direction."], ["You get it", "Edited photos and videos, ready to post."]];
  const body = `
  <tr><td style="background:${NAVY};border-radius:22px 22px 0 0;padding:38px 36px 34px" class="pad">
    <p style="margin:0 0 12px;font-family:${SANS};font-size:13px;font-weight:700;color:#a9b8de">Booking request received</p>
    <h1 class="h1" style="margin:0;font-family:${DISPLAY};font-weight:600;font-size:44px;line-height:46px;letter-spacing:-1px;color:#ffffff">Thanks, ${first(v.client)}.<br>It's with me now.</h1>
  </td></tr>
  <tr><td style="background:${PAPER};padding:30px 36px 4px" class="pad">
    <p style="margin:0;font-family:${SANS};font-size:17px;line-height:27px;color:#434b5c">I've got your request for a <b style="color:${INK}">${esc(v.service.toLowerCase())}</b>. I'll look through the details and reply to this email with a plan and a price.</p>
  </td></tr>
  <tr><td style="background:${PAPER};padding:24px 36px 6px" class="pad">
    <div style="border:1px solid ${LINE};border-radius:16px;padding:6px 20px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows(rows)}</table>
    </div>
  </td></tr>
  <tr><td style="background:${PAPER};padding:30px 36px 6px" class="pad">
    <p style="margin:0 0 16px;font-family:${DISPLAY};font-weight:600;font-size:22px;letter-spacing:-0.4px;color:${INK}">What happens next</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps.map(([t, d], i) => `<tr>
      <td width="40" style="vertical-align:top;padding:0 0 16px"><div style="width:30px;height:30px;border-radius:15px;background:${i ? SOFT : NAVY};color:${i ? NAVY : "#ffffff"};font-family:${SANS};font-size:14px;font-weight:700;line-height:30px;text-align:center">${i + 1}</div></td>
      <td style="vertical-align:top;padding:4px 0 16px;font-family:${SANS}"><b style="font-size:15px;color:${INK}">${t}</b><br><span style="font-size:14px;line-height:21px;color:${MUTED}">${d}</span></td></tr>`).join("")}</table>
  </td></tr>
  <tr><td style="background:${PAPER};border-radius:0 0 22px 22px;padding:24px 36px 34px" class="pad">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      ${button(`${site}/portfolio`, "See the portfolio")}
      ${button("https://www.instagram.com/riah_visuals/", "@riah_visuals", false)}
    </tr></table>
    <p style="margin:22px 0 0;font-family:${SANS};font-size:15px;line-height:23px;color:#434b5c">Need to add something? Just reply to this email.</p>
    <p style="margin:18px 0 0;font-family:${DISPLAY};font-weight:600;font-size:20px;letter-spacing:-0.3px;color:${INK}">Seraiah</p>
    <p style="margin:2px 0 0;font-family:${SANS};font-size:13px;color:${MUTED}">Riah Visuals</p>
  </td></tr>`;
  const text = `Thanks, ${String(v.client).split(" ")[0]}. Your request is with me now.\n\nI've got your request for a ${v.service}. I'll look through the details and reply to this email with a plan and a price.\n\n${rows.map(([k, val]) => `${k}: ${val}`).join("\n")}\n\nSee the portfolio: ${site}/portfolio\nInstagram: https://www.instagram.com/riah_visuals/\n\nSeraiah, Riah Visuals`;
  return { subject: `Thanks, ${String(v.client).split(" ")[0]}. Your booking request is with Riah Visuals`, html: shell({ title: "Booking request received", preheader: "Your request is in. I'll reply with a plan and a price.", body, site }), text };
}
