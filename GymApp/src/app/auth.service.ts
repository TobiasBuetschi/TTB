import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

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

  register(username: string, email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/users/register`, { username, email, password })
      .pipe(
        catchError((error) => {
          console.error('Registration error', error);
          return throwError(
            () =>
              new Error(
                error.error.message || 'Registration failed. Please try again.'
              )
          );
        })
      );
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
        catchError((error) => {
          console.error('Login error', error);
          throw error;
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/forgot-password`, { email })
      .pipe(
        catchError((error) => {
          console.error('Forgot password error', error);
          throw error;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }
}
