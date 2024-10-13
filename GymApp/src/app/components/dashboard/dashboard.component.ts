import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private router: Router) {}

  startNewWorkout() {
    this.router.navigate(['/muscle-group-selector'], {});
  }

  viewWorkoutHistory() {
    this.router.navigate(['/workout-history']);
  }
}
