import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // LocalStorage se token le rahe hain (aap apni jagah se token le sakte hain)
    const token = localStorage.getItem('token');

    if (token) {
      // Request ko clone kar ke Authorization header add karo
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      // Cloned request ko next handler ko bhejo
      return next.handle(clonedRequest);
    } else {
      // Agar token nahi to original request bhejo
      return next.handle(request);
    }
  }
}
