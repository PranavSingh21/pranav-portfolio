# PROJECT OVERVIEW

## Product Name

Savvy

## One-Sentence Elevator Pitch

Savvy is an AI-powered personal finance assistant that enables users to track expenses, income, and savings through natural language while combining conversational AI with structured financial workflows.

## Problem Being Solved

Most personal finance applications require users to:

* Navigate multiple screens
* Fill structured forms
* Categorize expenses manually
* Learn financial tooling

This creates friction and leads to inconsistent tracking behavior.

Savvy aims to reduce this friction by allowing users to interact with their finances conversationally while still maintaining structured financial records.

## Target Users

Primary:

* Young professionals
* First-time budgeters
* Users who dislike traditional finance apps
* Users comfortable with chat-based interfaces

Secondary:

* AI-first users
* Productivity enthusiasts
* Users seeking lightweight personal finance management

## Core Value Proposition

Instead of:

"Open app → Create transaction → Select category → Save"

Users can:

"Coffee 200"

and Savvy handles:

* Classification
* Categorization
* Tracking
* Summarization

through conversational interaction.

---

# PRODUCT VISION

## Long-Term Vision

Become an AI-powered financial operating system that understands user spending behavior, helps users make better financial decisions, and acts as an intelligent financial assistant rather than a ledger.

## Why This Product Exists

The project began with a hypothesis:

"If AI can understand human intent, finance tracking should feel like a conversation rather than bookkeeping."

During development this evolved into:

"AI should reduce friction, not replace structure."

This insight fundamentally shaped the product direction.

## Success Metrics

Short-Term

* Successful expense logging rate
* Classification accuracy
* User retention
* Transaction completion rate

Medium-Term

* Monthly active users
* Daily logging frequency
* Reduction in manual corrections

Long-Term

* Financial habit formation
* User trust
* AI recommendation adoption

---

# CURRENT PRODUCT STATE

## Features Completed

### Core Expense Logging

Users can enter:

* Swiggy 300
* Salary 120000
* Rent 20000

and create financial entries.

### Transaction Storage

Transactions stored in Supabase.

### CSV Export

Export transaction history.

### Transaction Reset

Delete user transaction history.

### Spending Breakdown

Category-wise spending summaries.

### Google Authentication

Implemented using Supabase Auth.

### User Session Management

Users remain logged in after authentication.

### Multi-User Transaction Storage

New transactions now save against authenticated user IDs rather than a shared demo account.

### Mobile Summary Drawer

Summary view for mobile users.

### Glassmorphism UI

Modern finance-themed interface with:

* Blur
* Gradients
* Glass cards

### Menu Portal Fix

Menu now renders using React Portal to avoid stacking-context issues.

---

## Features Partially Completed

### User-Specific Export

Implementation underway.

### User-Specific Reset

Implementation underway.

### Category Confirmation Flows

Working but inconsistent.

### Category Inference

Implemented but prone to ambiguity.

### Spending Analytics

Basic implementation.

---

## Features Planned

### Hybrid Logging Interface

Amount + Context inputs.

### Category Chips

Tap-to-select categories.

### Guided Confirmation Flow

Replace free-form confirmations.

### User-Specific Summaries

Complete migration from local state.

### Financial Insights

Monthly spending patterns.

### Savings Goals

Goal tracking.

### Budget Management

Budget setup and alerts.

### Recurring Transactions

Scheduled expense tracking.

---

## Features Intentionally Rejected

### Fully Conversational Product

Rejected because:

* Excessive ambiguity
* High maintenance cost
* Difficult edge-case handling
* Lower reliability

Decision:

Hybrid AI + Structured UX.

---

# USER EXPERIENCE

## Current User Flow

### Login

Google Authentication
→ Savvy Home

### Log Expense

User enters:

Coffee 200

→ AI interprets
→ Category inferred
→ Transaction saved

### View Summary

User opens summary drawer.

### Export

User exports CSV.

### Reset

User clears transaction history.

---

## Key Screens

