import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutSummaryComponent } from './workout-summary.component';

describe('WorkoutSummaryComponent', () => {
  let component: WorkoutSummaryComponent;
  let fixture: ComponentFixture<WorkoutSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
