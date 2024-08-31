import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-muscle-group-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './muscle-group-selector.component.html',
  styleUrls: ['./muscle-group-selector.component.css'],
})
export class MuscleGroupSelectorComponent {
  @Output() selectionConfirmed = new EventEmitter<string[]>();

  muscleGroups = [
    { name: 'Chest', selected: false },
    { name: 'Back', selected: false },
    { name: 'Biceps', selected: false },
    { name: 'Triceps', selected: false },
    { name: 'Shoulder', selected: false },
  ];

  confirmSelection() {
    const selectedGroups = this.muscleGroups
      .filter((group) => group.selected)
      .map((group) => group.name);
    this.selectionConfirmed.emit(selectedGroups);
  }

  get isAnyGroupSelected(): boolean {
    return this.muscleGroups.some((group) => group.selected);
  }
}
