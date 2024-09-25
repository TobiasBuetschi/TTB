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
  showAddExercise = false;

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
    this.showAddExercise = true;
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
    this.showAddExercise = false;
  }

  addDropSet(setIndex: number): void {
    const currentExercise = this.workout[this.currentExerciseIndex];
    if (currentExercise && currentExercise.sets[setIndex]) {
      currentExercise.sets[setIndex].dropSet = { reps: 0, weight: 0 };
    }
  }

  removeDropSet(exerciseIndex: number, setIndex: number): void {
    if (
      this.workout[exerciseIndex] &&
      this.workout[exerciseIndex].sets[setIndex]
    ) {
      if (this.workout[exerciseIndex].sets[setIndex].dropSet) {
        this.workout[exerciseIndex].sets[setIndex].dropSet = undefined;
      }
    }
  }

  getExerciseName(exerciseId: string): string {
    const currentExercise = this.workout[this.currentExerciseIndex];
    return currentExercise ? currentExercise.exercise.name : 'Unknown Exercise';
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
