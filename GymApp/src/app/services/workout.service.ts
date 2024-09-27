import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkoutSession } from '../models/workout.model';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private apiUrl = 'http://localhost:3000/api';
  private workouts: WorkoutSession[] = [];
  private workoutsSubject = new BehaviorSubject<WorkoutSession[]>(
    this.workouts
  );

  constructor(private http: HttpClient, private authService: AuthService) {}

  getWorkouts(): Observable<WorkoutSession[]> {
    return this.workoutsSubject.asObservable();
  }

  loadWorkouts(userId: string): Observable<WorkoutSession[]> {
    return this.http
      .get<WorkoutSession[]>(`${this.apiUrl}/workouts/${userId}`)
      .pipe(
        tap((workouts) => {
          this.workouts = workouts;
          this.workoutsSubject.next(this.workouts);
        })
      );
  }

  addWorkout(workout: WorkoutSession): Observable<WorkoutSession> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    const workoutWithUserId = { ...workout, userId };
    return this.http
      .post<WorkoutSession>(`${this.apiUrl}/workouts`, workoutWithUserId)
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
