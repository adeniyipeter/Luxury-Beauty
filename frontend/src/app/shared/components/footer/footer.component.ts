import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-grid">
          <!-- Column 1: Brand -->
          <div class="footer-col brand-col">
            <a routerLink="/" class="footer-logo">
              <span class="logo-accent">Veya</span> Beauty Studio
            </a>
            <p class="tagline">Beautiful Hair. Beautiful You.</p>
            <p class="desc">
              Lagos' premier luxury beauty atelier dedicated to high-precision hair artistry, restorative skin treatments, and customized nail craftsmanship.
            </p>
            <div class="social-links">
              <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
              <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
              <a href="#" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><a routerLink="/services">All Services</a></li>
              <li><a routerLink="/gallery">Lookbook & Gallery</a></li>
              <li><a routerLink="/about">Our Story & Team</a></li>
              <li><a routerLink="/booking">Book an Appointment</a></li>
              <li><a routerLink="/contact">Contact & Location</a></li>
            </ul>
          </div>

          <!-- Column 3: Services -->
          <div class="footer-col">
            <h4>Specialties</h4>
            <ul>
              <li><a routerLink="/services" [queryParams]="{category: 'hair-services'}">Knotless Braids & Twists</a></li>
              <li><a routerLink="/services" [queryParams]="{category: 'hair-services'}">Lace Melt & Wig Customization</a></li>
              <li><a routerLink="/services" [queryParams]="{category: 'nail-services'}">Russian Gel Manicures</a></li>
              <li><a routerLink="/services" [queryParams]="{category: 'skin-and-beauty'}">Hydra-Glow Facials</a></li>
              <li><a routerLink="/services" [queryParams]="{category: 'other-services'}">Bridal Pamper Packages</a></li>
            </ul>
          </div>

          <!-- Column 4: Studio Info & Hours -->
          <div class="footer-col">
            <h4>Salon Atelier</h4>
            <div class="info-item">
              <i class="fa-solid fa-location-dot"></i>
              <span>14 Victoria Island Boulevard, Lagos, Nigeria</span>
            </div>
            <div class="info-item">
              <i class="fa-solid fa-phone"></i>
              <span>+234 801 234 5678</span>
            </div>
            <div class="info-item">
              <i class="fa-solid fa-envelope"></i>
              <span>bookings@veyastudio.com</span>
            </div>
            <div class="hours-badge">
              <i class="fa-regular fa-clock"></i>
              <div>
                <strong>Mon - Sat:</strong> 9:00 AM - 7:00 PM<br/>
                <strong>Sun:</strong> 12:00 PM - 6:00 PM
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2026 Veya Beauty Studio. All rights reserved.</p>
          <div class="legal-links">
            <a href="#">Privacy Policy</a>
            <span class="dot">&bull;</span>
            <a href="#">Terms of Service</a>
            <span class="dot">&bull;</span>
            <a href="#">Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--color-primary);
      color: #FFFFFF;
      padding: 5rem 0 2rem;
      margin-top: 5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1.2fr 1.8fr;
      gap: 3rem;
      margin-bottom: 3.5rem;
    }

    .footer-logo {
      font-family: var(--font-serif);
      font-size: 1.7rem;
      font-weight: 700;
      color: #FFFFFF;
      display: inline-block;
      margin-bottom: 0.25rem;

      .logo-accent {
        color: var(--color-accent);
        font-style: italic;
      }
    }

    .tagline {
      font-family: var(--font-serif);
      font-style: italic;
      color: var(--color-accent);
      margin-bottom: 1rem;
      font-size: 1.05rem;
    }

    .desc {
      color: #C0B7B3;
      font-size: 0.92rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;

      a {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        transition: var(--transition);

        &:hover {
          background: var(--color-accent);
          color: #FFFFFF;
          transform: translateY(-2px);
        }
      }
    }

    h4 {
      color: #FFFFFF;
      font-family: var(--font-serif);
      font-size: 1.2rem;
      margin-bottom: 1.25rem;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 0;
        width: 28px;
        height: 2px;
        background-color: var(--color-accent);
      }
    }

    ul {
      list-style: none;

      li {
        margin-bottom: 0.75rem;

        a {
          color: #C0B7B3;
          font-size: 0.92rem;

          &:hover {
            color: var(--color-accent);
            padding-left: 4px;
          }
        }
      }
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      color: #C0B7B3;
      font-size: 0.92rem;
      margin-bottom: 0.85rem;

      i {
        color: var(--color-accent);
        margin-top: 0.2rem;
      }
    }

    .hours-badge {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      background: rgba(255, 255, 255, 0.06);
      padding: 0.85rem;
      border-radius: var(--radius-sm);
      margin-top: 1rem;
      font-size: 0.88rem;
      color: #C0B7B3;

      i {
        color: var(--color-accent);
        margin-top: 0.2rem;
      }

      strong {
        color: #FFFFFF;
      }
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #8C827E;
      font-size: 0.85rem;

      p {
        color: #8C827E;
      }

      .legal-links {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        a:hover {
          color: var(--color-accent);
        }

        .dot {
          opacity: 0.4;
        }
      }
    }

    @media (max-width: 992px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 600px) {
      .footer-grid {
        grid-template-columns: 1fr;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `],
})
export class FooterComponent {}
