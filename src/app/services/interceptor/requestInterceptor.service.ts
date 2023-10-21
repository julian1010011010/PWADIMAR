import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Router } from '@angular/router';

@Injectable()
export class RequestInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: any = localStorage.getItem('token');
    // Clone the request to add the new header
    const clonedRequest = request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) });
    if (token) {
      return next.handle(clonedRequest).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            localStorage.clear();
            this.router.navigateByUrl('/');
          }
          return throwError(err);
        })
      );
    } else {
      return next.handle(request);
    }
  }


}
