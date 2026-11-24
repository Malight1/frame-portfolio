// Booking requests from /book are emailed through Resend.
// Environment variables, set in the Vercel project settings (never in this file):
//   RESEND_API_KEY  the Resend API key (required)
//   BOOKING_TO      where bookings go; defaults to Riah's Gmail
//   BOOKING_FROM    sender on a verified domain, e.g. "Riah Visuals <bookings@riahvisuals.com>"
//   SITE_URL        the live site, used for links and photos in the emails
// Until a domain is verified in Resend, mail goes from onboarding@resend.dev and Resend only delivers
// to the address that owns the Resend account. So the client's thank-you email is sent only once
// BOOKING_FROM is set; before that, only Riah's booking email goes out.
import { bookingEmail, confirmEmail } from "./_emails.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { client: 120, email: 160, phone: 40, need: 40, service: 80, date: 40, where: 160, message: 4000 };

async function send(key, payload) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) console.error("Resend error", r.status, await r.text().catch(() => ""));
  return r.ok;
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ error: "Booking email is not set up yet." });

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};
  if (b.company) return res.status(200).json({ ok: true }); // hidden field only bots fill in

  const v = {};
  for (const [k, max] of Object.entries(LIMITS)) v[k] = String(b[k] ?? "").trim().slice(0, max);
  if (!v.client || !EMAIL.test(v.email) || !v.service || v.message.length < 10) {
    return res.status(400).json({ error: "Please fill in your name, a valid email, the kind of shoot and a short message." });
  }

  const site = (process.env.SITE_URL || "https://frame-portfolio-orpin.vercel.app").replace(/\/$/, "");
  const verified = process.env.BOOKING_FROM;
  const from = verified || "Riah Visuals Bookings <onboarding@resend.dev>";
  // Lowercased: Resend matches the test recipient against the account email exactly, and Gmail ignores case.
  const riah = (process.env.BOOKING_TO || "seraiahamaike98@gmail.com").trim().toLowerCase();

  const toRiah = bookingEmail(v, site);
  const ok = await send(key, { from, to: [riah], reply_to: v.email, subject: toRiah.subject, html: toRiah.html, text: toRiah.text });
  if (!ok) return res.status(502).json({ error: "The request could not be sent right now." });

  if (verified) {
    const toClient = confirmEmail(v, site);
    await send(key, { from, to: [v.email], reply_to: riah, subject: toClient.subject, html: toClient.html, text: toClient.text });
  }
  return res.status(200).json({ ok: true, confirmation: !!verified });
}
