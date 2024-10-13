import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutService } from '../services/workout.service';
import { WorkoutSession } from '../models/workout.model';
import { AuthService } from '../auth.service';
import { ExerciseService } from '../services/exercise.service';

@Component({
  selector: 'app-workout-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-history.component.html',
  styleUrls: ['./workout-history.component.css'],
})
export class WorkoutHistoryComponent implements OnInit {
  workouts: WorkoutSession[] = [];
  expandedWorkoutId: string | null = null;

  constructor(
    private workoutService: WorkoutService,
    private authService: AuthService,
    private exerciseService: ExerciseService
  ) {}

  ngOnInit(): void {
    this.loadWorkoutHistory();
  }

  loadWorkoutHistory(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.workoutService.loadWorkouts(userId).subscribe({
        next: (workouts) => {
          this.workouts = workouts.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          console.log('Workout history loaded', this.workouts);
          console.log(
            'Workout IDs:',
            this.workouts.map((w) => w._id)
          );
        },
        error: (error) => {
          console.error('Error loading workout history', error);
        },
      });
    } else {
      console.error('User not logged in');
    }
  }

  deleteWorkout(workoutId: string): void {
    if (!workoutId) {
      console.error('Workout ID is undefined');
      return;
    }

    console.log('Attempting to delete workout with ID:', workoutId);
    if (confirm('Are you sure you want to delete this workout?')) {
      this.workoutService.deleteWorkout(workoutId).subscribe({
        next: () => {
          console.log('Workout deleted successfully');
          this.workouts = this.workouts.filter(
            (workout) => workout._id !== workoutId
          );
        },
        error: (error) => {
          console.error('Error deleting workout', error);
        },
      });
    }
  }

  toggleWorkoutDetails(workoutId: string): void {
    this.expandedWorkoutId =
      this.expandedWorkoutId === workoutId ? null : workoutId;
  }

  getWorkoutMuscleGroups(workout: WorkoutSession): string {
    if (!workout.exercises || workout.exercises.length === 0)
      return 'No exercises';

    const muscleGroups = new Set<string>();

    workout.exercises.forEach((exercise) => {
      const exerciseIdOrName = exercise.exerciseId;
      let fullExercise = this.exerciseService.getExerciseById(exerciseIdOrName);

      if (!fullExercise) {
        fullExercise = this.exerciseService
          .getAllExercises()
          .find((e) => e.name.toLowerCase() === exerciseIdOrName.toLowerCase());
      }

      if (fullExercise && fullExercise.category) {
        muscleGroups.add(fullExercise.category);
      } else {
        console.warn(`Exercise not found: ${exerciseIdOrName}`);
      }
    });

    return Array.from(muscleGroups).join(', ') || 'Unknown';
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatTime(seconds: number | undefined): string {
    if (seconds === undefined) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getExerciseName(exerciseId: string): string {
    const exercise = this.exerciseService.getExerciseById(exerciseId);
    return exercise ? exercise.name : exerciseId;
  }
}
