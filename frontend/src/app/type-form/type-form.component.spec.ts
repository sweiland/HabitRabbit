import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeFormComponent } from './type-form.component';

describe('TypeFormComponent', () => {
  let component: TypeFormComponent;
  let fixture: ComponentFixture<TypeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
