import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Exercise } from '../../models/exercise.model';
import { WorkoutSession } from '../../models/workout.model';
import type { WorkoutSet, SetII } from '../../models/workout.model';
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
  selectedMuscleGroups: string[] = [];
  isRandomWorkout = false;
  exercises: Exercise[] = [];
  currentWorkout: SetII[] = [];
  selectedExercises: (Exercise | null)[] = [];
  showAvailableExercises = false;

  constructor(
    private router: Router,
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.selectedMuscleGroups =
        navigation.extras.state['selectedMuscleGroups'] || [];
      this.isRandomWorkout =
        navigation.extras.state['isRandomWorkout'] || false;
    }
  }

  ngOnInit(): void {
    console.log('Selected muscle groups:', this.selectedMuscleGroups);
    console.log('Is random workout:', this.isRandomWorkout);

    this.exerciseService.getExercises().subscribe(
      (exercises: Exercise[]) => {
        console.log('All exercises:', exercises);
        this.exercises = exercises.filter((exercise) =>
          this.selectedMuscleGroups.includes(exercise.category)
        );
        console.log('Filtered exercises:', this.exercises);

        if (this.exercises.length === 0) {
          console.warn(
            'No exercises found for selected muscle groups. Showing all exercises.'
          );
          this.exercises = exercises;
        }

        if (this.isRandomWorkout) {
          this.generateRandomWorkout();
        }
        this.selectedExercises = new Array(this.currentWorkout.length).fill(
          null
        );
      },
      (error) => console.error('Error fetching exercises:', error)
    );
  }

  generateRandomWorkout() {
    this.currentWorkout = [];
    const usedExercises = new Set<string>();

    const addRandomExercise = (
      exercises: Exercise[],
      type: 'Hauptübung' | 'Isolationsübung'
    ): boolean => {
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
          sets: 1,
          reps: 0,
          weight: 0,
        });
        usedExercises.add(randomExercise.id);
        return true;
      }
      return false;
    };

    const addExercises = (
      exercises: Exercise[],
      mainCount: number,
      isolationCount: number
    ) => {
      for (let i = 0; i < mainCount; i++) {
        addRandomExercise(exercises, 'Hauptübung');
      }
      for (let i = 0; i < isolationCount; i++) {
        addRandomExercise(exercises, 'Isolationsübung');
      }
    };

    const muscleGroupConfig: Record<string, [number, number]> = {
      Chest: [2, 2],
      Back: [3, 2],
      Shoulders: [1, 2],
      Biceps: [0, 0],
      Triceps: [0, 0],
    };

    this.selectedMuscleGroups.forEach((group) => {
      const exercisesForGroup = this.exercises.filter(
        (e) => e.category === group
      );
      const [mainCount, isolationCount] = muscleGroupConfig[group] || [0, 0];

      if (group === 'Biceps' || group === 'Triceps') {
        const count =
          this.selectedMuscleGroups.includes('Back') ||
          this.selectedMuscleGroups.includes('Chest')
            ? 2
            : 3;
        addExercises(exercisesForGroup, count, 0);
      } else {
        addExercises(exercisesForGroup, mainCount, isolationCount);
      }
    });

    this.selectedExercises = new Array(this.currentWorkout.length).fill(null);
  }

  drop(event: CdkDragDrop<WorkoutSet[]>) {
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
    if (!this.currentWorkout.some((set) => set.exerciseId === exercise.id)) {
      this.currentWorkout.push({
        exerciseId: exercise.id,
        sets: 1,
        reps: 0,
        weight: 0,
      });
      this.selectedExercises.push(null);
    }
  }

  replaceExercise(index: number): void {
    const newExercise = this.selectedExercises[index];
    if (
      newExercise &&
      !this.currentWorkout.some((set) => set.exerciseId === newExercise.id)
    ) {
      this.currentWorkout[index] = {
        exerciseId: newExercise.id,
        sets: this.currentWorkout[index].sets,
        reps: 0,
        weight: 0,
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

  getAvailableExercises(): Exercise[] {
    const selectedExerciseIds = this.currentWorkout.map(
      (set) => set.exerciseId
    );
    return this.exercises.filter(
      (exercise) => !selectedExerciseIds.includes(exercise.id)
    );
  }

  incrementSets(index: number): void {
    this.currentWorkout[index].sets++;
  }

  decrementSets(index: number): void {
    if (this.currentWorkout[index].sets > 1) {
      this.currentWorkout[index].sets--;
    }
  }
  startWorkout(): void {
    const workoutWithExercises = this.currentWorkout.map((exercise) => ({
      exercise: this.exercises.find((e) => e.id === exercise.exerciseId),
      sets: Array(exercise.sets)
        .fill({})
        .map(() => ({ reps: 0, weight: 0 })),
    }));

    console.log('Workout with exercises:', workoutWithExercises);

    this.router.navigate(['/workout-execution'], {
      state: { workout: workoutWithExercises },
    });
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

  getExerciseImage(exerciseId: string): string {
    const baseUrl = 'assets/exercisePictures/';
    const defaultImage = 'default-exercise.jpg';

    const imageMap: { [key: string]: string } = {
      // Brustübungen
      b1: 'Benchpress.jpeg',
      b2: 'Dumbell Benchpress.jpeg',
      b3: 'Incline Benchpress.jpeg',
      b4: 'InclineDumbellBenchpress.jpeg',
      b5: 'ButterflyNeutral.jpeg',
      b6: 'ButteflyHighLow.jpeg',
      b7: 'ButterflyLowHigh.jpeg',
      b8: 'DumbellButterflys.jpeg',
      b9: 'ButterflyMachine.jpeg',

      // Rückenübungen
      r1: 'PullUp.jpeg',
      r2: 'DumbellRowOnBench.jpeg',
      r3: 'DumbellRow2.jpeg',
      r4: 'PullDown.jpeg',
      r5: 'PulldownMachine.jpeg',
      r6: 'ReverseGripRow.jpeg',
      r7: 'RowMachine.jpeg',
      r8: 'SeatedRowMachine.jpeg',
      r9: 'Pullover.jpeg',
      r10: 'LateralProneRaise.jpeg',
      r11: 'ReverseButterflyMachine.jpeg',
      r12: 'ReverseButterflys.jpeg',

      // Schulterübungen
      s1: 'ShoulderPress.jpeg',
      s2: 'ShoulderPressMachine.jpeg',
      s3: 'SideRaises.jpeg',
      s4: 'ReverseButterflyMachine.jpeg',
      s5: 'ReverseButterflys.jpeg',

      // Bizepsübungen
      bi1: 'BicepCurlsSeated.jpeg',
      bi2: 'BicepsCurl.jpeg',
      bi3: 'CbumCurls.jpeg',
      bi4: 'HammerCurls.jpeg',
      bi5: 'PreacherCurls.jpeg',

      // Trizepsübungen
      t1: 'CableHighOverheadPull.jpeg',
      t2: 'CableLowOverheadPull.jpeg',
      t3: 'FrenchPress.jpeg',
      t4: 'FrenchPressStanding.jpeg',
      t5: 'TricepPullDown.jpeg',
    };

    const imageName = imageMap[exerciseId] || defaultImage;

    return baseUrl + imageName;
  }
}
