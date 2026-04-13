/**
 * Jabooda Cares Lead Capture API
 * Cloudflare Pages Function
 *
 * Handles form submissions from:
 *   - /build-with-us/ (construction leads)
 *   - /invest/ (EB-5 investor leads)
 *
 * Stores leads in D1 database (binding: DB)
 * Sends email notification via MailChannels (free on CF Workers)
 *
 * Environment bindings required:
 *   DB - D1 database "jabooda-leads"
 *   NOTIFY_EMAIL - destination email (set in Pages settings)
 */

// CORS headers for same-origin and local dev
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { env } = context;

  try {
    const body = await context.request.json();
    const source = body._source;

    if (!source || !["build-with-us", "invest-eb5"].includes(source)) {
      return jsonResponse({ error: "Invalid source" }, 400);
    }

    let result;

    if (source === "build-with-us") {
      result = await handleConstructionLead(env, body);
    } else {
      result = await handleInvestorLead(env, body);
    }

    // Send email notification (best effort, don't block response)
    context.waitUntil(sendNotification(env, source, body));

    return jsonResponse({ success: true, id: result.id }, 200);

  } catch (err) {
    console.error("Lead capture error:", err);
    return jsonResponse({ error: "Something went wrong. Please try again." }, 500);
  }
}

async function handleConstructionLead(env, body) {
  const { name, company, email, phone, project_type, unit_count, project_stage, location, details } = body;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const stmt = env.DB.prepare(
    `INSERT INTO construction_leads (name, company, email, phone, project_type, unit_count, project_stage, location, details)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const res = await stmt.bind(
    name, company || null, email, phone || null,
    project_type || null, unit_count || null,
    project_stage || null, location || null, details || null
  ).run();

  return { id: res.meta.last_row_id };
}

async function handleInvestorLead(env, body) {
  const { name, email, phone, country, timeline, has_attorney, message } = body;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const stmt = env.DB.prepare(
    `INSERT INTO investor_leads (name, email, phone, country, timeline, has_attorney, message)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const res = await stmt.bind(
    name, email, phone || null, country || null,
    timeline || null, has_attorney || null, message || null
  ).run();

  return { id: res.meta.last_row_id };
}

async function sendNotification(env, source, body) {
  const to = env.NOTIFY_EMAIL || "robert@jabooda.com";
  const isConstruction = source === "build-with-us";

  const subject = isConstruction
    ? `New Construction Lead: ${body.name}${body.company ? " (" + body.company + ")" : ""}`
    : `New EB-5 Investor Inquiry: ${body.name}${body.country ? " (" + body.country + ")" : ""}`;

  let text = "";
  if (isConstruction) {
    text = [
      `Name: ${body.name}`,
      `Company: ${body.company || "N/A"}`,
      `Email: ${body.email}`,
      `Phone: ${body.phone || "N/A"}`,
      `Project Type: ${body.project_type || "N/A"}`,
      `Units: ${body.unit_count || "N/A"}`,
      `Stage: ${body.project_stage || "N/A"}`,
      `Location: ${body.location || "N/A"}`,
      `Details: ${body.details || "N/A"}`,
      "",
      "View all leads: https://dash.cloudflare.com (D1 > jabooda-leads > construction_leads)",
    ].join("\n");
  } else {
    text = [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `Phone/WhatsApp: ${body.phone || "N/A"}`,
      `Country: ${body.country || "N/A"}`,
      `Timeline: ${body.timeline || "N/A"}`,
      `Has Attorney: ${body.has_attorney || "N/A"}`,
      `Message: ${body.message || "N/A"}`,
      "",
      "View all leads: https://dash.cloudflare.com (D1 > jabooda-leads > investor_leads)",
    ].join("\n");
  }

  // MailChannels - free email sending from Cloudflare Workers
  // Requires DNS TXT record for SPF: v=spf1 include:relay.mailchannels.net -all
  try {
    await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: "leads@jaboodacares.org", name: "Jabooda Leads" },
        subject: subject,
        content: [{ type: "text/plain", value: text }],
      }),
    });
  } catch (emailErr) {
    // Email is best-effort; lead is already saved to D1
    console.error("Email notification failed:", emailErr);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}
