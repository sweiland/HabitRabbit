import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePictureListComponent } from './profile-picture-list.component';

describe('ProfilePictureListComponent', () => {
  let component: ProfilePictureListComponent;
  let fixture: ComponentFixture<ProfilePictureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePictureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePictureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
