# AGC Web - Replit Configuration

## Overview

AGC Web is a professional web development agency website built for a Romanian market. The application serves as a marketing and contact platform showcasing web development services including e-commerce solutions (B2B, B2C, WooCommerce), presentation websites, blogs, and custom development services. The site features a modern, professional design inspired by Linear and Stripe aesthetics with Romanian language content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for UI transitions
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript compiled with tsx
- **API Design**: RESTful endpoints under `/api` prefix
- **Build System**: esbuild for production bundling with selective dependency inlining

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Storage Pattern**: Interface-based storage abstraction (`IStorage`) with in-memory implementation for development

### Project Structure
```
client/           # React frontend application
  src/
    components/   # UI components (shadcn/ui)
    pages/        # Route components
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Data access layer
  vite.ts         # Vite dev server integration
shared/           # Shared code between client/server
  schema.ts       # Drizzle schemas and Zod validators
```

### Design System
- **Typography**: Inter (body) + Space Grotesk (headings) from Google Fonts
- **Theme**: CSS custom properties with light/dark mode support
- **Component Library**: Full shadcn/ui component set with Radix UI primitives
- **Border Radius**: Custom values (9px/6px/3px for lg/md/sm)

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Session Storage**: connect-pg-simple for session persistence (configured but using memory storage currently)

### UI Component Dependencies
- **Radix UI**: Complete primitive set for accessible components
- **Embla Carousel**: Carousel functionality
- **cmdk**: Command palette component
- **Vaul**: Drawer component
- **react-day-picker**: Calendar/date picker
- **Recharts**: Charting library

### Development Tools
- **Replit Plugins**: vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner
- **Drizzle Kit**: Database migrations and schema push

### Configured but Not Yet Active
- Nodemailer (email sending)
- Stripe (payments)
- Passport/passport-local (authentication)
- OpenAI and Google Generative AI (AI integrations)
- Multer (file uploads)