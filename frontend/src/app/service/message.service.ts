/** ****************************************************************************
 * message.service.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

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

  updateMessage(message) {
    return this.http.patch('/api/message/' + message.id + '/update', message);
  }

  deleteMessage(id: number) {
    return this.http.delete('/api/message/' + id + '/delete');
  }

  saveMessage(message: any) {
    return this.http.post('/api/message/create', message);
  }
}
