import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  private userForm: any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private userService: UserService, private router: Router) {
  }


  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.userForm = this.fb.group({
      id: [null],
      username: [''],
      first_name: [''],
      last_name: [''],
      password: [''],
      password_check: [''],
      email: [''],
      level: [1],
      score: [0],
      is_superuser: [false],
      is_staff: [false]
    });
    if (data.user) {
      this.userForm.patchValue(data.user);
    }
  }

  onSubmit() {
    this.userForm.patchValue({is_staff: this.userForm.value.is_superuser});
    this.userService.register(this.userForm.value).subscribe(() => {
      this.router.navigate(['/user-list']);
    });
  }
}
