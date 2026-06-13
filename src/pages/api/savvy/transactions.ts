import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabaseServer";

export const prerender = false;


export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const type = body?.type;
    const merchant = body?.merchant || "";
    const amount = Number(body?.amount || 0);
    const category = body?.category || "General";
    const note = body?.note || "";
    const userId = body?.userId;

    if (!type || !["expense", "income", "savings"].includes(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid transaction type" }),
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Amount must be greater than 0" }),
        { status: 400 }
      );
    }
if (!userId) {
  return new Response(
    JSON.stringify({ error: "User not authenticated" }),
    { status: 401 }
  );
}
    const { data, error } = await supabaseServer
      .from("savvy_transactions")
      .insert({
        user_id: userId,
        type,
        merchant,
        amount,
        category,
        note,
        source: "chat",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);

      return new Response(
        JSON.stringify({ error: "Failed to save transaction" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ transaction: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Transaction API error:", error);

    return new Response(
      JSON.stringify({ error: "Unexpected server error" }),
      { status: 500 }
    );
  }
};