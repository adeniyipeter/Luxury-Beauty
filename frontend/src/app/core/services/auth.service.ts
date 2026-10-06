import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { User, UserRole, AuthResponse, ApiResponse } from '../models';
import { Apiurl } from '../../../../.env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${Apiurl}/auth`;
  private tokenKey = 'veya_auth_token';

  // Angular Signals for state management
  currentUser = signal<User | null>(null);
  token = signal<string | null>(this.getStoredToken());

  isAuthenticated = computed(() => !!this.currentUser());
  isCustomer = computed(() => this.currentUser()?.role === 'CUSTOMER');
  isStaff = computed(() => this.currentUser()?.role === 'STAFF');
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  constructor(private http: HttpClient, private router: Router) {
    if (this.token()) {
      this.fetchCurrentUser().subscribe({
        error: () => this.logout(),
      });
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.token.set(token);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
    this.token.set(null);
    this.currentUser.set(null);
  }

  register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => {
        if (res.data?.token) {
          this.setToken(res.data.token);
          this.currentUser.set(res.data.user);
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.data?.token) {
          this.setToken(res.data.token);
          this.currentUser.set(res.data.user);
        }
      })
    );
  }

  fetchCurrentUser(): Observable<ApiResponse<{ user: User }>> {
    return this.http.get<ApiResponse<{ user: User }>>(`${this.apiUrl}/me`).pipe(
      tap((res) => {
        if (res.data?.user) {
          this.currentUser.set(res.data.user);
        }
      }),
      catchError((err) => {
        this.clearToken();
        return throwError(() => err);
      })
    );
  }

  updateProfile(data: Partial<User & { address?: string }>): Observable<ApiResponse<{ user: User }>> {
    return this.http.patch<ApiResponse<{ user: User }>>(`${this.apiUrl}/me`, data).pipe(
      tap((res) => {
        if (res.data?.user) {
          this.currentUser.set(res.data.user);
        }
      })
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {},
      error: () => {},
    });
    this.clearToken();
    this.router.navigate(['/auth/login']);
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    const current = this.currentUser();
    if (!current) return false;
    if (Array.isArray(role)) {
      return role.includes(current.role);
    }
    return current.role === role;
  }
}
