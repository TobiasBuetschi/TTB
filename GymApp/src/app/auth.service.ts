import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    this._isLoggedIn.next(!!token);
  }

  register(user: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/users/register`, user)
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this._isLoggedIn.next(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/forgot-password`, { email })
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    localStorage.removeItem('token');
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage =
        error.error.message ||
        `Server returned code ${error.status}, error message is: ${error.message}`;
    }
    console.error('HTTP error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
