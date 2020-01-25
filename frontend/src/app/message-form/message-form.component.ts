/** ****************************************************************************
 * message-form.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from '../service/message.service';
import {HttpClient} from '@angular/common/http';
import {TypeService} from '../service/type.service';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {
  messageForm;
  memberOptions;
  typeOptions;
  isSuperUser: boolean;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private messageService: MessageService,
              private router: Router, private http: HttpClient, private typeService: TypeService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe((x: any) => this.isSuperUser = x.is_superuser);
    const data = this.route.snapshot.data;
    this.memberOptions = data.memberOptions;
    this.typeOptions = data.typeOptions;
    this.messageForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      message: ['', Validators.required],
      type: [[], Validators.required],
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get('/api/message/' + id + '/get')
        .subscribe((response: any) => {
          this.messageForm.patchValue(response);
        });
    }
  }

  onSubmit() {
    const message = this.messageForm.value;
    if (message.id) {
      this.messageService.updateMessage(message)
        .subscribe(() => {
          this.router.navigate(['/message-list/']);
        });
    } else {
      this.messageService.saveMessage(message)
        .subscribe((response: any) => {
          this.router.navigate(['/message-list/']);
        });
    }
  }


}
