# Jabooda Cares — Web Project Context

## Organization
- **Name:** Jabooda Cares
- **Type:** WMBE-certified 501(c)(3) nonprofit affordable housing developer
- **EIN:** 99-4589825
- **Location:** 2101 S Grand St, Retail #45, Seattle, WA 98144
- **Contact:** robert@jabooda.com · 206-395-9808
- **Key staff:** Nghia Pham (CEO), Kaitlyn Huynh (COO/Board President), Robert Luu (Executive Co-Director)

## Brand Identity
**Colors (CSS variables to use):**
- `--forest: #0F2318` — primary dark green
- `--forest-mid: #1C3A28` — mid green
- `--cedar: #8B4A1C` — copper/cedar
- `--cedar-warm: #B5672E` — warm copper accent
- `--cedar-faint: #FAF3EB` — warm background
- `--cream: #FDFAF5` — primary background
- `--gold: #C9922A` — gold accent
- `--sage: #7A9E86` — sage green

**Typography:**
- Display/headings: Playfair Display (serif, weights 700/900)
- Body: Inter or DM Sans (300/400/500)
- Monospace/stats/eyebrows: DM Mono (uppercase, tracked)

**Voice:** Direct, community-rooted, never jargon-heavy. Lead with people, not policy.

## Audiences (5 personas — design for all)
1. **Syndicator/Funder** — wants deal data, pipeline, pro forma access
2. **City Official/Program Officer** — wants certifications, compliance, downloadable brief
3. **Board Candidate** — wants governance health, skills matrix, time commitment
4. **Volunteer** — wants specific ask, skill match, shift calendar
5. **Donor** — wants resident story, impact numbers, EIN, easy giving

## Design Rules
- Full-bleed photography over illustrations
- Resident faces before statistics — people first
- Photo placeholders must include photographer brief comments
- EIN 99-4589825 visible in footer on every page
- Equal Housing Opportunity logo required on housing-facing pages
- Every section has a persona-aware CTA
- Sticky nav that darkens on scroll (transparent over hero)

## Tech Stack
- **Default:** Vanilla HTML/CSS/JS — single self-contained file
- **CSS:** Custom properties for all design tokens, no Tailwind unless asked
- **Fonts:** Google Fonts via preconnect link
- **Deploy target:** Cloudflare Pages via GitHub push
- **Schema:** NGO type, JSON-LD in head
- **SEO:** Semantic HTML, one H1, OG tags, canonical URL required

## Active Projects
- Melody Apartments — 179 units, $50M, North Beacon Hill (Complete)
- Symphony Apartments — $18M, Columbia City (Complete)
- Apollo Heights — 130 units, $36M, Tacoma Lincoln District (Complete)
- Judkins Park 58 — 58 units, $23M, 30% AMI, NHTF 2026 submitted (Pipeline)
- Henderson Street — 70-120 units, City of Seattle OH finalist (Pipeline)

## Key Differentiator to Always Mention
Jabooda Construction is our affiliated WMBE GC — we design, finance, AND build every project.
This eliminates the 8-12% contractor margin that breaks 30% AMI pro formas.
All affiliated transactions are board-approved, independently certified, and 990-disclosed.

<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design,
this creates what users call the "AI slop" aesthetic. Avoid this: make creative,
distinctive frontends that surprise and delight. Focus on:

- Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic
  fonts like Arial and Inter; opt instead for distinctive choices that elevate the
  frontend's aesthetics. Pair a distinctive display font with a refined body font.

- Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency.
  Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
  For Jabooda: forest green + cedar copper + warm cream is the system. Don't dilute it.

- Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions.
  One well-orchestrated page load with staggered reveals creates more delight than
  scattered micro-interactions. Scroll-triggered reveals on every major section.

- Spatial Composition: Unexpected layouts. Asymmetry. Full-bleed sections that break
  the grid. Generous negative space. Let photography breathe.

- Backgrounds: Atmosphere over flat color. Dark overlays on photography with gradient
  blends. The forest green should feel like Pacific Northwest woods, not a corporate color.

NEVER use: Inter as primary font, purple gradients, white cards on white backgrounds,
generic icon sets, symmetrical centered layouts with no tension, or cookie-cutter
nonprofit website patterns.

Jabooda Cares is not a generic charity. It is a sophisticated development platform
with a track record, a capital stack, and a community. Design like it.
</frontend_aesthetics>
