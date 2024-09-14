import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutService } from '../services/workout.service';
import { WorkoutSession } from '../models/workout.model';

@Component({
  selector: 'app-workout-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-history.component.html',
  styleUrls: ['./workout-history.component.css'],
})
export class WorkoutHistoryComponent implements OnInit {
  workouts: WorkoutSession[] = [];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.loadWorkoutHistory();
  }

  loadWorkoutHistory(): void {
    this.workoutService.loadWorkouts().subscribe({
      next: (workouts) => {
        this.workouts = workouts;
        console.log('Workout history loaded', this.workouts);
      },
      error: (error) => {
        console.error('Error loading workout history', error);
      },
    });
  }

  deleteWorkout(workoutId: string): void {
    this.workoutService.deleteWorkout(workoutId).subscribe({
      next: () => {
        console.log('Workout deleted successfully');
        this.loadWorkoutHistory();
      },
      error: (error) => {
        console.error('Error deleting workout', error);
      },
    });
  }
}
