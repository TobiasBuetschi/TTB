import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-muscle-group-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './muscle-group-selector.component.html',
  styleUrls: ['./muscle-group-selector.component.css'],
})
export class MuscleGroupSelectorComponent {
  muscleGroups = [
    { name: 'Chest', selected: false },
    { name: 'Back', selected: false },
    { name: 'Biceps', selected: false },
    { name: 'Triceps', selected: false },
    { name: 'Shoulder', selected: false },
  ];

  constructor(private router: Router) {}

  confirmSelection() {
    const selectedGroups = this.muscleGroups
      .filter((group) => group.selected)
      .map((group) => group.name);

    console.log('Sending selectedMuscleGroups:', selectedGroups);

    this.router.navigateByUrl('/workout-selector', {
      state: { selectedMuscleGroups: selectedGroups },
    });
  }

  get isAnyGroupSelected(): boolean {
    return this.muscleGroups.some((group) => group.selected);
  }
}
