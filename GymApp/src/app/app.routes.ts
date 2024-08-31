import { Routes } from '@angular/router';
import { WorkoutBuilderComponent } from './components/workout-builder/workout-builder.component';
import { WorkoutExecutionComponent } from './workout-execution/workout-execution.component';

export const routes: Routes = [
  { path: '', redirectTo: '/workout-builder', pathMatch: 'full' },
  { path: 'workout-builder', component: WorkoutBuilderComponent },
  { path: 'workout-execution', component: WorkoutExecutionComponent },
  { path: '**', redirectTo: '/workout-builder' }, // Wildcard route für 404
];
