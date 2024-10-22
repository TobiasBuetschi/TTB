import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuscleGroupSelectorComponent } from './muscle-group-selector.component';

describe('MuscleGroupSelectorComponent', () => {
  let component: MuscleGroupSelectorComponent;
  let fixture: ComponentFixture<MuscleGroupSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleGroupSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuscleGroupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
