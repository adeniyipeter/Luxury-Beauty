# Salon Website — AI Agent Instructions

## Project Context
Build a full-stack salon management and appointment-booking platform.

- Frontend: Angular
- Backend: Node.js v18
- Recommended database: PostgreSQL
- Recommended ORM: Prisma
- API: REST

## Core Roles
- CUSTOMER
- STAFF
- ADMIN

## Angular Rules
Prefer standalone components, Angular Router, Reactive Forms, HttpClient, Signals, and RxJS where appropriate.

Recommended structure:

src/app/
- core/
  - guards/
  - interceptors/
  - services/
  - models/
- shared/
  - components/
  - directives/
  - pipes/
- features/
  - auth/
  - home/
  - services/
  - booking/
  - customer/
  - staff/
  - admin/

Components should handle presentation and interaction. Put business logic in services/facades.

Use dedicated Angular API services. Do not make raw HTTP requests directly from components.

## Backend Rules
Recommended structure:

src/
- config/
- controllers/
- middleware/
- routes/
- services/
- repositories/
- validators/
- utils/
- types/
- prisma/
- app.ts

Request flow:

Route -> Middleware -> Controller -> Service -> Repository/Prisma -> Database

Controllers should remain thin.

## Authentication
Use JWT authentication with:
- Login
- Register
- Logout
- Current-user retrieval
- Auth interceptor
- Auth guard
- Role guard

Never trust the frontend for authorization. Enforce roles on the backend.

## Booking Rules
The backend is the source of truth.

Before creating a booking verify:
- service exists and is active
- staff exists
- staff can perform service
- staff is available
- time is valid and not in the past
- salon is open
- no conflicting appointment exists

Never rely only on frontend availability calculations.

## Time Handling
Use a consistent timezone strategy. Store the salon timezone in salon settings and avoid mixing UTC, browser local time, and server time silently.

## Service Data
Services must be database-driven, not hard-coded in Angular.

Initial categories:
- Hair Services
- Nail Services
- Skin & Beauty
- Other Services

## Security
Never:
- store plaintext passwords
- commit `.env`
- expose JWT secrets
- trust client-supplied roles
- trust client-supplied prices
- trust client-only availability

For bookings, accept identifiers from the client but retrieve actual price/duration/availability from the database.

## Error Handling
Use centralized error handling and appropriate HTTP status codes:
400, 401, 403, 404, 409, 422, 500.

Never expose stack traces in production.

## UX
All async operations should support:
- Loading
- Success
- Empty
- Error

Build mobile-first and accessibility-conscious interfaces.

## Performance
Frontend:
- lazy-load routes
- optimize images
- avoid unnecessary subscriptions
- use signals/computed appropriately
- avoid unnecessary API calls

Backend:
- paginate large lists
- use indexes
- avoid N+1 queries
- return only needed fields

## Testing Priority
1. Authentication
2. Authorization
3. Booking conflicts
4. Availability
5. Service management
6. Cancellation
7. Payment verification

## Git
Use descriptive commits, for example:
- feat: add salon service management
- feat: implement appointment booking
- fix: prevent duplicate staff bookings
- feat: add staff availability management

Do not mix unrelated features.

## AI Agent Workflow
For every feature:
1. Inspect existing code and conventions.
2. Identify reusable code.
3. Explain the approach briefly.
4. Make the smallest clean change.
5. Reuse existing patterns.
6. Test the implementation.
7. Check TypeScript/build errors.
8. Check affected API contracts.
9. Summarize changed files.
10. Mention anything requiring manual verification.

Do not rewrite unrelated code or invent APIs when the existing project can be inspected.

## Completion Standard
A feature is complete only when UI, validation, API, authorization, database, error handling, and relevant tests work together.
