import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { ServicesComponent } from './features/services/services.component';
import { ServiceDetailComponent } from './features/services/service-detail/service-detail.component';
import { GalleryComponent } from './features/gallery/gallery.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { BookingComponent } from './features/booking/booking.component';
import { LoginComponent } from './features/auth/login/login.component';
import { CustomerDashboardComponent } from './features/customer/customer-dashboard.component';
import { StaffDashboardComponent } from './features/staff/staff-dashboard.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Veya Beauty Studio | Beautiful Hair. Beautiful You.' },
  { path: 'services', component: ServicesComponent, title: 'Services & Treatments | Veya Beauty Studio' },
  { path: 'services/:id', component: ServiceDetailComponent, title: 'Treatment Details | Veya Beauty Studio' },
  { path: 'gallery', component: GalleryComponent, title: 'Lookbook & Portfolio | Veya Beauty Studio' },
  { path: 'about', component: AboutComponent, title: 'Our Story & Team | Veya Beauty Studio' },
  { path: 'contact', component: ContactComponent, title: 'Contact Atelier | Veya Beauty Studio' },
  { path: 'booking', component: BookingComponent, title: 'Book an Appointment | Veya Beauty Studio' },
  { path: 'auth/login', component: LoginComponent, title: 'Sign In | Veya Beauty Studio' },
  { path: 'auth/register', component: LoginComponent, title: 'Register Account | Veya Beauty Studio' },

  // Customer Routes (Protected)
  {
    path: 'customer/dashboard',
    component: CustomerDashboardComponent,
    canActivate: [authGuard],
    title: 'Customer Dashboard | Veya Beauty Studio',
  },
  {
    path: 'customer/appointments',
    component: CustomerDashboardComponent,
    canActivate: [authGuard],
    title: 'My Appointments | Veya Beauty Studio',
  },
  {
    path: 'customer/profile',
    component: CustomerDashboardComponent,
    canActivate: [authGuard],
    title: 'Profile Settings | Veya Beauty Studio',
  },

  // Staff Routes (Protected)
  {
    path: 'staff/dashboard',
    component: StaffDashboardComponent,
    canActivate: [authGuard, roleGuard(['STAFF', 'ADMIN'])],
    title: 'Specialist Portal | Veya Beauty Studio',
  },

  // Admin Routes (Protected)
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    title: 'Admin Console | Veya Beauty Studio',
  },

  { path: '**', redirectTo: '' },
];
