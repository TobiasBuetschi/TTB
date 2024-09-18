import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseService } from '../services/exercise.service';
import { SetII, SetIII } from '../models/workout.model';
import { Exercise } from '../models/exercise.model';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseSelectionComponent } from '../exercise-selection/exercise-selection.component';

@Component({
  selector: 'app-workout-execution',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-execution.component.html',
  styleUrls: ['./workout-execution.component.css'],
})
export class WorkoutExecutionComponent implements OnInit {
  workout: { exercise: Exercise; sets: SetIII[] }[] = [];
  currentExerciseIndex = 0;
  workoutTimer = 0;
  pauseTimer = 0;
  isPaused = false;
  intervalId: any;
  pauseIntervalId: any;
  isLastExercise = false;
  availableExercises: Exercise[] = [];

  constructor(
    private router: Router,
    private exerciseService: ExerciseService,
    private dialog: MatDialog
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.workout = navigation.extras.state['workout'];
      console.log('Constructor - Received workout:', this.workout);
    } else {
      console.log('Constructor - No workout data in navigation state');
    }
  }

  ngOnInit(): void {
    console.log('ngOnInit - Workout:', this.workout);
    console.log(
      'ngOnInit - Current Exercise Index:',
      this.currentExerciseIndex
    );
    this.loadAvailableExercises();
    this.checkIfLastExercise();

    if (!this.workout || this.workout.length === 0) {
      console.error('ngOnInit - No workout data available');
      return;
    }

    console.log(
      'ngOnInit - Current Exercise:',
      this.workout[this.currentExerciseIndex]
    );

    this.startWorkoutTimer();
  }

  formatWorkoutTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatPauseTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
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
      this.checkIfLastExercise();
    }
  }

  checkIfLastExercise(): void {
    this.isLastExercise = this.currentExerciseIndex === this.workout.length - 1;
  }

  loadAvailableExercises(): void {
    this.exerciseService.getExercises().subscribe(
      (exercises: Exercise[]) => {
        this.availableExercises = exercises;
      },
      (error) => console.error('Error fetching exercises:', error)
    );
  }

  addExercise(): void {
    const dialogRef = this.dialog.open(ExerciseSelectionComponent, {
      width: '500px',
      data: { exercises: this.availableExercises },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addExerciseToWorkout(result);
      }
    });
  }

  removeSet(exerciseIndex: number, setIndex: number): void {
    if (this.workout[exerciseIndex]) {
      if (this.workout[exerciseIndex].sets.length > 1) {
        this.workout[exerciseIndex].sets.splice(setIndex, 1);
      } else {
        this.workout.splice(exerciseIndex, 1);
        if (this.currentExerciseIndex >= this.workout.length) {
          this.currentExerciseIndex = Math.max(0, this.workout.length - 1);
        }
      }
    }
  }

  addSet(): void {
    if (this.workout[this.currentExerciseIndex]) {
      this.workout[this.currentExerciseIndex].sets.push({ reps: 0, weight: 0 });
    }
  }

  addExerciseToWorkout(exercise: Exercise): void {
    const defaultSets = 3;
    const newExerciseSet = {
      exercise: exercise,
      sets: Array(defaultSets)
        .fill(null)
        .map(() => ({ reps: 0, weight: 0 })),
    };
    this.workout.push(newExerciseSet);
    this.currentExerciseIndex = this.workout.length - 1;
    this.checkIfLastExercise();
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

  endWorkout(): void {
    const workoutSummary = {
      duration: this.workoutTimer,
      exercises: this.workout.map((exercise) => ({
        name: exercise.exercise.name,
        sets: exercise.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
          dropSet: set.dropSet
            ? { reps: set.dropSet.reps, weight: set.dropSet.weight }
            : null,
        })),
      })),
    };
    console.log('Ending workout, summary:', workoutSummary);
    this.router.navigate(['/workout-summary'], {
      state: { summary: workoutSummary },
    });
  }
}
