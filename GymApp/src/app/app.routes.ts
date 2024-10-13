import { Routes } from '@angular/router';
import { MuscleGroupSelectorComponent } from './components/muscle-group-selector/muscle-group-selector.component';
import { WorkoutSelectorComponent } from './components/workout-selector/workout-selector.component';
import { WorkoutBuilderComponent } from './components/workout-builder/workout-builder.component';
import { WorkoutExecutionComponent } from './components/workout-execution/workout-execution.component';
import { WorkoutSummaryComponent } from './components/workout-summary/workout-summary.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WorkoutHistoryComponent } from './components/workout-history/workout-history.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'home-page', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  /*{ path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'logout', loadChildren: () => import('./logout/logout.module').then(m => m.LogoutModule) },
  { path: 'forgot-password', loadChildren: () => import('./forgot-password/forgot-password.module').then(*/
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  {
    path: 'muscle-group-selector',
    component: MuscleGroupSelectorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'workout-selector',
    component: WorkoutSelectorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'workout-builder',
    component: WorkoutBuilderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'workout-execution',
    component: WorkoutExecutionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'workout-summary',
    component: WorkoutSummaryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'workout-history',
    component: WorkoutHistoryComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/home-page' },
];
