import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkoutBuilderComponent } from './components/workout-builder/workout-builder.component';
import { MuscleGroupSelectorComponent } from './components/muscle-group-selector/muscle-group-selector.component';
import { WorkoutSelectorComponent } from './components/workout-selector/workout-selector.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    WorkoutBuilderComponent,
    MuscleGroupSelectorComponent,
    WorkoutSelectorComponent,
  ],
  template: `
    <app-header></app-header>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'TTB';
}
