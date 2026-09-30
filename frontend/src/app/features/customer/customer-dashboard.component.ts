import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AuthService } from '@core/services/auth.service';
import { Appointment, Notification } from '@core/models';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="customer-dashboard-page">
      <div class="container">
        <!-- Top Profile Welcome Banner -->
        <div class="welcome-banner card" *ngIf="auth.currentUser() as user">
          <div class="user-profile-meta">
            <img
              [src]="user.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'"
              alt="Avatar"
              class="user-avatar"
            />
            <div>
              <span class="greeting">Welcome back,</span>
              <h1>{{ user.firstName }} {{ user.lastName }}</h1>
              <p class="user-email"><i class="fa-regular fa-envelope"></i> {{ user.email }} &bull; <i class="fa-solid fa-phone"></i> {{ user.phone || 'No phone set' }}</p>
            </div>
          </div>

          <div class="stats-ribbon">
            <div class="ribbon-stat">
              <span class="num">{{ appointments().length }}</span>
              <span class="lbl">Total Bookings</span>
            </div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-stat">
              <span class="num text-accent">{{ user.customerProfile?.loyaltyPoints || 150 }}</span>
              <span class="lbl">Loyalty Points</span>
            </div>
          </div>
        </div>

        <!-- Action Notice / Alerts -->
        <div *ngIf="actionMessage" class="alert alert-success">
          <i class="fa-solid fa-circle-check"></i> {{ actionMessage }}
        </div>
        <div *ngIf="errorMessage" class="alert alert-danger">
          <i class="fa-solid fa-triangle-exclamation"></i> {{ errorMessage }}
        </div>

        <!-- Next Upcoming Appointment Hero Card -->
        <div class="upcoming-section" *ngIf="nextUpcoming() as nextApt">
          <div class="upcoming-card card">
            <div class="upcoming-badge">
              <span class="badge badge-accent">Next Scheduled Appointment</span>
              <span class="ref-code">Ref: {{ nextApt.appointmentNumber }}</span>
            </div>

            <div class="upcoming-main">
              <div class="apt-time-badge">
                <span class="month">{{ nextApt.date }}</span>
                <span class="time">{{ nextApt.startTime }}</span>
              </div>

              <div class="apt-info">
                <h2>{{ nextApt.service?.name }}</h2>
                <div class="staff-line">
                  <i class="fa-solid fa-scissors"></i>
                  Specialist: <strong>{{ nextApt.staff?.user?.firstName }} {{ nextApt.staff?.user?.lastName }}</strong> ({{ nextApt.staff?.title }})
                </div>
                <div class="meta-line">
                  <span><i class="fa-regular fa-clock"></i> {{ nextApt.durationMinutes }} mins</span>
                  <span><i class="fa-solid fa-tag"></i> ₦{{ nextApt.price | number:'1.0-0' }}</span>
                  <span class="status-pill status-{{ nextApt.status.toLowerCase() }}">{{ nextApt.status }}</span>
                </div>
              </div>

              <div class="apt-actions">
                <button (click)="openReschedule(nextApt)" class="btn btn-outline btn-sm">
                  <i class="fa-regular fa-calendar-days"></i> Reschedule
                </button>
                <button (click)="cancelAppointment(nextApt)" class="btn btn-ghost btn-sm text-danger">
                  <i class="fa-solid fa-xmark"></i> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Dashboard Tabs: Appointments, Notifications, Profile -->
        <div class="dash-tabs-bar">
          <button [class.active]="activeTab === 'appointments'" (click)="activeTab = 'appointments'">
            <i class="fa-regular fa-calendar-check"></i> My Appointments ({{ appointments().length }})
          </button>
          <button [class.active]="activeTab === 'notifications'" (click)="activeTab = 'notifications'; loadNotifications()">
            <i class="fa-regular fa-bell"></i> In-App Updates ({{ notifications().length }})
          </button>
          <button [class.active]="activeTab === 'profile'" (click)="activeTab = 'profile'">
            <i class="fa-regular fa-user"></i> Profile Settings
          </button>
          <a routerLink="/booking" class="btn btn-accent btn-sm book-new-btn">
            <i class="fa-solid fa-plus"></i> Book New Service
          </a>
        </div>

        <!-- ================= APPOINTMENTS TAB ================= -->
        <div *ngIf="activeTab === 'appointments'" class="tab-content">
          <div *ngIf="appointments().length > 0; else noApts" class="appointments-table-card card">
            <table class="dash-table">
              <thead>
                <tr>
                  <th>Ref #</th>
                  <th>Service</th>
                  <th>Specialist</th>
                  <th>Date & Time</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let apt of appointments()">
                  <td class="ref-cell">{{ apt.appointmentNumber }}</td>
                  <td class="font-semibold">{{ apt.service?.name }}</td>
                  <td>{{ apt.staff?.user?.firstName }} {{ apt.staff?.user?.lastName }}</td>
                  <td>
                    <div>{{ apt.date }}</div>
                    <small class="text-muted">{{ apt.startTime }} ({{ apt.durationMinutes }}m)</small>
                  </td>
                  <td>₦{{ apt.price | number:'1.0-0' }}</td>
                  <td>
                    <span class="status-pill status-{{ apt.status.toLowerCase() }}">{{ apt.status }}</span>
                  </td>
                  <td>
                    <div class="row-actions">
                      <!-- If completed & not reviewed yet, allow review -->
                      <button
                        *ngIf="apt.status === 'COMPLETED' && !apt.review"
                        (click)="openReviewModal(apt)"
                        class="btn btn-sm btn-outline review-btn"
                      >
                        <i class="fa-regular fa-star"></i> Review
                      </button>
                      <span *ngIf="apt.status === 'COMPLETED' && apt.review" class="reviewed-tag">
                        ★ {{ apt.review.rating }}/5
                      </span>

                      <!-- If active, allow reschedule or cancel -->
                      <ng-container *ngIf="apt.status === 'CONFIRMED' || apt.status === 'PENDING'">
                        <button (click)="openReschedule(apt)" class="icon-btn" title="Reschedule">
                          <i class="fa-regular fa-calendar-days"></i>
                        </button>
                        <button (click)="cancelAppointment(apt)" class="icon-btn danger" title="Cancel Booking">
                          <i class="fa-solid fa-xmark"></i>
                        </button>
                      </ng-container>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #noApts>
            <div class="empty-state-box card text-center">
              <i class="fa-regular fa-calendar-xmark empty-icon"></i>
              <h3>No appointments yet</h3>
              <p>You haven't scheduled any beauty or hair treatments yet.</p>
              <a routerLink="/booking" class="btn btn-accent btn-md">Book Your First Treatment</a>
            </div>
          </ng-template>
        </div>

        <!-- ================= NOTIFICATIONS TAB ================= -->
        <div *ngIf="activeTab === 'notifications'" class="tab-content">
          <div class="card notif-card">
            <h3>Recent Updates & Alerts</h3>
            <div *ngIf="notifications().length > 0; else noNotifs" class="notif-list">
              <div *ngFor="let n of notifications()" class="notif-item" [class.unread]="!n.isRead">
                <div class="notif-icon">
                  <i class="fa-solid fa-bell"></i>
                </div>
                <div class="notif-body">
                  <h4>{{ n.title }}</h4>
                  <p>{{ n.message }}</p>
                  <small>{{ n.createdAt | date:'medium' }}</small>
                </div>
                <button *ngIf="!n.isRead" (click)="markRead(n)" class="btn btn-ghost btn-sm">
                  Mark Read
                </button>
              </div>
            </div>
            <ng-template #noNotifs>
              <p class="text-muted text-center py-4">No notifications at this time.</p>
            </ng-template>
          </div>
        </div>

        <!-- ================= PROFILE TAB ================= -->
        <div *ngIf="activeTab === 'profile'" class="tab-content">
          <div class="card profile-card" *ngIf="auth.currentUser() as user">
            <h3>Profile & Preferences</h3>
            <form (ngSubmit)="saveProfile()">
              <div class="grid-2">
                <div class="form-group">
                  <label>First Name</label>
                  <input type="text" class="form-control" [(ngModel)]="profFirstName" name="firstName" />
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" class="form-control" [(ngModel)]="profLastName" name="lastName" />
                </div>
              </div>

              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" class="form-control" [(ngModel)]="profPhone" name="phone" />
              </div>

              <div class="form-group">
                <label>Address</label>
                <input type="text" class="form-control" [(ngModel)]="profAddress" name="address" placeholder="e.g. Lekki Phase 1, Lagos" />
              </div>

              <button type="submit" class="btn btn-primary btn-md">Save Changes</button>
            </form>
          </div>
        </div>
      </div>

      <!-- ================= RESCHEDULE MODAL ================= -->
      <div class="modal-backdrop" *ngIf="rescheduleModalOpen">
        <div class="modal-card card">
          <div class="modal-header">
            <h3>Reschedule Appointment</h3>
            <button (click)="rescheduleModalOpen = false" class="close-btn"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body" *ngIf="targetApt">
            <p>Rescheduling <strong>{{ targetApt.service?.name }}</strong> (Ref: {{ targetApt.appointmentNumber }})</p>

            <div class="form-group mt-3">
              <label>Select New Date</label>
              <input type="date" class="form-control" [(ngModel)]="newDate" [min]="minDate" (change)="loadRescheduleSlots()" />
            </div>

            <div class="form-group">
              <label>Select New Time</label>
              <select class="form-control" [(ngModel)]="newTime">
                <option value="">-- Choose available time --</option>
                <option *ngFor="let s of rescheduleSlots" [value]="s.time" [disabled]="!s.isAvailable">
                  {{ s.time }} {{ s.isAvailable ? '' : ' (Booked)' }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="rescheduleModalOpen = false" class="btn btn-ghost btn-sm">Cancel</button>
            <button [disabled]="!newDate || !newTime" (click)="submitReschedule()" class="btn btn-accent btn-sm">
              Confirm Reschedule
            </button>
          </div>
        </div>
      </div>

      <!-- ================= REVIEW MODAL ================= -->
      <div class="modal-backdrop" *ngIf="reviewModalOpen">
        <div class="modal-card card">
          <div class="modal-header">
            <h3>Review Your Treatment</h3>
            <button (click)="reviewModalOpen = false" class="close-btn"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body" *ngIf="targetApt">
            <p>How was your experience for <strong>{{ targetApt.service?.name }}</strong> with {{ targetApt.staff?.user?.firstName }}?</p>

            <div class="rating-picker my-3">
              <button
                *ngFor="let star of [1,2,3,4,5]"
                type="button"
                class="star-btn"
                [class.active]="reviewRating >= star"
                (click)="reviewRating = star"
              >
                ★
              </button>
            </div>

            <div class="form-group">
              <label>Your Feedback / Review *</label>
              <textarea
                class="form-control"
                rows="4"
                [(ngModel)]="reviewComment"
                placeholder="Share your thoughts about your hair, the salon atmosphere, or the specialist..."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="reviewModalOpen = false" class="btn btn-ghost btn-sm">Cancel</button>
            <button [disabled]="!reviewComment" (click)="submitReview()" class="btn btn-accent btn-sm">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-dashboard-page {
      padding: 3rem 0 6rem;
    }

    .welcome-banner {
      padding: 2.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      background: linear-gradient(135deg, #FFFFFF 0%, var(--color-surface-alt) 100%);

      .user-profile-meta {
        display: flex;
        align-items: center;
        gap: 1.5rem;

        .user-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-accent);
        }

        .greeting {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        h1 {
          font-size: 2rem;
          margin: 0.1rem 0 0.35rem;
        }

        .user-email {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
        }
      }

      .stats-ribbon {
        display: flex;
        align-items: center;
        gap: 2rem;
        background: #FFFFFF;
        padding: 1rem 1.75rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);

        .ribbon-stat {
          display: flex;
          flex-direction: column;
          align-items: center;

          .num {
            font-family: var(--font-serif);
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--color-primary);

            &.text-accent { color: var(--color-accent); }
          }

          .lbl {
            font-size: 0.78rem;
            color: var(--color-text-secondary);
            text-transform: uppercase;
          }
        }

        .ribbon-divider {
          width: 1px;
          height: 36px;
          background: var(--color-border);
        }
      }
    }

    .upcoming-card {
      padding: 2rem;
      margin-bottom: 2.5rem;
      border-left: 4px solid var(--color-accent);

      .upcoming-badge {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;

        .ref-code {
          font-family: monospace;
          font-size: 0.88rem;
          color: var(--color-text-secondary);
        }
      }

      .upcoming-main {
        display: flex;
        align-items: center;
        gap: 2rem;

        .apt-time-badge {
          background: var(--color-surface-alt);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 110px;

          .month { font-size: 0.82rem; font-weight: 600; color: var(--color-text-secondary); }
          .time { font-family: var(--font-serif); font-size: 1.4rem; font-weight: 700; color: var(--color-primary); }
        }

        .apt-info {
          flex-grow: 1;

          h2 { font-size: 1.5rem; margin-bottom: 0.4rem; }
          .staff-line { font-size: 0.95rem; color: var(--color-text-secondary); margin-bottom: 0.6rem; i { color: var(--color-accent); margin-right: 0.4rem; } }
          .meta-line {
            display: flex;
            align-items: center;
            gap: 1.25rem;
            font-size: 0.88rem;
            color: var(--color-text-secondary);
            i { color: var(--color-accent); margin-right: 0.3rem; }
          }
        }

        .apt-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
      }
    }

    .dash-tabs-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 0.75rem;

      button {
        background: transparent;
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: var(--radius-sm);
        font-family: var(--font-sans);
        font-size: 0.92rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: var(--transition);

        &:hover { color: var(--color-primary); }
        &.active {
          background: #FFFFFF;
          color: var(--color-primary);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }
      }

      .book-new-btn {
        margin-left: auto;
      }
    }

    /* Table */
    .appointments-table-card {
      overflow-x: auto;
    }

    .dash-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.92rem;

      th {
        padding: 1rem 1.25rem;
        background: var(--color-surface-alt);
        color: var(--color-text-secondary);
        font-weight: 600;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid var(--color-border);
      }

      td {
        padding: 1.1rem 1.25rem;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text-primary);
      }

      .ref-cell {
        font-family: monospace;
        font-size: 0.82rem;
        color: var(--color-text-secondary);
      }
    }

    .status-pill {
      display: inline-block;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;

      &.status-confirmed { background: var(--color-info-bg); color: var(--color-info); }
      &.status-completed { background: var(--color-success-bg); color: var(--color-success); }
      &.status-cancelled { background: var(--color-danger-bg); color: var(--color-danger); }
      &.status-in_progress { background: var(--color-warning-bg); color: var(--color-warning); }
      &.status-pending { background: #E0E0E0; color: #616161; }
    }

    .row-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .icon-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--color-surface-alt);
        border: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--color-text-secondary);
        transition: var(--transition);

        &:hover { color: var(--color-primary); border-color: var(--color-primary); }
        &.danger:hover { color: var(--color-danger); border-color: var(--color-danger); }
      }

      .reviewed-tag {
        font-size: 0.8rem;
        font-weight: 600;
        color: #FFB300;
      }
    }

    .notif-card, .profile-card {
      padding: 2.5rem;
      h3 { margin-bottom: 1.5rem; }
    }

    .notif-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .notif-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        border-radius: var(--radius-sm);
        background: var(--color-surface-alt);

        &.unread {
          border-left: 3px solid var(--color-accent);
          background: #FFFFFF;
          box-shadow: var(--shadow-sm);
        }

        .notif-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-accent-light);
          color: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-body {
          flex-grow: 1;
          h4 { font-size: 0.95rem; margin-bottom: 0.2rem; }
          p { font-size: 0.88rem; margin-bottom: 0.35rem; }
          small { color: var(--color-text-muted); font-size: 0.78rem; }
        }
      }
    }

    .empty-state-box {
      padding: 4rem 2rem;
      .empty-icon { font-size: 3rem; color: var(--color-text-muted); margin-bottom: 1rem; }
      h3 { margin-bottom: 0.4rem; }
      p { margin-bottom: 1.5rem; }
    }

    /* Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(43, 33, 30, 0.7);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;

      .modal-card {
        max-width: 480px;
        width: 100%;
        padding: 2rem;

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;

          .close-btn {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: var(--color-text-secondary);
          }
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
        }
      }
    }

    .rating-picker {
      display: flex;
      gap: 0.5rem;
      .star-btn {
        background: none;
        border: none;
        font-size: 2rem;
        color: #DDD;
        cursor: pointer;
        &.active { color: #FFB300; }
      }
    }

    .alert {
      padding: 0.85rem 1.25rem;
      border-radius: var(--radius-sm);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;

      &.alert-success { background: var(--color-success-bg); color: var(--color-success); }
      &.alert-danger { background: var(--color-danger-bg); color: var(--color-danger); }
    }

    @media (max-width: 900px) {
      .welcome-banner {
        flex-direction: column;
        align-items: stretch;
        gap: 1.5rem;
      }

      .upcoming-main {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `],
})
export class CustomerDashboardComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);

  appointments = signal<Appointment[]>([]);
  notifications = signal<Notification[]>([]);
  activeTab: 'appointments' | 'notifications' | 'profile' = 'appointments';

  actionMessage = '';
  errorMessage = '';

  // Reschedule state
  rescheduleModalOpen = false;
  targetApt: Appointment | null = null;
  newDate = '';
  newTime = '';
  rescheduleSlots: any[] = [];
  minDate = new Date().toISOString().split('T')[0];

  // Review modal state
  reviewModalOpen = false;
  reviewRating = 5;
  reviewComment = '';

  // Profile inputs
  profFirstName = '';
  profLastName = '';
  profPhone = '';
  profAddress = '';

  nextUpcoming = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments().find((a) => a.date >= today && (a.status === 'CONFIRMED' || a.status === 'PENDING'));
  });

  ngOnInit() {
    this.loadAppointments();
    this.initProfileForm();
  }

  loadAppointments() {
    this.api.getAppointments().subscribe({
      next: (res) => this.appointments.set(res.data?.appointments || []),
    });
  }

  loadNotifications() {
    this.api.getNotifications().subscribe({
      next: (res) => this.notifications.set(res.data?.notifications || []),
    });
  }

  markRead(n: Notification) {
    this.api.markNotificationRead(n.id).subscribe({
      next: () => this.loadNotifications(),
    });
  }

  initProfileForm() {
    const u = this.auth.currentUser();
    if (u) {
      this.profFirstName = u.firstName;
      this.profLastName = u.lastName;
      this.profPhone = u.phone || '';
      this.profAddress = u.customerProfile?.address || '';
    }
  }

  saveProfile() {
    this.actionMessage = '';
    this.auth
      .updateProfile({
        firstName: this.profFirstName,
        lastName: this.profLastName,
        phone: this.profPhone,
        address: this.profAddress,
      })
      .subscribe({
        next: () => {
          this.actionMessage = 'Your profile settings have been updated.';
        },
      });
  }

  openReschedule(apt: Appointment) {
    this.targetApt = apt;
    this.newDate = apt.date;
    this.newTime = '';
    this.rescheduleModalOpen = true;
    this.loadRescheduleSlots();
  }

  loadRescheduleSlots() {
    if (!this.targetApt || !this.newDate) return;
    this.api.getTimeSlots(this.targetApt.serviceId, this.targetApt.staffId, this.newDate).subscribe({
      next: (res) => {
        this.rescheduleSlots = res.data?.slots || [];
      },
    });
  }

  submitReschedule() {
    if (!this.targetApt || !this.newDate || !this.newTime) return;
    this.api
      .rescheduleAppointment(this.targetApt.id, { date: this.newDate, startTime: this.newTime })
      .subscribe({
        next: () => {
          this.rescheduleModalOpen = false;
          this.actionMessage = 'Appointment rescheduled successfully!';
          this.loadAppointments();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to reschedule appointment.';
        },
      });
  }

  cancelAppointment(apt: Appointment) {
    if (confirm(`Are you sure you want to cancel appointment ${apt.appointmentNumber}?`)) {
      this.api.cancelAppointment(apt.id, 'Cancelled by customer via dashboard').subscribe({
        next: () => {
          this.actionMessage = `Appointment ${apt.appointmentNumber} has been cancelled.`;
          this.loadAppointments();
        },
      });
    }
  }

  openReviewModal(apt: Appointment) {
    this.targetApt = apt;
    this.reviewRating = 5;
    this.reviewComment = '';
    this.reviewModalOpen = true;
  }

  submitReview() {
    if (!this.targetApt || !this.reviewComment) return;
    this.api
      .createReview({
        appointmentId: this.targetApt.id,
        rating: this.reviewRating,
        comment: this.reviewComment,
      })
      .subscribe({
        next: () => {
          this.reviewModalOpen = false;
          this.actionMessage = 'Thank you! Your review has been submitted.';
          this.loadAppointments();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Could not submit review.';
        },
      });
  }
}
