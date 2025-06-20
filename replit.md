# replit.md

## Overview

This is a full-stack application built with React, Express, and TypeScript that manages program activities and provides administrative capabilities. The application features a dashboard for viewing program progress, detailed program views, and administrative functions for managing programs and dynamic tables.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API structure
- **Middleware**: JSON parsing, URL encoding, custom logging middleware
- **Error Handling**: Centralized error handling middleware

### Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless database
- **Schema Management**: Drizzle Kit for migrations and schema management
- **In-Memory Storage**: Fallback MemStorage class for development/testing

## Key Components

### Database Schema
- **Programs Table**: Core program management with fields for name, type, status, progress, participants, budget tracking, and metadata
- **Activities Table**: Program activity tracking with status and details
- **Table Config Table**: Dynamic table configuration storage with JSON columns
- **Users Table**: Basic user management with role-based access

### API Endpoints
- **Programs API**: Full CRUD operations for program management
- **Activities API**: Activity tracking and management
- **Table Config API**: Dynamic table configuration management

### Frontend Pages
- **Dashboard**: Main program overview with cards, progress timeline, and activity table
- **Program Detail**: Individual program view with detailed metrics and activities
- **Admin Panel**: Administrative interface for program and table management
- **404 Page**: Error handling for undefined routes

### UI Components
- **Program Cards**: Interactive program display cards with progress indicators
- **Navigation**: Multi-language support and theme selection
- **Tables**: Dynamic table components with filtering and sorting
- **Forms**: Type-safe forms with validation using React Hook Form and Zod
- **Modals**: Program detail modals and administrative dialogs

## Data Flow

1. **Client Requests**: Frontend makes API requests through TanStack Query
2. **API Processing**: Express server processes requests and validates data
3. **Database Operations**: Drizzle ORM handles type-safe database interactions
4. **Response Handling**: Structured JSON responses with error handling
5. **State Management**: TanStack Query manages caching and synchronization
6. **UI Updates**: React components automatically re-render on state changes

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm and drizzle-zod for database operations and validation
- **UI Components**: Extensive Radix UI component library
- **Validation**: Zod for runtime type checking and validation
- **Date Handling**: date-fns for date manipulation
- **State Management**: @tanstack/react-query for server state

### Development Tools
- **Build Tools**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript for type safety
- **Styling**: Tailwind CSS with PostCSS processing
- **Development**: tsx for TypeScript execution in development

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Static Assets**: Served from built frontend directory

### Environment Configuration
- **Development**: `npm run dev` runs TypeScript server directly
- **Production**: `npm run start` runs compiled JavaScript
- **Database Migration**: `npm run db:push` for schema changes

### Replit Configuration
- **Modules**: Node.js 20, web server, PostgreSQL 16
- **Deployment**: Autoscale deployment target
- **Port Mapping**: Internal port 5000 mapped to external port 80
- **Environment**: PostgreSQL provisioning with DATABASE_URL

## Changelog

```
Changelog:
- June 20, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```