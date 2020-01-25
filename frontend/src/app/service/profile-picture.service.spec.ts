/** ****************************************************************************
 * profile-picture.service.spec.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import { TestBed } from '@angular/core/testing';

import { ProfilePictureService } from './profile-picture.service';

describe('ProfilePictureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfilePictureService = TestBed.get(ProfilePictureService);
    expect(service).toBeTruthy();
  });
});
