/*
 * message-form.component.ts Copyright (c) 2020 by the MessageRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, ValidatorFn} from '@angular/forms';
import * as moment from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from '../service/message.service';
import {Message} from '../message';
import {HttpClient} from '@angular/common/http';
import {TypeService} from '../service/type.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {
  messageForm;
  memberOptions;
  typeOptions;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private messageService: MessageService,
              private router: Router, private http: HttpClient, private typeService: TypeService) {
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.memberOptions = data.memberOptions;
    this.typeOptions = data.typeOptions;
    this.messageForm = this.fb.group({
      id: [null],
      title: [''],
      message: [''],
      type: [[]],
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get('/api/message/' + id + '/get')
        .subscribe((response: any) => {
          const message = JSON.parse(response);
          this.messageForm.patchValue(response);
          this.messageForm.patchValue({message});
        });
    }
  }

  onSubmit() {
    const message = this.messageForm.value;
    message.message = JSON.stringify(this.messageForm.value.message);
    if (message.id) {
      this.messageService.updateMessage(message)
        .subscribe(() => {
          this.router.navigate(['/message-list/']);
          alert('updated successfully');
        });
    } else {
      this.messageService.saveMessage(message)
        .subscribe((response: any) => {
          this.router.navigate(['/message-list/']);
          alert('created successfully');
        });
    }
  }


}
