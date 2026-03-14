// ═══════════════════════════════════════════════════════════════
//   ITZ'S RNG — js/app.js
//   Shared: aura data, nav active state, fetch helpers
// ═══════════════════════════════════════════════════════════════

/* ── AURA DATA (mirrors config.py) ──────────────────────────── */
const AURAS = [
  { name: "Normal",    rarity: "Common",    tier:  1, emoji: "⬜", color: "#AAAAAA", chance: "1/2",         description: "The default aura. Everyone starts here." },
  { name: "Wind",      rarity: "Uncommon",  tier:  2, emoji: "💨", color: "#90EE90", chance: "1/8",         description: "Gusts of wind constantly swirl around you." },
  { name: "Rock",      rarity: "Uncommon",  tier:  2, emoji: "🪨", color: "#8B7355", chance: "1/25",        description: "Solid as stone — immovable and imposing." },
  { name: "Rainy",     rarity: "Rare",      tier:  3, emoji: "🌧️", color: "#4682B4", chance: "1/50",        description: "Rain falls upon you in an eternal drizzle." },
  { name: "Fire",      rarity: "Rare",      tier:  3, emoji: "🔥", color: "#FF4500", chance: "1/75",        description: "Flames chase you wherever you go." },
  { name: "Ice",       rarity: "Epic",      tier:  4, emoji: "❄️", color: "#00BFFF", chance: "1/200",       description: "A glacial chill radiates from your very being." },
  { name: "Lightning", rarity: "Epic",      tier:  4, emoji: "⚡", color: "#F5C518", chance: "1/500",       description: "Electricity crackles and sparks all around you." },
  { name: "Sand",      rarity: "Epic",      tier:  4, emoji: "🏜️", color: "#F4A460", chance: "1/800",       description: "Grains of sand float endlessly around you." },
  { name: "Snow",      rarity: "Epic",      tier:  4, emoji: "🌨️", color: "#C9E8FF", chance: "1/1,000",     description: "Snowflakes drift down in an eternal winter." },
  { name: "Shadow",    rarity: "Legendary", tier:  5, emoji: "🌑", color: "#7B4FBF", chance: "1/1,500",     description: "The shadows bend entirely to your will." },
  { name: "Mythic",    rarity: "Legendary", tier:  5, emoji: "🔮", color: "#FF1493", chance: "1/2,500",     description: "A power that only exists in the darkest of legends." },
  { name: "Exotic",    rarity: "Legendary", tier:  5, emoji: "🌺", color: "#9400D3", chance: "1/3,000",     description: "One of a kind — impossible to find." },
  { name: "Divine",    rarity: "Divine",    tier:  6, emoji: "✨", color: "#FFD700", chance: "1/5,000",     description: "Blessed by the gods themselves." },
  { name: "Prismatic", rarity: "Divine",    tier:  6, emoji: "🌈", color: "#FF69B4", chance: "1/10,000",    description: "Every colour of the rainbow condensed into one." },
  { name: "Heavenly",  rarity: "Heavenly",  tier:  7, emoji: "🌟", color: "#87CEEB", chance: "1/25,000",    description: "A power that transcends the heavens themselves." },
  { name: "Glitched",  rarity: "Glitched",  tier:  8, emoji: "👾", color: "#00FF41", chance: "1/75,000",    description: "Reality fractures and glitches all around you." },
  { name: "Error",     rarity: "Error",     tier:  9, emoji: "❌", color: "#FF3333", chance: "1/100,000",   description: "ERROR 404: Aura not found. Congratulations?" },
  { name: "Oblivion",  rarity: "Oblivion",  tier: 10, emoji: "🌌", color: "#8080C8", chance: "1/500,000",   description: "The eternal void that consumes everything." },
  { name: "Celestial", rarity: "Celestial", tier: 11, emoji: "💫", color: "#FFF9C4", chance: "1/1,000,000", description: "The rarest aura in all of existence." },
];

const RARITIES = ["Common","Uncommon","Rare","Epic","Legendary","Divine","Heavenly","Glitched","Error","Oblivion","Celestial"];

/* ── HELPERS ─────────────────────────────────────────────────── */

function rarityClass(rarity) {
  return "badge-" + rarity.toLowerCase();
}

function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

async function apiFetch(path, timeout = 6000) {
  // If GUILD_ID is set, append it automatically to API calls that don't already have it
  let url = CONFIG.BOT_URL + path;
  if (CONFIG.GUILD_ID && path.startsWith("/api/") && !path.includes("guild_id")) {
    url += (path.includes("?") ? "&" : "?") + "guild_id=" + CONFIG.GUILD_ID;
  }
  const ctrl = new AbortController();
  const id   = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

/* ── NAV ACTIVE STATE ────────────────────────────────────────── */
(function setActiveNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
})();

/* ── MOBILE NAV TOGGLE ──────────────────────────────────────── */
(function mobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links  = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.style.display === "flex";
    links.style.display = open ? "" : "flex";
    links.style.flexDirection = "column";
    links.style.position = "absolute";
    links.style.top = "var(--nav-h)";
    links.style.left = "0";
    links.style.right = "0";
    links.style.background = "var(--surface)";
    links.style.borderBottom = "1px solid var(--border)";
    links.style.padding = "1rem 1.5rem";
    links.style.gap = "0.25rem";
    if (open) links.removeAttribute("style");
  });
})();

/* ── ANIMATED COUNTER ────────────────────────────────────────── */
function animateCount(el, target, duration = 1200) {
  const start = performance.now();
  const from  = 0;
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(Math.round(from + (target - from) * ease));
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}