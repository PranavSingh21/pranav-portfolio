# Savvy — Failure Log

## 1. Static Architecture Broke After AI Integration

### What Happened
Savvy started as a static frontend experience.

Once `/api/parse` was introduced, Savvy required runtime execution.

The app still deployed as static, which caused live parsing to fail in production.

### Root Cause
The product architecture changed, but deployment architecture did not.

### Fix
Savvy was migrated from static output to SSR using Astro’s Vercel adapter.

### Lesson
Feature changes can invalidate infrastructure assumptions.

---

## 2. Production Showed Old UI Despite Local Updates

### What Happened
Local Savvy showed updated UI and logic, but production continued serving older behavior.

### Root Cause
Changes were not successfully reaching production due to failed deployments.

### Fix
Deployment logs were audited and Astro SSR configuration was corrected.

### Lesson
“Works locally” is not a deployment signal.

---

## 3. Build Failed After SSR Migration

### What Happened
After enabling server routes, Vercel builds failed.

### Root Cause
Astro required an adapter for server-rendered pages.

### Fix
Added `@astrojs/vercel` and configured SSR adapter in `astro.config.mjs`.

### Lesson
Runtime features require runtime adapters.

---

## 4. Parse API Failed in Production

### What Happened
Savvy’s `/api/parse` endpoint returned 500 errors in production.

### Root Cause
Missing API credentials in Vercel environment variables.

### Fix
Added environment variables in Vercel project settings.

### Lesson
Runtime AI systems fail silently without deployment-level credential checks.

---

## 5. Category Classification Was Too Broad

### What Happened
Savvy initially grouped:
- groceries
- cook fees
- Swiggy
- Zomato

all under Food.

This made reporting misleading.

### Root Cause
Category design optimized for simplicity, not usefulness.

### Fix
Food was broken into:
- Groceries
- Eating Out
- Household

### Lesson
User mental models matter more than internal category simplicity.

---

## 6. Ambiguous Inputs Broke Trust

### What Happened
Inputs like:
- “Coke Zero”
- “Chicken masala”
- “Dosa batter”

were often misclassified.

### Root Cause
Ambiguous merchant-only inputs lacked enough context.

### Fix
Savvy introduced clarification prompts for ambiguous low-confidence inputs.

### Lesson
Ambiguity should trigger clarification, not confident misclassification.
