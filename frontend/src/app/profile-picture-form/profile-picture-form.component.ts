/*
 * profile-picture-form.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile-picture-form',
  templateUrl: './profile-picture-form.component.html',
  styleUrls: ['./profile-picture-form.component.scss']
})
export class ProfilePictureFormComponent implements OnInit {

  pictureForm;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.pictureForm = this.fb.group({
      color: [null],
      picture: [null]
    });
  }

  onSubmitColor(color: string) {
    this.pictureForm.patchValue({color});
    const profilepicture = this.pictureForm.value;
    if (profilepicture.id) {
      this.http.put('/api/profilepicture/' + profilepicture.id + '/update', profilepicture)
        .subscribe(() => {
          alert('updated successfully');
        });
    } else {
      this.http.post('/api/profilepicture/create', profilepicture)
        .subscribe((response: any) => {
          this.router.navigate(['/profile-picture-form/' + response.id]);
        });
    }
  }
  onSubmitPicture() {
  }
}
