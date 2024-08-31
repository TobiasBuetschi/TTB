import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Exercise } from '../../models/exercise.model';
import { WorkoutSession } from '../../models/workout.model';
import type { Set } from '../../models/workout.model';
import { ExerciseService } from '../../services/exercise.service';
import { WorkoutService } from '../../services/workout.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './workout-builder.component.html',
  styleUrls: ['./workout-builder.component.css'],
})
export class WorkoutBuilderComponent implements OnInit {
  @Input() selectedMuscleGroups: string[] = [];
  @Input() isRandomWorkout = false;
  exercises: Exercise[] = [];
  currentWorkout: Set[] = [];
  selectedExercises: (Exercise | null)[] = [];
  showAvailableExercises = false;

  constructor(
    private router: Router,
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService
  ) {}

  ngOnInit(): void {
    this.exerciseService.getExercises().subscribe((exercises: Exercise[]) => {
      this.exercises = exercises.filter((exercise) =>
        this.selectedMuscleGroups.includes(exercise.category)
      );
      if (this.isRandomWorkout) {
        this.generateRandomWorkout();
      }
      this.selectedExercises = new Array(this.currentWorkout.length).fill(null);
    });
  }

  generateRandomWorkout() {
    this.currentWorkout = [];
    const usedExercises = new Set<string>();

    this.selectedMuscleGroups.forEach((group) => {
      const exercisesForGroup = this.exercises.filter(
        (e) => e.category === group
      );

      const addRandomExercise = (
        exercises: Exercise[],
        type: 'Hauptübung' | 'Isolationsübung'
      ) => {
        const availableExercises = exercises.filter(
          (e) => e.type === type && !usedExercises.has(e.id)
        );
        if (availableExercises.length > 0) {
          const randomExercise =
            availableExercises[
              Math.floor(Math.random() * availableExercises.length)
            ];
          this.currentWorkout.push({
            exerciseId: randomExercise.id,
            sets: type === 'Hauptübung' ? 4 : 3,
          });
          usedExercises.add(randomExercise.id);
        }
      };

      switch (group) {
        case 'Chest':
          addRandomExercise(exercisesForGroup, 'Hauptübung');
          addRandomExercise(exercisesForGroup, 'Hauptübung');
          addRandomExercise(exercisesForGroup, 'Isolationsübung');
          addRandomExercise(exercisesForGroup, 'Isolationsübung');
          break;
        case 'Back':
          for (let i = 0; i < 3; i++)
            addRandomExercise(exercisesForGroup, 'Hauptübung');
          for (let i = 0; i < 2; i++)
            addRandomExercise(exercisesForGroup, 'Isolationsübung');
          break;
        case 'Shoulder':
          addRandomExercise(exercisesForGroup, 'Hauptübung');
          addRandomExercise(exercisesForGroup, 'Isolationsübung');
          addRandomExercise(exercisesForGroup, 'Isolationsübung');
          break;
        case 'Biceps':
        case 'Triceps':
          const count =
            this.selectedMuscleGroups.includes('Back') ||
            this.selectedMuscleGroups.includes('Chest')
              ? 2
              : 3;
          for (let i = 0; i < count; i++)
            addRandomExercise(exercisesForGroup, 'Hauptübung');
          break;
      }
    });

    this.selectedExercises = new Array(this.currentWorkout.length).fill(null);
  }

  drop(event: CdkDragDrop<Set[]>) {
    moveItemInArray(
      this.currentWorkout,
      event.previousIndex,
      event.currentIndex
    );
    moveItemInArray(
      this.selectedExercises,
      event.previousIndex,
      event.currentIndex
    );
  }

  toggleAvailableExercises() {
    this.showAvailableExercises = !this.showAvailableExercises;
  }

  addExerciseToWorkout(exercise: Exercise): void {
    this.currentWorkout.push({
      exerciseId: exercise.id,
      sets: exercise.type === 'Hauptübung' ? 4 : 3,
    });
    this.selectedExercises.push(null);
  }

  replaceExercise(index: number): void {
    const newExercise = this.selectedExercises[index];
    if (newExercise) {
      this.currentWorkout[index] = {
        exerciseId: newExercise.id,
        sets: newExercise.type === 'Hauptübung' ? 4 : 3,
      };
      this.selectedExercises[index] = null;
    }
  }

  removeExercise(index: number): void {
    this.currentWorkout.splice(index, 1);
    this.selectedExercises.splice(index, 1);
  }

  moveExercise(index: number, direction: 'up' | 'down'): void {
    if (direction === 'up' && index > 0) {
      [this.currentWorkout[index], this.currentWorkout[index - 1]] = [
        this.currentWorkout[index - 1],
        this.currentWorkout[index],
      ];
      [this.selectedExercises[index], this.selectedExercises[index - 1]] = [
        this.selectedExercises[index - 1],
        this.selectedExercises[index],
      ];
    } else if (direction === 'down' && index < this.currentWorkout.length - 1) {
      [this.currentWorkout[index], this.currentWorkout[index + 1]] = [
        this.currentWorkout[index + 1],
        this.currentWorkout[index],
      ];
      [this.selectedExercises[index], this.selectedExercises[index + 1]] = [
        this.selectedExercises[index + 1],
        this.selectedExercises[index],
      ];
    }
  }
  startWorkout(): void {
    console.log('startWorkout method called');
    console.log('Current workout:', this.currentWorkout);

    const workoutWithExercises = this.currentWorkout.map((set) => ({
      exercise: this.exercises.find((e) => e.id === set.exerciseId)!,
      sets: [{ reps: 0, weight: 0, exerciseId: set.exerciseId }],
    }));

    console.log('Workout with exercises:', workoutWithExercises);

    this.router
      .navigate(['/workout-execution'], {
        state: { workout: workoutWithExercises },
      })
      .then(() => {
        console.log('Navigation successful');
      })
      .catch((error) => {
        console.error('Navigation failed:', error);
      });
  }

  saveWorkout(): void {
    const workout: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date(),
      sets: this.currentWorkout,
    };
    this.workoutService.addWorkout(workout);
    this.currentWorkout = [];
    this.selectedExercises = [];
  }

  getExerciseName(exerciseId: string): string {
    const exercise = this.exercises.find((e) => e.id === exerciseId);
    return exercise ? exercise.name : '';
  }

  getExerciseType(
    exerciseId: string
  ): 'Hauptübung' | 'Isolationsübung' | undefined {
    const exercise = this.exercises.find((e) => e.id === exerciseId);
    return exercise?.type;
  }
}
