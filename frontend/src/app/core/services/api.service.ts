import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ServiceCategory,
  Service,
  StaffProfile,
  Appointment,
  Review,
  GalleryImage,
  Promotion,
  Notification,
  SalonSetting,
  DashboardMetrics,
  TimeSlot,
  ApiResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:5060/api/v1';

  constructor(private http: HttpClient) {}

  // Categories
  getCategories(): Observable<ApiResponse<{ categories: ServiceCategory[] }>> {
    return this.http.get<ApiResponse<{ categories: ServiceCategory[] }>>(`${this.baseUrl}/categories`);
  }

  getCategory(id: string): Observable<ApiResponse<{ category: ServiceCategory }>> {
    return this.http.get<ApiResponse<{ category: ServiceCategory }>>(`${this.baseUrl}/categories/${id}`);
  }

  createCategory(data: any): Observable<ApiResponse<{ category: ServiceCategory }>> {
    return this.http.post<ApiResponse<{ category: ServiceCategory }>>(`${this.baseUrl}/categories`, data);
  }

  updateCategory(id: string, data: any): Observable<ApiResponse<{ category: ServiceCategory }>> {
    return this.http.patch<ApiResponse<{ category: ServiceCategory }>>(`${this.baseUrl}/categories/${id}`, data);
  }

  deleteCategory(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/categories/${id}`);
  }

  // Services
  getServices(params?: { categoryId?: string; search?: string; isActive?: boolean }): Observable<ApiResponse<{ services: Service[] }>> {
    let httpParams = new HttpParams();
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.isActive !== undefined) httpParams = httpParams.set('isActive', String(params.isActive));

    return this.http.get<ApiResponse<{ services: Service[] }>>(`${this.baseUrl}/services`, { params: httpParams });
  }

  getService(id: string): Observable<ApiResponse<{ service: Service }>> {
    return this.http.get<ApiResponse<{ service: Service }>>(`${this.baseUrl}/services/${id}`);
  }

  createService(data: any): Observable<ApiResponse<{ service: Service }>> {
    return this.http.post<ApiResponse<{ service: Service }>>(`${this.baseUrl}/services`, data);
  }

  updateService(id: string, data: any): Observable<ApiResponse<{ service: Service }>> {
    return this.http.patch<ApiResponse<{ service: Service }>>(`${this.baseUrl}/services/${id}`, data);
  }

  deleteService(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/services/${id}`);
  }

  // Staff
  getStaffList(params?: { serviceId?: string }): Observable<ApiResponse<{ staff: StaffProfile[] }>> {
    let httpParams = new HttpParams();
    if (params?.serviceId) httpParams = httpParams.set('serviceId', params.serviceId);

    return this.http.get<ApiResponse<{ staff: StaffProfile[] }>>(`${this.baseUrl}/staff`, { params: httpParams });
  }

  getStaff(id: string): Observable<ApiResponse<{ staff: StaffProfile }>> {
    return this.http.get<ApiResponse<{ staff: StaffProfile }>>(`${this.baseUrl}/staff/${id}`);
  }

  updateStaff(id: string, data: any): Observable<ApiResponse<{ staff: StaffProfile }>> {
    return this.http.patch<ApiResponse<{ staff: StaffProfile }>>(`${this.baseUrl}/staff/${id}`, data);
  }

  setStaffAvailability(id: string, schedules: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/staff/${id}/availability`, { schedules });
  }

  // Availability Slots
  getTimeSlots(serviceId: string, staffId: string, date: string): Observable<ApiResponse<{ slots: TimeSlot[] }>> {
    const params = new HttpParams()
      .set('serviceId', serviceId)
      .set('staffId', staffId)
      .set('date', date);
    return this.http.get<ApiResponse<{ slots: TimeSlot[] }>>(`${this.baseUrl}/availability/slots`, { params });
  }

  // Appointments
  getAppointments(params?: { status?: string; date?: string; staffId?: string }): Observable<ApiResponse<{ appointments: Appointment[] }>> {
    let httpParams = new HttpParams();
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.date) httpParams = httpParams.set('date', params.date);
    if (params?.staffId) httpParams = httpParams.set('staffId', params.staffId);

    return this.http.get<ApiResponse<{ appointments: Appointment[] }>>(`${this.baseUrl}/appointments`, { params: httpParams });
  }

  getAppointment(id: string): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.get<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/appointments/${id}`);
  }

  bookAppointment(data: {
    serviceId: string;
    staffId: string;
    date: string;
    startTime: string;
    notes?: string;
    promoCode?: string;
    paymentMethod?: string;
  }): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.post<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/appointments`, data);
  }

  updateAppointmentStatus(id: string, status: string, reason?: string): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.patch<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/appointments/${id}/status`, {
      status,
      cancellationReason: reason,
    });
  }

  cancelAppointment(id: string, reason?: string): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.post<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/appointments/${id}/cancel`, {
      cancellationReason: reason,
    });
  }

  rescheduleAppointment(id: string, data: { date: string; startTime: string; staffId?: string }): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.post<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/appointments/${id}/reschedule`, data);
  }

  // Reviews
  getReviews(): Observable<ApiResponse<{ reviews: Review[] }>> {
    return this.http.get<ApiResponse<{ reviews: Review[] }>>(`${this.baseUrl}/reviews`);
  }

  createReview(data: { appointmentId: string; rating: number; comment: string }): Observable<ApiResponse<{ review: Review }>> {
    return this.http.post<ApiResponse<{ review: Review }>>(`${this.baseUrl}/reviews`, data);
  }

  // Gallery
  getGallery(category?: string): Observable<ApiResponse<{ images: GalleryImage[] }>> {
    let httpParams = new HttpParams();
    if (category && category !== 'All') httpParams = httpParams.set('category', category);
    return this.http.get<ApiResponse<{ images: GalleryImage[] }>>(`${this.baseUrl}/gallery`, { params: httpParams });
  }

  createGalleryImage(data: any): Observable<ApiResponse<{ image: GalleryImage }>> {
    return this.http.post<ApiResponse<{ image: GalleryImage }>>(`${this.baseUrl}/gallery`, data);
  }

  deleteGalleryImage(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/gallery/${id}`);
  }

  // Promotions
  getPromotions(): Observable<ApiResponse<{ promotions: Promotion[] }>> {
    return this.http.get<ApiResponse<{ promotions: Promotion[] }>>(`${this.baseUrl}/promotions`);
  }

  validatePromoCode(code: string): Observable<ApiResponse<{ promo: Promotion }>> {
    return this.http.get<ApiResponse<{ promo: Promotion }>>(`${this.baseUrl}/promotions/validate/${code}`);
  }

  // Notifications
  getNotifications(): Observable<ApiResponse<{ notifications: Notification[] }>> {
    return this.http.get<ApiResponse<{ notifications: Notification[] }>>(`${this.baseUrl}/notifications`);
  }

  markNotificationRead(id: string): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/notifications/${id}/read`, {});
  }

  // Settings & Reports
  getSettings(): Observable<ApiResponse<{ list: SalonSetting[]; map: Record<string, string> }>> {
    return this.http.get<ApiResponse<{ list: SalonSetting[]; map: Record<string, string> }>>(`${this.baseUrl}/settings`);
  }

  updateSetting(key: string, value: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/settings`, { key, value });
  }

  getDashboardMetrics(): Observable<ApiResponse<DashboardMetrics>> {
    return this.http.get<ApiResponse<DashboardMetrics>>(`${this.baseUrl}/reports/dashboard`);
  }
}
