# Cadastral Engineer Landing Page

## Overview

A professional landing page for a cadastral engineer (кадастровый инженер) service with a dark, modern, premium design. The application features atmospheric background images and thematic service images to create immersion in the topic. The design uses a dark theme with blue (#3b82f6) primary color and orange accent for a professional, expensive, trustworthy look.

Marketing structure follows conversion flow: awareness → interest → desire → action. Uses real data from geodezist37.ru and kadastr-online.ru websites.

## Admin Panel
- **URL**: `/admin`
- **Password**: `admin123`
- **Features**:
  - Hero section editor (title, subtitle, button text)
  - Statistics editor (years, projects, surveys, satisfaction %)
  - Services CRUD with icon selector
  - Process steps editor
  - Testimonials CRUD
  - Contacts editor (phones, email, WhatsApp, notification email)
  - Navigation menu editor

## Email Notifications (TODO)
- Currently inquiries are saved to database only
- `notificationEmail` field in contacts is prepared for future email integration
- To enable email notifications: connect Resend or SendGrid integration when ready
- Contact data: +7 903 743-80-61, +7 906 770-06-97, 9037438061@mail.ru, WhatsApp 79037438061

## Recent Changes (December 2024)
- Implemented dark premium theme with glassmorphism effects
- Added 9 atmospheric stock images (surveyors, aerial views, documents, construction)
- Built conversion-optimized landing page with 8 sections: Hero, Stats, Problems, Why Us, Services, Process, Testimonials, Contact
- Added full admin panel with form-based editors
- Dynamic navigation menu from admin panel
- Icon selector for services
- Statistics section editable from admin

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth scroll animations and transitions
- **Smooth Scrolling**: react-scroll for navigation to page sections
- **Build Tool**: Vite

The frontend follows a component-based architecture with:
- Reusable UI components in `client/src/components/ui/` (shadcn/ui)
- Custom hooks in `client/src/hooks/` for data fetching and state
- Page components in `client/src/pages/`
- Path aliases: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Neon serverless)
- **API Design**: RESTful endpoints defined in `shared/routes.ts`
- **Validation**: Zod schemas for request/response validation

The backend serves both the API and static files:
- Development: Vite middleware serves the frontend with HMR
- Production: Static files served from `dist/public`

### Data Layer
- **Schema Definition**: `shared/schema.ts` contains Drizzle table definitions
- **Content Storage**: JSON blocks stored in `content_blocks` table for dynamic content (hero, services, contacts, testimonials)
- **Form Submissions**: `inquiries` table stores contact form submissions

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database schema and Zod validation schemas
- `routes.ts`: API route definitions with type-safe input/output schemas

### Build System
- Custom build script (`script/build.ts`) handles both Vite and esbuild
- Server dependencies are bundled to reduce cold start times
- Output: `dist/` for server, `dist/public/` for client

## External Dependencies

### Database
- **PostgreSQL**: Primary database (Neon serverless compatible)
- **Connection**: Via `DATABASE_URL` environment variable
- **Migrations**: Drizzle Kit for schema migrations (`npm run db:push`)

### UI Component Library
- **shadcn/ui**: Pre-built accessible components based on Radix UI primitives
- **Configuration**: `components.json` defines component paths and styling

### Key NPM Packages
- `@neondatabase/serverless`: PostgreSQL driver for Neon
- `drizzle-orm` / `drizzle-zod`: ORM and schema validation
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `react-scroll`: Smooth scrolling navigation
- `zod`: Runtime type validation
- Full Radix UI primitive suite for accessible components

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal`: Error overlay in development
- `@replit/vite-plugin-cartographer`: Development tooling
- `@replit/vite-plugin-dev-banner`: Development banner