# Savvy — System Flow

## Overview

Savvy is a conversational finance system built around a simple loop:

1. User sends natural language input
2. Savvy interprets intent
3. Structured financial state is updated
4. UI recalculates summaries
5. Savvy responds in plain language

The system is designed to make money tracking feel conversational while preserving structured state underneath.

---

## End-to-End Flow

### Step 1: User Input

The user enters a freeform message in chat.

Examples:
- “Swiggy 280”
- “Salary 70000”
- “Groceries total”
- “Can I spend 2k?”

This is the only input surface.

---

### Step 2: Frontend Message Dispatch

The frontend:
- captures the raw message
- appends it to chat
- sends it to `/api/parse`

This keeps the interaction immediate while routing interpretation to the backend.

---

### Step 3: Intent Parsing Layer (`/api/parse`)

The parse API sends the user message to the AI parser.

The parser extracts:
- intent
- merchant
- amount
- category
- reply

Example output:
```json
{
  "intent": "expense_add",
  "merchant": "swiggy",
  "amount": 280,
  "category": "Eating Out",
  "reply": "Logged ₹280 under Eating Out."
}
