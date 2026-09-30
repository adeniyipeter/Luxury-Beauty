import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Service } from '../../../core/models';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="service-card card card-hover">
      <div class="card-image-wrap">
        <img
          [src]="service.imageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'"
          [alt]="service.name"
          class="card-img"
          loading="lazy"
        />
        <span *ngIf="service.category" class="category-pill">{{ service.category.name }}</span>
      </div>

      <div class="card-body">
        <div class="meta-row">
          <span class="duration">
            <i class="fa-regular fa-clock"></i> {{ service.durationMinutes }} mins
          </span>
          <span class="price">₦{{ service.price | number:'1.0-0' }}</span>
        </div>

        <h3 class="service-title">
          <a [routerLink]="['/services', service.slug || service.id]">{{ service.name }}</a>
        </h3>

        <p class="service-desc">{{ service.description }}</p>

        <div *ngIf="service.isDisclaimerRequired" class="disclaimer-alert">
          <i class="fa-solid fa-circle-info"></i> Consultation & waiver required
        </div>

        <div class="card-footer">
          <a [routerLink]="['/services', service.slug || service.id]" class="btn btn-ghost btn-sm">
            View Details
          </a>
          <button (click)="onBook()" class="btn btn-accent btn-sm">
            Book Now <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .service-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .card-image-wrap {
      position: relative;
      width: 100%;
      height: 220px;
      overflow: hidden;

      .card-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      .category-pill {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: rgba(43, 33, 30, 0.85);
        backdrop-filter: blur(4px);
        color: #FFFFFF;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.3rem 0.75rem;
        border-radius: var(--radius-full);
      }
    }

    .service-card:hover .card-img {
      transform: scale(1.05);
    }

    .card-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;

      .duration {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
        display: flex;
        align-items: center;
        gap: 0.35rem;

        i {
          color: var(--color-accent);
        }
      }

      .price {
        font-family: var(--font-serif);
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-primary);
      }
    }

    .service-title {
      font-size: 1.2rem;
      margin-bottom: 0.6rem;
      line-height: 1.35;

      a:hover {
        color: var(--color-accent);
      }
    }

    .service-desc {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
      margin-bottom: 1.25rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex-grow: 1;
    }

    .disclaimer-alert {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      color: var(--color-warning);
      background-color: var(--color-warning-bg);
      padding: 0.4rem 0.65rem;
      border-radius: var(--radius-sm);
      margin-bottom: 1rem;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
      margin-top: auto;
    }
  `],
})
export class ServiceCardComponent {
  @Input({ required: true }) service!: Service;
  @Output() book = new EventEmitter<Service>();

  onBook() {
    this.book.emit(this.service);
  }
}
