import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-page">
      <section class="page-header text-center">
        <div class="container">
          <span class="badge badge-accent">Get In Touch</span>
          <h1>Visit Our Atelier</h1>
          <p>We invite you to experience tranquil luxury. Reach out for bespoke bridal consultations or general enquiries.</p>
        </div>
      </section>

      <section class="contact-section">
        <div class="container contact-grid">
          <!-- Contact Info -->
          <div class="contact-info-col">
            <div class="info-card card">
              <h2>Salon Information</h2>
              <p class="lead">Located in the exclusive heart of Victoria Island, accessible and private.</p>

              <div class="detail-item">
                <div class="icon-wrap"><i class="fa-solid fa-location-dot"></i></div>
                <div>
                  <strong>Studio Address</strong>
                  <p>14 Victoria Island Boulevard, Victoria Island, Lagos, Nigeria</p>
                </div>
              </div>

              <div class="detail-item">
                <div class="icon-wrap"><i class="fa-solid fa-phone"></i></div>
                <div>
                  <strong>Telephone & Concierge</strong>
                  <p>+234 801 234 5678</p>
                </div>
              </div>

              <div class="detail-item">
                <div class="icon-wrap"><i class="fa-solid fa-envelope"></i></div>
                <div>
                  <strong>Email Inquiries</strong>
                  <p>bookings&#64;veyastudio.com</p>
                </div>
              </div>

              <div class="hours-card">
                <h3><i class="fa-regular fa-clock"></i> Opening Hours</h3>
                <div class="h-row">
                  <span>Monday – Saturday:</span>
                  <strong>9:00 AM – 7:00 PM</strong>
                </div>
                <div class="h-row">
                  <span>Sunday:</span>
                  <strong>12:00 PM – 6:00 PM</strong>
                </div>
              </div>

              <!-- Map Visual Placeholder -->
              <div class="map-placeholder">
                <i class="fa-solid fa-map-location-dot"></i>
                <span>Victoria Island Atelier &bull; Lagos, NG</span>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-col">
            <div class="form-card card">
              <h2>Send Us a Message</h2>
              <p>Have questions about bridal packages or specific hair treatments? Let us know.</p>

              <div *ngIf="messageSent" class="alert alert-success">
                <i class="fa-solid fa-circle-check"></i>
                Thank you! Your message has been sent to our concierge team. We will respond within 24 hours.
              </div>

              <form *ngIf="!messageSent" (ngSubmit)="sendMessage()">
                <div class="form-group">
                  <label>Full Name *</label>
                  <input type="text" class="form-control" [(ngModel)]="name" name="name" required placeholder="Your full name" />
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label>Email Address *</label>
                    <input type="email" class="form-control" [(ngModel)]="email" name="email" required placeholder="your&#64;email.com" />
                  </div>
                  <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" class="form-control" [(ngModel)]="phone" name="phone" placeholder="+234 800 000 0000" />
                  </div>
                </div>

                <div class="form-group">
                  <label>Topic / Interest</label>
                  <select class="form-control" [(ngModel)]="subject" name="subject">
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Bridal Consultation">Bridal Consultation</option>
                    <option value="Custom Wig Making">Custom Wig Making</option>
                    <option value="Skin Toning / Hyperpigmentation">Skin Toning / Hyperpigmentation</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Your Message *</label>
                  <textarea
                    class="form-control"
                    rows="5"
                    [(ngModel)]="message"
                    name="message"
                    required
                    placeholder="Tell us about your hair or skin goals..."
                  ></textarea>
                </div>

                <button type="submit" [disabled]="!name || !email || !message" class="btn btn-primary btn-lg w-100">
                  Send Message <i class="fa-solid fa-paper-plane"></i>
                </button>
              </form>
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
      p { font-size: 1.1rem; max-width: 600px; margin: 0 auto; }
    }

    .contact-section {
      padding: 4.5rem 0 6rem;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      gap: 3.5rem;
      align-items: start;
    }

    .info-card, .form-card {
      padding: 2.5rem;

      h2 {
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
      }

      .lead {
        margin-bottom: 2rem;
        font-size: 0.95rem;
      }
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      margin-bottom: 1.5rem;

      .icon-wrap {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--color-surface-alt);
        color: var(--color-accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        flex-shrink: 0;
      }

      strong {
        display: block;
        font-size: 0.95rem;
        color: var(--color-primary);
        margin-bottom: 0.2rem;
      }

      p {
        font-size: 0.9rem;
        margin: 0;
      }
    }

    .hours-card {
      background: var(--color-surface-alt);
      border-radius: var(--radius-sm);
      padding: 1.25rem;
      margin: 1.5rem 0;

      h3 {
        font-size: 1.05rem;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        i { color: var(--color-accent); }
      }

      .h-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.88rem;
        margin-bottom: 0.4rem;
        span { color: var(--color-text-secondary); }
        strong { color: var(--color-primary); }
      }
    }

    .map-placeholder {
      height: 140px;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, #2B211E 0%, #46342E 100%);
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.9rem;

      i { font-size: 2rem; color: var(--color-accent); }
    }

    .alert {
      padding: 1rem 1.25rem;
      border-radius: var(--radius-sm);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.95rem;

      &.alert-success {
        background: var(--color-success-bg);
        color: var(--color-success);
        i { font-size: 1.2rem; }
      }
    }

    @media (max-width: 900px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ContactComponent {
  name = '';
  email = '';
  phone = '';
  subject = 'General Inquiry';
  message = '';
  messageSent = false;

  sendMessage() {
    this.messageSent = true;
  }
}
