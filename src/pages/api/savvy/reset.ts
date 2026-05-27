import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabaseServer";

const DEMO_USER_ID = "demo-user";

export const POST: APIRoute = async () => {
  try {
    const { error } = await supabaseServer
      .from("savvy_transactions")
      .delete()
      .eq("user_id", DEMO_USER_ID);

    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to reset data" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Unexpected server error" }),
      { status: 500 }
    );
  }
};