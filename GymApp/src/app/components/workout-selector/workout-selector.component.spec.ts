import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutSelectorComponent } from './workout-selector.component';

describe('WorkoutSelectorComponent', () => {
  let component: WorkoutSelectorComponent;
  let fixture: ComponentFixture<WorkoutSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
