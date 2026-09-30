# Salon Website — UI/UX Design Specification

## Design Direction
Create a premium, modern salon experience that feels:
- Elegant
- Warm
- Modern
- Professional
- Clean
- Trustworthy
- Photography-focused

Avoid an overly complicated luxury aesthetic.

## Color System
Primary: Deep Espresso `#2B211E`
Secondary: Warm Mocha `#6F5147`
Accent: Soft Rose `#C98F91`
Background: Warm Cream `#FAF7F3`
Surface: White `#FFFFFF`
Primary Text: `#211B19`
Secondary Text: `#6E6662`
Border: `#E7DED8`

Exact values may be adjusted after visual testing.

## Typography
Recommended:
- Headings: Playfair Display or similar serif
- Body: Inter or similar modern sans-serif

Approximate sizes:
- Hero: 64px desktop / 40px mobile
- Section heading: 40px desktop / 30px mobile
- Card heading: 20–24px
- Body: 16px
- Small: 14px

## Header
Desktop:
Logo | Home | Services | About | Gallery | Contact | Book Appointment

Mobile:
Logo | Menu

Optional sticky behavior.

## Hero
Communicate the salon's value immediately.

Example:
“Beautiful Hair. Beautiful You.”

Include:
- short supporting copy
- Book Appointment CTA
- Explore Services CTA
- high-quality salon image

## Service Categories
Four categories:
- Hair
- Nails
- Skin & Beauty
- Other Services

Each category should have image, title, short description, and CTA.

## Service Cards
Show:
- image
- service name
- description
- duration
- price
- Book Now

Desktop: 3–4 cards/row
Tablet: 2/row
Mobile: 1/row

## Service Details
Show:
- image
- name
- category
- description
- duration
- price
- preparation
- aftercare
- available staff
- booking CTA
- related services

## Booking UX
Use a simple multi-step flow:

1. Service
2. Staff
3. Date & Time
4. Details
5. Confirmation

Use a progress indicator.

Time slots must clearly distinguish available and unavailable times.

## Confirmation
Show:
- confirmation state
- service
- staff
- date
- time
- duration
- price
- View Appointment
- Back to Home

## Customer Dashboard
Include:
- Dashboard
- Appointments
- Services
- Profile
- Notifications

Show upcoming appointment, recent appointments, booking count, and quick-book action.

## Admin Dashboard
SaaS-style layout:
- sidebar
- header
- search
- notifications
- profile

Sidebar:
Dashboard, Appointments, Customers, Staff, Services, Gallery, Reviews, Promotions, Reports, Settings.

Dashboard cards:
- Today's Appointments
- Customers
- Revenue
- Completed Appointments

## Appointment Management
Table columns:
Customer, Service, Staff, Date, Time, Status, Amount, Actions.

Statuses:
Pending, Confirmed, In Progress, Completed, Cancelled, No Show.

Use text/icon labels in addition to color.

## Staff Management
Show:
- profile image
- name
- role
- services
- availability
- status

## Gallery
Use a responsive editorial/masonry grid.

Categories:
All, Hair, Nails, Makeup, Bridal, Beauty.

Lazy-load gallery images.

## Bridal Section
Create a distinct promotional section for bridal hair + makeup packages.

## Kids' Services
Use a friendly but still premium visual style.

## Contact
Include:
- address
- phone
- email
- opening hours
- map
- social links

## Footer
Include:
- logo
- short tagline
- quick links
- service links
- contact
- social links
- copyright
- privacy policy
- terms

## Forms
Use clear labels, comfortable inputs, validation messages, and obvious primary actions.

## Loading / Empty / Error States
Use skeleton loaders for cards/lists.

Example empty state:
“No upcoming appointments. You don't have any appointments scheduled yet. [Book an Appointment]”

Example error:
“Something went wrong. We couldn't load the services. Please try again. [Try Again]”

## Responsive Breakpoints
- Mobile: <640px
- Tablet: 640–1023px
- Desktop: 1024px+
- Large desktop: 1440px+

Layouts should adapt naturally rather than relying only on fixed breakpoints.

## Accessibility
Implement:
- semantic HTML
- keyboard navigation
- visible focus states
- accessible labels
- alt text
- correct heading hierarchy
- sufficient contrast
- accessible dialogs
- accessible date/time controls
- screen-reader-friendly status messages

## Motion
Use subtle fades, slides, hover elevation, and gallery zoom. Respect `prefers-reduced-motion`.

## SEO
Support:
- page titles
- meta descriptions
- Open Graph
- semantic headings
- SEO-friendly service URLs
- alt text
- structured data where appropriate

Example:
`/services/hair/box-braids`

## Reusable Design System
Create reusable components:
- Button
- Input
- Select
- Modal
- Badge
- Card
- ServiceCard
- StaffCard
- Avatar
- Toast
- Alert
- Skeleton
- Pagination
- Tabs
- DatePicker
- TimeSlot
- EmptyState

## Overall Experience
Customer-facing:
Beautiful imagery + clear services + trust + easy booking + mobile usability

Admin:
Efficiency + clear data + fast appointment management + simple service management + operational visibility
