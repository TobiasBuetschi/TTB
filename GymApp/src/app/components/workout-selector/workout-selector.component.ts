import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workout-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-selector.component.html',
  styleUrls: ['./workout-selector.component.css'],
})
export class WorkoutSelectorComponent {
  @Input() selectedMuscleGroups: string[] = [];
  @Output() selectionMade = new EventEmitter<'custom' | 'random'>();

  selectCustomWorkout() {
    this.selectionMade.emit('custom');
  }

  selectRandomWorkout() {
    this.selectionMade.emit('random');
  }
}
