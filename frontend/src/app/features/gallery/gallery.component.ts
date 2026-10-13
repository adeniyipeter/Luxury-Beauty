import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { GalleryImage } from '@core/models';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="gallery-page">
      <!-- Header -->
      <section class="page-header text-center">
        <div class="container">
          <span class="badge badge-accent">Visual Portfolio</span>
          <h1>Studio Lookbook</h1>
          <p>
            Explore our curated gallery of bridal artistry, precision knotless braids, flawless lace melt wigs, and couture gel nails.
          </p>

          <!-- Category filter buttons -->
          <div class="gallery-filters">
            <button
              *ngFor="let cat of categories"
              class="cat-filter-btn"
              [class.active]="selectedCategory() === cat"
              (click)="selectedCategory.set(cat)"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </section>

      <!-- Gallery Grid -->
      <section class="gallery-grid-section">
        <div class="container">
          <div class="gallery-grid">
            <div
              *ngFor="let item of filteredImages()"
              class="gallery-card card"
              (click)="openLightbox(item)"
            >
              <img [src]="item.imageUrl" [alt]="item.title" loading="lazy" class="gallery-img" />
              <div class="gallery-caption">
                <span class="badge badge-accent">{{ item.category }}</span>
                <h3>{{ item.title }}</h3>
                <p *ngIf="item.description">{{ item.description }}</p>
                <span class="view-zoom"><i class="fa-solid fa-magnifying-glass-plus"></i> View Full Look</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Lightbox Modal -->
      <div class="lightbox-modal" *ngIf="activeItem() as active" (click)="closeLightbox()">
        <div class="lightbox-content" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="closeLightbox()"><i class="fa-solid fa-xmark"></i></button>
          <img [src]="active.imageUrl" [alt]="active.title" class="lightbox-img" />
          <div class="lightbox-info">
            <span class="badge badge-accent">{{ active.category }}</span>
            <h2>{{ active.title }}</h2>
            <p>{{ active.description }}</p>
            <a routerLink="/booking" (click)="closeLightbox()" class="btn btn-accent btn-sm book-style-btn">
              Book This Style <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(180deg, #FFFFFF 0%, var(--color-bg) 100%);
      padding: 2.5rem 0 1.75rem;
      border-bottom: 1px solid var(--color-border);

      @media (min-width: 768px) {
        padding: 4.5rem 0 3rem;
      }

      h1 { margin: 0.5rem 0; }
      p {
        font-size: 0.95rem;
        max-width: 620px;
        margin: 0 auto 1.5rem;

        @media (min-width: 768px) {
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
      }
    }

    .gallery-filters {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      white-space: nowrap;
      padding: 0.25rem 0.5rem 0.75rem;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; }
      justify-content: flex-start;

      @media (min-width: 640px) {
        justify-content: center;
        flex-wrap: wrap;
        overflow-x: visible;
        padding-bottom: 0;
      }

      .cat-filter-btn {
        flex-shrink: 0;
        min-height: 40px;
        padding: 0.5rem 1.15rem;
        border-radius: var(--radius-full);
        background: #FFFFFF;
        border: 1px solid var(--color-border);
        font-family: var(--font-sans);
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition);
        display: inline-flex;
        align-items: center;

        @media (min-width: 768px) {
          font-size: 0.9rem;
          padding: 0.5rem 1.25rem;
        }

        &:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        &.active {
          background: var(--color-primary);
          color: #FFFFFF;
          border-color: var(--color-primary);
        }
      }
    }

    .gallery-grid-section {
      padding: 2.5rem 0 4rem;

      @media (min-width: 768px) {
        padding: 4rem 0 6rem;
      }
    }

    .gallery-grid {
      columns: 1;
      column-gap: 1rem;

      @media (min-width: 520px) {
        columns: 2;
        column-gap: 1.25rem;
      }

      @media (min-width: 992px) {
        columns: 3;
        column-gap: 1.75rem;
      }

      .gallery-card {
        break-inside: avoid;
        margin-bottom: 1rem;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        border-radius: var(--radius-md);

        @media (min-width: 520px) {
          margin-bottom: 1.25rem;
        }

        @media (min-width: 992px) {
          margin-bottom: 1.75rem;
        }

        .gallery-img {
          width: 100%;
          display: block;
          transition: transform 0.5s ease;
        }

        .gallery-caption {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(43, 33, 30, 0.92) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1rem;
          color: #FFFFFF;
          opacity: 1;
          transition: var(--transition);

          @media (min-width: 768px) and (hover: hover) {
            opacity: 0;
            padding: 1.5rem;
          }

          h3 {
            color: #FFFFFF;
            font-size: 1.05rem;
            margin: 0.35rem 0 0.2rem;

            @media (min-width: 768px) {
              font-size: 1.2rem;
              margin: 0.5rem 0 0.25rem;
            }
          }

          p {
            color: #DDD4CF;
            font-size: 0.8rem;
            margin-bottom: 0.5rem;

            @media (min-width: 768px) {
              font-size: 0.85rem;
              margin-bottom: 0.75rem;
            }
          }

          .view-zoom {
            font-size: 0.75rem;
            color: var(--color-accent);
            font-weight: 600;

            @media (min-width: 768px) {
              font-size: 0.8rem;
            }
          }
        }

        &:hover {
          .gallery-img { transform: scale(1.04); }
          .gallery-caption { opacity: 1; }
        }
      }
    }

    /* Lightbox Modal */
    .lightbox-modal {
      position: fixed;
      inset: 0;
      background: rgba(43, 33, 30, 0.88);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;

      @media (min-width: 640px) {
        padding: 2rem;
      }

      .lightbox-content {
        background: #FFFFFF;
        border-radius: var(--radius-lg);
        overflow: hidden;
        max-width: 840px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        position: relative;
        box-shadow: var(--shadow-lg);

        @media (min-width: 768px) {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          overflow-y: visible;
        }

        .close-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.4);
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          z-index: 10;
          transition: var(--transition);

          @media (min-width: 768px) {
            top: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.08);
            color: var(--color-primary);
          }

          &:hover {
            background: var(--color-primary);
            color: #FFFFFF;
          }
        }

        .lightbox-img {
          width: 100%;
          height: 260px;
          object-fit: cover;

          @media (min-width: 480px) {
            height: 320px;
          }

          @media (min-width: 768px) {
            height: 100%;
            max-height: 80vh;
          }
        }

        .lightbox-info {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: center;

          @media (min-width: 768px) {
            padding: 2.5rem;
          }

          h2 {
            font-size: 1.35rem;
            margin: 0.5rem 0;

            @media (min-width: 768px) {
              font-size: 1.8rem;
              margin: 0.75rem 0;
            }
          }

          p {
            font-size: 0.88rem;
            line-height: 1.6;
            margin-bottom: 1.25rem;

            @media (min-width: 768px) {
              font-size: 0.95rem;
              margin-bottom: 2rem;
            }
          }

          .book-style-btn {
            width: 100%;
            justify-content: center;

            @media (min-width: 480px) {
              width: auto;
              align-self: flex-start;
            }
          }
        }
      }
    }
  `],
})
export class GalleryComponent implements OnInit {
  private api = inject(ApiService);

  categories = ['All', 'Hair', 'Nails', 'Makeup', 'Bridal', 'Beauty', 'Other'];
  selectedCategory = signal<string>('All');
  images = signal<GalleryImage[]>([]);
  activeItem = signal<GalleryImage | null>(null);

  filteredImages = computed(() => {
    const cat = this.selectedCategory();
    const all = this.images();
    if (cat === 'All') return all;
    return all.filter((i) => i.category.toLowerCase() === cat.toLowerCase());
  });

  ngOnInit() {
    this.api.getGallery().subscribe({
      next: (res) => this.images.set(res.data?.images || []),
    });
  }

  openLightbox(item: GalleryImage) {
    this.activeItem.set(item);
  }

  closeLightbox() {
    this.activeItem.set(null);
  }
}
