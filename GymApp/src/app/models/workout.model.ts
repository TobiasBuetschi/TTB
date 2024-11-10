import { Exercise } from './exercise.model';

export interface WorkoutSet /*for workout-summary.component*/ {
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
  dropSet?: {
    reps: number;
    weight: number;
  };
}

export interface WorkoutSession {
  _id?: string;
  date: Date;
  duration: number;
  exercises: {
    exerciseId: string;
    sets: {
      reps: number;
      weight: number;
      dropSet?: {
        reps: number;
        weight: number;
      };
    }[];
  }[];
}

export interface SetII /*for workout-builder.component.ts*/ {
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
  dropSet?: {
    reps: number;
    weight: number;
  };
}

export interface SetIII /*for workout-execution.component.ts*/ {
  reps: number;
  weight: number;
  dropSet?: {
    reps: number;
    weight: number;
  };
}
