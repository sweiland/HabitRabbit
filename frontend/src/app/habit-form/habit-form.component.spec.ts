import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitFormComponent } from './habit-form.component';

describe('HabitFormComponent', () => {
  let component: HabitFormComponent;
  let fixture: ComponentFixture<HabitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
