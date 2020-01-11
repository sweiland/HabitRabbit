/*
 * httperror.interceptor.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';


export class HttperrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          this.snackBar.open(errorMessage, 'Close', {duration: 3000});
          return throwError(errorMessage);
        })
      )
  }
}
