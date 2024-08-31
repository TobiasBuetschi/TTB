import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseService } from './app/services/exercise.service';
import { WorkoutService } from './app/services/workout.service';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(FormsModule),
    ExerciseService,
    WorkoutService,
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
