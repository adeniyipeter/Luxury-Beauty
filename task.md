# Veya Beauty Studio — Full-Stack Task Specification

## 1. Project Overview

Build a modern, responsive salon and beauty-service booking platform for Veya Beauty Studio.

### Frontend
- Framework: Angular
- Architecture: Standalone components preferred
- State management: Angular Signals/services where appropriate
- Responsive: Mobile, tablet, desktop
- API communication: REST API
- Form handling: Reactive Forms
- Authentication: JWT-based authentication

### Backend
- Runtime: Node.js v16
- API: REST
- Authentication: JWT
- Database: PostgreSQL recommended
- ORM: Prisma recommended
- Validation: Zod or Joi
- Password hashing: bcrypt
- File uploads: Cloudinary/S3-compatible storage or local development storage

## 2. User Roles

### Customer
- Create account, login/logout
- View/search/filter services
- View service details and prices
- Select staff, date, and time
- Book, reschedule, and cancel appointments
- View booking history
- Receive notifications
- Manage profile
- Leave reviews after completed appointments

### Staff
- Login
- View assigned appointments
- View customer information
- Update appointment status
- Manage availability
- View assigned services
- Update profile
- View earnings/booking statistics where enabled

### Admin
- Dashboard
- Manage customers, staff, services, categories, prices, appointments
- Manage salon availability, reviews, promotions, gallery, website content
- View reports and configure salon settings

## 3. Service Categories

### Hair Services
- Relaxing / Perming (Rebonding, Texturizing)
- Weaving / Braiding (Cornrows, Box Braids, Ghana Weaving, etc.)
- Wig Making / Fixing / Revamping
- Hair Washing / Conditioning / Deep Treatment
- Hair Coloring / Dyeing
- Blow Drying / Styling
- Hair Cutting / Trimming
- Dreadlocks / Loc Maintenance
- Silk Press / Thermal Styling
- Weave-on / Attachment Installation

### Nail Services
- Manicure
- Pedicure
- Gel Nails
- Acrylic Nails
- Nail Art
- Nail Polish / Gel Polish

### Skin & Beauty
- Facial Treatments
- Makeup Application (Bridal, Party, Everyday)
- Waxing (Eyebrows, Upper Lip, Legs, Arms)
- Threading
- Skin Bleaching / Toning
- Body Scrub / Exfoliation

### Other Services
- Eyelash Extensions
- Eyebrow Shaping / Tinting
- Head / Neck / Shoulder Massage
- Bridal Packages
- Kids' Hair Services

> Skin bleaching/toning should be configurable by the salon and accompanied by appropriate service information/disclaimer where required.

## 4. Public Website

### Home
- Hero section
- Salon introduction
- Book Appointment CTA
- Featured services
- Service categories
- Gallery
- Why choose us
- Testimonials
- Bridal promotion
- Opening hours
- Location/contact
- Social links
- Footer

### Services
- Category filters
- Service cards
- Name, description, duration, price, image
- Book Now CTA

### Service Details
- Image
- Description
- Duration
- Price
- Category
- Preparation/aftercare information
- Available staff
- Booking CTA

### Gallery
- Hair, Nails, Makeup, Bridal, Beauty, Other
- Responsive grid
- Image preview/lightbox
- Filtering

### About
- Salon story
- Mission
- Values
- Team
- Salon images

### Contact
- Address
- Phone
- Email
- Opening hours
- Contact form
- Map
- Social links

## 5. Appointment Booking

Flow:
1. Select service
2. Select staff
3. Select date
4. View available times
5. Select time
6. Confirm customer details
7. Review
8. Confirm
9. Payment if enabled
10. Confirmation

Statuses:
- PENDING
- CONFIRMED
- IN_PROGRESS
- COMPLETED
- CANCELLED
- NO_SHOW

Prevent double booking, bookings outside business hours, unavailable staff/services, and past bookings.

