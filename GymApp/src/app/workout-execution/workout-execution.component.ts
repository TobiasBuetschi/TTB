import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Set {
  exerciseId: string;
  reps: number;
  weight: number;
  dropSet?: {
    reps: number;
    weight: number;
  };
}

interface Exercise {
  id: string;
  name: string;
  // ... andere Eigenschaften
}

@Component({
  selector: 'app-workout-execution',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-execution.component.html',
  styleUrls: ['./workout-execution.component.css'],
})
export class WorkoutExecutionComponent implements OnInit {
  workout: { exercise: Exercise; sets: Set[] }[] = [];
  currentExerciseIndex = 0;
  workoutTimer = 0;
  pauseTimer = 0;
  isPaused = false;
  intervalId: any;
  pauseIntervalId: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.workout = navigation.extras.state['workout'];
    }
  }

  ngOnInit(): void {
    this.startWorkoutTimer();
  }

  startWorkoutTimer(): void {
    this.intervalId = setInterval(() => {
      this.workoutTimer++;
    }, 1000);
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pauseIntervalId = setInterval(() => {
        this.pauseTimer++;
      }, 1000);
    } else {
      clearInterval(this.pauseIntervalId);
      this.pauseTimer = 0;
    }
  }

  nextExercise(): void {
    if (this.currentExerciseIndex < this.workout.length - 1) {
      this.currentExerciseIndex++;
    } else {
      // Workout beendet
      clearInterval(this.intervalId);
      // Hier könnten Sie zur Zusammenfassungsseite navigieren
    }
  }

  addDropSet(setIndex: number): void {
    const currentExercise = this.workout[this.currentExerciseIndex];
    if (currentExercise && currentExercise.sets[setIndex]) {
      currentExercise.sets[setIndex].dropSet = { reps: 0, weight: 0 };
    }
  }

  getExerciseName(exerciseId: string): string {
    const currentExercise = this.workout[this.currentExerciseIndex];
    return currentExercise ? currentExercise.exercise.name : 'Unknown Exercise';
  }
}
