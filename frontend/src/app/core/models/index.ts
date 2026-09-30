export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  customerProfile?: CustomerProfile;
  staffProfile?: StaffProfile;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  address?: string;
  notes?: string;
  loyaltyPoints: number;
}

export interface StaffProfile {
  id: string;
  userId: string;
  title: string;
  bio?: string;
  specialty?: string;
  rating: number;
  experienceYears: number;
  isActive: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
  };
  services?: Array<{
    serviceId: string;
    service: Service;
  }>;
  availabilities?: StaffAvailability[];
}

export interface StaffAvailability {
  id: string;
  staffProfileId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  services?: Service[];
  _count?: { services: number };
}

export interface Service {
  id: string;
  categoryId: string;
  category?: ServiceCategory;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl?: string;
  preparation?: string;
  aftercare?: string;
  isDisclaimerRequired: boolean;
  disclaimerText?: string;
  isActive: boolean;
  staffMembers?: Array<{
    staff: StaffProfile;
  }>;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  customerId: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  staffId: string;
  staff?: StaffProfile;
  serviceId: string;
  service?: Service;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
  paymentStatus: string;
  paymentMethod?: string;
  createdAt: string;
  review?: Review;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  reason?: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  appointment?: Appointment;
  customerId: string;
  customer?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  rating: number;
  comment: string;
  isPublished: boolean;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountPercent?: number;
  discountAmount?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface SalonSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export interface DashboardMetrics {
  todayAppointments: number;
  upcomingAppointments: number;
  totalCustomers: number;
  totalStaff: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  recentAppointments: Appointment[];
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  details?: any;
}

export interface AuthResponse {
  user: User;
  token: string;
}
