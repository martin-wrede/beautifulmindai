# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based AI-powered project planning application called "Beautiful Mind AI". It's built with Vite and uses Cloudflare Pages Functions for serverless backend functionality. The app provides an interactive planner with AI assistance, timeline visualization, and subscription management.

## Development Commands

```bash
# Start development server
npm run dev

# Build the project for production
npm run build

# Preview the production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### Frontend Structure
- **Vite + React 18**: Main development setup with JSX support
- **React Router**: Client-side routing with protected routes
- **Context API**: Global state management for language switching and data fetching
- **Clerk**: Authentication system with subscription handling

### Key Components
- `PlannerApp.jsx`: Main application component handling AI interactions, roadmap management, and timeline visualization
- `Context.jsx`: Provides multi-language support and data fetching from locale files
- `ProtectedRoute.jsx`: Route protection based on authentication status
- `useSubscription.js`: Subscription status management (currently mocked for development)

### Backend (Cloudflare Functions)
- `functions/ai.js`: OpenAI integration endpoint with Airtable logging
- `functions/utils/airtable.js`: Database operations for chat message storage
- `functions/api/webhooks/lemonsqueezy.js`: Payment webhook handling

### Data Flow
1. User interacts with AI chatbot in PlannerApp
2. Messages sent to `/ai` endpoint (Cloudflare function)
3. OpenAI API processes requests with roadmap context
4. Responses parsed for JSON/ICS calendar data
5. Timeline and roadmap components updated automatically
6. Chat messages optionally logged to Airtable

## Configuration

### Environment Variables (wrangler.toml)
- `VITE_APP_OPENAI_API_KEY`: OpenAI API access
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`: Database storage
- `LEMON_Squeezy_API_KEY`: Payment processing
- `VITE_CLERK_PUBLISHABLE_KEY`: Authentication

### Deployment
- **Development**: Vite dev server
- **Production**: Cloudflare Pages with Functions
- **Static Assets**: GitHub Pages deployment option available

## Important Development Notes

### AI Integration
- The AI endpoint expects roadmap context in JSON format
- Responses are parsed for embedded JSON/ICS calendar data
- File uploads (ICS/JSON) supported for roadmap import

### State Management
- Undo/redo functionality implemented for roadmap edits
- Timeline data synchronized between SVG timeline and roadmap edit components
- Multi-day tasks automatically expanded to daily view

### Subscription System
- Currently uses mock status for development (`MOCK_STATUS = 'free'`)
- Pro features gated behind subscription check
- LemonSqueezy integration for payment processing

## Language Support
The app loads locale-specific data from `/public/locales/`:
- `data2-${language}.json`: Main UI text
- `data-${language}-ai.json`: AI-specific prompts and responses