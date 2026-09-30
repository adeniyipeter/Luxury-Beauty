import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { AuthService } from '@core/services/auth.service';
import { Appointment, StaffProfile } from '@core/models';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="staff-dashboard-page">
      <div class="container">
        <!-- Top Specialist Banner -->
        <div class="staff-banner card" *ngIf="auth.currentUser() as user">
          <div class="staff-identity">
            <img
              [src]="user.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'"
              alt="Staff photo"
              class="staff-avatar"
            />
            <div>
              <span class="portal-badge badge badge-accent">Specialist Portal</span>
              <h1>{{ user.firstName }} {{ user.lastName }}</h1>
              <p class="staff-title">{{ user.staffProfile?.title || 'Senior Beauty Artist' }} &bull; <strong>★ {{ user.staffProfile?.rating || '5.0' }}</strong></p>
            </div>
          </div>

          <div class="schedule-summary">
            <div class="stat-box">
              <span class="val">{{ todayAppointments().length }}</span>
              <span class="lbl">Appointments Today</span>
            </div>
            <div class="stat-box">
              <span class="val">{{ upcomingAppointments().length }}</span>
              <span class="lbl">Upcoming</span>
            </div>
          </div>
        </div>

        <div *ngIf="notice" class="alert alert-success">
          <i class="fa-solid fa-circle-check"></i> {{ notice }}
        </div>

        <!-- Tabs: Assigned Appointments & Availability Schedule -->
        <div class="staff-tabs">
          <button [class.active]="activeTab === 'appointments'" (click)="activeTab = 'appointments'">
            <i class="fa-regular fa-calendar-check"></i> Assigned Appointments ({{ appointments().length }})
          </button>
          <button [class.active]="activeTab === 'availability'" (click)="activeTab = 'availability'">
            <i class="fa-regular fa-clock"></i> My Working Hours & Availability
          </button>
        </div>

        <!-- ================= APPOINTMENTS TAB ================= -->
        <div *ngIf="activeTab === 'appointments'" class="tab-pane">
          <!-- Filter Bar -->
          <div class="staff-filter-bar">
            <div class="filter-pills">
              <button [class.active]="statusFilter === 'ALL'" (click)="statusFilter = 'ALL'">All</button>
              <button [class.active]="statusFilter === 'CONFIRMED'" (click)="statusFilter = 'CONFIRMED'">Confirmed</button>
              <button [class.active]="statusFilter === 'IN_PROGRESS'" (click)="statusFilter = 'IN_PROGRESS'">In Progress</button>
              <button [class.active]="statusFilter === 'COMPLETED'" (click)="statusFilter = 'COMPLETED'">Completed</button>
            </div>
          </div>

          <div *ngIf="filteredAppointments().length > 0; else noAppointments" class="table-card card">
            <table class="dash-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Client Notes</th>
                  <th>Status</th>
                  <th>Action Controls</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let apt of filteredAppointments()">
                  <td>
                    <strong>{{ apt.customer?.firstName }} {{ apt.customer?.lastName }}</strong>
                    <div class="client-phone"><i class="fa-solid fa-phone"></i> {{ apt.customer?.phone || 'No phone' }}</div>
                    <small class="text-muted">{{ apt.customer?.email }}</small>
                  </td>
                  <td>
                    <strong>{{ apt.service?.name }}</strong>
                    <div class="text-muted">{{ apt.durationMinutes }}m &bull; ₦{{ apt.price | number:'1.0-0' }}</div>
                  </td>
                  <td>
                    <div>{{ apt.date }}</div>
                    <strong>{{ apt.startTime }} – {{ apt.endTime }}</strong>
                  </td>
                  <td>
                    <div class="client-notes-cell">{{ apt.notes || 'None' }}</div>
                  </td>
                  <td>
                    <span class="status-pill status-{{ apt.status.toLowerCase() }}">{{ apt.status }}</span>
                  </td>
                  <td>
                    <div class="status-actions-group">
                      <button
                        *ngIf="apt.status === 'CONFIRMED'"
                        (click)="updateStatus(apt, 'IN_PROGRESS')"
                        class="btn btn-sm btn-outline start-btn"
                      >
                        <i class="fa-solid fa-play"></i> Start
                      </button>

                      <button
                        *ngIf="apt.status === 'IN_PROGRESS'"
                        (click)="updateStatus(apt, 'COMPLETED')"
                        class="btn btn-sm btn-accent complete-btn"
                      >
                        <i class="fa-solid fa-check"></i> Complete
                      </button>

                      <button
                        *ngIf="apt.status === 'CONFIRMED'"
                        (click)="updateStatus(apt, 'NO_SHOW')"
                        class="btn btn-sm btn-ghost text-danger"
                      >
                        No-Show
                      </button>

                      <span *ngIf="apt.status === 'COMPLETED'" class="completed-check text-success">
                        <i class="fa-solid fa-circle-check"></i> Done
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #noAppointments>
            <div class="empty-box card text-center py-5">
              <i class="fa-regular fa-calendar-check empty-icon"></i>
              <h3>No appointments in this view</h3>
              <p>You have no bookings matching the selected status filter.</p>
            </div>
          </ng-template>
        </div>

        <!-- ================= AVAILABILITY TAB ================= -->
        <div *ngIf="activeTab === 'availability'" class="tab-pane">
          <div class="availability-card card">
            <div class="avail-header">
              <div>
                <h2>Weekly Working Hours</h2>
                <p>Define your daily shifts. The booking engine will only offer slots inside these hours.</p>
              </div>
              <button (click)="saveAvailability()" class="btn btn-primary btn-sm">
                Save Shifts
              </button>
            </div>

            <div class="shifts-table-wrap">
              <div *ngFor="let s of shifts" class="shift-row">
                <div class="day-col">
                  <label class="toggle-wrap">
                    <input type="checkbox" [(ngModel)]="s.isWorking" />
                    <span class="day-name font-semibold">{{ s.dayName }}</span>
                  </label>
                </div>

                <div class="time-inputs" *ngIf="s.isWorking; else offDuty">
                  <span>From:</span>
                  <input type="time" class="form-control time-input" [(ngModel)]="s.startTime" />
                  <span>To:</span>
                  <input type="time" class="form-control time-input" [(ngModel)]="s.endTime" />
                </div>

                <ng-template #offDuty>
                  <span class="off-duty-badge">Off Duty (Rest Day)</span>
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .staff-dashboard-page {
      padding: 3rem 0 6rem;
    }

    .staff-banner {
      padding: 2.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      background: linear-gradient(135deg, #FFFFFF 0%, #F5EFEB 100%);

      .staff-identity {
        display: flex;
        align-items: center;
        gap: 1.5rem;

        .staff-avatar {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-primary);
        }

        h1 {
          font-size: 2rem;
          margin: 0.1rem 0;
        }

        .staff-title {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
        }
      }

      .schedule-summary {
        display: flex;
        gap: 1.5rem;

        .stat-box {
          background: #FFFFFF;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid var(--color-border);

          .val {
            font-family: var(--font-serif);
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--color-primary);
          }

          .lbl {
            font-size: 0.78rem;
            color: var(--color-text-secondary);
          }
        }
      }
    }

    .staff-tabs {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 0.75rem;

      button {
        background: transparent;
        border: none;
        padding: 0.6rem 1.25rem;
        font-family: var(--font-sans);
        font-size: 0.92rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        cursor: pointer;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &.active {
          background: #FFFFFF;
          color: var(--color-primary);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }
      }
    }

    .staff-filter-bar {
      margin-bottom: 1.5rem;
      .filter-pills {
        display: flex;
        gap: 0.5rem;
        button {
          padding: 0.35rem 0.9rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: #FFFFFF;
          font-size: 0.85rem;
          cursor: pointer;
          &.active {
            background: var(--color-primary);
            color: #FFFFFF;
            border-color: var(--color-primary);
          }
        }
      }
    }

    .table-card {
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
        font-size: 0.8rem;
        text-transform: uppercase;
        border-bottom: 1px solid var(--color-border);
      }

      td {
        padding: 1.1rem 1.25rem;
        border-bottom: 1px solid var(--color-border);
      }

      .client-phone {
        font-size: 0.82rem;
        color: var(--color-accent);
      }

      .client-notes-cell {
        font-size: 0.85rem;
        max-width: 200px;
        color: var(--color-text-secondary);
      }
    }

    .status-actions-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-pill {
      display: inline-block;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;

      &.status-confirmed { background: var(--color-info-bg); color: var(--color-info); }
      &.status-completed { background: var(--color-success-bg); color: var(--color-success); }
      &.status-in_progress { background: var(--color-warning-bg); color: var(--color-warning); }
      &.status-cancelled { background: var(--color-danger-bg); color: var(--color-danger); }
      &.status-no_show { background: #ECEFF1; color: #546E7A; }
    }

    .availability-card {
      padding: 2.5rem;

      .avail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;

        h2 { font-size: 1.6rem; margin-bottom: 0.25rem; }
        p { font-size: 0.95rem; }
      }

      .shifts-table-wrap {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .shift-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: var(--color-surface-alt);
          border-radius: var(--radius-sm);

          .day-col {
            min-width: 140px;

            .toggle-wrap {
              display: flex;
              align-items: center;
              gap: 0.6rem;
              cursor: pointer;
            }
          }

          .time-inputs {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.9rem;

            .time-input {
              width: 130px;
              padding: 0.4rem 0.6rem;
            }
          }

          .off-duty-badge {
            font-size: 0.85rem;
            color: var(--color-text-muted);
            font-style: italic;
          }
        }
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
    }

    @media (max-width: 800px) {
      .staff-banner {
        flex-direction: column;
        align-items: stretch;
        gap: 1.5rem;
      }
    }
  `],
})
export class StaffDashboardComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);

  appointments = signal<Appointment[]>([]);
  activeTab: 'appointments' | 'availability' = 'appointments';
  statusFilter = 'ALL';
  notice = '';

  shifts = [
    { dayOfWeek: 1, dayName: 'Monday', startTime: '09:00', endTime: '18:00', isWorking: true },
    { dayOfWeek: 2, dayName: 'Tuesday', startTime: '09:00', endTime: '18:00', isWorking: true },
    { dayOfWeek: 3, dayName: 'Wednesday', startTime: '09:00', endTime: '18:00', isWorking: true },
    { dayOfWeek: 4, dayName: 'Thursday', startTime: '09:00', endTime: '18:00', isWorking: true },
    { dayOfWeek: 5, dayName: 'Friday', startTime: '09:00', endTime: '18:00', isWorking: true },
    { dayOfWeek: 6, dayName: 'Saturday', startTime: '09:00', endTime: '18:00', isWorking: true },
    { dayOfWeek: 0, dayName: 'Sunday', startTime: '12:00', endTime: '18:00', isWorking: false },
  ];

  todayAppointments = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments().filter((a) => a.date === today);
  });

  upcomingAppointments = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments().filter((a) => a.date >= today && a.status !== 'COMPLETED' && a.status !== 'CANCELLED');
  });

  filteredAppointments = computed(() => {
    const list = this.appointments();
    if (this.statusFilter === 'ALL') return list;
    return list.filter((a) => a.status === this.statusFilter);
  });

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.api.getAppointments().subscribe({
      next: (res) => this.appointments.set(res.data?.appointments || []),
    });
  }

  updateStatus(apt: Appointment, status: string) {
    this.api.updateAppointmentStatus(apt.id, status).subscribe({
      next: () => {
        this.notice = `Appointment ${apt.appointmentNumber} updated to ${status}.`;
        this.loadAppointments();
      },
    });
  }

  saveAvailability() {
    const user = this.auth.currentUser();
    const staffId = user?.staffProfile?.id;
    if (!staffId) return;

    this.api.setStaffAvailability(staffId, this.shifts).subscribe({
      next: () => {
        this.notice = 'Your working hours schedule has been updated.';
      },
    });
  }
}
