import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabaseServer";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401 }
      );
    }

    const { error } = await supabaseServer
      .from("savvy_transactions")
      .delete()
      .eq("user_id", userId);

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