import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ApiResponseInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<unknown>) => {
        // Handle successful responses
        if (event instanceof HttpResponse) {
          // Only show success toasts for mutations (POST, PUT, PATCH, DELETE)
          const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
          
          if (isMutation && event.body && typeof event.body === 'object' && 'message' in event.body) {
            const body = event.body as any;
            if (body.message) {
              this.toastService.success(body.message);
            }
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle error responses
        let errorMsg = 'An unknown error occurred';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMsg = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMsg = error.error?.message || error.message;
        }
        
        // Don't show toast for 401s if it's handled by AuthInterceptor
        if (error.status !== 401) {
          this.toastService.error(errorMsg);
        }
        
        return throwError(() => error);
      })
    );
  }
}
