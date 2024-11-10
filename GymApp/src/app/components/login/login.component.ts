import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  usernameOrEmail: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.usernameOrEmail, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = error.message || 'An unexpected error occurred';
      },
    });
  }
  onForgotPassword() {
    if (!this.usernameOrEmail) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.authService.forgotPassword(this.usernameOrEmail).subscribe({
      next: (response) => {
        console.log('Password reset email sent');
        this.successMessage =
          'A password reset link has been sent to your email.';
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Forgot password failed', error);
        this.errorMessage =
          'Failed to send password reset email. Please try again.';
        this.successMessage = '';
      },
    });
  }

  onSignUp() {
    console.log('Sign up clicked');
    this.router.navigate(['/register']);
  }

  enterGuestMode() {
    this.authService.enterGuestMode();
    this.router.navigate(['/dashboard']);
  }
}
