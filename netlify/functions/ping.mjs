// ═══════════════════════════════════════════════════════════════
//   ITZ'S RNG — netlify/functions/ping.mjs
//   Scheduled function: pings the bot every 5 minutes
//   so it never goes to sleep on Replit / Render / Railway.
//
//   Set the BOT_URL environment variable in Netlify:
//   Site settings → Environment variables → Add: BOT_URL
// ═══════════════════════════════════════════════════════════════

import { schedule } from "@netlify/functions";

// Runs every 5 minutes (cron: minute/5)
export const handler = schedule("*/5 * * * *", async () => {
  const url = process.env.BOT_URL;

  if (!url) {
    console.error("[ping] ❌ BOT_URL environment variable is not set.");
    return { statusCode: 400, body: "BOT_URL not configured" };
  }

  const target = url.replace(/\/$/, "") + "/ping";

  try {
    const res = await fetch(target, {
      signal: AbortSignal.timeout(10_000),
      headers: { "User-Agent": "Netlify-KeepAlive/1.0" },
    });

    console.log(`[ping] ✅ ${target} → HTTP ${res.status}`);
    return { statusCode: 200, body: `Pinged ${target} — ${res.status}` };
  } catch (err) {
    console.error(`[ping] ❌ Failed to reach ${target}: ${err.message}`);
    return { statusCode: 500, body: err.message };
  }
});
