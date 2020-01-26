/** ****************************************************************************
 * habit-form.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, ValidatorFn, Validators} from '@angular/forms';
import * as moment from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import {HabitService} from '../service/habit.service';
import {MatSnackBar} from '@angular/material';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-habit-form',
  templateUrl: './habit-form.component.html',
  styleUrls: ['./habit-form.component.scss']
})
export class HabitFormComponent implements OnInit {

  habitForm;
  memberOptions;
  typeOptions;
  isSuperuser;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private habitService: HabitService, private router: Router,
              private snackbar: MatSnackBar, private userService: UserService) {
  }

  ngOnInit(): void {
    const userID = this.userService.getID();
    this.userService.getUser().subscribe((response: any) => {
      this.isSuperuser = response.is_superuser;
    });
    const data = this.route.snapshot.data;
    this.memberOptions = data.memberOptions;
    this.typeOptions = data.typeOptions;
    this.habitForm = this.fb.group({
      id: [null],
      start_date: [moment().startOf('day'), [Validators.required, this.startDateValidator()]],
      end_date: [null, Validators.required],
      name: ['', Validators.required],
      member: [userID, Validators.required],
      type: [null, Validators.required],
      priority: [1, Validators.required]
    }, {validator: this.dateValidator});
    if (data.habit) {
      data.habit.priority = data.habit.priority === 3 ? 1 : data.habit.priority === 2 ? 2 : 3;
      this.habitForm.patchValue(data.habit);
    }
  }

  dateValidator(control: AbstractControl) {
    const startDate = moment(control.get('start_date').value);
    const endDate = moment(control.get('end_date').value);
    const date_check_se: boolean = startDate.startOf('day').isSameOrAfter(endDate.endOf('day'));
    const date_check_le: boolean = startDate.add(1, 'year').startOf('day').isBefore(endDate.startOf('day'));
    const date_check_du: boolean = startDate.startOf('day').diff(endDate.startOf('day'), 'day') === 366;
    if (date_check_se) {
      control.get('end_date').setErrors({date_check_se});
    }
    if (date_check_le) {
      control.get('end_date').setErrors({date_check_le});
    }
    if (date_check_du) {
      control.get('end_date').setErrors({date_check_du});
    }
  }

  startDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const startDate = moment(control.value).startOf('day');
      const today = moment().startOf('day');
      return startDate.isBefore(today) ? {start_check: {value: control.value}} : null;
    };
  }


  onSubmit() {
    const habit = this.habitForm.value;
    habit.type = habit.type.id;
    habit.priority = habit.priority === 3 ? 1 : habit.priority === 2 ? 2 : 3;
    habit.interval = habit.priority === 3 ? 7 : habit.priority === 2 ? 3 : 1;
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

  moment() {
    return moment();
  }

  getMax() {
    return moment(this.habitForm.get('start_date').value).add(1, 'year');
  }

  getEnd(event: any) {
    const end_date = moment(this.habitForm.controls.start_date.value);
    const unit = event.duration === 52 || event.duration === 39 || event.duration === 26 || event.duration === 13 ? 'year' :
      event.duration >= 4 ? 'month' : 'week';
    const duration = unit === 'year' ? (event.duration / 52) : unit === 'month' ? (event.duration / 4) : event.duration;
    end_date.add(duration, unit).endOf('day');
    this.habitForm.patchValue({end_date});
  }
}
