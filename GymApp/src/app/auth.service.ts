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
  isGuestMode: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this._isLoggedIn.next(isLoggedIn);

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
            localStorage.setItem('isLoggedIn', 'true');
            if (response.username) {
              this.setUsername(response.username);
            } else {
              console.error('Username not provided in login response');
              this.setUsername(usernameOrEmail);
            }
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
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.setItem('isLoggedIn', 'false');
    this._isLoggedIn.next(false);
    this._username.next('');
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

  enterGuestMode() {
    this.isGuestMode = true;
  }

  exitGuestMode() {
    this.isGuestMode = false;
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
