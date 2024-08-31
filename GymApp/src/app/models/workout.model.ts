import { Exercise } from './exercise.model';

export interface Set {
  exerciseId: string;
  sets: number;
}

export interface WorkoutSession {
  id: string;
  date: Date;
  sets: Set[];
}
