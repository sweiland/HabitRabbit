/*
 * habit-form.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, ValidatorFn} from '@angular/forms';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';
import {HabitService} from '../service/habit.service';

@Component({
  selector: 'app-habit-form',
  templateUrl: './habit-form.component.html',
  styleUrls: ['./habit-form.component.scss']
})
export class HabitFormComponent implements OnInit {
  habitForm;
  memberOptions;
  typeOptions;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private habitService: HabitService) {
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.memberOptions = data.memberOptions;
    this.typeOptions = data.typeOptions;
    this.habitForm = this.fb.group({
      start_date: [moment().startOf('day')],
      end_date: [null, [this.dateValidator()]],
      name: [''],
      member: [1],
      type: [1],
      priority: [1]
    });
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      console.log(control.value);
      return (moment().startOf('day').isAfter(control.value)) ? {dateCheck: {value: control.value}} : null;
    };
  }

  onSubmit() {
    this.habitService.saveHabit(this.habitForm.value).subscribe(() => {
    });
  }
}
