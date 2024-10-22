import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { ExerciseService } from './services/exercise.service';
import { WorkoutService } from './services/workout.service';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(FormsModule),
    ExerciseService,
    WorkoutService,
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
