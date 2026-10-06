import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toastService.toasts()" 
        class="toast" 
        [ngClass]="toast.type"
      >
        <div class="toast-icon">
          <i class="fa-solid" [ngClass]="{
            'fa-circle-check': toast.type === 'success',
            'fa-circle-exclamation': toast.type === 'error',
            'fa-circle-info': toast.type === 'info',
            'fa-triangle-exclamation': toast.type === 'warning'
          }"></i>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" (click)="toastService.remove(toast.id)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 300px;
      max-width: 400px;
      animation: slideIn 0.3s ease forwards;
    }
    .toast.success { border-left: 4px solid #10b981; }
    .toast.error { border-left: 4px solid #ef4444; }
    .toast.info { border-left: 4px solid #3b82f6; }
    .toast.warning { border-left: 4px solid #f59e0b; }
    
    .toast.success .toast-icon { color: #10b981; }
    .toast.error .toast-icon { color: #ef4444; }
    .toast.info .toast-icon { color: #3b82f6; }
    .toast.warning .toast-icon { color: #f59e0b; }

    .toast-icon {
      font-size: 1.2rem;
    }
    .toast-message {
      flex: 1;
      font-size: 0.95rem;
      color: #374151;
    }
    .toast-close {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      font-size: 1rem;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toast-close:hover {
      color: #4b5563;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
