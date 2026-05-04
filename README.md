# 🚀 Pranav Anand Singh – Product Portfolio

## 👋 About This Repository

This repository contains the source code for my personal portfolio website and live product experiments.

It showcases:

- Product Ownership experience in FinTech systems
- High-availability validation frameworks
- AI-powered product experiments (FlowPilot, ScreenSage, Savvy)
- Systems thinking, execution, and product strategy
- Interactive live product demos built as portfolio artifacts

The goal of this repository is not just to present work, but to demonstrate how I think, build, and ship products end-to-end.

---

## 🧠 About Me

I am a Product Owner specializing in:

- FinTech platform systems
- Validation architecture & workflow automation
- API-driven product modules
- AI-powered productivity and consumer tools

I focus on building scalable, reliable systems while exploring product-led, AI-first experiences through live product experiments.

This portfolio is both:
- a showcase of shipped work
- a sandbox for building and testing product ideas in public

**📍 Bangalore, India**  
**📧 021pranavsingh@gmail.com**  
**🔗 LinkedIn:** www.linkedin.com/in/pranav-anand-singh/

---

## 💡 Featured Product: Savvy

Savvy is an AI-first conversational personal finance assistant built as a live product experiment.

It helps users:
- log expenses in plain English
- track spending conversationally
- classify transactions intelligently
- query spending without dashboards
- build lightweight financial awareness with low friction

Savvy is designed as a chat-first finance product that replaces rigid forms and manual categorization with natural language input and AI-assisted parsing.

---

## 🛠 Savvy Tech Stack

### Frontend
- Astro — app shell / routing
- React + TypeScript — interactive chat UI and state handling
- Tailwind CSS — styling and design system

### Backend
- Astro API Routes — lightweight backend endpoints (`/api/parse`)
- Server-side rendering (SSR) — enabled for live runtime behavior

### AI Layer
- OpenRouter — model gateway
- OpenAI (`gpt-4o-mini` via OpenRouter) — intent parsing and classification

### State & Storage
- React local state — chat, memory, and pending conversational state
- Browser `localStorage` — lightweight persistence for:
  - profile memory
  - spend memory
  - chat history

### Deployment
- Vercel — hosting and SSR deployment
- GitHub — source control and deployment trigger
