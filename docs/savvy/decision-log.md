
---

# `docs/savvy/decision-log.md`

```md
# Savvy — Decision Log

## Why Chat-First Instead of Form-First

Traditional finance apps optimize for structure.  
Savvy optimizes for speed.

A form-first flow increases accuracy but adds friction:
- select category
- choose merchant
- enter amount
- confirm

Savvy uses chat-first input because logging speed matters more than perfect structure in early behavior adoption.

Decision:
Favor low-friction logging over rigid accuracy.

---

## Why AI Parsing Instead of Rules-Only

Rule-based parsing is fast but brittle.

It works for:
- “Swiggy 280”
- “Ola 200”

It breaks for:
- “Spent 300 on chicken masala powder”
- “Can I spend 2k this weekend?”
- “How much did I spend on eating out?”

AI parsing allows broader natural language coverage and more human-like interaction.

Decision:
Use AI for interpretation, rules for fallback safety.

---

## Why Local Memory Instead of Database

Savvy’s MVP goal is behavior validation, not persistence infrastructure.

A database would add:
- auth complexity
- schema overhead
- infra cost
- migration burden

Local memory is sufficient to validate:
- logging behavior
- query behavior
- category usefulness
- conversational UX

Decision:
Use local state + localStorage for MVP speed.

---

## Why Category Abstraction Matters

Users do not think in strict finance labels.

They think in:
- “Swiggy”
- “Chicken masala powder”
- “Coke Zero”
- “Cook fees”

Savvy translates user language into reporting categories.

This preserves:
- natural input
- useful analytics

Decision:
Use merchant-level understanding with category abstraction.

---

## Why Clarification Over Silent Failure

When Savvy is unsure, it asks.

Example:
“Should I log ₹80 under Eating Out, Groceries, or Personal?”

Silent misclassification damages trust faster than clarification friction.

Decision:
Ask when ambiguity impacts financial trust.

---

## Why SSR Was Required

Savvy introduced live AI parsing via `/api/parse`.

This changed the app from:
- static portfolio UI

to:
- runtime application with server behavior

Static builds cannot support live parsing endpoints.

Decision:
Move Savvy from static rendering to SSR.

---

## Why OpenRouter Instead of Direct OpenAI

Savvy needed:
- fast setup
- lower cost
- model flexibility
- lightweight experimentation

OpenRouter allowed model routing without tight vendor coupling.

Decision:
Use OpenRouter for MVP flexibility and cost efficiency.
