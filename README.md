# Krispy AI

Krispy provides marketing, automation and customer retention services over WhatsApp. It allows businesses a deeper insight into their customer base and gives valuable statistics along with a plan of action. Each business onboarded on Krispy has their own personal AI agent that is trained on the data of the business. Once trained and integrated, it can reply to the customers on WhatsApp, set up automations, flow and run campaigns.

I was brought on as the founding engineer of Krispy. I worked closely with the CTO to set up the complete architecture of services, integrations with various APIs and deploying the services. I set up end-to-end services responsible for chatting over WhatsApp, “catching” Shopify hooks, automations/flows, subscription and collecting contacts base.

Krispy is built upon a micro-services architecture, with a shared database. Each dedicated service handles a set of tasks. We have 5 micro-services deployed yet; core, chat, webhook, cron and AI services.


## Overview

This repository features only the core backend service of Krispy including:
- Authentication
- User management
- Flows/Automations
- 3rd Party Integrations with Shopify, Klaviyo, Twillio etc.

The project focuses on demonstrating structure, clarity, and engineering approach.


## Tech Stack

- React / Next.js
- JavaScript
- TailwindCSS
- Node.js / ExpressJs

## Note

This repository is a sanitized version of the production service. It does not contain sensitive/confidential information.
