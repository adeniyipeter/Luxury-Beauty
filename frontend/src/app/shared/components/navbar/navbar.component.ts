import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar">
      <div class="container navbar-inner">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <span class="logo-accent">Veya</span> Beauty Studio
        </a>

        <!-- Desktop Navigation -->
        <nav class="nav-links" [class.open]="mobileMenuOpen">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Home</a>
          <a routerLink="/services" routerLinkActive="active" (click)="closeMenu()">Services</a>
          <a routerLink="/gallery" routerLinkActive="active" (click)="closeMenu()">Gallery</a>
          <a routerLink="/about" routerLinkActive="active" (click)="closeMenu()">About</a>
          <a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">Contact</a>

          <!-- Mobile Only User Links -->
          <div class="mobile-user-actions" *ngIf="mobileMenuOpen">
            <ng-container *ngIf="authService.currentUser() as user; else mobileGuest">
              <a *ngIf="user.role === 'ADMIN'" routerLink="/admin/dashboard" (click)="closeMenu()" class="btn btn-sm btn-outline">Admin Panel</a>
              <a *ngIf="user.role === 'STAFF'" routerLink="/staff/dashboard" (click)="closeMenu()" class="btn btn-sm btn-outline">Staff Portal</a>
              <a *ngIf="user.role === 'CUSTOMER'" routerLink="/customer/dashboard" (click)="closeMenu()" class="btn btn-sm btn-outline">My Account</a>
              <button (click)="authService.logout(); closeMenu()" class="btn btn-sm btn-ghost">Log Out</button>
            </ng-container>
            <ng-template #mobileGuest>
              <a routerLink="/auth/login" (click)="closeMenu()" class="btn btn-sm btn-ghost">Log In</a>
              <a routerLink="/auth/register" (click)="closeMenu()" class="btn btn-sm btn-outline">Sign Up</a>
            </ng-template>
          </div>
        </nav>

        <!-- Right Side: User Menu & Book Appointment CTA -->
        <div class="nav-actions">
          <ng-container *ngIf="authService.currentUser() as user; else guestNav">
            <div class="user-menu-wrapper">
              <button class="user-badge" (click)="toggleDropdown()">
                <img [src]="user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'" alt="Avatar" class="avatar-sm" />
                <span class="user-name">{{ user.firstName }}</span>
                <i class="fa-solid fa-chevron-down chevron-icon"></i>
              </button>

              <div class="user-dropdown" *ngIf="dropdownOpen">
                <div class="dropdown-header">
                  <strong>{{ user.firstName }} {{ user.lastName }}</strong>
                  <span class="badge badge-accent">{{ user.role }}</span>
                </div>
                <hr />
                <a *ngIf="user.role === 'ADMIN'" routerLink="/admin/dashboard" (click)="dropdownOpen = false">
                  <i class="fa-solid fa-chart-pie"></i> Admin Dashboard
                </a>
                <a *ngIf="user.role === 'STAFF'" routerLink="/staff/dashboard" (click)="dropdownOpen = false">
                  <i class="fa-solid fa-calendar-check"></i> Staff Portal
                </a>
                <a *ngIf="user.role === 'CUSTOMER'" routerLink="/customer/dashboard" (click)="dropdownOpen = false">
                  <i class="fa-solid fa-user"></i> My Dashboard
                </a>
                <a *ngIf="user.role === 'CUSTOMER'" routerLink="/customer/appointments" (click)="dropdownOpen = false">
                  <i class="fa-solid fa-clock-rotate-left"></i> My Appointments
                </a>
                <a routerLink="/customer/profile" (click)="dropdownOpen = false">
                  <i class="fa-solid fa-gear"></i> Profile Settings
                </a>
                <hr />
                <button (click)="authService.logout(); dropdownOpen = false" class="logout-btn">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i> Log Out
                </button>
              </div>
            </div>
          </ng-container>

          <ng-template #guestNav>
            <a routerLink="/auth/login" class="btn btn-ghost btn-sm login-btn">Sign In</a>
          </ng-template>

          <a routerLink="/booking" class="btn btn-accent btn-sm book-cta">
            <i class="fa-regular fa-calendar-plus"></i> Book Now
          </a>

          <!-- Mobile Hamburger -->
          <button class="hamburger-btn" (click)="toggleMobileMenu()" aria-label="Toggle Navigation">
            <i [class]="mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      height: 76px;
      display: flex;
      align-items: center;
    }

    .navbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      font-family: var(--font-serif);
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--color-primary);
      letter-spacing: -0.02em;

      .logo-accent {
        color: var(--color-accent);
        font-style: italic;
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;

      a {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        position: relative;
        padding: 0.5rem 0;

        &:hover, &.active {
          color: var(--color-primary);
        }

        &.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--color-accent);
          border-radius: 2px;
        }
      }
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-menu-wrapper {
      position: relative;
    }

    .user-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-surface-alt);
      border: 1px solid var(--color-border);
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      cursor: pointer;
      font-family: var(--font-sans);
      font-weight: 500;
      color: var(--color-primary);

      .avatar-sm {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }

      .chevron-icon {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
      }
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 240px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      padding: 0.75rem 0;
      display: flex;
      flex-direction: column;
      z-index: 1001;

      .dropdown-header {
        padding: 0.5rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.9rem;
      }

      hr {
        border: none;
        border-top: 1px solid var(--color-border);
        margin: 0.5rem 0;
      }

      a, button {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
        color: var(--color-text-primary);
        background: transparent;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        font-family: var(--font-sans);

        &:hover {
          background-color: var(--color-surface-alt);
          color: var(--color-accent);
        }

        i {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
        }
      }

      .logout-btn {
        color: var(--color-danger);
        i { color: var(--color-danger); }
      }
    }

    .hamburger-btn {
      display: none;
      background: none;
      border: none;
      font-size: 1.4rem;
      color: var(--color-primary);
      cursor: pointer;
    }

    .mobile-user-actions {
      display: none;
    }

    @media (max-width: 900px) {
      .hamburger-btn {
        display: block;
      }

      .login-btn {
        display: none;
      }

      .nav-links {
        display: none;
        position: absolute;
        top: 76px;
        left: 0;
        right: 0;
        background: #FFFFFF;
        flex-direction: column;
        padding: 1.5rem;
        gap: 1.25rem;
        border-bottom: 1px solid var(--color-border);
        box-shadow: var(--shadow-md);

        &.open {
          display: flex;
        }

        .mobile-user-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
        }
      }
    }
  `],
})
export class NavbarComponent {
  authService = inject(AuthService);
  mobileMenuOpen = false;
  dropdownOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu() {
    this.mobileMenuOpen = false;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
