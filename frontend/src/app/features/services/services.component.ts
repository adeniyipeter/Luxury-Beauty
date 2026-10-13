import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { BookingStateService } from '@core/services/booking.service';
import { Service, ServiceCategory } from '@core/models';
import { ServiceCardComponent } from '@shared/components/service-card/service-card.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ServiceCardComponent],
  template: `
    <div class="services-page">
      <!-- Header Banner -->
      <section class="page-header">
        <div class="container text-center">
          <span class="badge badge-accent">Menu of Care</span>
          <h1>Salon & Spa Services</h1>
          <p>
            Explore our curated menu of hair styling, custom lace wigs, deluxe nail artistry, and revitalizing skin treatments.
          </p>
        </div>
      </section>

      <!-- Search & Filters -->
      <section class="filter-section">
        <div class="container">
          <div class="filter-bar">
            <!-- Category Pills -->
            <div class="category-pills">
              <button
                class="pill-btn"
                [class.active]="selectedCategorySlug() === 'all'"
                (click)="selectCategory('all')"
              >
                All Services
              </button>
              <button
                *ngFor="let cat of categories()"
                class="pill-btn"
                [class.active]="selectedCategorySlug() === cat.slug"
                (click)="selectCategory(cat.slug)"
              >
                {{ cat.name }}
              </button>
            </div>

            <!-- Search Input -->
            <div class="search-input-wrap">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                class="form-control search-input"
                placeholder="Search services (e.g. Braids, Facial, Pedicure)..."
                [(ngModel)]="searchQuery"
              />
              <button *ngIf="searchQuery" (click)="searchQuery = ''" class="clear-search-btn">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Grid -->
      <section class="services-content-section">
        <div class="container">
          <!-- Active filter notice -->
          <div class="result-count">
            <span>Showing <strong>{{ filteredServices().length }}</strong> treatments</span>
            <span *ngIf="selectedCategoryName()" class="active-category-tag">
              in {{ selectedCategoryName() }}
            </span>
          </div>

          <!-- Services Grid -->
          <div *ngIf="filteredServices().length > 0; else noServices" class="services-grid grid-3">
            <app-service-card
              *ngFor="let service of filteredServices()"
              [service]="service"
              (book)="onBook(service)"
            ></app-service-card>
          </div>

          <!-- Empty State -->
          <ng-template #noServices>
            <div class="empty-state card">
              <div class="empty-icon"><i class="fa-regular fa-calendar-xmark"></i></div>
              <h3>No treatments found</h3>
              <p>We couldn't find any services matching your current filters or search term.</p>
              <button (click)="resetFilters()" class="btn btn-outline btn-sm">Clear All Filters</button>
            </div>
          </ng-template>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(180deg, #FFFFFF 0%, var(--color-bg) 100%);
      padding: 2.75rem 0 2rem;
      border-bottom: 1px solid var(--color-border);

      @media (min-width: 768px) {
        padding: 4rem 0 3rem;
      }

      h1 {
        margin: 0.5rem 0;
      }

      p {
        font-size: 1rem;
        max-width: 600px;
        margin: 0 auto;

        @media (min-width: 640px) {
          font-size: 1.1rem;
        }
      }
    }

    .filter-section {
      padding: 1.25rem 0;
      background: #FFFFFF;
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 68px;
      z-index: 100;

      @media (min-width: 900px) {
        top: 76px;
        padding: 1.75rem 0;
      }
    }

    .filter-bar {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
      }
    }

    .category-pills {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
      -webkit-overflow-scrolling: touch;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .pill-btn {
        background: var(--color-surface-alt);
        border: 1px solid var(--color-border);
        color: var(--color-text-primary);
        font-family: var(--font-sans);
        font-size: 0.88rem;
        font-weight: 500;
        padding: 0.45rem 1rem;
        border-radius: var(--radius-full);
        cursor: pointer;
        white-space: nowrap;
        transition: var(--transition);
        min-height: 38px;

        &:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        &.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: #FFFFFF;
        }
      }
    }

    .search-input-wrap {
      position: relative;
      width: 100%;

      @media (min-width: 768px) {
        width: 300px;
        flex-shrink: 0;
      }

      .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-secondary);
        font-size: 0.9rem;
      }

      .search-input {
        padding-left: 2.5rem;
        padding-right: 2.2rem;
        border-radius: var(--radius-full);
        font-size: 0.9rem;
        width: 100%;
      }

      .clear-search-btn {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .services-content-section {
      padding: 2rem 0 4rem;

      @media (min-width: 768px) {
        padding: 3rem 0 5rem;
      }
    }

    .result-count {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      color: var(--color-text-secondary);

      strong {
        color: var(--color-primary);
      }

      .active-category-tag {
        color: var(--color-accent);
        font-weight: 500;
      }
    }

    .empty-state {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 500px;
      margin: 2rem auto;

      .empty-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: var(--color-surface-alt);
        color: var(--color-text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
        margin-bottom: 1.25rem;
      }

      h3 {
        margin-bottom: 0.5rem;
      }

      p {
        margin-bottom: 1.5rem;
        font-size: 0.95rem;
      }
    }

    @media (max-width: 768px) {
      .filter-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-input-wrap {
        width: 100%;
      }
    }
  `],
})
export class ServicesComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingState = inject(BookingStateService);

  categories = signal<ServiceCategory[]>([]);
  services = signal<Service[]>([]);
  selectedCategorySlug = signal<string>('all');
  searchQuery = '';

  selectedCategoryName = computed(() => {
    const slug = this.selectedCategorySlug();
    if (slug === 'all') return '';
    const cat = this.categories().find((c) => c.slug === slug);
    return cat ? cat.name : '';
  });

  filteredServices = computed(() => {
    let list = this.services();
    const slug = this.selectedCategorySlug();
    const query = this.searchQuery.toLowerCase().trim();

    if (slug !== 'all') {
      const cat = this.categories().find((c) => c.slug === slug);
      if (cat) {
        list = list.filter((s) => s.categoryId === cat.id);
      }
    }

    if (query) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }

    return list;
  });

  ngOnInit() {
    this.api.getCategories().subscribe({
      next: (res) => this.categories.set(res.data?.categories || []),
    });

    this.api.getServices({ isActive: true }).subscribe({
      next: (res) => this.services.set(res.data?.services || []),
    });

    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategorySlug.set(params['category']);
      }
    });
  }

  selectCategory(slug: string) {
    this.selectedCategorySlug.set(slug);
  }

  resetFilters() {
    this.selectedCategorySlug.set('all');
    this.searchQuery = '';
  }

  onBook(service: Service) {
    this.bookingState.setService(service);
    this.bookingState.currentStep.set(2);
    this.router.navigate(['/booking']);
  }
}