### Chat Screen

Primary experience.

### Summary Drawer

Spending overview.

### Authentication State

Login button or email display.

### Menu

* Export
* Summary
* Reset

---

## Navigation Structure

Single-page conversational application.

Primary actions:

* Chat
* Summary
* Menu

---

## Important UX Decisions

### Portal-Based Menu

Reason:

Bot messages created stacking context conflicts.

Solution:

React Portal.

### Hybrid Logging Direction

Reason:

AI ambiguity increased significantly with unrestricted chat.

Decision:

Move toward structured input.

---

# TECHNICAL ARCHITECTURE

## Frontend Stack

* Astro
* React
* TypeScript
* Tailwind CSS v4

## Backend Stack

* Astro API Routes

## Database

Supabase PostgreSQL

## Authentication

Supabase Auth

Provider:

* Google OAuth

## Storage

Current Mixed State:

### Database

Transactions

### Local Storage

* Messages
* Profile
* Spend memory

Migration still required.

## Deployment

Frontend:

* Vercel

Database/Auth:

* Supabase

---

# DATA MODEL

## Transaction

Fields:

* id
* user_id
* type
* merchant
* amount
* category
* note
* source
* created_at

## User

Managed through Supabase Auth.

Key Field:

* id

Relationship:

User
→ Many Transactions

---

# AI IMPLEMENTATION

## Current Workflow

User Input
→ OpenRouter
→ Intent Parsing
→ Category Inference
→ Confirmation Logic
→ Save Transaction

## Current AI Responsibilities

* Intent detection
* Merchant extraction
* Category suggestions
* Clarifications

## Major Limitation

AI currently has excessive freedom.

Example:

Input:

"grocery 4000"

Incorrectly interpreted as savings.

## Major Product Learning

The hardest problem is not AI accuracy.

It is deciding when AI should not decide.

---

# PRODUCT DECISIONS LOG

## Decision: Use Conversational Input

Alternatives:

* Traditional form

Reason:

Wanted low-friction logging.

---

## Decision: Add Confirmation Layer

Alternatives:

* Auto-save everything

Reason:

Reduce incorrect logs.

---

## Decision: Google Authentication

Alternatives:

* Email/password

Reason:

Faster onboarding.

---

## Decision: Use Supabase

Alternatives:

* Custom backend

Reason:

Speed of execution.

---

## Decision: React Portal Menu

Alternatives:

* z-index adjustments

Reason:

Stacking context bugs persisted.

---

## Decision: Hybrid Logging

Alternatives:

* Fully conversational

Reason:

Maintainability and reliability.

---

# CHALLENGES ENCOUNTERED

## Technical

### Portal Layering Issues

Problem:

Bot messages appeared above menu.

Solution:

React Portal.

---

### Export Failures

Problem:

Environment configuration mismatch.

Solution:

Correct Supabase configuration.

---

### Multi-User Data

Problem:

All transactions tied to demo-user.

Solution:

Google Auth + user-specific storage.

---

## Product

### AI Ambiguity

Problem:

Same input could imply multiple intents.

Solution:

Move toward guided interactions.

---

## UX

### Free-Form Category Handling

Problem:

Users created unsupported categories.

Solution:

Plan category chips.

---

# ROADMAP

## Immediate Next Steps

1. Finish user-specific export.
2. Finish user-specific reset.
3. Verify user isolation.
4. Remove remaining demo-user dependencies.

## Short-Term

1. Hybrid logging UI.
2. Category chips.
3. Guided confirmation.
4. Better merchant extraction.

## Long-Term

1. Financial coaching.
2. Budgeting.
3. Savings goals.
4. Recurring transactions.
5. Predictive insights.

---

# OPEN ISSUES

## Bugs

### Merchant Extraction

Still returns Unknown in some flows.

### Category Misclassification

Example:

grocery 4000 → savings

### Mixed State Sources

Database + local storage coexist.

---

## Technical Debt

* No server-side auth verification.
* User ID trusted from frontend.
* Local storage still active.

