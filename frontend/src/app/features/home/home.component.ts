import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { BookingStateService } from '@core/services/booking.service';
import { Service, ServiceCategory, Review, GalleryImage } from '@core/models';
import { ServiceCardComponent } from '@shared/components/service-card/service-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ServiceCardComponent],
  template: `
    <div class="home-page">
      <!-- 1. Hero Section -->
      <section class="hero-section">
        <div class="container hero-container">
          <div class="hero-content">
            <span class="hero-eyebrow">Luxury Beauty & Hair Atelier</span>
            <h1 class="hero-title">Beautiful Hair.<br/><span class="italic-serif">Beautiful You.</span></h1>
            <p class="hero-subtext">
              Experience the pinnacle of hair artistry, restorative skin therapies, and couture nails in our serene Lagos sanctuary. Crafted for the modern individual who values elegance and care.
            </p>
            <div class="hero-actions">
              <a routerLink="/booking" class="btn btn-primary btn-lg">
                Book an Appointment <i class="fa-solid fa-arrow-right"></i>
              </a>
              <a routerLink="/services" class="btn btn-outline btn-lg">
                Explore Services
              </a>
            </div>

            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">4.9★</span>
                <span class="stat-label">Client Rating</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">2,500+</span>
                <span class="stat-label">Appointments</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">100%</span>
                <span class="stat-label">Tension-Free Braids</span>
              </div>
            </div>
          </div>

          <div class="hero-visual">
            <div class="image-frame main-frame">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80"
                alt="Luxury salon experience at Veya Beauty Studio"
                class="hero-img"
              />
            </div>
            <div class="floating-card">
              <div class="floating-icon"><i class="fa-solid fa-sparkles"></i></div>
              <div>
                <strong>Award-Winning Styling</strong>
                <p>Personalized consultation & aftercare</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Categories Section -->
      <section class="section categories-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge badge-accent">Curated Offerings</span>
            <h2>Our Specialized Disciplines</h2>
            <p>From protective styles to bespoke skin rituals, explore our specialized studios.</p>
          </div>

          <div class="categories-grid grid-4">
            <div *ngFor="let cat of categories()" class="category-card card" [routerLink]="['/services']" [queryParams]="{category: cat.slug}">
              <div class="cat-img-wrap">
                <img [src]="cat.imageUrl" [alt]="cat.name" class="cat-img" />
                <div class="cat-overlay"></div>
              </div>
              <div class="cat-info">
                <h3>{{ cat.name }}</h3>
                <p>{{ cat.description }}</p>
                <span class="cat-link">View Treatments <i class="fa-solid fa-arrow-right"></i></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Featured Services -->
      <section class="section featured-section">
        <div class="container">
          <div class="section-header">
            <div>
              <span class="badge badge-primary">Client Favorites</span>
              <h2>Signature Services</h2>
              <p>Our most requested hair installations, skin therapies, and manicures.</p>
            </div>
            <a routerLink="/services" class="btn btn-outline btn-sm view-all-btn">
              View All Services ({{ services().length }})
            </a>
          </div>

          <div class="services-grid grid-3">
            <app-service-card
              *ngFor="let service of featuredServices()"
              [service]="service"
              (book)="onQuickBook($event)"
            ></app-service-card>
          </div>
        </div>
      </section>

      <!-- 4. Bridal Luxury Package Promo -->
      <section class="section bridal-section">
        <div class="container bridal-banner">
          <div class="bridal-content">
            <span class="badge badge-accent">Bridal Atelier</span>
            <h2>Your Wedding Day, Flawlessly Perfected</h2>
            <p>
              Complete bridal pampering including hair trials, wedding day melt installations, HD glam makeup, and deluxe champagne pedicures for you and your bridal party.
            </p>
            <div class="bridal-perks">
              <div class="perk"><i class="fa-solid fa-check"></i> Private suite on your wedding morning</div>
              <div class="perk"><i class="fa-solid fa-check"></i> Complimentary pre-wedding consultation</div>
              <div class="perk"><i class="fa-solid fa-check"></i> Touch-up kit and champagne service</div>
            </div>
            <a routerLink="/booking" class="btn btn-accent btn-lg">
              Book Bridal Consultation <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div class="bridal-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
              alt="Veya Bridal Hair and Makeup Transformation"
              class="bridal-img"
            />
          </div>
        </div>
      </section>

      <!-- 5. Why Choose Veya -->
      <section class="section why-us-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge badge-primary">The Veya Difference</span>
            <h2>Why Clients Choose Our Studio</h2>
            <p>We blend world-class techniques with attentive, unhurried hospitality.</p>
          </div>

          <div class="grid-4 why-grid">
            <div class="why-card card">
              <div class="why-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
              <h3>Master Specialists</h3>
              <p>Every stylist and esthetician brings certified expertise, continuous training, and artistic vision.</p>
            </div>
            <div class="why-card card">
              <div class="why-icon"><i class="fa-solid fa-shield-heart"></i></div>
              <h3>Hair Health First</h3>
              <p>We believe protective styles must protect. No edge breakage, tension headaches, or harsh chemicals.</p>
            </div>
            <div class="why-card card">
              <div class="why-icon"><i class="fa-solid fa-pump-soap"></i></div>
              <h3>Hospital-Grade Hygiene</h3>
              <p>Medical-grade autoclave sterilization for all pedicure, manicure, and esthetic instruments.</p>
            </div>
            <div class="why-card card">
              <div class="why-icon"><i class="fa-solid fa-calendar-check"></i></div>
              <h3>Seamless Scheduling</h3>
              <p>Zero double-booking, guaranteed appointment start times, and live status notifications.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Gallery Preview -->
      <section class="section gallery-preview-section">
        <div class="container">
          <div class="section-header">
            <div>
              <span class="badge badge-accent">Portfolio</span>
              <h2>Latest Looks From Our Studio</h2>
              <p>Real clients, real transformations. Discover your next inspiration.</p>
            </div>
            <a routerLink="/gallery" class="btn btn-outline btn-sm">View Full Lookbook</a>
          </div>

          <div class="gallery-grid grid-3">
            <div *ngFor="let item of gallery()" class="gallery-item card">
              <img [src]="item.imageUrl" [alt]="item.title" loading="lazy" />
              <div class="gallery-overlay">
                <span class="badge badge-accent">{{ item.category }}</span>
                <h4>{{ item.title }}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Testimonials -->
      <section class="section testimonials-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge badge-primary">Client Stories</span>
            <h2>Words From Our Beloved Clients</h2>
          </div>

          <div class="grid-3 test-grid">
            <div *ngFor="let r of reviews()" class="test-card card">
              <div class="rating-stars">
                <i *ngFor="let star of [1,2,3,4,5]" class="fa-solid fa-star"></i>
              </div>
              <p class="review-text">“{{ r.comment }}”</p>
              <div class="reviewer-info">
                <img
                  [src]="r.customer?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'"
                  alt="Customer avatar"
                  class="reviewer-avatar"
                />
                <div>
                  <strong>{{ r.customer?.firstName }} {{ r.customer?.lastName }}</strong>
                  <span class="verified"><i class="fa-solid fa-circle-check"></i> Verified Client</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 8. Book Appointment CTA Banner -->
      <section class="cta-banner-section">
        <div class="container">
          <div class="cta-box">
            <h2>Ready to Elevate Your Look?</h2>
            <p>Book your bespoke appointment online in minutes. Select your specialist, date, and preferred time slot.</p>
            <div class="cta-buttons">
              <a routerLink="/booking" class="btn btn-accent btn-lg">Book Appointment Now</a>
              <a routerLink="/contact" class="btn btn-outline btn-lg cta-contact-btn">Speak With Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    /* Hero */
    .hero-section {
      padding: 2.5rem 0 2rem;
      background: linear-gradient(180deg, #FFFFFF 0%, var(--color-bg) 100%);
      overflow: hidden;

      @media (min-width: 768px) {
        padding: 4.5rem 0 3.5rem;
      }
    }

    .hero-container {
      display: grid;
      grid-template-columns: 1fr;
      align-items: center;
      gap: 2.5rem;

      @media (min-width: 992px) {
        grid-template-columns: 1.15fr 0.85fr;
        gap: 4rem;
      }
    }

    .hero-eyebrow {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--color-accent);
      margin-bottom: 0.6rem;
      display: inline-block;

      @media (min-width: 640px) {
        font-size: 0.85rem;
        margin-bottom: 0.75rem;
      }
    }

    .hero-title {
      font-size: clamp(2.2rem, 6.5vw, 3.5rem);
      line-height: 1.15;
      margin-bottom: 1rem;
      color: var(--color-primary);

      .italic-serif {
        font-style: italic;
        color: var(--color-secondary);
      }

      @media (min-width: 640px) {
        margin-bottom: 1.25rem;
      }
    }

    .hero-subtext {
      font-size: 0.98rem;
      color: var(--color-text-secondary);
      line-height: 1.65;
      margin-bottom: 1.75rem;
      max-width: 540px;

      @media (min-width: 640px) {
        font-size: 1.1rem;
        line-height: 1.7;
        margin-bottom: 2rem;
      }
    }

    .hero-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;

      .btn {
        width: 100%;
      }

      @media (min-width: 540px) {
        flex-direction: row;
        gap: 1rem;
        margin-bottom: 2.75rem;

        .btn {
          width: auto;
        }
      }
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--color-border);
      text-align: center;

      .stat-item {
        display: flex;
        flex-direction: column;

        .stat-number {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--color-primary);

          @media (min-width: 640px) {
            font-size: 1.5rem;
          }
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);

          @media (min-width: 640px) {
            font-size: 0.82rem;
          }
        }
      }

      .stat-divider {
        display: none;
      }

      @media (min-width: 640px) {
        display: flex;
        align-items: center;
        text-align: left;
        gap: 2rem;
        padding-top: 1.5rem;

        .stat-divider {
          display: block;
          width: 1px;
          height: 36px;
          background: var(--color-border);
        }
      }
    }

    .hero-visual {
      position: relative;

      .image-frame {
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        height: 300px;

        @media (min-width: 640px) {
          height: 420px;
        }

        @media (min-width: 992px) {
          height: 520px;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .floating-card {
        position: static;
        margin-top: 1rem;
        width: 100%;
        background: #FFFFFF;
        padding: 1rem 1.25rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid var(--color-border);

        @media (min-width: 768px) {
          position: absolute;
          bottom: 2rem;
          left: -1rem;
          margin-top: 0;
          max-width: 320px;
          box-shadow: var(--shadow-lg);
        }

        @media (min-width: 1200px) {
          left: -2rem;
        }

        .floating-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-accent-light);
          color: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        strong {
          font-size: 0.95rem;
          color: var(--color-primary);
          display: block;
        }

        p {
          font-size: 0.82rem;
          margin: 0;
          color: var(--color-text-secondary);
        }
      }
    }

    /* Sections general */
    .section {
      padding: 3rem 0;

      @media (min-width: 768px) {
        padding: 5rem 0;
      }
    }

    .section-header {
      margin-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;

      .view-all-btn {
        align-self: flex-start;
      }

      &.text-center {
        align-items: center;
        text-align: center;
      }

      @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 2.75rem;

        .view-all-btn {
          align-self: auto;
        }
      }

      h2 {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 1rem;
        max-width: 600px;

        @media (min-width: 640px) {
          font-size: 1.05rem;
        }
      }
    }

    /* Category Cards */
    .category-card {
      cursor: pointer;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .cat-img-wrap {
        position: relative;
        height: 180px;
        overflow: hidden;

        @media (min-width: 640px) {
          height: 200px;
        }

        .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .cat-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(43, 33, 30, 0.4) 100%);
        }
      }

      &:hover .cat-img {
        transform: scale(1.08);
      }

      .cat-info {
        padding: 1.15rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        @media (min-width: 640px) {
          padding: 1.25rem;
        }

        h3 {
          font-size: 1.15rem;
          margin-bottom: 0.4rem;
        }

        p {
          font-size: 0.88rem;
          margin-bottom: 0.85rem;
          flex-grow: 1;
        }

        .cat-link {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-accent);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
      }
    }

    /* Bridal Section */
    .bridal-banner {
      background: linear-gradient(135deg, var(--color-primary) 0%, #3d2f2b 100%);
      border-radius: var(--radius-lg);
      padding: 2rem 1.25rem;
      display: grid;
      grid-template-columns: 1fr;
      align-items: center;
      gap: 2rem;
      color: #FFFFFF;
      overflow: hidden;

      @media (min-width: 640px) {
        padding: 2.75rem 2rem;
      }

      @media (min-width: 992px) {
        grid-template-columns: 1.2fr 0.8fr;
        padding: 4rem;
        gap: 3rem;
      }

      .bridal-content {
        h2 {
          color: #FFFFFF;
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          margin: 0.75rem 0 1rem;
        }

        p {
          color: #DDD4CF;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;

          @media (min-width: 640px) {
            font-size: 1.05rem;
            line-height: 1.7;
            margin-bottom: 1.75rem;
          }
        }

        .bridal-perks {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1.75rem;

          .perk {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.92rem;
            color: #FFFFFF;

            i {
              color: var(--color-accent);
              font-size: 0.9rem;
              flex-shrink: 0;
            }
          }
        }

        .btn {
          width: 100%;
          @media (min-width: 540px) {
            width: auto;
          }
        }
      }

      .bridal-image-wrap {
        height: 240px;
        border-radius: var(--radius-md);
        overflow: hidden;
        box-shadow: var(--shadow-lg);

        @media (min-width: 640px) {
          height: 320px;
        }

        @media (min-width: 992px) {
          height: 400px;
        }

        .bridal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    /* Why Us */
    .why-card {
      padding: 1.75rem 1.25rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;

      @media (min-width: 640px) {
        padding: 2rem 1.5rem;
      }

      .why-icon {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--color-surface-alt);
        color: var(--color-accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.35rem;
        margin-bottom: 1rem;
      }

      h3 {
        font-size: 1.15rem;
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 0.88rem;
        line-height: 1.6;
      }
    }

    /* Gallery preview */
    .gallery-item {
      height: 240px;
      position: relative;
      overflow: hidden;
      cursor: pointer;

      @media (min-width: 640px) {
        height: 320px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      &:hover img {
        transform: scale(1.08);
      }

      .gallery-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 40%, rgba(43, 33, 30, 0.9) 100%);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 1.25rem;
        color: #FFFFFF;

        h4 {
          color: #FFFFFF;
          margin-top: 0.35rem;
          font-size: 1.05rem;
        }
      }
    }

    /* Testimonials */
    .test-card {
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      @media (min-width: 640px) {
        padding: 2rem;
      }

      .rating-stars {
        color: #FFB300;
        font-size: 0.9rem;
        margin-bottom: 0.85rem;
        display: flex;
        gap: 0.25rem;
      }

      .review-text {
        font-style: italic;
        color: var(--color-text-primary);
        font-size: 0.92rem;
        line-height: 1.6;
        margin-bottom: 1.25rem;
      }

      .reviewer-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .reviewer-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
        }

        strong {
          display: block;
          font-size: 0.9rem;
          color: var(--color-primary);
        }

        .verified {
          font-size: 0.75rem;
          color: var(--color-success);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      }
    }

    /* CTA Box */
    .cta-banner-section {
      padding: 2rem 0;

      @media (min-width: 768px) {
        padding: 3rem 0;
      }

      .cta-box {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 2.5rem 1.25rem;
        text-align: center;
        box-shadow: var(--shadow-md);

        @media (min-width: 640px) {
          padding: 4rem 2rem;
        }

        h2 {
          font-size: clamp(1.6rem, 4.5vw, 2.4rem);
          margin-bottom: 0.75rem;
        }

        p {
          font-size: 1rem;
          max-width: 580px;
          margin: 0 auto 1.5rem;

          @media (min-width: 640px) {
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }
        }

        .cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;

          .btn {
            width: 100%;
          }

          @media (min-width: 540px) {
            flex-direction: row;
            justify-content: center;
            gap: 1rem;

            .btn {
              width: auto;
            }
          }
        }

        .cta-contact-btn {
          background: #FFFFFF;
        }
      }
    }
  `],
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  private bookingState = inject(BookingStateService);
  private router = inject(Router);

  categories = signal<ServiceCategory[]>([]);
  services = signal<Service[]>([]);
  featuredServices = signal<Service[]>([]);
  gallery = signal<GalleryImage[]>([]);
  reviews = signal<Review[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getCategories().subscribe({
      next: (res) => this.categories.set(res.data?.categories || []),
    });

    this.api.getServices({ isActive: true }).subscribe({
      next: (res) => {
        const all = res.data?.services || [];
        this.services.set(all);
        this.featuredServices.set(all.slice(0, 6));
      },
    });

    this.api.getGallery().subscribe({
      next: (res) => this.gallery.set((res.data?.images || []).slice(0, 3)),
    });

    this.api.getReviews().subscribe({
      next: (res) => this.reviews.set((res.data?.reviews || []).slice(0, 3)),
    });
  }

  onQuickBook(service: Service) {
    this.bookingState.setService(service);
    this.bookingState.currentStep.set(2);
    this.router.navigate(['/booking']);
  }
}