## 6. Customer Dashboard
- Dashboard
- My Appointments
- Appointment Details
- Profile
- Notifications
- Reviews

Show upcoming appointment, recent appointments, booking count, and quick-book CTA.

## 7. Admin Dashboard
Widgets:
- Today's appointments
- Upcoming appointments
- Total customers
- Total staff
- Revenue
- Completed appointments
- Cancelled appointments

Navigation:
Dashboard, Appointments, Customers, Staff, Services, Categories, Gallery, Reviews, Promotions, Reports, Settings.

## 8. Backend API

Base URL: `/api/v1`

### Authentication
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/logout`
- POST `/auth/refresh`
- GET `/auth/me`

### Users
- GET `/users/me`
- PATCH `/users/me`
- GET `/users/:id`

### Services
- GET `/services`
- GET `/services/:id`
- POST `/services`
- PATCH `/services/:id`
- DELETE `/services/:id`

### Categories
- GET `/categories`
- POST `/categories`
- PATCH `/categories/:id`
- DELETE `/categories/:id`

### Staff
- GET `/staff`
- GET `/staff/:id`
- POST `/staff`
- PATCH `/staff/:id`
- DELETE `/staff/:id`

### Availability
- GET `/availability`
- POST `/availability`
- PATCH `/availability/:id`
- DELETE `/availability/:id`

### Appointments
- GET `/appointments`
- GET `/appointments/:id`
- POST `/appointments`
- PATCH `/appointments/:id`
- DELETE `/appointments/:id`
- POST `/appointments/:id/cancel`
- POST `/appointments/:id/confirm`
- POST `/appointments/:id/complete`

### Reviews
- GET `/reviews`
- POST `/reviews`
- PATCH `/reviews/:id`
- DELETE `/reviews/:id`

### Gallery
- GET `/gallery`
- POST `/gallery`
- PATCH `/gallery/:id`
- DELETE `/gallery/:id`

## 9. Database Entities

Recommended:
- User
- Role
- CustomerProfile
- StaffProfile
- ServiceCategory
- Service
- StaffService
- StaffAvailability
- Appointment
- AppointmentService
- Payment
- Review
- GalleryImage
- Promotion
- Notification
- SalonSetting

## 10. Security
- Password hashing
- JWT authentication
- Role-based authorization
- Request validation
- Rate limiting
- CORS
- Secure HTTP headers
- Input sanitization
- Environment variables
- File-upload validation
- Unauthorized-action protection

Never expose password hashes, JWT secrets, database credentials, or private API keys.

## 11. Notifications
Support:
- Booking confirmation
- Cancellation
- Appointment reminder
- Rescheduling
- Completion
- Admin notifications

Initial channels: Email and in-app notifications. SMS/WhatsApp can be added later.

## 12. Payments
Support:
- Pending
- Successful
- Failed
- Refund
- Payment reference

Abstract payment logic behind a payment service.

## 13. Testing
Frontend:
- Component tests
- Service tests
- Form validation tests
- Booking-flow tests

Backend:
- Unit tests
- Controller tests
- Service tests
- API integration tests
- Auth tests
- Authorization tests
- Booking conflict tests

Critical test: two customers must not successfully book the same staff member for the same unavailable time slot.

## 14. Definition of Done
A feature is complete when:
- UI is responsive
- API integration works
- Loading/empty/error states exist
- Validation exists
- Authorization is enforced
- API errors are handled
- Tests are added where appropriate
- No sensitive information is exposed
- Code follows project architecture
- Production build succeeds

## 15. Implementation Phases
1. Foundation — Angular, Node.js, PostgreSQL, Prisma, auth, environment, errors
2. Services — categories, services API and UI
3. Staff — staff API, availability, service assignment
4. Booking — availability, booking, conflicts, appointment management
5. Customer — auth, dashboard, profile, history, reviews
6. Admin — dashboard and management modules
7. Payments & Notifications
8. Production — security, testing, performance, SEO, accessibility, deployment
