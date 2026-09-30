import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { BookingStateService } from '@core/services/booking.service';
import { Service, StaffProfile } from '@core/models';
import { ServiceCardComponent } from '@shared/components/service-card/service-card.component';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ServiceCardComponent],
  template: `
    <div class="service-detail-page" *ngIf="service() as s">
      <!-- Breadcrumb -->
      <div class="breadcrumb-bar">
        <div class="container">
          <a routerLink="/">Home</a>
          <span class="sep">/</span>
          <a routerLink="/services">Services</a>
          <span class="sep">/</span>
          <span class="current">{{ s.name }}</span>
        </div>
      </div>

      <!-- Main Overview -->
      <section class="detail-hero-section">
        <div class="container detail-grid">
          <!-- Image -->
          <div class="detail-image-wrap">
            <img
              [src]="s.imageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80'"
              [alt]="s.name"
              class="detail-hero-img"
            />
            <span *ngIf="s.category" class="cat-badge badge badge-accent">{{ s.category.name }}</span>
          </div>

          <!-- Info & Booking Card -->
          <div class="detail-summary">
            <h1 class="service-title">{{ s.name }}</h1>

            <div class="pricing-card card">
              <div class="price-row">
                <div>
                  <span class="price-label">Price</span>
                  <div class="price-value">₦{{ s.price | number:'1.0-0' }}</div>
                </div>
                <div class="duration-box">
                  <i class="fa-regular fa-clock"></i>
                  <span>{{ s.durationMinutes }} minutes</span>
                </div>
              </div>

              <button (click)="onBookTreatment()" class="btn btn-accent btn-lg w-100 book-btn">
                Book This Treatment <i class="fa-solid fa-calendar-check"></i>
              </button>
            </div>

            <!-- Description -->
            <div class="content-block">
              <h3>Treatment Overview</h3>
              <p>{{ s.description }}</p>
            </div>

            <!-- Disclaimer if required -->
            <div *ngIf="s.isDisclaimerRequired" class="disclaimer-box">
              <div class="disclaimer-header">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <strong>Important Clinical Notice & Consultation Requirement</strong>
              </div>
              <p>{{ s.disclaimerText || 'This treatment requires an on-site consultation to assess skin suitability. We do not use unsafe or banned chemical formulations.' }}</p>
            </div>

            <!-- Preparation & Aftercare Accordion/Cards -->
            <div class="grid-2 care-grid">
              <div class="care-card card" *ngIf="s.preparation">
                <h4><i class="fa-solid fa-sparkles"></i> Preparation</h4>
                <p>{{ s.preparation }}</p>
              </div>

              <div class="care-card card" *ngIf="s.aftercare">
                <h4><i class="fa-solid fa-heart"></i> Aftercare</h4>
                <p>{{ s.aftercare }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Available Specialists -->
      <section class="specialists-section" *ngIf="availableStaff().length > 0">
        <div class="container">
          <div class="section-header">
            <h2>Specialists For This Treatment</h2>
            <p>Our certified artists trained to deliver this exact service.</p>
          </div>

          <div class="grid-3 staff-grid">
            <div *ngFor="let staff of availableStaff()" class="staff-card card card-hover">
              <img
                [src]="staff.user.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'"
                [alt]="staff.user.firstName"
                class="staff-avatar"
              />
              <div class="staff-info">
                <h3>{{ staff.user.firstName }} {{ staff.user.lastName }}</h3>
                <span class="staff-title">{{ staff.title }}</span>
                <p class="staff-bio">{{ staff.bio }}</p>
                <div class="staff-footer">
                  <span class="rating">★ {{ staff.rating }} ({{ staff.experienceYears }} yrs exp)</span>
                  <button (click)="onBookWithStaff(staff)" class="btn btn-outline btn-sm">
                    Select Specialist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .breadcrumb-bar {
      padding: 1.25rem 0;
      background: #FFFFFF;
      border-bottom: 1px solid var(--color-border);
      font-size: 0.88rem;

      a {
        color: var(--color-text-secondary);
        &:hover { color: var(--color-accent); }
      }

      .sep {
        margin: 0 0.5rem;
        color: var(--color-text-muted);
      }

      .current {
        color: var(--color-primary);
        font-weight: 500;
      }
    }

    .detail-hero-section {
      padding: 3.5rem 0;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 3.5rem;
      align-items: start;
    }

    .detail-image-wrap {
      position: sticky;
      top: 100px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      height: 480px;

      .detail-hero-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .cat-badge {
        position: absolute;
        top: 1.25rem;
        left: 1.25rem;
      }
    }

    .detail-summary {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;

      .service-title {
        font-size: 2.4rem;
        line-height: 1.2;
      }
    }

    .pricing-card {
      padding: 1.75rem;
      background: var(--color-surface-alt);
      border-color: rgba(201, 143, 145, 0.4);

      .price-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 1.25rem;

        .price-label {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .price-value {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1;
        }

        .duration-box {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          background: #FFFFFF;
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);

          i { color: var(--color-accent); }
        }
      }

      .book-btn {
        width: 100%;
      }
    }

    .content-block {
      h3 {
        font-size: 1.25rem;
        margin-bottom: 0.6rem;
      }

      p {
        font-size: 1rem;
        line-height: 1.7;
      }
    }

    .disclaimer-box {
      background: #FFF8E1;
      border: 1px solid #FFE082;
      border-radius: var(--radius-sm);
      padding: 1.25rem;
      color: #795548;

      .disclaimer-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.4rem;
        font-size: 0.92rem;
        color: #E65100;
      }

      p {
        font-size: 0.88rem;
        color: #5D4037;
        margin: 0;
      }
    }

    .care-grid {
      margin-top: 0.5rem;

      .care-card {
        padding: 1.25rem;

        h4 {
          font-size: 1.05rem;
          margin-bottom: 0.4rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--color-primary);

          i { color: var(--color-accent); }
        }

        p {
          font-size: 0.88rem;
          margin: 0;
          line-height: 1.5;
        }
      }
    }

    .specialists-section {
      padding: 4rem 0;
      background: #FFFFFF;
      border-top: 1px solid var(--color-border);
    }

    .staff-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .staff-avatar {
        width: 100%;
        height: 220px;
        object-fit: cover;
      }

      .staff-info {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        h3 {
          font-size: 1.15rem;
          margin-bottom: 0.2rem;
        }

        .staff-title {
          font-size: 0.82rem;
          color: var(--color-accent);
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        .staff-bio {
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
          flex-grow: 1;
        }

        .staff-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.75rem;
          border-top: 1px solid var(--color-border);

          .rating {
            font-size: 0.82rem;
            font-weight: 600;
            color: #FFB300;
          }
        }
      }
    }

    @media (max-width: 900px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }

      .detail-image-wrap {
        position: static;
        height: 320px;
      }
    }
  `],
})
export class ServiceDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingState = inject(BookingStateService);

  service = signal<Service | null>(null);
  availableStaff = signal<StaffProfile[]>([]);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const idOrSlug = params['id'];
      if (idOrSlug) {
        this.loadService(idOrSlug);
      }
    });
  }

  loadService(idOrSlug: string) {
    this.api.getService(idOrSlug).subscribe({
      next: (res) => {
        if (res.data?.service) {
          const s = res.data.service;
          this.service.set(s);

          // Extract staff members
          if (s.staffMembers) {
            this.availableStaff.set(s.staffMembers.map((sm) => sm.staff));
          }
        }
      },
      error: () => this.router.navigate(['/services']),
    });
  }

  onBookTreatment() {
    const s = this.service();
    if (!s) return;
    this.bookingState.setService(s);
    this.bookingState.currentStep.set(2);
    this.router.navigate(['/booking']);
  }

  onBookWithStaff(staff: StaffProfile) {
    const s = this.service();
    if (!s) return;
    this.bookingState.setService(s);
    this.bookingState.setStaff(staff);
    this.bookingState.currentStep.set(3);
    this.router.navigate(['/booking']);
  }
}
