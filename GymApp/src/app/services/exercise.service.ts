import { Injectable } from '@angular/core';
import { Exercise } from '../models/exercise.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private exercises: Exercise[] = [
    // Brustübungen
    { id: 'b1', name: 'Benchpress', category: 'Brust', type: 'Hauptübung' },
    {
      id: 'b2',
      name: 'Dumbell Benchpress',
      category: 'Chest',
      type: 'Hauptübung',
    },
    {
      id: 'b3',
      name: 'Incline Benchpress',
      category: 'Chest',
      type: 'Hauptübung',
    },
    {
      id: 'b4',
      name: 'Incline Dumbell Benchpress',
      category: 'Chest',
      type: 'Hauptübung',
    },
    {
      id: 'b5',
      name: 'Butterfly neutral',
      category: 'Chest',
      type: 'Isolationsübung',
    },
    {
      id: 'b6',
      name: 'Butterfly High to low',
      category: 'Chest',
      type: 'Isolationsübung',
    },
    {
      id: 'b7',
      name: 'Butterfly low to high',
      category: 'Chest',
      type: 'Isolationsübung',
    },
    {
      id: 'b8',
      name: 'Dumbell Butterflys',
      category: 'Chest',
      type: 'Isolationsübung',
    },
    {
      id: 'b9',
      name: 'Machinebutterflys',
      category: 'Chest',
      type: 'Isolationsübung',
    },

    // Rückenübungen
    { id: 'r1', name: 'Pullups', category: 'Back', type: 'Hauptübung' },
    {
      id: 'r2',
      name: 'Dumbellrow on Bench',
      category: 'Back',
      type: 'Hauptübung',
    },
    { id: 'r3', name: 'Dumbellrow', category: 'Back', type: 'Hauptübung' },
    { id: 'r4', name: 'Pulldowns', category: 'Back', type: 'Hauptübung' },
    {
      id: 'r5',
      name: 'Machinepulldowns',
      category: 'Back',
      type: 'Hauptübung',
    },
    {
      id: 'r6',
      name: 'Reverse Grip Row',
      category: 'Back',
      type: 'Hauptübung',
    },
    { id: 'r7', name: 'Row Machine', category: 'Back', type: 'Hauptübung' },
    { id: 'r8', name: 'CableRows', category: 'Back', type: 'Hauptübung' },
    { id: 'r9', name: 'Pullover', category: 'Back', type: 'Isolationsübung' },
    {
      id: 'r10',
      name: 'Lateral prone Raises',
      category: 'Back',
      type: 'Isolationsübung',
    },
    {
      id: 'r11',
      name: 'Machine reverse Butterflys',
      category: 'Back',
      type: 'Isolationsübung',
    },
    {
      id: 'r12',
      name: 'Cable reverse Butterflys',
      category: 'Back',
      type: 'Isolationsübung',
    },

    // Schulterübungen
    {
      id: 's1',
      name: 'Shoulderpress',
      category: 'Shoulder',
      type: 'Hauptübung',
    },
    {
      id: 's2',
      name: 'Machine Shoulderpress',
      category: 'Shoulder',
      type: 'Hauptübung',
    },
    {
      id: 's3',
      name: 'Sideraises',
      category: 'Shoulder',
      type: 'Isolationsübung',
    },
    {
      id: 's4',
      name: 'Machine reverse Butterflys',
      category: 'Shoulder',
      type: 'Isolationsübung',
    },
    {
      id: 's5',
      name: 'Cable reverse Butterflys',
      category: 'Shoulder',
      type: 'Isolationsübung',
    },

    // Bizepsübungen
    {
      id: 'bi1',
      name: 'Bizepscurls seated',
      category: 'Biceps',
      type: 'Hauptübung',
    },
    { id: 'bi2', name: 'Bizepscurls', category: 'Biceps', type: 'Hauptübung' },
    { id: 'bi3', name: 'Cbum Curls', category: 'Biceps', type: 'Hauptübung' },
    { id: 'bi4', name: 'Hammer Curls', category: 'Biceps', type: 'Hauptübung' },
    {
      id: 'bi5',
      name: 'Preacher Curls',
      category: 'Biceps',
      type: 'Hauptübung',
    },

    // Trizepsübungen
    {
      id: 't1',
      name: 'Cable Overheadpull high',
      category: 'Triceps',
      type: 'Hauptübung',
    },
    {
      id: 't2',
      name: 'Cable Overheadpull low',
      category: 'Triceps',
      type: 'Hauptübung',
    },
    { id: 't3', name: 'Frenchpress', category: 'Triceps', type: 'Hauptübung' },
    {
      id: 't4',
      name: 'Frenchpress standing',
      category: 'Triceps',
      type: 'Hauptübung',
    },
    {
      id: 't5',
      name: 'Tricep Pulldown',
      category: 'Triceps',
      type: 'Hauptübung',
    },
  ];

  private exercisesSubject = new BehaviorSubject<Exercise[]>(this.exercises);

  constructor() {}

  getExercises(): Observable<Exercise[]> {
    return this.exercisesSubject.asObservable();
  }

  getExercisesByCategory(category: string): Exercise[] {
    return this.exercises.filter((exercise) => exercise.category === category);
  }

  getExercisesByCategoryAndType(
    category: string,
    type: 'Hauptübung' | 'Isolationsübung'
  ): Exercise[] {
    return this.exercises.filter(
      (exercise) => exercise.category === category && exercise.type === type
    );
  }
}
