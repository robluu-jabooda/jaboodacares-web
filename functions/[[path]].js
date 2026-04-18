/**
 * Cloudflare Pages catch-all: Markdown for Agents
 *
 * Intercepts ALL requests. If Accept: text/markdown is present,
 * returns a markdown version of the page. Otherwise serves the
 * static asset normally via context.next().
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

export async function onRequest(context) {
  const accept = context.request.headers.get("Accept") || "";

  /* Not asking for markdown — serve static asset as normal */
  if (!accept.includes("text/markdown")) {
    return context.next();
  }

  const url = new URL(context.request.url);
  let path = url.pathname
    .replace(/\/index\.html$/, "/")
    .replace(/\/$/, "") || "/";

  let md = PAGES[path] || PAGES[path + "/"];

  if (!md) {
    /* Fallback: try to serve llms.txt */
    try {
      const origin = url.origin;
      const asset = await context.env.ASSETS.fetch(
        new Request(origin + "/llms.txt")
      );
      if (asset.ok) md = await asset.text();
    } catch (_) { /* ignore */ }
  }

  if (!md) {
    return context.next();
  }

  return new Response(md, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Markdown-Tokens": String(new Blob([md]).size),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
