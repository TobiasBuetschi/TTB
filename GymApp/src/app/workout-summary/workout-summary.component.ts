import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkoutService } from '../services/workout.service';
import { WorkoutSession } from '../models/workout.model';

@Component({
  selector: 'app-workout-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-summary.component.html',
  styleUrls: ['./workout-summary.component.css'],
})
export class WorkoutSummaryComponent implements OnInit {
  workoutSummary?: WorkoutSession;

  constructor(private router: Router, private workoutService: WorkoutService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.workoutSummary = navigation.extras.state['summary'];
    }
  }

  ngOnInit(): void {
    if (!this.workoutSummary) {
      this.router.navigate(['/']);
    } else {
      console.log('Workout summary:', this.workoutSummary);
    }
  }

  saveWorkout(): void {
    if (this.workoutSummary) {
      this.workoutService.addWorkout(this.workoutSummary).subscribe({
        next: (savedWorkout) => {
          console.log('Workout saved successfully', savedWorkout);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error saving workout', error);
        },
      });
    } else {
      console.error('No workout summary to save');
    }
  }

  deleteWorkout(): void {
    console.log('Workout discarded');
    this.router.navigate(['/dashboard']);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
