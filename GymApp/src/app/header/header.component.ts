import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string = '';
  showLogoutButton: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.username$.subscribe((username) => {
      this.username = username;
      console.log('Username in header:', this.username);
    });
  }

  toggleLogoutButton() {
    this.showLogoutButton = !this.showLogoutButton;
  }

  onLogout() {
    this.authService.logout();
    this.showLogoutButton = false;
    this.router.navigate(['/login']);
  }
}
