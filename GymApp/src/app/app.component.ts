import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkoutBuilderComponent } from './components/workout-builder/workout-builder.component';
import { MuscleGroupSelectorComponent } from './components/muscle-group-selector/muscle-group-selector.component';
import { WorkoutSelectorComponent } from './components/workout-selector/workout-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    WorkoutBuilderComponent,
    MuscleGroupSelectorComponent,
    WorkoutSelectorComponent,
  ],
  template: `
    <h1>{{ title }}</h1>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Workout App';
}
