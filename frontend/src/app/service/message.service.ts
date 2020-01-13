/*
 * message.service.ts Copyright (c) 2020 by the MessageRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get('/api/message/list');
  }

  deleteMessage(id: number) {
    return this.http.delete('/api/message/' + id + '/delete');
  }

  saveMessage(message: any) {
    return this.http.post('/api/message/create', message);
  }
}
