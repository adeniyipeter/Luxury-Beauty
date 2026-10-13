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
      height: 68px;
      display: flex;
      align-items: center;

      @media (min-width: 900px) {
        height: 76px;
      }
    }

    .navbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .logo {
      font-family: var(--font-serif);
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--color-primary);
      letter-spacing: -0.02em;
      white-space: nowrap;

      .logo-accent {
        color: var(--color-accent);
        font-style: italic;
      }

      @media (min-width: 640px) {
        font-size: 1.6rem;
      }
    }

    .nav-links {
      display: none;
      position: fixed;
      top: 68px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(16px);
      flex-direction: column;
      padding: 1.5rem 1.25rem 2.5rem;
      gap: 0.4rem;
      overflow-y: auto;
      border-bottom: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      z-index: 999;

      &.open {
        display: flex;
      }

      a {
        font-size: 1.05rem;
        font-weight: 500;
        color: var(--color-text-primary);
        padding: 0.85rem 1rem;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        transition: var(--transition);

        &:hover, &.active {
          background: var(--color-surface-alt);
          color: var(--color-accent);
        }
      }

      .mobile-user-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
        margin-top: 1rem;
        padding-top: 1.25rem;
        border-top: 1px solid var(--color-border);

        .btn {
          width: 100%;
          justify-content: center;
        }
      }

      @media (min-width: 900px) {
        display: flex;
        position: static;
        background: transparent;
        backdrop-filter: none;
        flex-direction: row;
        padding: 0;
        gap: 2rem;
        overflow-y: visible;
        box-shadow: none;
        border-bottom: none;
        z-index: auto;

        a {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          position: relative;
          padding: 0.5rem 0;
          border-radius: 0;

          &:hover, &.active {
            background: transparent;
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

        .mobile-user-actions {
          display: none;
        }
      }
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      @media (min-width: 640px) {
        gap: 1rem;
      }
    }

    .book-cta {
      padding: 0.45rem 0.85rem;
      font-size: 0.82rem;
      min-height: 38px;

      @media (min-width: 640px) {
        padding: 0.5rem 1.15rem;
        font-size: 0.88rem;
        min-height: 40px;
      }
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
      padding: 0.3rem 0.6rem;
      border-radius: var(--radius-full);
      cursor: pointer;
      font-family: var(--font-sans);
      font-weight: 500;
      color: var(--color-primary);
      min-height: 38px;

      .avatar-sm {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
      }

      .user-name {
        display: none;
        font-size: 0.88rem;

        @media (min-width: 500px) {
          display: inline;
        }
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
      width: min(250px, calc(100vw - 2rem));
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
        padding: 0.65rem 1rem;
        font-size: 0.9rem;
        color: var(--color-text-primary);
        background: transparent;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        font-family: var(--font-sans);
        min-height: 44px;

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

    .login-btn {
      display: none;

      @media (min-width: 900px) {
        display: inline-flex;
      }
    }

    .hamburger-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: none;
      border: none;
      font-size: 1.35rem;
      color: var(--color-primary);
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: var(--transition);

      &:hover {
        background: var(--color-surface-alt);
      }

      @media (min-width: 900px) {
        display: none;
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
