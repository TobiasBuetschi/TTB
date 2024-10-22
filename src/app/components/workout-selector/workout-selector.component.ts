import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-selector.component.html',
  styleUrls: ['./workout-selector.component.css'],
})
export class WorkoutSelectorComponent implements OnInit {
  selectedMuscleGroups: string[] = [];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.selectedMuscleGroups =
        navigation.extras.state['selectedMuscleGroups'] || [];
    }
  }

  ngOnInit() {
    console.log('Received selectedMuscleGroups:', this.selectedMuscleGroups);
  }

  selectCustomWorkout() {
    this.router.navigate(['/workout-builder'], {
      state: {
        selectedMuscleGroups: this.selectedMuscleGroups,
        isRandomWorkout: false,
      },
    });
  }

  selectRandomWorkout() {
    this.router.navigate(['/workout-builder'], {
      state: {
        selectedMuscleGroups: this.selectedMuscleGroups,
        isRandomWorkout: true,
      },
    });
  }

  private navigateToWorkoutBuilder(isRandomWorkout: boolean) {
    this.router.navigate(['/workout-builder'], {
      state: {
        selectedMuscleGroups: this.selectedMuscleGroups,
        isRandomWorkout: isRandomWorkout,
      },
    });
  }
}
