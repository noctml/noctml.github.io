const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export default {
  async fetch(request, env) {
    const cors = getCors(request, env);

    if (!cors.allowed) {
      return json({ error: "origin_not_allowed" }, 403, cors.headers);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors.headers });
    }

    if (!env.DB) {
      return json({ error: "missing_d1_binding" }, 500, cors.headers);
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === "/" || url.pathname === "/stats") {
        if (request.method !== "GET") return methodNotAllowed(cors.headers);
        return json(await readStats(env), 200, cors.headers);
      }

      if (url.pathname === "/visit") {
        if (request.method !== "POST") return methodNotAllowed(cors.headers);
        return json(await recordVisit(request, env), 200, cors.headers);
      }

      return json({ error: "not_found" }, 404, cors.headers);
    } catch (error) {
      return json(
        {
          error: "counter_failed",
          message: env.DEBUG === "true" ? String(error?.message || error) : undefined
        },
        500,
        cors.headers
      );
    }
  }
};

async function recordVisit(request, env) {
  const todayDay = kstDay();
  const visitorHash = await hashVisitor(request, env, todayDay);

  const unique = await env.DB.prepare(
    "INSERT OR IGNORE INTO daily_uniques (day, visitor_hash) VALUES (?1, ?2)"
  )
    .bind(todayDay, visitorHash)
    .run();

  const counted = Number(unique.meta?.changes || 0) > 0;

  await ensureDay(env, todayDay);
  if (counted) {
    await env.DB.prepare(
      "UPDATE daily_counts SET visits = visits + 1, updated_at = CURRENT_TIMESTAMP WHERE day = ?1"
    )
      .bind(todayDay)
      .run();
  }

  // Keep the unique table compact. This is intentionally best-effort.
  await cleanupOldUniques(env);

  return {
    ...(await readStats(env)),
    counted
  };
}

async function readStats(env) {
  const todayDay = kstDay();
  const yesterdayDay = kstDay(-1);
  const [today, yesterday, totalRow] = await Promise.all([
    readCount(env, todayDay),
    readCount(env, yesterdayDay),
    env.DB.prepare("SELECT COALESCE(SUM(visits), 0) AS total FROM daily_counts").first()
  ]);

  return {
    timezone: "Asia/Seoul",
    todayDay,
    yesterdayDay,
    today,
    yesterday,
    total: Number(totalRow?.total || 0)
  };
}

async function ensureDay(env, day) {
  await env.DB.prepare("INSERT OR IGNORE INTO daily_counts (day, visits) VALUES (?1, 0)")
    .bind(day)
    .run();
}

async function readCount(env, day) {
  const row = await env.DB.prepare("SELECT visits FROM daily_counts WHERE day = ?1")
    .bind(day)
    .first();
  return Number(row?.visits || 0);
}

async function cleanupOldUniques(env) {
  const cutoff = kstDay(-45);
  await env.DB.prepare("DELETE FROM daily_uniques WHERE day < ?1").bind(cutoff).run();
}

async function hashVisitor(request, env, day) {
  const ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    "unknown-ip";
  const ua = request.headers.get("User-Agent") || "unknown-ua";
  const acceptLanguage = request.headers.get("Accept-Language") || "";
  const salt = env.VISITOR_SALT || "replace-this-salt";
  const text = `${day}|${ip}|${ua}|${acceptLanguage}|${salt}`;
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function kstDay(offsetDays = 0) {
  const shifted = new Date(Date.now() + KST_OFFSET_MS + offsetDays * DAY_MS);
  return shifted.toISOString().slice(0, 10);
}

function getCors(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const hasOriginList = allowedOrigins.length > 0;
  const allowed = !hasOriginList || !origin || allowedOrigins.includes(origin);
  const allowOrigin = hasOriginList ? origin || allowedOrigins[0] : "*";

  return {
    allowed,
    headers: {
      "Access-Control-Allow-Origin": allowed ? allowOrigin : "null",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin"
    }
  };
}

function methodNotAllowed(headers) {
  return json({ error: "method_not_allowed" }, 405, headers);
}

function json(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
