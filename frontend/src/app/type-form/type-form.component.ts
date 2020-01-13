/*
 * type-form.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TypeService} from '../service/type.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-type-form',
  templateUrl: './type-form.component.html',
  styleUrls: ['./type-form.component.scss']
})

export class TypeFormComponent implements OnInit {
  typeForm;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private typeService: TypeService, private router: Router, private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.typeForm = this.fb.group({
      id: [null],
      is_custom: [true],
      name: [''],
      duration: [1],
      helpful_link: [null]
    });
    if (data.type) {
      this.typeForm.patchValue(data.type);
    }
  }

  onSubmit() {
    const type = this.typeForm.value;
    if (type.id) {
      this.typeService.updateType(type)
        .subscribe(() => {
          this.snackbar.open('Successfully Updated!', 'close', {duration: 1000});
          this.router.navigate(['/type-form/' + type.id]);
        });
    } else {
      this.typeService.saveType(type).subscribe((response: any) => {
        this.router.navigate(['/type-form/' + response.id]);
      });
    }
  }
}
