import { Routes } from '@angular/router';
import { MuscleGroupSelectorComponent } from './components/muscle-group-selector/muscle-group-selector.component';
import { WorkoutSelectorComponent } from './components/workout-selector/workout-selector.component';
import { WorkoutBuilderComponent } from './components/workout-builder/workout-builder.component';
import { WorkoutExecutionComponent } from './workout-execution/workout-execution.component';
import { WorkoutSummaryComponent } from './workout-summary/workout-summary.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorkoutHistoryComponent } from './workout-history/workout-history.component';

export const routes: Routes = [
  { path: 'home-page', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },

  /*{ path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'logout', loadChildren: () => import('./logout/logout.module').then(m => m.LogoutModule) },
  { path: 'forgot-password', loadChildren: () => import('./forgot-password/forgot-password.module').then(*/
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: 'muscle-group-selector', component: MuscleGroupSelectorComponent },
  { path: 'workout-selector', component: WorkoutSelectorComponent },
  { path: 'workout-builder', component: WorkoutBuilderComponent },
  { path: 'workout-execution', component: WorkoutExecutionComponent },
  { path: 'workout-summary', component: WorkoutSummaryComponent },
  { path: 'workout-history', component: WorkoutHistoryComponent },
  { path: '**', redirectTo: '/home-page' },
];
