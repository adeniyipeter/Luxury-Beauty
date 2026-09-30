import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="container auth-container">
        <div class="auth-card card">
          <!-- Logo & Brand Header -->
          <div class="auth-header text-center">
            <a routerLink="/" class="auth-logo">
              <span class="logo-accent">Veya</span> Beauty Studio
            </a>
            <p class="tagline">Sign in to manage your appointments & bespoke treatments</p>

            <!-- Mode Tabs -->
            <div class="mode-tabs">
              <button [class.active]="mode === 'login'" (click)="mode = 'login'">Sign In</button>
              <button [class.active]="mode === 'register'" (click)="mode = 'register'">Create Account</button>
            </div>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="alert alert-danger">
            <i class="fa-solid fa-triangle-exclamation"></i> {{ errorMessage }}
          </div>

          <!-- ================= LOGIN FORM ================= -->
          <form *ngIf="mode === 'login'" (ngSubmit)="onLogin()">
            <div class="form-group">
              <label>Email Address</label>
              <input
                type="email"
                class="form-control"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="your@email.com"
              />
            </div>

            <div class="form-group">
              <div class="password-label-row">
                <label>Password</label>
                <a href="#" class="forgot-link" (click)="$event.preventDefault()">Forgot?</a>
              </div>
              <input
                type="password"
                class="form-control"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" [disabled]="loading || !email || !password" class="btn btn-primary btn-lg w-100 submit-btn">
              <i *ngIf="loading" class="fa-solid fa-spinner fa-spin"></i>
              {{ loading ? 'Signing In...' : 'Sign In to Studio' }}
            </button>
          </form>

          <!-- ================= REGISTER FORM ================= -->
          <form *ngIf="mode === 'register'" (ngSubmit)="onRegister()">
            <div class="grid-2 name-grid">
              <div class="form-group">
                <label>First Name *</label>
                <input type="text" class="form-control" [(ngModel)]="regFirstName" name="firstName" required />
              </div>
              <div class="form-group">
                <label>Last Name *</label>
                <input type="text" class="form-control" [(ngModel)]="regLastName" name="lastName" required />
              </div>
            </div>

            <div class="form-group">
              <label>Email Address *</label>
              <input type="email" class="form-control" [(ngModel)]="regEmail" name="email" required placeholder="your@email.com" />
            </div>

            <div class="form-group">
              <label>Phone Number (Optional)</label>
              <input type="tel" class="form-control" [(ngModel)]="regPhone" name="phone" placeholder="+234 800 000 0000" />
            </div>

            <div class="form-group">
              <label>Password *</label>
              <input type="password" class="form-control" [(ngModel)]="regPassword" name="password" required placeholder="Min 6 characters" />
            </div>

            <button type="submit" [disabled]="loading || !regEmail || !regPassword || !regFirstName || !regLastName" class="btn btn-accent btn-lg w-100 submit-btn">
              <i *ngIf="loading" class="fa-solid fa-spinner fa-spin"></i>
              {{ loading ? 'Creating Account...' : 'Register Account' }}
            </button>
          </form>

          <!-- Demo Credentials Quick Buttons -->
          <div class="demo-logins-box">
            <span class="demo-title">Fast Demo Testing Logins:</span>
            <div class="demo-buttons-row">
              <button (click)="fillDemo('admin')" class="demo-btn admin-demo" type="button">
                <i class="fa-solid fa-crown"></i> Admin
              </button>
              <button (click)="fillDemo('staff')" class="demo-btn staff-demo" type="button">
                <i class="fa-solid fa-scissors"></i> Staff
              </button>
              <button (click)="fillDemo('customer')" class="demo-btn customer-demo" type="button">
                <i class="fa-solid fa-user"></i> Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      padding: 4.5rem 0 6rem;
      min-height: 80vh;
      display: flex;
      align-items: center;
    }

    .auth-container {
      max-width: 480px;
    }

    .auth-card {
      padding: 2.75rem 2.25rem;

      .auth-logo {
        font-family: var(--font-serif);
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--color-primary);

        .logo-accent {
          color: var(--color-accent);
          font-style: italic;
        }
      }

      .tagline {
        font-size: 0.9rem;
        margin: 0.5rem 0 1.5rem;
      }
    }

    .mode-tabs {
      display: flex;
      background: var(--color-surface-alt);
      border-radius: var(--radius-full);
      padding: 0.25rem;
      margin-bottom: 2rem;

      button {
        flex: 1;
        padding: 0.6rem 0;
        border: none;
        background: transparent;
        border-radius: var(--radius-full);
        font-family: var(--font-sans);
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: var(--transition);

        &.active {
          background: #FFFFFF;
          color: var(--color-primary);
          box-shadow: var(--shadow-sm);
        }
      }
    }

    .password-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .forgot-link {
        font-size: 0.8rem;
        color: var(--color-accent);
        &:hover { text-decoration: underline; }
      }
    }

    .submit-btn {
      margin-top: 0.75rem;
    }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      margin-bottom: 1.25rem;

      &.alert-danger {
        background: var(--color-danger-bg);
        color: var(--color-danger);
      }
    }

    .demo-logins-box {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px dashed var(--color-border);
      text-align: center;

      .demo-title {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-muted);
        display: block;
        margin-bottom: 0.75rem;
      }

      .demo-buttons-row {
        display: flex;
        gap: 0.5rem;
        justify-content: center;

        .demo-btn {
          flex: 1;
          padding: 0.45rem 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          border: 1px solid var(--color-border);
          background: var(--color-surface-alt);
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;

          &.admin-demo:hover { background: #EFEBE9; color: var(--color-primary); }
          &.staff-demo:hover { background: #E0F2F1; color: #00796B; }
          &.customer-demo:hover { background: var(--color-accent-light); color: var(--color-accent); }
        }
      }
    }

    .name-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  `],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mode: 'login' | 'register' = 'login';
  loading = false;
  errorMessage = '';

  // Login inputs
  email = '';
  password = '';

  // Register inputs
  regFirstName = '';
  regLastName = '';
  regEmail = '';
  regPhone = '';
  regPassword = '';

  onLogin() {
    this.loading = true;
    this.errorMessage = '';

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.redirectAfterAuth(res.data?.user.role);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      },
    });
  }

  onRegister() {
    this.loading = true;
    this.errorMessage = '';

    this.auth
      .register({
        email: this.regEmail,
        password: this.regPassword,
        firstName: this.regFirstName,
        lastName: this.regLastName,
        phone: this.regPhone,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.redirectAfterAuth(res.data?.user.role);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Registration failed.';
        },
      });
  }

  fillDemo(type: 'admin' | 'staff' | 'customer') {
    this.mode = 'login';
    if (type === 'admin') {
      this.email = 'admin@veya.com';
      this.password = 'Admin123!';
    } else if (type === 'staff') {
      this.email = 'ngozi@veya.com';
      this.password = 'Password123!';
    } else {
      this.email = 'customer@veya.com';
      this.password = 'Password123!';
    }
  }

  private redirectAfterAuth(role?: string) {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    if (role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'STAFF') {
      this.router.navigate(['/staff/dashboard']);
    } else {
      this.router.navigate(['/customer/dashboard']);
    }
  }
}
