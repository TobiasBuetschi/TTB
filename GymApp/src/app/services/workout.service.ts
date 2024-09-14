import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkoutSession } from '../models/workout.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private apiUrl = 'http://localhost:3000/api'; // change when going live
  private workouts: WorkoutSession[] = [];
  private workoutsSubject = new BehaviorSubject<WorkoutSession[]>(
    this.workouts
  );

  constructor(private http: HttpClient) {}

  getWorkouts(): Observable<WorkoutSession[]> {
    return this.workoutsSubject.asObservable();
  }

  loadWorkouts(): Observable<WorkoutSession[]> {
    return this.http.get<WorkoutSession[]>(`${this.apiUrl}/workouts`).pipe(
      tap((workouts) => {
        this.workouts = workouts;
        this.workoutsSubject.next(this.workouts);
      })
    );
  }

  addWorkout(workout: WorkoutSession): Observable<WorkoutSession> {
    return this.http
      .post<WorkoutSession>(`${this.apiUrl}/workouts`, workout)
      .pipe(
        tap((newWorkout) => {
          this.workouts.push(newWorkout);
          this.workoutsSubject.next(this.workouts);
        })
      );
  }

  getWorkoutById(id: string): WorkoutSession | undefined {
    return this.workouts.find((workout) => workout.id === id);
  }

  deleteWorkout(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/workouts/${id}`).pipe(
      tap(() => {
        this.workouts = this.workouts.filter((workout) => workout.id !== id);
        this.workoutsSubject.next(this.workouts);
      })
    );
  }
}
