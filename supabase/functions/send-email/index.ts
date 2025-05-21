import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
      "Authorization": `Bearer ${Deno.env.get("re_atdwuf2p_7cjERHb3gi52ckGktyzt2U2V")}`,
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

  return new Response(
    JSON.stringify({ message: "Email sent successfully!" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
