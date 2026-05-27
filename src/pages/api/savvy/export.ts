import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabaseServer";

const DEMO_USER_ID = "demo-user";

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabaseServer
      .from("savvy_transactions")
      .select("*")
      .eq("user_id", DEMO_USER_ID)
      .order("created_at", { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch transactions" }),
        { status: 500 }
      );
    }

const headers = [
  "Date",
  "Type",
  "Description",
  "Category",
  "Amount",
];

const rows =
  data?.map((tx) =>
    [
      tx.created_at?.split("T")[0] || "",
      tx.type,
      tx.merchant,
      tx.category,
      tx.amount,
    ].join(",")
  ) || [];

    const csv = [headers.join(","), ...rows].join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="savvy-transactions.csv"',
      },
    });
  } catch (err) {
    console.error("CSV export error:", err);

    return new Response(
      JSON.stringify({ error: "Unexpected server error" }),
      { status: 500 }
    );
  }
};