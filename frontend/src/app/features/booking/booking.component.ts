import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AuthService } from '@core/services/auth.service';
import { BookingStateService } from '@core/services/booking.service';
import { Service, ServiceCategory, StaffProfile, TimeSlot, Appointment } from '@core/models';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="booking-page">
      <div class="container booking-container">
        <!-- Progress Stepper -->
        <div class="stepper-wrap" *ngIf="bookingState.currentStep() <= 4">
          <div class="step-indicator" [class.active]="bookingState.currentStep() >= 1" [class.current]="bookingState.currentStep() === 1">
            <span class="step-num">1</span>
            <span class="step-text">Service</span>
          </div>
          <div class="step-line" [class.active]="bookingState.currentStep() >= 2"></div>
          <div class="step-indicator" [class.active]="bookingState.currentStep() >= 2" [class.current]="bookingState.currentStep() === 2">
            <span class="step-num">2</span>
            <span class="step-text">Specialist</span>
          </div>
          <div class="step-line" [class.active]="bookingState.currentStep() >= 3"></div>
          <div class="step-indicator" [class.active]="bookingState.currentStep() >= 3" [class.current]="bookingState.currentStep() === 3">
            <span class="step-num">3</span>
            <span class="step-text">Date & Time</span>
          </div>
          <div class="step-line" [class.active]="bookingState.currentStep() >= 4"></div>
          <div class="step-indicator" [class.active]="bookingState.currentStep() >= 4" [class.current]="bookingState.currentStep() === 4">
            <span class="step-num">4</span>
            <span class="step-text">Confirm</span>
          </div>
        </div>

        <!-- ================= STEP 1: SELECT SERVICE ================= -->
        <div *ngIf="bookingState.currentStep() === 1" class="step-content">
          <div class="step-header text-center">
            <h2>Select Your Treatment</h2>
            <p>Choose the beauty or hair service you wish to experience today.</p>
          </div>

          <!-- Category filter -->
          <div class="category-filter-row">
            <button
              class="cat-chip"
              [class.active]="selectedCat() === 'all'"
              (click)="selectedCat.set('all')"
            >
              All Treatments
            </button>
            <button
              *ngFor="let c of categories()"
              class="cat-chip"
              [class.active]="selectedCat() === c.id"
              (click)="selectedCat.set(c.id)"
            >
              {{ c.name }}
            </button>
          </div>

          <div class="services-select-grid grid-3">
            <div
              *ngFor="let s of filteredServices()"
              class="selectable-card card"
              [class.selected]="bookingState.selectedService()?.id === s.id"
              (click)="selectService(s)"
            >
              <img [src]="s.imageUrl" [alt]="s.name" class="service-thumb" />
              <div class="selectable-info">
                <div class="meta-line">
                  <span class="badge badge-accent">{{ s.category?.name }}</span>
                  <span class="duration"><i class="fa-regular fa-clock"></i> {{ s.durationMinutes }}m</span>
                </div>
                <h3>{{ s.name }}</h3>
                <p>{{ s.description }}</p>
                <div class="price-action-row">
                  <span class="price">₦{{ s.price | number:'1.0-0' }}</span>
                  <button class="btn btn-sm" [class.btn-accent]="bookingState.selectedService()?.id === s.id" [class.btn-outline]="bookingState.selectedService()?.id !== s.id">
                    {{ bookingState.selectedService()?.id === s.id ? 'Selected' : 'Select' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <div></div>
            <button
              [disabled]="!bookingState.selectedService()"
              (click)="bookingState.currentStep.set(2); loadStaffForService()"
              class="btn btn-primary btn-lg"
            >
              Continue to Specialist <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- ================= STEP 2: SELECT SPECIALIST ================= -->
        <div *ngIf="bookingState.currentStep() === 2" class="step-content">
          <div class="step-header text-center">
            <h2>Select Your Specialist</h2>
            <p>Choose from our certified artists who specialize in {{ bookingState.selectedService()?.name }}.</p>
          </div>

          <div class="staff-select-grid grid-3" *ngIf="availableStaff().length > 0; else noStaffFound">
            <div
              *ngFor="let staff of availableStaff()"
              class="selectable-staff-card card"
              [class.selected]="bookingState.selectedStaff()?.id === staff.id"
              (click)="selectStaff(staff)"
            >
              <img
                [src]="staff.user.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'"
                [alt]="staff.user.firstName"
                class="staff-photo"
              />
              <div class="staff-details">
                <div class="rating-badge">★ {{ staff.rating }}</div>
                <h3>{{ staff.user.firstName }} {{ staff.user.lastName }}</h3>
                <span class="title">{{ staff.title }}</span>
                <p class="bio">{{ staff.bio }}</p>
                <div class="specialty-tag">
                  <i class="fa-solid fa-award"></i> {{ staff.specialty }}
                </div>
                <div class="select-btn-wrap">
                  <button class="btn btn-sm w-100" [class.btn-accent]="bookingState.selectedStaff()?.id === staff.id" [class.btn-outline]="bookingState.selectedStaff()?.id !== staff.id">
                    {{ bookingState.selectedStaff()?.id === staff.id ? 'Selected' : 'Choose Specialist' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ng-template #noStaffFound>
            <div class="empty-box card text-center">
              <p>No specialists currently available for this service. Please choose another treatment.</p>
            </div>
          </ng-template>

          <div class="step-actions">
            <button (click)="bookingState.currentStep.set(1)" class="btn btn-ghost btn-lg">
              <i class="fa-solid fa-arrow-left"></i> Back to Services
            </button>
            <button
              [disabled]="!bookingState.selectedStaff()"
              (click)="goToStep3()"
              class="btn btn-primary btn-lg"
            >
              Continue to Date & Time <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- ================= STEP 3: DATE & TIME SLOTS ================= -->
        <div *ngIf="bookingState.currentStep() === 3" class="step-content">
          <div class="step-header text-center">
            <h2>Select Date & Time</h2>
            <p>Real-time slot availability for {{ bookingState.selectedStaff()?.user?.firstName }}.</p>
          </div>

          <div class="datetime-layout">
            <!-- Left: Date Picker -->
            <div class="calendar-card card">
              <h3><i class="fa-regular fa-calendar"></i> Pick a Date</h3>
              <p class="sub">Select an available date within opening days (Mon - Sat).</p>

              <div class="date-input-box">
                <input
                  type="date"
                  class="form-control date-picker-input"
                  [min]="minDate"
                  [(ngModel)]="dateInput"
                  (change)="onDateChange()"
                />
              </div>

              <div class="quick-dates">
                <button
                  *ngFor="let qd of upcomingDates"
                  class="date-pill"
                  [class.active]="dateInput === qd.val"
                  (click)="dateInput = qd.val; onDateChange()"
                >
                  <span class="day-name">{{ qd.day }}</span>
                  <span class="day-num">{{ qd.label }}</span>
                </button>
              </div>

              <div class="salon-hours-note">
                <i class="fa-regular fa-clock"></i>
                <div>
                  <strong>Studio Hours:</strong> 9:00 AM – 7:00 PM<br/>
                  Duration: {{ bookingState.selectedService()?.durationMinutes }} minutes
                </div>
              </div>
            </div>

            <!-- Right: Slots Grid -->
            <div class="slots-card card">
              <div class="slots-header">
                <h3><i class="fa-regular fa-clock"></i> Available Timeslots</h3>
                <span *ngIf="dateInput" class="selected-date-badge">{{ dateInput }}</span>
              </div>

              <div *ngIf="loadingSlots" class="loading-state">
                <i class="fa-solid fa-spinner fa-spin"></i> Checking live schedule...
              </div>

              <div *ngIf="!loadingSlots && slots().length > 0" class="slots-grid">
                <button
                  *ngFor="let slot of slots()"
                  class="slot-btn"
                  [disabled]="!slot.isAvailable"
                  [class.selected]="bookingState.selectedTime() === slot.time"
                  [class.booked]="!slot.isAvailable"
                  (click)="selectTimeSlot(slot.time)"
                >
                  <span class="slot-time">{{ slot.time }}</span>
                  <span class="slot-status">{{ slot.isAvailable ? 'Available' : (slot.reason || 'Booked') }}</span>
                </button>
              </div>

              <div *ngIf="!loadingSlots && slots().length === 0" class="empty-slots">
                <i class="fa-regular fa-calendar-xmark"></i>
                <p>No available slots found for this date. The specialist may be off duty or fully booked. Please select another date.</p>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <button (click)="bookingState.currentStep.set(2)" class="btn btn-ghost btn-lg">
              <i class="fa-solid fa-arrow-left"></i> Back to Specialist
            </button>
            <button
              [disabled]="!bookingState.selectedTime() || !bookingState.selectedDate()"
              (click)="bookingState.currentStep.set(4); prepCustomerStep()"
              class="btn btn-primary btn-lg"
            >
              Review Booking Details <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- ================= STEP 4: REVIEW & CONFIRM DETAILS ================= -->
        <div *ngIf="bookingState.currentStep() === 4" class="step-content">
          <div class="step-header text-center">
            <h2>Review & Complete Booking</h2>
            <p>Please double-check your appointment summary before confirming.</p>
          </div>

          <div class="review-grid">
            <!-- Left: Customer Info & Notes -->
            <div class="customer-info-box card">
              <h3>Client Information</h3>

              <div *ngIf="!authService.currentUser()" class="login-notice">
                <i class="fa-solid fa-circle-info"></i>
                <span>You are currently booking as a guest. <a routerLink="/auth/login">Sign in</a> to save booking to your account history.</span>
              </div>

              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" class="form-control" [(ngModel)]="customerName" placeholder="Your full name" />
              </div>

              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" class="form-control" [(ngModel)]="customerEmail" placeholder="your@email.com" />
              </div>

              <div class="form-group">
                <label>Phone Number *</label>
                <input type="tel" class="form-control" [(ngModel)]="customerPhone" placeholder="+234 800 000 0000" />
              </div>

              <div class="form-group">
                <label>Special Requests or Scalp/Skin Notes (Optional)</label>
                <textarea
                  class="form-control"
                  rows="3"
                  [(ngModel)]="customerNotes"
                  placeholder="e.g. Prefer light tension, sensitive skin, bringing my own wig..."
                ></textarea>
              </div>

              <!-- Promo Code -->
              <div class="form-group">
                <label>Promo / Voucher Code</label>
                <div class="promo-input-row">
                  <input
                    type="text"
                    class="form-control text-uppercase"
                    [(ngModel)]="promoInput"
                    placeholder="e.g. WELCOME15"
                  />
                  <button (click)="applyPromo()" class="btn btn-outline btn-sm">Apply</button>
                </div>
                <span *ngIf="promoMessage" [class.text-success]="promoSuccess" [class.text-danger]="!promoSuccess" class="promo-feedback">
                  {{ promoMessage }}
                </span>
              </div>

              <!-- Payment Option -->
              <div class="form-group">
                <label>Payment Method</label>
                <div class="payment-options">
                  <label class="radio-label">
                    <input type="radio" name="payMethod" value="PAY_AT_SALON" [(ngModel)]="payMethod" />
                    <span>Pay at Studio (Cash, Card, or Transfer on arrival)</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="payMethod" value="CARD" [(ngModel)]="payMethod" />
                    <span>Pay Online with Card (Paystack/Flutterwave)</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Right: Order Summary -->
            <div class="order-summary-box card">
              <h3>Appointment Summary</h3>

              <div class="summary-item" *ngIf="bookingState.selectedService() as s">
                <span class="label">Treatment</span>
                <span class="val font-semibold">{{ s.name }}</span>
              </div>

              <div class="summary-item" *ngIf="bookingState.selectedStaff() as st">
                <span class="label">Specialist</span>
                <span class="val">{{ st.user.firstName }} {{ st.user.lastName }} ({{ st.title }})</span>
              </div>

              <div class="summary-item">
                <span class="label">Date</span>
                <span class="val">{{ bookingState.selectedDate() }}</span>
              </div>

              <div class="summary-item">
                <span class="label">Time Slot</span>
                <span class="val">{{ bookingState.selectedTime() }} ({{ bookingState.selectedService()?.durationMinutes }} mins)</span>
              </div>

              <div class="summary-item">
                <span class="label">Location</span>
                <span class="val">14 Victoria Island Blvd, Lagos</span>
              </div>

              <hr />

              <div class="price-breakdown">
                <div class="breakdown-row">
                  <span>Service Subtotal</span>
                  <span>₦{{ bookingState.selectedService()?.price | number:'1.0-0' }}</span>
                </div>
                <div class="breakdown-row text-success" *ngIf="discountAmount > 0">
                  <span>Promo Discount</span>
                  <span>-₦{{ discountAmount | number:'1.0-0' }}</span>
                </div>
                <div class="breakdown-row total-row">
                  <span>Total Amount</span>
                  <span class="total-price">₦{{ finalTotal | number:'1.0-0' }}</span>
                </div>
              </div>

              <div *ngIf="bookingError" class="alert alert-danger">
                <i class="fa-solid fa-triangle-exclamation"></i> {{ bookingError }}
              </div>

              <button
                [disabled]="submittingBooking"
                (click)="confirmBooking()"
                class="btn btn-accent btn-lg w-100 confirm-btn"
              >
                <i *ngIf="submittingBooking" class="fa-solid fa-spinner fa-spin"></i>
                {{ submittingBooking ? 'Reserving...' : 'Confirm & Book Appointment' }}
              </button>
            </div>
          </div>

          <div class="step-actions">
            <button (click)="bookingState.currentStep.set(3)" class="btn btn-ghost btn-lg">
              <i class="fa-solid fa-arrow-left"></i> Back to Date & Time
            </button>
            <div></div>
          </div>
        </div>

        <!-- ================= STEP 5: BOOKING CONFIRMATION ================= -->
        <div *ngIf="bookingState.currentStep() === 5 && bookingState.confirmedAppointment() as apt" class="step-content">
          <div class="confirmation-box card text-center">
            <div class="success-icon-wrap">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <span class="badge badge-success">Booking Confirmed</span>
            <h2>We Look Forward to Welcoming You!</h2>
            <p class="ref-sub">Your appointment reference number is:</p>
            <div class="booking-ref-pill">{{ apt.appointmentNumber }}</div>

            <div class="confirm-details-card">
              <div class="c-row">
                <span>Treatment:</span>
                <strong>{{ apt.service?.name }}</strong>
              </div>
              <div class="c-row">
                <span>Specialist:</span>
                <strong>{{ apt.staff?.user?.firstName }} {{ apt.staff?.user?.lastName }}</strong>
              </div>
              <div class="c-row">
                <span>Date & Time:</span>
                <strong>{{ apt.date }} at {{ apt.startTime }} – {{ apt.endTime }}</strong>
              </div>
              <div class="c-row">
                <span>Total Amount:</span>
                <strong>₦{{ apt.price | number:'1.0-0' }}</strong>
              </div>
              <div class="c-row">
                <span>Payment:</span>
                <strong>{{ apt.paymentMethod === 'PAY_AT_SALON' ? 'Pay upon arrival at studio' : 'Paid' }}</strong>
              </div>
            </div>

            <p class="confirmation-note">
              A confirmation email has been sent with studio directions and preparation guidelines.
            </p>

            <div class="confirm-actions">
              <a *ngIf="authService.currentUser()" routerLink="/customer/appointments" class="btn btn-primary btn-lg">
                View My Appointments
              </a>
              <a routerLink="/" class="btn btn-outline btn-lg">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-page {
      padding: 3rem 0 5rem;
      min-height: 80vh;
    }

    .booking-container {
      max-width: 1040px;
    }

    /* Stepper */
    .stepper-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 3.5rem;

      .step-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;

        .step-num {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--color-surface-alt);
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.95rem;
          border: 1px solid var(--color-border);
          transition: var(--transition);
        }

        .step-text {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        &.active .step-num {
          background: var(--color-primary);
          color: #FFFFFF;
          border-color: var(--color-primary);
        }

        &.current .step-num {
          background: var(--color-accent);
          color: #FFFFFF;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 4px rgba(201, 143, 145, 0.25);
        }

        &.current .step-text {
          color: var(--color-accent);
          font-weight: 600;
        }
      }

      .step-line {
        flex-grow: 1;
        max-width: 100px;
        height: 2px;
        background: var(--color-border);
        margin: 0 0.75rem 1.4rem;

        &.active {
          background: var(--color-primary);
        }
      }
    }

    .step-header {
      margin-bottom: 2.5rem;
      h2 { margin-bottom: 0.4rem; }
      p { font-size: 1.05rem; }
    }

    .category-filter-row {
      display: flex;
      gap: 0.6rem;
      justify-content: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;

      .cat-chip {
        padding: 0.45rem 1.1rem;
        border-radius: var(--radius-full);
        background: #FFFFFF;
        border: 1px solid var(--color-border);
        font-family: var(--font-sans);
        font-size: 0.88rem;
        cursor: pointer;
        transition: var(--transition);

        &.active {
          background: var(--color-primary);
          color: #FFFFFF;
          border-color: var(--color-primary);
        }
      }
    }

    /* Selectable Service Card */
    .selectable-card {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 2px solid transparent;

      .service-thumb {
        height: 180px;
        width: 100%;
        object-fit: cover;
      }

      .selectable-info {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        .meta-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.6rem;
        }

        h3 {
          font-size: 1.15rem;
          margin-bottom: 0.4rem;
        }

        p {
          font-size: 0.85rem;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-grow: 1;
        }

        .price-action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.75rem;
          border-top: 1px solid var(--color-border);

          .price {
            font-family: var(--font-serif);
            font-weight: 700;
            font-size: 1.2rem;
            color: var(--color-primary);
          }
        }
      }

      &.selected {
        border-color: var(--color-accent);
        box-shadow: 0 4px 18px rgba(201, 143, 145, 0.3);
      }
    }

    /* Selectable Staff Card */
    .selectable-staff-card {
      cursor: pointer;
      overflow: hidden;
      border: 2px solid transparent;

      .staff-photo {
        width: 100%;
        height: 220px;
        object-fit: cover;
      }

      .staff-details {
        padding: 1.25rem;
        position: relative;

        .rating-badge {
          position: absolute;
          top: -16px;
          right: 1.25rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: 0.2rem 0.65rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #FFB300;
          box-shadow: var(--shadow-sm);
        }

        h3 { font-size: 1.15rem; margin-bottom: 0.2rem; }
        .title { font-size: 0.82rem; color: var(--color-accent); font-weight: 500; display: block; margin-bottom: 0.6rem; }
        .bio { font-size: 0.85rem; line-height: 1.5; margin-bottom: 0.8rem; }
        .specialty-tag { font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 1.25rem; i { color: var(--color-accent); } }
      }

      &.selected {
        border-color: var(--color-accent);
        box-shadow: 0 4px 18px rgba(201, 143, 145, 0.3);
      }
    }

    /* DateTime layout */
    .datetime-layout {
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      gap: 2rem;
      margin-bottom: 2.5rem;

      .calendar-card, .slots-card {
        padding: 1.75rem;

        h3 {
          font-size: 1.2rem;
          margin-bottom: 0.35rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;

          i { color: var(--color-accent); }
        }

        .sub { font-size: 0.88rem; margin-bottom: 1.25rem; }
      }

      .date-picker-input {
        font-size: 1.05rem;
        padding: 0.85rem;
        cursor: pointer;
        margin-bottom: 1.25rem;
      }

      .quick-dates {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        margin-bottom: 1.5rem;

        .date-pill {
          padding: 0.6rem 0.4rem;
          border-radius: var(--radius-sm);
          background: var(--color-surface-alt);
          border: 1px solid var(--color-border);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: var(--transition);

          .day-name { font-size: 0.72rem; text-transform: uppercase; color: var(--color-text-secondary); }
          .day-num { font-size: 0.9rem; font-weight: 600; color: var(--color-primary); }

          &.active {
            background: var(--color-primary);
            color: #FFFFFF;
            border-color: var(--color-primary);
            .day-name, .day-num { color: #FFFFFF; }
          }
        }
      }

      .salon-hours-note {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.85rem;
        color: var(--color-text-secondary);
        background: var(--color-surface-alt);
        padding: 0.75rem;
        border-radius: var(--radius-sm);

        i { color: var(--color-accent); font-size: 1.1rem; }
      }

      .slots-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        .selected-date-badge {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-accent);
          background: var(--color-accent-light);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
        }
      }

      .slots-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;

        .slot-btn {
          padding: 0.75rem 0.5rem;
          border-radius: var(--radius-sm);
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: var(--transition);

          .slot-time { font-size: 1rem; font-weight: 600; color: var(--color-primary); }
          .slot-status { font-size: 0.72rem; color: var(--color-success); }

          &:hover:not(:disabled) {
            border-color: var(--color-accent);
            background: var(--color-accent-light);
          }

          &.selected {
            background: var(--color-accent);
            border-color: var(--color-accent);
            .slot-time, .slot-status { color: #FFFFFF; }
          }

          &.booked {
            opacity: 0.45;
            cursor: not-allowed;
            background: #F0ECE9;
            .slot-status { color: var(--color-danger); }
          }
        }
      }

      .loading-state, .empty-slots {
        padding: 3rem 1.5rem;
        text-align: center;
        color: var(--color-text-secondary);

        i { font-size: 2rem; color: var(--color-text-muted); margin-bottom: 0.75rem; display: block; }
      }
    }

    /* Review Grid */
    .review-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 2rem;
      margin-bottom: 2.5rem;

      .customer-info-box, .order-summary-box {
        padding: 2rem;
        h3 { margin-bottom: 1.5rem; font-size: 1.25rem; }
      }

      .login-notice {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--color-surface-alt);
        padding: 0.75rem 1rem;
        border-radius: var(--radius-sm);
        font-size: 0.85rem;
        margin-bottom: 1.5rem;

        i { color: var(--color-info); }
        a { color: var(--color-accent); font-weight: 600; text-decoration: underline; }
      }

      .promo-input-row {
        display: flex;
        gap: 0.5rem;
        .text-uppercase { text-transform: uppercase; }
      }

      .promo-feedback {
        display: block;
        margin-top: 0.35rem;
        font-size: 0.82rem;
      }

      .payment-options {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          cursor: pointer;
        }
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.85rem;
        font-size: 0.92rem;

        .label { color: var(--color-text-secondary); }
        .val { color: var(--color-primary); text-align: right; max-width: 60%; }
      }

      hr {
        border: none;
        border-top: 1px solid var(--color-border);
        margin: 1.25rem 0;
      }

      .price-breakdown {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        margin-bottom: 1.5rem;

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;

          &.total-row {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--color-primary);
            padding-top: 0.5rem;
            border-top: 1px dashed var(--color-border);

            .total-price {
              font-family: var(--font-serif);
              color: var(--color-accent);
            }
          }
        }
      }
    }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.88rem;
      margin-bottom: 1rem;

      &.alert-danger {
        background: var(--color-danger-bg);
        color: var(--color-danger);
      }
    }

    /* Confirmation */
    .confirmation-box {
      max-width: 640px;
      margin: 0 auto;
      padding: 3.5rem 2.5rem;

      .success-icon-wrap {
        font-size: 3.5rem;
        color: var(--color-success);
        margin-bottom: 1rem;
      }

      h2 { margin: 1rem 0 0.5rem; }
      .ref-sub { font-size: 0.95rem; }

      .booking-ref-pill {
        display: inline-block;
        font-family: monospace;
        font-size: 1.4rem;
        font-weight: 700;
        background: var(--color-surface-alt);
        border: 2px dashed var(--color-accent);
        color: var(--color-primary);
        padding: 0.5rem 1.5rem;
        border-radius: var(--radius-sm);
        margin: 1rem 0 2rem;
      }

      .confirm-details-card {
        background: var(--color-surface-alt);
        border-radius: var(--radius-sm);
        padding: 1.5rem;
        text-align: left;
        margin-bottom: 1.75rem;

        .c-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.6rem;
          font-size: 0.92rem;

          span { color: var(--color-text-secondary); }
          strong { color: var(--color-primary); }
        }
      }

      .confirmation-note {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
        margin-bottom: 2rem;
      }

      .confirm-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
      }
    }

    .step-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2rem;
    }

    @media (max-width: 800px) {
      .datetime-layout, .review-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class BookingComponent implements OnInit {
  api = inject(ApiService);
  authService = inject(AuthService);
  bookingState = inject(BookingStateService);
  router = inject(Router);

  categories = signal<ServiceCategory[]>([]);
  services = signal<Service[]>([]);
  availableStaff = signal<StaffProfile[]>([]);
  slots = signal<TimeSlot[]>([]);
  selectedCat = signal<string>('all');
  loadingSlots = false;

  // Form inputs
  dateInput = '';
  customerName = '';
  customerEmail = '';
  customerPhone = '';
  customerNotes = '';
  promoInput = '';
  promoMessage = '';
  promoSuccess = false;
  discountAmount = 0;
  payMethod = 'PAY_AT_SALON';
  submittingBooking = false;
  bookingError = '';

  minDate = '';
  upcomingDates: Array<{ val: string; day: string; label: string }> = [];

  filteredServices = computed(() => {
    const cat = this.selectedCat();
    const list = this.services();
    if (cat === 'all') return list;
    return list.filter((s) => s.categoryId === cat);
  });

  get finalTotal(): number {
    const s = this.bookingState.selectedService();
    if (!s) return 0;
    return Math.max(0, s.price - this.discountAmount);
  }

  ngOnInit() {
    this.setupDatePickers();
    this.loadCatalog();

    // If customer already logged in, autofill
    const user = this.authService.currentUser();
    if (user) {
      this.customerName = `${user.firstName} ${user.lastName}`;
      this.customerEmail = user.email;
      this.customerPhone = user.phone || '';
    }

    // If navigated with a preselected service
    if (this.bookingState.selectedService()) {
      this.loadStaffForService();
    }
  }

  setupDatePickers() {
    const now = new Date();
    // Default tomorrow or today
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.minDate = now.toISOString().split('T')[0];
    this.dateInput = tomorrow.toISOString().split('T')[0];

    // Generate next 6 days buttons
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.upcomingDates = [];

    for (let i = 1; i <= 6; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const val = d.toISOString().split('T')[0];
      const day = days[d.getDay()];
      const label = `${months[d.getMonth()]} ${d.getDate()}`;
      this.upcomingDates.push({ val, day, label });
    }
  }

  loadCatalog() {
    this.api.getCategories().subscribe({
      next: (res) => this.categories.set(res.data?.categories || []),
    });
    this.api.getServices({ isActive: true }).subscribe({
      next: (res) => this.services.set(res.data?.services || []),
    });
  }

  selectService(service: Service) {
    this.bookingState.setService(service);
  }

  loadStaffForService() {
    const s = this.bookingState.selectedService();
    if (!s) return;
    this.api.getStaffList({ serviceId: s.id }).subscribe({
      next: (res) => {
        this.availableStaff.set(res.data?.staff || []);
      },
    });
  }

  selectStaff(staff: StaffProfile) {
    this.bookingState.setStaff(staff);
  }

  goToStep3() {
    this.bookingState.currentStep.set(3);
    this.loadSlots();
  }

  onDateChange() {
    this.bookingState.selectedDate.set(this.dateInput);
    this.bookingState.selectedTime.set('');
    this.loadSlots();
  }

  loadSlots() {
    const s = this.bookingState.selectedService();
    const st = this.bookingState.selectedStaff();
    if (!s || !st || !this.dateInput) return;

    this.loadingSlots = true;
    this.api.getTimeSlots(s.id, st.id, this.dateInput).subscribe({
      next: (res) => {
        this.slots.set(res.data?.slots || []);
        this.loadingSlots = false;
      },
      error: () => {
        this.slots.set([]);
        this.loadingSlots = false;
      },
    });
  }

  selectTimeSlot(time: string) {
    this.bookingState.setDateTime(this.dateInput, time);
  }

  prepCustomerStep() {
    const user = this.authService.currentUser();
    if (user && !this.customerName) {
      this.customerName = `${user.firstName} ${user.lastName}`;
      this.customerEmail = user.email;
      this.customerPhone = user.phone || '';
    }
  }

  applyPromo() {
    if (!this.promoInput.trim()) return;
    this.api.validatePromoCode(this.promoInput).subscribe({
      next: (res) => {
        const promo = res.data?.promo;
        if (promo) {
          const s = this.bookingState.selectedService();
          if (s) {
            if (promo.discountPercent) {
              this.discountAmount = (s.price * promo.discountPercent) / 100;
            } else if (promo.discountAmount) {
              this.discountAmount = promo.discountAmount;
            }
            this.promoSuccess = true;
            this.promoMessage = `Promo applied! You saved ₦${this.discountAmount.toLocaleString()}`;
            this.bookingState.promoCode.set(promo.code);
          }
        }
      },
      error: (err) => {
        this.promoSuccess = false;
        this.promoMessage = err.error?.message || 'Invalid promo code';
        this.discountAmount = 0;
      },
    });
  }

  confirmBooking() {
    this.bookingError = '';
    const service = this.bookingState.selectedService();
    const staff = this.bookingState.selectedStaff();
    const date = this.bookingState.selectedDate();
    const startTime = this.bookingState.selectedTime();

    if (!service || !staff || !date || !startTime) {
      this.bookingError = 'Missing required booking selections. Please go back and select all fields.';
      return;
    }

    if (!this.customerName || !this.customerEmail) {
      this.bookingError = 'Please provide your full name and email address.';
      return;
    }

    this.submittingBooking = true;

    // Check if user is logged in or if we should register/login silently or book directly
    if (!this.authService.currentUser()) {
      // Auto-register customer so their booking is saved and they have account access
      const names = this.customerName.trim().split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ') || 'Client';

      this.authService
        .register({
          email: this.customerEmail,
          password: 'Password123!',
          firstName,
          lastName,
          phone: this.customerPhone,
        })
        .subscribe({
          next: () => this.sendBookingRequest(service.id, staff.id, date, startTime),
          error: () => {
            // Email might already exist, try login or send booking
            this.authService
              .login({ email: this.customerEmail, password: 'Password123!' })
              .subscribe({
                next: () => this.sendBookingRequest(service.id, staff.id, date, startTime),
                error: () => {
                  this.submittingBooking = false;
                  this.bookingError = 'An account with this email exists. Please sign in first to book with this email.';
                },
              });
          },
        });
    } else {
      this.sendBookingRequest(service.id, staff.id, date, startTime);
    }
  }

  private sendBookingRequest(serviceId: string, staffId: string, date: string, startTime: string) {
    this.api
      .bookAppointment({
        serviceId,
        staffId,
        date,
        startTime,
        notes: this.customerNotes,
        promoCode: this.bookingState.promoCode(),
        paymentMethod: this.payMethod,
      })
      .subscribe({
        next: (res) => {
          this.submittingBooking = false;
          if (res.data?.appointment) {
            this.bookingState.confirmedAppointment.set(res.data.appointment);
            this.bookingState.currentStep.set(5);
          }
        },
        error: (err) => {
          this.submittingBooking = false;
          this.bookingError = err.error?.message || 'Failed to book appointment. Please try another time slot.';
        },
      });
  }
}
