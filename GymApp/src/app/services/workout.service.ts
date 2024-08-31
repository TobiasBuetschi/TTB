import { Injectable } from '@angular/core';
import { WorkoutSession } from '../models/workout.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private workouts: WorkoutSession[] = [];
  private workoutsSubject = new BehaviorSubject<WorkoutSession[]>(
    this.workouts
  );

  constructor() {}

  getWorkouts(): Observable<WorkoutSession[]> {
    return this.workoutsSubject.asObservable();
  }

  addWorkout(workout: WorkoutSession): void {
    this.workouts.push(workout);
    this.workoutsSubject.next(this.workouts);
  }

  getWorkoutById(id: string): WorkoutSession | undefined {
    return this.workouts.find((workout) => workout.id === id);
  }
}
