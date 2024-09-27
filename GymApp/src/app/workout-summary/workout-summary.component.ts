import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkoutService } from '../services/workout.service';
import { WorkoutSession } from '../models/workout.model';

interface WorkoutSummary {
  id?: string;
  date?: Date;
  duration: number;
  exercises: {
    name: string;
    sets: {
      reps: number;
      weight: number;
      dropSet?: {
        reps: number;
        weight: number;
      } | null;
    }[];
  }[];
  sets?: {
    reps: number;
    weight: number;
    dropSet?: {
      reps: number;
      weight: number;
    } | null;
  }[];
}

@Component({
  selector: 'app-workout-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-summary.component.html',
  styleUrls: ['./workout-summary.component.css'],
})
export class WorkoutSummaryComponent implements OnInit {
  workoutSummary?: WorkoutSummary;

  constructor(private router: Router, private workoutService: WorkoutService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.workoutSummary = <WorkoutSummary>navigation.extras.state['summary'];
      if (this.workoutSummary) {
        this.workoutSummary.id =
          this.workoutSummary.id || Date.now().toString();
        this.workoutSummary.date = this.workoutSummary.date || new Date();
        this.workoutSummary.sets = this.workoutSummary.exercises.flatMap(
          (e) => e.sets
        );
      }
    }
  }

  ngOnInit(): void {
    if (!this.workoutSummary) {
      console.log('No workout summary available');
      this.router.navigate(['/']);
    } else {
      console.log('Workout summary:', this.workoutSummary);
    }
  }

  saveWorkout(): void {
    if (this.workoutSummary) {
      const workoutSession: WorkoutSession = {
        id: this.workoutSummary.id || Date.now().toString(),
        date: this.workoutSummary.date || new Date(),
        duration: this.workoutSummary.duration,
        exercises: this.workoutSummary.exercises.map((exercise) => ({
          exerciseId: exercise.name,
          sets: exercise.sets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            dropSet: set.dropSet
              ? {
                  reps: set.dropSet.reps,
                  weight: set.dropSet.weight,
                }
              : undefined,
          })),
        })),
      };

      this.workoutService.addWorkout(workoutSession).subscribe({
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
