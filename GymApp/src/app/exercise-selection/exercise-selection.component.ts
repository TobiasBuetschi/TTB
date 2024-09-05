import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Exercise } from '../models/exercise.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-selection',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Select an Exercise</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Exercise</mat-label>
        <mat-select [(ngModel)]="selectedExercise">
          <mat-option
            *ngFor="let exercise of data.exercises"
            [value]="exercise"
          >
            {{ exercise.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="selectedExercise" cdkFocusInitial>
        Add
      </button>
    </mat-dialog-actions>
  `,
})
export class ExerciseSelectionComponent {
  selectedExercise: Exercise | null = null;

  constructor(
    public dialogRef: MatDialogRef<ExerciseSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { exercises: Exercise[] }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
