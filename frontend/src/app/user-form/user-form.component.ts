import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  private userForm: any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.userForm = this.fb.group({
      id: [null],
      username: [''],
      first_name: [''],
      last_name: [''],
      email: [''],
      level: [1],
      score: [0],
      is_superuser: [false]

    });
    if (data.type) {
      this.userForm.patchValue(data.type);
    }
  }

  onSubmit() {
    alert('Thanks!');
  }
}
