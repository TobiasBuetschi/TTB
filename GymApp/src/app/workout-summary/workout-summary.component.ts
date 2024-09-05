import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-summary.component.html',
  styleUrls: ['./workout-summary.component.css'],
})
export class WorkoutSummaryComponent implements OnInit {
  workoutSummary: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.workoutSummary = navigation.extras.state['summary'];
    }
  }

  ngOnInit(): void {
    if (!this.workoutSummary) {
      this.router.navigate(['/']);
    } else {
      console.log('Workout summary:', this.workoutSummary);
    }
  }

  saveWorkout(): void {
    // Hier implementieren Sie die Logik zum Speichern des Workouts
    console.log('Workout saved');
    // Nach dem Speichern zur Startseite navigieren
    this.router.navigate(['/']);
  }

  deleteWorkout(): void {
    // Hier können Sie zusätzliche Logik zum Löschen hinzufügen, falls nötig
    console.log('Workout deleted');
    // Zur Startseite navigieren
    this.router.navigate(['/']);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
