import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, ValidatorFn} from '@angular/forms';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-habit-form',
  templateUrl: './habit-form.component.html',
  styleUrls: ['./habit-form.component.scss']
})
export class HabitFormComponent implements OnInit {
  habitForm;
  memberOptions;
  typeOptions;

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.memberOptions = data.memberOptions;
    this.typeOptions = data.typeOptions;
    this.habitForm = this.fb.group({
      start_date: [moment()],
      end_date: [null, [this.dateValidator()]],
      name: [''],
      member: [1],
      type: [1],
      priority: [1]
    });
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return (control.value <= moment()) ? {dateCheck: {value: control.value}} : null;
    };
  }

  onSubmit() {
    alert('Thanks!');
  }
}
