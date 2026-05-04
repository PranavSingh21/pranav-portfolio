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
  "type": "transaction | profile_update | clarification | query | unknown",
  "amount": number,
  "merchant": string,
  "category": "Eating Out | Groceries | Transport | Rent | Bills | Household | Health | Shopping | Entertainment | Personal | Savings | Salary | General",
  "field": "salary | savings | rent | currentBalance | null",
  "value": number,
  "options": string[],
  "reply": string
}

Rules:
- "spent 240 on swiggy" => type = "transaction"
- "salary credited 95000" => type = "profile_update", field = "salary", value = amount
- "saved 5000" => type = "profile_update", field = "savings", value = amount
- "how much did I spend on food" => type = "query"

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
- if unknown, set type = "unknown"
- amount must be number
- merchant must be empty string if none
- reply should be short, natural, and helpful

- "spending breakdown" => type = "query"
- "safe to spend" => type = "query"
- "this month spend" => type = "query"
- "groceries total" => type = "query", category = "Groceries"
- "transport total" => type = "query", category = "Transport"

- For transaction replies, always mention the assigned category in the reply.
- Example: "Logged ₹200 for chicken masala under Groceries."
- Example: "Logged ₹500 for Colgate under Personal."

- If the merchant is clear but amount is missing, ask only for the amount.
- Example: "How much should I log for chicken masala powder?"
- If amount is clear but category is unclear, ask only for the category.
- Example: "Should I log ₹500 under Groceries, Household, or Personal?"
- If both are unclear, ask for only the missing details needed to log it.
- Avoid generic replies like "provide more details" when the missing field is obvious.

- If clarification is needed, always return:
- type = "clarification"
- include known merchant if available
- include known amount if available
- include known category if available
- include options[] only when the user must choose between valid Savvy categories
- reply must ask only for the missing field

- If amount is known but category is ambiguous, return:
  type = "clarification"

- If confirmation is needed, return:
  type = "clarification"

- clarification responses may include:
  merchant, amount, category, options[], reply

  Savvy must only use categories from this exact allowed list:
Eating Out, Groceries, Transport, Rent, Bills, Household, Health, Shopping, Entertainment, Personal, Savings, Salary, General

Do not invent new categories.
Do not suggest categories outside this list.
Never suggest labels like Stocks, Mutual Funds, Bonds, EMI, Insurance, Investments, Crypto, Travel, or Food unless they map to one of the allowed categories above.

If the user refers to investments, mutual funds, stocks, SIPs, trading, or stock market:
- default category = Savings
- do not ask category clarification unless the user explicitly indicates it is an expense
- prefer direct confirmation:
  "Should I add ₹50000 to Savings?"

`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

const raw = completion.choices[0]?.message?.content ?? "{}";
const parsed = JSON.parse(raw);

return new Response(JSON.stringify(parsed), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});
  } catch (error: any) {
  console.error("Parse API error:", error);
    return new Response(
      JSON.stringify({
         type: "unknown",
  amount: 0,
  merchant: "",
  category: "General",
  field: null,
  value: 0,
  options: [],
  reply: "I couldn't understand that. Try rephrasing it."
      }),
      { status: 200 }
    );
  }
};