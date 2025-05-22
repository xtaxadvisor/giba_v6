import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseAdmin = createClient(
  Deno.env.get("PUBLIC_SUPABASE_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const { to, subject, body } = await req.json();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "info@protaxadvisors.tax",
      to,
      cc: ["info@protaxadvisors.tax"],
      subject,
      html: body,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ✅ Log email to Supabase
  const { error: logError } = await supabaseAdmin.from('email_log').insert([
    {
      to_email: to,
      subject,
      body
    }
  ]);

  if (logError) {
    console.error("❌ Failed to log email to email_log:", logError);
  }

  return new Response(
    JSON.stringify({ message: "Email sent successfully!" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});