---

## Risks

* AI unpredictability.
* Category ambiguity.
* Scaling conversational logic.

---

# PORTFOLIO / INTERVIEW STORY

## Why This Is A 0→1 Product

Built from idea to functioning product.

Includes:

* Product design
* AI workflows
* Authentication
* Data architecture
* Deployment

## PM Challenges Solved

### Ambiguity Management

Users express intent inconsistently.

### AI Trust

Balancing automation with confirmation.

### User Identity

Authentication vs authorization distinction.

## Product Thinking Demonstrated

* MVP scoping
* Feature prioritization
* UX trade-offs
* AI orchestration
* Build-measure-learn cycles

## Technical Complexity Demonstrated

* OAuth
* Supabase
* API architecture
* AI integrations
* Multi-user migration

---

# DAILY WORK LOG SUMMARY

## Phase 1

Built conversational expense logging.

Learning:

Natural language feels magical but introduces ambiguity.

## Phase 2

Built categorization and confirmation.

Learning:

AI confidence varies significantly.

## Phase 3

Implemented Supabase storage.

Learning:

Persistence changes product architecture.

## Phase 4

Built export and reset.

Learning:

Operational features matter.

## Phase 5

Solved portal and menu rendering issues.

Learning:

UI bugs often originate from stacking contexts rather than z-index values.

## Phase 6

Implemented Google Authentication.

Learning:

Authentication, session management, and data ownership are separate problems.

## Phase 7

Migrated transaction ownership.

Learning:

Identity alone does not create multi-user behavior.

## Phase 8

Identified conversational UX limits.

Learning:

Hybrid interfaces outperform pure conversational systems for transactional workflows.

---

# CONTEXT RECOVERY SECTION

PROJECT: SAVVY

Savvy is an AI-powered personal finance assistant built using Astro, React, TypeScript, Supabase, OpenRouter, and Vercel.

Core idea:
Allow users to manage finances conversationally.

Current realization:
Pure chat introduces excessive ambiguity.

Major product insight:
The future is not chat-first.
It is intent-first.

Current architecture:

Frontend:

* Astro
* React
* Tailwind v4

Backend:

* Astro API Routes

Database:

* Supabase

Auth:

* Google OAuth via Supabase

Current state:

* Auth working
* User sessions working
* Transactions saved against authenticated user IDs
* Export/reset migration in progress
* Menu portal issues solved

Major decision:
Transition from pure chat toward hybrid logging:

Amount + Context
→ AI categorization
→ Confirmation
→ Save

Future roadmap:

1. Complete user-specific export/reset.
2. Build hybrid logging UI.
3. Add category chips.
4. Remove local storage dependencies.
5. Build analytics and budgeting.

Important PM lesson:
The hardest AI product challenge was not model intelligence. It was deciding when not to let the model decide.

---

# AI COLLABORATION INSTRUCTIONS

1. Treat this document as the primary source of truth.

2. Preserve major architectural decisions unless explicitly changed.

3. Do not revert toward a fully conversational product without discussing trade-offs.

4. Continue roadmap from:

   * User-specific export/reset completion
   * Hybrid logging implementation

5. Ask clarifying questions before modifying:

   * Authentication
   * Database schema
   * AI workflows

6. Prioritize:
   Reliability > Intelligence

7. Preserve key product insight:

"AI should reduce friction, not replace structure."

8. Future recommendations should align with the hybrid AI + structured UX philosophy established during development.


## Milestone: Hybrid Conversational Logging

### Features Added
- Category selection chips
- Yes/No confirmation chips
- Interactive clarification flows

### Bugs Fixed
- Unknown merchant issue
- Null category issue
- Invalid profile update issue ("Saved your null as ₹0")

### Product Learnings
- Users enter descriptions, not just merchants
- Chat UX benefits from guided actions
- AI confidence should determine when chips appear

### New Edge Cases Discovered
- Portfolio website charges
- LinkedIn Premium subscription
- Business/service expenses vs merchant expenses