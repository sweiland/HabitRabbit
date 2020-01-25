/** ****************************************************************************
 * habit.service.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HabitService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get('/api/habit/list');
  }

  deleteHabit(id: number) {
    return this.http.delete('/api/habit/' + id + '/delete');
  }

  saveHabit(habit: any) {
    return this.http.post('/api/habit/create', habit);
  }

  getHabit(id: string) {
    return this.http.get('/api/habit/' + id + '/get');
  }

  updateHabit(habit: any) {
    return this.http.patch('/api/habit/' + habit.id + '/update', habit);
  }
}
