/*
 * habit-form.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder} from '@angular/forms';
import * as moment from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import {HabitService} from '../service/habit.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-habit-form',
  templateUrl: './habit-form.component.html',
  styleUrls: ['./habit-form.component.scss']
})
export class HabitFormComponent implements OnInit {
  habitForm;
  memberOptions;
  typeOptions;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private habitService: HabitService, private router: Router,
              private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.memberOptions = data.memberOptions;
    this.typeOptions = data.typeOptions;
    this.habitForm = this.fb.group({
      id: [null],
      start_date: [moment().startOf('day')],
      end_date: [null],
      name: [''],
      member: [null],
      type: [null],
      priority: [1]
    }, {validator: this.dateValidator});
    if (data.habit) {
      this.habitForm.patchValue(data.habit);
    }
  }

  dateValidator(control: AbstractControl) {
    const startDate = moment(control.get('start_date').value);
    const endDate = moment(control.get('end_date').value);
    if (startDate.startOf('day').isAfter(endDate)) {
      control.get('end_date').setErrors({date_check: true});
    }
  }

  onSubmit() {
    const habit = this.habitForm.value;
    if (habit.id) {
      this.habitService.updateHabit(habit).subscribe(() => {
        this.snackbar.open('Successfully Updated!', 'close', {duration: 1000});
        this.router.navigate(['/habit-form/' + habit.id]);
      });
    } else {
      this.habitService.saveHabit(habit).subscribe((response: any) => {
        this.router.navigate(['/habit-form/' + response.id]);
      });
    }
  }


}
