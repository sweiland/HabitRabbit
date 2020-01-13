/*
 * message-form.component.ts Copyright (c) 2020 by the MessageRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, ValidatorFn} from '@angular/forms';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../service/message.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {
  messageForm;
  memberOptions;
  typeOptions;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private messageService: MessageService) {
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.memberOptions = data.memberOptions;
    this.typeOptions = data.typeOptions;
    this.messageForm = this.fb.group({
      message: [''],
      type: [[]],
    });
  }

  onSubmit() {
    this.messageService.saveMessage(this.messageForm.value).subscribe(() => {
    });
  }
}
