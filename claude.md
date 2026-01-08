# Anplexa Backend & Deployment Documentation

## Backend Architecture

Anplexa uses a hybrid backend approach to balance performance, privacy, and development speed.

### 1. In-App Backend (Next.js API Routes)
The frontend application includes a set of serverless API routes located in `app/api/`. These routes act as a secure proxy and orchestration layer:

- **Proxying**: Sensitive requests to the external Backend API are routed through these internal endpoints to protect API keys and secrets.
- **Authentication**: Validates user sessions and manages JWT tokens before communicating with core services.
- **Analytics & Integration**: Orchestrates data flow between the user's browser, PostHog, Clarity, and Stripe.
- **Environment**: Runs within the same Node.js environment as the Next.js server.

### 2. External Backend API (`api.anplexa.com`)
The core business logic, AI model orchestration (Ollama), and persistent data management are handled by a dedicated backend service:

- **AI Chat**: Handles streaming SSE responses and personality mode logic.
- **User Data**: Manages profiles, companion settings, and conversation history.
- **Subscription Verification**: Integrates directly with Stripe webhooks for PRO status.

## Deployment Strategy

Anplexa is currently deployed using **Replit's Autoscale Deployment** infrastructure.

### Environment & Hosting
- **NixOS Environment**: The application runs in a reproducible Nix-based Linux container.
- **Autoscale**: The deployment target is set to `autoscale`, meaning the app spins up instances based on traffic and scales to zero when inactive to optimize costs.
- **Global Hosting**: Leverages Replit's infrastructure to provide low-latency access globally.

### Continuous Deployment
- **Branch-based**: Changes pushed to the main branch are automatically detected.
- **Build Process**: Replit executes `npm run build` (Next.js build) to generate a production-optimized bundle.
- **Production Server**: The app is served via `npm start`, listening on a production-ready port managed by Replit's ingress.

### Secrets & Variables
- **Secrets Management**: Sensitive keys (Stripe, PostHog, Backend API) are stored in Replit's encrypted Secrets vault and injected as environment variables at runtime.
- **Public Domain**: The app is accessible via the custom domain managed through the Replit Deployment pane.
