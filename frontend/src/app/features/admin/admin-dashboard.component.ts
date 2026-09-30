import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { AuthService } from '@core/services/auth.service';
import { Appointment, Service, ServiceCategory, DashboardMetrics } from '@core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-dashboard-page">
      <div class="container">
        <!-- Header -->
        <div class="admin-topbar card">
          <div>
            <span class="badge badge-primary">Operations & Management</span>
            <h1>Salon Administration Console</h1>
            <p>Real-time booking ledger, staff orchestration, and studio service catalog.</p>
          </div>
          <div class="current-admin-pill" *ngIf="auth.currentUser() as u">
            <i class="fa-solid fa-user-shield"></i>
            <span>{{ u.firstName }} {{ u.lastName }} (Admin)</span>
          </div>
        </div>

        <div *ngIf="notice" class="alert alert-success">
          <i class="fa-solid fa-circle-check"></i> {{ notice }}
        </div>

        <!-- Metric KPI Cards -->
        <div class="kpi-grid grid-4" *ngIf="metrics() as m">
          <div class="kpi-card card">
            <span class="kpi-label">Today's Bookings</span>
            <div class="kpi-val">{{ m.todayAppointments }}</div>
            <span class="kpi-sub">{{ m.upcomingAppointments }} upcoming</span>
          </div>

          <div class="kpi-card card">
            <span class="kpi-label">Total Revenue</span>
            <div class="kpi-val text-accent">₦{{ m.totalRevenue | number:'1.0-0' }}</div>
            <span class="kpi-sub">Completed & paid</span>
          </div>

          <div class="kpi-card card">
            <span class="kpi-label">Active Clients</span>
            <div class="kpi-val">{{ m.totalCustomers }}</div>
            <span class="kpi-sub">Registered accounts</span>
          </div>

          <div class="kpi-card card">
            <span class="kpi-label">Salon Specialists</span>
            <div class="kpi-val">{{ m.totalStaff }}</div>
            <span class="kpi-sub">Active staff members</span>
          </div>
        </div>

        <!-- Admin Nav Tabs -->
        <div class="admin-nav-tabs">
          <button [class.active]="tab === 'appointments'" (click)="tab = 'appointments'">
            <i class="fa-regular fa-calendar-check"></i> Appointments Ledger
          </button>
          <button [class.active]="tab === 'services'" (click)="tab = 'services'">
            <i class="fa-solid fa-list-check"></i> Service Catalog ({{ services().length }})
          </button>
          <button [class.active]="tab === 'gallery'" (click)="tab = 'gallery'">
            <i class="fa-regular fa-image"></i> Lookbook & Gallery
          </button>
          <button [class.active]="tab === 'settings'" (click)="tab = 'settings'">
            <i class="fa-solid fa-sliders"></i> Studio Settings
          </button>
        </div>

        <!-- ================= TAB: APPOINTMENTS LEDGER ================= -->
        <div *ngIf="tab === 'appointments'" class="admin-pane">
          <div class="table-card card">
            <div class="pane-header">
              <h2>All Client Bookings</h2>
              <div class="filter-controls">
                <select class="form-control" [(ngModel)]="statusFilter" (change)="loadAppointments()">
                  <option value="">All Statuses</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <table class="dash-table">
              <thead>
                <tr>
                  <th>Ref #</th>
                  <th>Client</th>
                  <th>Treatment</th>
                  <th>Specialist</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let apt of appointments()">
                  <td class="ref-cell">{{ apt.appointmentNumber }}</td>
                  <td>
                    <strong>{{ apt.customer?.firstName }} {{ apt.customer?.lastName }}</strong>
                    <div class="text-muted text-xs">{{ apt.customer?.phone || apt.customer?.email }}</div>
                  </td>
                  <td>{{ apt.service?.name }}</td>
                  <td>{{ apt.staff?.user?.firstName }} {{ apt.staff?.user?.lastName }}</td>
                  <td>{{ apt.date }} &bull; {{ apt.startTime }}</td>
                  <td>₦{{ apt.price | number:'1.0-0' }}</td>
                  <td>
                    <span class="status-pill status-{{ apt.status.toLowerCase() }}">{{ apt.status }}</span>
                  </td>
                  <td>
                    <div class="admin-btn-group">
                      <button
                        *ngIf="apt.status === 'CONFIRMED' || apt.status === 'IN_PROGRESS'"
                        (click)="markComplete(apt)"
                        class="btn btn-sm btn-outline text-success"
                        title="Mark Completed"
                      >
                        <i class="fa-solid fa-check"></i>
                      </button>
                      <button
                        *ngIf="apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED'"
                        (click)="cancelAppointment(apt)"
                        class="btn btn-sm btn-ghost text-danger"
                        title="Cancel"
                      >
                        <i class="fa-solid fa-ban"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ================= TAB: SERVICES CATALOG ================= -->
        <div *ngIf="tab === 'services'" class="admin-pane">
          <div class="card p-4 mb-4">
            <div class="pane-header">
              <h2>Add New Salon Service</h2>
            </div>
            <form (ngSubmit)="createService()">
              <div class="grid-3">
                <div class="form-group">
                  <label>Category *</label>
                  <select class="form-control" [(ngModel)]="newServCategory" name="cat" required>
                    <option *ngFor="let c of categories()" [value]="c.id">{{ c.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Service Name *</label>
                  <input type="text" class="form-control" [(ngModel)]="newServName" name="name" required placeholder="e.g. Knotless Braids" />
                </div>
                <div class="form-group">
                  <label>Price (₦) *</label>
                  <input type="number" class="form-control" [(ngModel)]="newServPrice" name="price" required placeholder="25000" />
                </div>
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label>Duration (Minutes) *</label>
                  <input type="number" class="form-control" [(ngModel)]="newServDuration" name="dur" required placeholder="120" />
                </div>
                <div class="form-group">
                  <label>Image URL</label>
                  <input type="url" class="form-control" [(ngModel)]="newServImage" name="img" placeholder="https://..." />
                </div>
              </div>

              <div class="form-group">
                <label>Description *</label>
                <textarea class="form-control" rows="2" [(ngModel)]="newServDesc" name="desc" required placeholder="Service overview..."></textarea>
              </div>

              <button type="submit" [disabled]="!newServName || !newServPrice || !newServCategory" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-plus"></i> Create Service
              </button>
            </form>
          </div>

          <div class="table-card card">
            <div class="pane-header">
              <h2>Existing Services ({{ services().length }})</h2>
            </div>
            <table class="dash-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of services()">
                  <td>
                    <strong>{{ s.name }}</strong>
                    <div class="text-muted text-xs">{{ s.slug }}</div>
                  </td>
                  <td>{{ s.category?.name }}</td>
                  <td>{{ s.durationMinutes }} mins</td>
                  <td>₦{{ s.price | number:'1.0-0' }}</td>
                  <td>
                    <span class="badge" [class.badge-success]="s.isActive" [class.badge-warning]="!s.isActive">
                      {{ s.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <button (click)="toggleServiceActive(s)" class="btn btn-sm btn-ghost">
                      {{ s.isActive ? 'Deactivate' : 'Activate' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ================= TAB: GALLERY ================= -->
        <div *ngIf="tab === 'gallery'" class="admin-pane">
          <div class="card p-4 mb-4">
            <div class="pane-header">
              <h2>Add Image to Lookbook</h2>
            </div>
            <form (ngSubmit)="addGalleryImage()">
              <div class="grid-3">
                <div class="form-group">
                  <label>Title *</label>
                  <input type="text" class="form-control" [(ngModel)]="newGalTitle" name="title" required placeholder="e.g. Bohemian Goddess Braids" />
                </div>
                <div class="form-group">
                  <label>Category *</label>
                  <select class="form-control" [(ngModel)]="newGalCategory" name="cat" required>
                    <option value="Hair">Hair</option>
                    <option value="Nails">Nails</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Bridal">Bridal</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Image URL *</label>
                  <input type="url" class="form-control" [(ngModel)]="newGalUrl" name="url" required placeholder="https://images.unsplash.com/..." />
                </div>
              </div>

              <div class="form-group">
                <label>Description</label>
                <input type="text" class="form-control" [(ngModel)]="newGalDesc" name="desc" placeholder="Details about this look..." />
              </div>

              <button type="submit" [disabled]="!newGalTitle || !newGalUrl" class="btn btn-accent btn-sm">
                <i class="fa-solid fa-cloud-arrow-up"></i> Upload Lookbook Item
              </button>
            </form>
          </div>
        </div>

        <!-- ================= TAB: SETTINGS ================= -->
        <div *ngIf="tab === 'settings'" class="admin-pane">
          <div class="card p-4">
            <div class="pane-header">
              <h2>Salon Operational Settings</h2>
              <p>Configure studio name, operating hours, phone, and address.</p>
            </div>

            <form (ngSubmit)="saveSalonSettings()">
              <div class="grid-2">
                <div class="form-group">
                  <label>Salon Name</label>
                  <input type="text" class="form-control" [(ngModel)]="settingName" name="sname" />
                </div>
                <div class="form-group">
                  <label>Tagline</label>
                  <input type="text" class="form-control" [(ngModel)]="settingTagline" name="stagline" />
                </div>
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label>Concierge Telephone</label>
                  <input type="text" class="form-control" [(ngModel)]="settingPhone" name="sphone" />
                </div>
                <div class="form-group">
                  <label>Operating Hours</label>
                  <input type="text" class="form-control" [(ngModel)]="settingHours" name="shours" />
                </div>
              </div>

              <div class="form-group">
                <label>Studio Physical Address</label>
                <input type="text" class="form-control" [(ngModel)]="settingAddress" name="saddress" />
              </div>

              <button type="submit" class="btn btn-primary btn-md">
                Save Studio Configuration
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard-page {
      padding: 3rem 0 6rem;
    }

    .admin-topbar {
      padding: 2.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 { font-size: 2rem; margin: 0.25rem 0; }
      p { font-size: 0.95rem; }

      .current-admin-pill {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--color-surface-alt);
        padding: 0.5rem 1rem;
        border-radius: var(--radius-full);
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-primary);
      }
    }

    .kpi-grid {
      margin-bottom: 2.5rem;

      .kpi-card {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;

        .kpi-label {
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .kpi-val {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1.1;

          &.text-accent { color: var(--color-accent); }
        }

        .kpi-sub {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-top: 0.4rem;
        }
      }
    }

    .admin-nav-tabs {
      display: flex;
      gap: 0.5rem;
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

    .pane-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--color-border);

      h2 { font-size: 1.35rem; }
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
        padding: 0.9rem 1.25rem;
        background: var(--color-surface-alt);
        color: var(--color-text-secondary);
        font-size: 0.78rem;
        text-transform: uppercase;
        border-bottom: 1px solid var(--color-border);
      }

      td {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--color-border);
      }

      .ref-cell {
        font-family: monospace;
        font-size: 0.8rem;
      }
    }

    .status-pill {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;

      &.status-confirmed { background: var(--color-info-bg); color: var(--color-info); }
      &.status-completed { background: var(--color-success-bg); color: var(--color-success); }
      &.status-in_progress { background: var(--color-warning-bg); color: var(--color-warning); }
      &.status-cancelled { background: var(--color-danger-bg); color: var(--color-danger); }
    }

    .admin-btn-group {
      display: flex;
      gap: 0.4rem;
    }

    .p-4 { padding: 1.75rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .text-xs { font-size: 0.78rem; }

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
  `],
})
export class AdminDashboardComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);

  tab: 'appointments' | 'services' | 'gallery' | 'settings' = 'appointments';
  metrics = signal<DashboardMetrics | null>(null);
  appointments = signal<Appointment[]>([]);
  services = signal<Service[]>([]);
  categories = signal<ServiceCategory[]>([]);
  statusFilter = '';
  notice = '';

  // New service form inputs
  newServCategory = '';
  newServName = '';
  newServPrice: number | null = null;
  newServDuration = 60;
  newServImage = '';
  newServDesc = '';

  // New gallery image
  newGalTitle = '';
  newGalCategory = 'Hair';
  newGalUrl = '';
  newGalDesc = '';

  // Salon settings
  settingName = 'Veya Beauty Studio';
  settingTagline = 'Beautiful Hair. Beautiful You.';
  settingPhone = '+234 801 234 5678';
  settingHours = 'Mon - Sat: 9:00 AM - 7:00 PM | Sun: 12:00 PM - 6:00 PM';
  settingAddress = '14 Victoria Island Boulevard, Lagos, Nigeria';

  ngOnInit() {
    this.loadDashboard();
    this.loadAppointments();
    this.loadCatalog();
    this.loadSettings();
  }

  loadDashboard() {
    this.api.getDashboardMetrics().subscribe({
      next: (res) => this.metrics.set(res.data || null),
    });
  }

  loadAppointments() {
    this.api.getAppointments({ status: this.statusFilter }).subscribe({
      next: (res) => this.appointments.set(res.data?.appointments || []),
    });
  }

  loadCatalog() {
    this.api.getCategories().subscribe({
      next: (res) => {
        const cats = res.data?.categories || [];
        this.categories.set(cats);
        if (cats.length > 0 && !this.newServCategory) {
          this.newServCategory = cats[0].id;
        }
      },
    });

    this.api.getServices().subscribe({
      next: (res) => this.services.set(res.data?.services || []),
    });
  }

  loadSettings() {
    this.api.getSettings().subscribe({
      next: (res) => {
        const map = res.data?.map || {};
        if (map['salon_name']) this.settingName = map['salon_name'];
        if (map['salon_tagline']) this.settingTagline = map['salon_tagline'];
        if (map['salon_phone']) this.settingPhone = map['salon_phone'];
        if (map['salon_hours']) this.settingHours = map['salon_hours'];
        if (map['salon_address']) this.settingAddress = map['salon_address'];
      },
    });
  }

  markComplete(apt: Appointment) {
    this.api.updateAppointmentStatus(apt.id, 'COMPLETED').subscribe({
      next: () => {
        this.notice = `Appointment ${apt.appointmentNumber} marked as completed.`;
        this.loadAppointments();
        this.loadDashboard();
      },
    });
  }

  cancelAppointment(apt: Appointment) {
    this.api.cancelAppointment(apt.id, 'Admin cancellation').subscribe({
      next: () => {
        this.notice = `Appointment ${apt.appointmentNumber} has been cancelled.`;
        this.loadAppointments();
        this.loadDashboard();
      },
    });
  }

  createService() {
    if (!this.newServName || !this.newServPrice || !this.newServCategory) return;
    this.api
      .createService({
        categoryId: this.newServCategory,
        name: this.newServName,
        price: Number(this.newServPrice),
        durationMinutes: Number(this.newServDuration),
        imageUrl: this.newServImage,
        description: this.newServDesc,
      })
      .subscribe({
        next: () => {
          this.notice = `Service "${this.newServName}" created successfully!`;
          this.newServName = '';
          this.newServPrice = null;
          this.newServDesc = '';
          this.newServImage = '';
          this.loadCatalog();
        },
      });
  }

  toggleServiceActive(s: Service) {
    this.api.updateService(s.id, { isActive: !s.isActive }).subscribe({
      next: () => {
        this.notice = `Service "${s.name}" status updated.`;
        this.loadCatalog();
      },
    });
  }

  addGalleryImage() {
    if (!this.newGalTitle || !this.newGalUrl) return;
    this.api
      .createGalleryImage({
        title: this.newGalTitle,
        category: this.newGalCategory,
        imageUrl: this.newGalUrl,
        description: this.newGalDesc,
      })
      .subscribe({
        next: () => {
          this.notice = 'Lookbook image added!';
          this.newGalTitle = '';
          this.newGalUrl = '';
          this.newGalDesc = '';
        },
      });
  }

  saveSalonSettings() {
    this.api.updateSetting('salon_name', this.settingName).subscribe();
    this.api.updateSetting('salon_tagline', this.settingTagline).subscribe();
    this.api.updateSetting('salon_phone', this.settingPhone).subscribe();
    this.api.updateSetting('salon_hours', this.settingHours).subscribe();
    this.api.updateSetting('salon_address', this.settingAddress).subscribe({
      next: () => {
        this.notice = 'Salon configurations saved.';
      },
    });
  }
}
