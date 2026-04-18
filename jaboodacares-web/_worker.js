/**
 * Cloudflare Pages Advanced Mode Worker: Markdown for Agents
 *
 * Runs before every request. If the caller wants markdown
 * (Accept: text/markdown  OR  ?format=markdown), return a
 * clean markdown version. Otherwise serve the static asset.
 */

const SITE = "https://www.jaboodacares.org";

const PAGES = {
  "/": `# Jabooda Cares

AANHPI-led 501(c)(3) nonprofit that develops and builds permanently affordable housing for veterans, foster youth, and families in Seattle and Tacoma, Washington.

- **EIN:** 99-4589825
- **Phone:** 206-395-9808
- **Email:** robert@jabooda.com
- **Address:** 2101 S Grand St, Retail #45, Seattle, WA 98144

## Programs
- [About & Board](${SITE}/about)
- [Corporate Partners & CRA](${SITE}/partners/)
- [RVAHI Homeownership](${SITE}/rvahi/)
- [Donate](${SITE}/give)
- [Transparency & Financials](${SITE}/transparency)

## Services
- [Build With Us (GC Services)](${SITE}/build-with-us/)
- [EB-5 Investment](${SITE}/invest/)

## More Info
- [llms.txt](${SITE}/llms.txt)
- [Privacy Policy](${SITE}/privacy)
- [Donor Privacy](${SITE}/donor-privacy)
`,

  "/about": `# About Jabooda Cares

Jabooda Cares is an AANHPI-led 501(c)(3) nonprofit affordable housing developer based in Rainier Valley, Seattle. Founded by Robert Luu, we are one of the few nonprofit housing developers in Washington State that also builds our own projects through an affiliated WMBE general contractor, Jabooda Construction.

## Board of Directors
Robert Luu (President), Kaitlyn Huynh (Secretary/Treasurer), and independent board members provide oversight of all operations and affiliated transactions.

## Portfolio
Over 437 homes and $127M in development value, including Melody Apartments (179 units), Symphony Apartments, and Apollo Heights (130 units).
`,

  "/build-with-us": `# Build With Us | Jabooda Construction

Jabooda Construction is the affiliated WMBE general contractor of Jabooda Cares. We build multifamily housing, mixed-use development, and affordable housing projects across the greater Seattle area.

## Services
- Ground-up multifamily construction (5-200+ units)
- Affordable housing and LIHTC projects
- Mixed-use and transit-oriented development
- Prevailing wage compliance

## Why Developers Choose Us
- Vertically integrated with 501(c)(3) nonprofit
- WMBE-certified contractor
- 15-20% cost savings vs external GC
- Deep affordable housing experience

## Contact
Submit an inquiry at ${SITE}/build-with-us/ or email robert@jabooda.com
`,

  "/invest": `# EB-5 Investment | Jabooda Construction

Jabooda Construction is a USCIS-approved EB-5 regional center. Foreign investors seeking U.S. permanent residence through the EB-5 Immigrant Investor Program can invest in real construction projects in Seattle.

## EB-5 Program Overview
- Minimum investment: $800,000 (Targeted Employment Area)
- Must create 10 full-time U.S. jobs
- Path to permanent green card for investor and immediate family
- Projects in Seattle TEA zones

## Contact
Submit an inquiry at ${SITE}/invest/ or email robert@jabooda.com

*This page is for informational purposes only and does not constitute an offer to sell securities.*
`,
};

/* ---- Leads API (formerly functions/api/leads.js) ---- */

const GOOGLE_SHEET_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbwGJi7Vh6uEpCpEDzwlZl2bfNI10avYM3mvXPdgb7l7cdiYTJH2CosR7BbvF4kug0EZ/exec";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

async function handleConstructionLead(env, body) {
  const { name, company, email, phone, project_type, unit_count, project_stage, location, details } = body;
  if (!name || !email) throw new Error("Name and email are required");
  const stmt = env.DB.prepare(
    `INSERT INTO construction_leads (name, company, email, phone, project_type, unit_count, project_stage, location, details)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const res = await stmt
    .bind(name, company || null, email, phone || null, project_type || null, unit_count || null, project_stage || null, location || null, details || null)
    .run();
  return { id: res.meta.last_row_id };
}

async function handleInvestorLead(env, body) {
  const { name, email, phone, country, timeline, has_attorney, message } = body;
  if (!name || !email) throw new Error("Name and email are required");
  const stmt = env.DB.prepare(
    `INSERT INTO investor_leads (name, email, phone, country, timeline, has_attorney, message)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const res = await stmt
    .bind(name, email, phone || null, country || null, timeline || null, has_attorney || null, message || null)
    .run();
  return { id: res.meta.last_row_id };
}

async function forwardToGoogleSheet(body) {
  try {
    await fetch(GOOGLE_SHEET_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (_) { /* best-effort */ }
}

async function handleLeadsApi(request, env, ctx) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }
  try {
    const body = await request.json();
    const source = body._source;
    if (!source || !["build-with-us", "invest-eb5"].includes(source)) {
      return jsonResponse({ error: "Invalid source" }, 400);
    }
    const result =
      source === "build-with-us"
        ? await handleConstructionLead(env, body)
        : await handleInvestorLead(env, body);
    ctx.waitUntil(forwardToGoogleSheet(body));
    return jsonResponse({ success: true, id: result.id }, 200);
  } catch (err) {
    console.error("Lead capture error:", err);
    return jsonResponse({ error: "Something went wrong. Please try again." }, 500);
  }
}

/* ---- Main fetch handler ---- */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    /* Route /api/leads to the leads handler */
    if (url.pathname === "/api/leads") {
      return handleLeadsApi(request, env, ctx);
    }

    const accept = request.headers.get("Accept") || "";
    const wantsMd =
      accept.includes("text/markdown") ||
      (url.searchParams.has("format") &&
        url.searchParams.get("format") === "markdown");

    /* Normal browser request — serve static asset */
    if (!wantsMd) {
      return env.ASSETS.fetch(request);
    }

    /* Agent request — serve markdown */
    let path =
      url.pathname
        .replace(/\/index\.html$/, "/")
        .replace(/\/$/, "") || "/";

    let md = PAGES[path] || PAGES[path + "/"];

    if (!md) {
      /* Fallback: serve llms.txt for unmapped pages */
      try {
        const llms = await env.ASSETS.fetch(
          new Request(url.origin + "/llms.txt")
        );
        if (llms.ok) md = await llms.text();
      } catch (_) {
        /* ignore */
      }
    }

    if (!md) {
      return env.ASSETS.fetch(request);
    }

    return new Response(md, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Markdown-Tokens": String(new Blob([md]).size),
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
