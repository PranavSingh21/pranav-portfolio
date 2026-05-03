import type { APIRoute } from "astro";
import OpenAI from "openai";

export const prerender = false;

const client = new OpenAI({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const message = body?.message?.trim();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
      });
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `
You are Savvy, an AI finance parsing assistant.

Convert the user's message into structured JSON.

Return ONLY valid JSON.
Do not add markdown.
Do not explain anything.

Use this exact schema:
{
  "intent": "expense_add | income_add | savings_add | expense_query | breakdown_query | safe_to_spend | unknown",
  "amount": number,
  "merchant": string,
  "category": "Eating Out | Groceries | Transport | Rent | Bills | Household | Health | Shopping | Entertainment | Personal | Savings | Salary | General",
  "direction": "debit | credit | neutral",
  "reply": string
}

Rules:
- "spent 240 on swiggy" => expense_add
- "salary credited 70000" => income_add
- "saved 5000" => savings_add
- "how much did I spend on food" => expense_query

Category mapping:
- swiggy, zomato, restaurant, cafe, dineout => Eating Out
- grocery, groceries, milk, curd, bread, eggs, rice, dal, atta, fruits, vegetables, spices, masala, dosa batter, oil, supermarket => Groceries
- ola, uber, rapido, cab, auto, metro, fuel => Transport
- rent, landlord => Rent
- electricity, internet, wifi, recharge, water bill => Bills
- cook, maid, cleaning, laundry, utensils, bucket, mop => Household
- doctor, medicine, pharmacy, hospital, gym => Health
- amazon, myntra, shopping, clothes => Shopping
- movie, netflix, games, outing => Entertainment
- cigarette, cigg, smoke, vape, paan => Personal

Rules:
- infer merchant and category when possible
- if unknown, set intent = "unknown"
- amount must be number
- merchant must be empty string if none
- reply should be short, natural, and helpful

- "spending breakdown" => breakdown_query
- "safe to spend" => safe_to_spend
- "this month spend" => expense_query
- "groceries total" => expense_query with category = "Groceries"
- "transport total" => expense_query with category = "Transport"

- For expense_add replies, always mention the assigned category in the reply.
- Example: "Logged ₹200 for chicken masala under Groceries."
- Example: "Logged ₹500 for Colgate under Personal."

- If the merchant is clear but amount is missing, ask only for the amount.
- Example: "How much should I log for chicken masala powder?"
- If amount is clear but category is unclear, ask only for the category.
- Example: "Should I log ₹500 under Groceries, Household, or Personal?"
- If both are unclear, ask for only the missing details needed to log it.
- Avoid generic replies like "provide more details" when the missing field is obvious.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    return new Response(raw, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
  console.error("Parse API error:", error);
    return new Response(
      JSON.stringify({
        intent: "unknown",
        amount: 0,
        merchant: "",
        category: "General",
        direction: "neutral",
        reply: "I couldn't understand that. Try rephrasing it.",
      }),
      { status: 200 }
    );
  }
};