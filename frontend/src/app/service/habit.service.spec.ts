/** ****************************************************************************
 * habit.service.spec.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import { TestBed } from '@angular/core/testing';

import { HabitService } from './habit.service';

describe('HabitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HabitService = TestBed.get(HabitService);
    expect(service).toBeTruthy();
  });
});
