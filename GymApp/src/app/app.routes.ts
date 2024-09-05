import { Routes } from '@angular/router';
import { MuscleGroupSelectorComponent } from './components/muscle-group-selector/muscle-group-selector.component';
import { WorkoutSelectorComponent } from './components/workout-selector/workout-selector.component';
import { WorkoutBuilderComponent } from './components/workout-builder/workout-builder.component';
import { WorkoutExecutionComponent } from './workout-execution/workout-execution.component';
import { WorkoutSummaryComponent } from './workout-summary/workout-summary.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/muscle-group-selector', pathMatch: 'full' },
  { path: 'muscle-group-selector', component: MuscleGroupSelectorComponent },
  { path: 'workout-selector', component: WorkoutSelectorComponent },
  { path: 'workout-builder', component: WorkoutBuilderComponent },
  { path: 'workout-execution', component: WorkoutExecutionComponent },
  { path: 'workout-summary', component: WorkoutSummaryComponent },
  { path: '**', redirectTo: '/muscle-group-selector' },
];
