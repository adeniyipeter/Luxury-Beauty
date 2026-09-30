import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-page">
      <!-- Hero -->
      <section class="page-header text-center">
        <div class="container">
          <span class="badge badge-accent">Our Heritage & Craft</span>
          <h1>Artistry, Precision & Pure Care</h1>
          <p>
            Veya Beauty Studio was founded to redefine the beauty atelier experience in Nigeria — harmonizing traditional African hair heritage with clinical esthetic precision.
          </p>
        </div>
      </section>

      <!-- Story Section -->
      <section class="story-section">
        <div class="container story-grid">
          <div class="story-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80"
              alt="Inside Veya Beauty Studio"
              class="story-img"
            />
          </div>
          <div class="story-text">
            <span class="badge badge-primary">The Veya Story</span>
            <h2>Where Elegance Meets Scalp & Skin Wellness</h2>
            <p>
              Born in the vibrant heart of Victoria Island, Lagos, Veya began with a simple yet uncompromising standard: beauty treatments must nurture the individual, never sacrifice scalp health for aesthetics, and respect our clients' precious time.
            </p>
            <p>
              Too often, salon experiences meant unpredictable wait times, edge-destroying tension, and harsh ingredients. At Veya, we created a serene, schedule-accurate sanctuary where clients unwind with herbal tea or champagne while master craftsmen care for their crowns.
            </p>
            <div class="quote-card card">
              <p>“We don't just create hairstyles or paint nails — we restore confidence and celebrate the divine beauty inherent in every woman.”</p>
              <strong>— Ayuba Veya, Founder & Creative Director</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section class="values-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge badge-accent">Core Pillars</span>
            <h2>The Principles Guiding Every Service</h2>
          </div>

          <div class="grid-3 values-grid">
            <div class="val-card card">
              <div class="val-icon"><i class="fa-solid fa-gem"></i></div>
              <h3>Uncompromising Craft</h3>
              <p>Every braid part is razor-clean, every acrylic apex balanced to perfection, and every facial custom-formulated to your unique skin profile.</p>
            </div>
            <div class="val-card card">
              <div class="val-icon"><i class="fa-solid fa-leaf"></i></div>
              <h3>Ethical & Safe Formulations</h3>
              <p>Zero banned bleaching agents or toxic harsh parabens. We prioritize botanicals, hyaluronic complexes, and bond-building proteins.</p>
            </div>
            <div class="val-card card">
              <div class="val-icon"><i class="fa-solid fa-heart-pulse"></i></div>
              <h3>Respect for Your Crown & Time</h3>
              <p>Strict booking slots mean you are attended to on time. No seating for hours before service starts.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Team -->
      <section class="team-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge badge-primary">Master Artists</span>
            <h2>Meet Our Specialists</h2>
            <p>Dedicated professionals with specialized training across London, Paris, and Lagos.</p>
          </div>

          <div class="grid-3 team-grid">
            <div class="team-card card">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80"
                alt="Ngozi Adeleke"
                class="team-img"
              />
              <div class="team-info">
                <h3>Ngozi Adeleke</h3>
                <span class="team-role">Master Hair Stylist & Braiding Lead</span>
                <p>8+ years crafting lightweight knotless braids, tension-free locs, and undetectable HD frontal melts.</p>
              </div>
            </div>

            <div class="team-card card">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80"
                alt="Amina Yusuf"
                class="team-img"
              />
              <div class="team-info">
                <h3>Amina Yusuf</h3>
                <span class="team-role">Lead Nail Artist & Lash Specialist</span>
                <p>Certified dry e-file Russian manicure technician and master of 3D luxury nail embellishments.</p>
              </div>
            </div>

            <div class="team-card card">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=500&q=80"
                alt="Chidinma Okafor"
                class="team-img"
              />
              <div class="team-info">
                <h3>Chidinma Okafor</h3>
                <span class="team-role">Senior Esthetician & Bridal MUA</span>
                <p>Licensed clinical skin therapist specializing in hyperpigmentation, Hydra-facials, and radiant bridal glam.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(180deg, #FFFFFF 0%, var(--color-bg) 100%);
      padding: 4.5rem 0 3rem;
      border-bottom: 1px solid var(--color-border);
      h1 { margin: 0.75rem 0 0.5rem; }
      p { font-size: 1.1rem; max-width: 680px; margin: 0 auto; }
    }

    .story-section {
      padding: 5rem 0;
    }

    .story-grid {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 4rem;
      align-items: center;
    }

    .story-image-wrap {
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      height: 480px;

      .story-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .story-text {
      h2 {
        font-size: 2.2rem;
        margin: 0.75rem 0 1.25rem;
      }

      p {
        font-size: 1.05rem;
        line-height: 1.7;
        margin-bottom: 1.25rem;
      }

      .quote-card {
        background: var(--color-surface-alt);
        padding: 1.5rem;
        border-left: 3px solid var(--color-accent);
        margin-top: 1.5rem;

        p {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1.1rem;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        strong {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }
      }
    }

    .values-section {
      padding: 5rem 0;
      background: #FFFFFF;
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }

    .val-card {
      padding: 2.5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;

      .val-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: var(--color-accent-light);
        color: var(--color-accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
        margin-bottom: 1.25rem;
      }

      h3 {
        font-size: 1.25rem;
        margin-bottom: 0.6rem;
      }

      p {
        font-size: 0.95rem;
        line-height: 1.6;
      }
    }

    .team-section {
      padding: 5rem 0;
    }

    .team-card {
      overflow: hidden;

      .team-img {
        width: 100%;
        height: 280px;
        object-fit: cover;
      }

      .team-info {
        padding: 1.5rem;

        h3 { font-size: 1.25rem; margin-bottom: 0.2rem; }
        .team-role { font-size: 0.85rem; color: var(--color-accent); font-weight: 500; display: block; margin-bottom: 0.75rem; }
        p { font-size: 0.9rem; line-height: 1.5; }
      }
    }

    @media (max-width: 900px) {
      .story-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AboutComponent {}
