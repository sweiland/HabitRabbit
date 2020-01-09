import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HabitService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get('/api/habit/list');
  }

  deleteHabit(id: number) {
    return this.http.delete('/api/habit/' + id + '/delete');
  }
}
