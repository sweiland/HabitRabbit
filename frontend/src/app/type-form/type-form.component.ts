/** ****************************************************************************
 * type-form.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TypeService} from '../service/type.service';
import {MatSnackBar} from '@angular/material';
import {FAQService} from '../service/faq.service';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-type-form',
  templateUrl: './type-form.component.html',
  styleUrls: ['./type-form.component.scss']
})

export class TypeFormComponent implements OnInit {
  typeForm;
  isSuperUser: boolean;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private typeService: TypeService,
              private router: Router, private snackbar: MatSnackBar, private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe((x: any) => this.isSuperUser = x.is_superuser);
    const data = this.route.snapshot.data;
    const reg = '(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.typeForm = this.fb.group({
      id: [null],
      is_custom: [true],
      name: ['', Validators.required],
      duration: [1, [Validators.max(365)]],
      helpful_link: [null, Validators.pattern(reg)]
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
