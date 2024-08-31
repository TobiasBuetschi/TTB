import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutBuilderComponent } from './components/workout-builder/workout-builder.component';
import { MuscleGroupSelectorComponent } from './components/muscle-group-selector/muscle-group-selector.component';
import { WorkoutSelectorComponent } from './components/workout-selector/workout-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    WorkoutBuilderComponent,
    MuscleGroupSelectorComponent,
    WorkoutSelectorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Workout App';
  selectedMuscleGroups: string[] = [];
  showMuscleGroupSelector = true;
  showWorkoutSelector = false;
  showWorkoutBuilder = false;
  isRandomWorkout = false;

  onMuscleGroupsSelected(groups: string[]) {
    this.selectedMuscleGroups = groups;
    this.showMuscleGroupSelector = false;
    this.showWorkoutSelector = true;
  }

  onWorkoutTypeSelected(type: 'custom' | 'random') {
    this.isRandomWorkout = type === 'random';
    this.showWorkoutSelector = false;
    this.showWorkoutBuilder = true;
  }
}
