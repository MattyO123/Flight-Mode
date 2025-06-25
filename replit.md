# Flight Mode Competitions

## Overview

Flight Mode Competitions is a luxury travel competition platform where users can win dream holidays through skill-based competitions. The application is built as a full-stack TypeScript application using React for the frontend, Express.js for the backend, and PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Build Tool**: Vite for development and production builds
- **UI Components**: Extensive use of Radix UI primitives via shadcn/ui

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: TSX for TypeScript execution in development

### Database Layer
- **Database**: PostgreSQL (configurable via environment)
- **ORM**: Drizzle ORM with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless connection pooling

### Authentication System
- **Provider**: Replit Auth (OpenID Connect)
- **Strategy**: Passport.js with OpenID Connect strategy
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Custom user profile management with Stripe integration

## Key Components

### Database Schema
- **Users**: Core user profiles with Stripe customer integration
- **Sessions**: Express session storage for authentication
- **Competitions**: Competition metadata including pricing, categories, and timing
- **Entries**: User competition entries (referenced but not fully implemented)

### Payment Integration
- **Payment Processor**: Stripe for handling payments
- **Features**: Customer creation, subscription management, and checkout flows
- **Components**: React Stripe.js integration for payment forms

### Competition System
- **Competition Management**: CRUD operations for competitions
- **Categories**: Filterable competition categories (luxury, wellness, adventure)
- **Skill Questions**: Modal-based skill verification before entry
- **Progress Tracking**: Visual progress indicators for competition entry limits

### UI/UX Features
- **Responsive Design**: Mobile-first design with desktop optimization
- **Component Library**: Comprehensive UI component system
- **Theme System**: CSS custom properties for consistent theming
- **Interactive Elements**: Countdown timers, progress bars, and modal dialogs

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit Auth, sessions stored in PostgreSQL
2. **Competition Discovery**: Competitions fetched via React Query, cached for performance
3. **Entry Process**: Skill question modal → Stripe checkout → competition entry
4. **Dashboard Updates**: Real-time updates of user statistics and active entries
5. **Payment Processing**: Stripe handles payment verification and customer management

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless
- **Authentication**: Replit Auth (OpenID Connect)
- **Payments**: Stripe payment processing
- **Email/Notifications**: Not currently implemented

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Production build compilation for server code
- **Vite**: Frontend development server and build tool
- **Drizzle Kit**: Database schema management and migrations

### UI Libraries
- **Radix UI**: Accessibility-focused component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hook Form**: Form state management

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Development Server**: Concurrent frontend (Vite) and backend (TSX) processes
- **Hot Reload**: Vite HMR for frontend, TSX watch mode for backend
- **Database**: Replit-provisioned PostgreSQL instance

### Production Build
- **Frontend**: Vite static build to `dist/public`
- **Backend**: ESBuild compilation to `dist/index.js`
- **Deployment**: Replit autoscale deployment target
- **Process Management**: Single Node.js process serving both static assets and API

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **Authentication**: Replit Auth environment variables
- **Payments**: Stripe public and secret keys
- **Sessions**: `SESSION_SECRET` for session encryption

## Recent Changes

- **June 25, 2025**: Initial project setup with PostgreSQL database, Stripe payment integration, and React frontend
- **June 25, 2025**: Fixed app startup issues by making Stripe optional for development mode
- **June 25, 2025**: Updated brand colors and theme to match Flight Mode identity (navy blue, gold, cream)
- **June 25, 2025**: Integrated official Flight Mode logo across navigation and hero sections
- **June 25, 2025**: Added sample competition data (Maldives, Swiss Alps, Bali) and resolved accessibility warnings

## User Preferences

```
Preferred communication style: Simple, everyday language.
```