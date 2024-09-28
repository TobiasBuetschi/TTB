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
  private _username = new BehaviorSubject<string>('');
  username$ = this._username.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    this._isLoggedIn.next(!!token);

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this._username.next(storedUsername);
    }
  }

  register(user: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/register`, user)
      .pipe(catchError(this.handleError));
  }

  login(usernameOrEmail: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { usernameOrEmail, password })
      .pipe(
        tap((response: any) => {
          console.log('Login response:', response);
          if (response.userId) {
            localStorage.setItem('userId', response.userId);
            if (response.username) {
              this.setUsername(response.username);
            } else {
              console.error('Username not provided in login response');
              this.setUsername(usernameOrEmail);
            }
            this._isLoggedIn.next(true);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            return throwError(
              () => new Error('Invalid username/email or password')
            );
          }
          return throwError(() => new Error('An unexpected error occurred'));
        })
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

  setUsername(username: string): void {
    this._username.next(username);
    localStorage.setItem('username', username);
  }

  getUsername(): string {
    return this._username.value || localStorage.getItem('username') || '';
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
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
