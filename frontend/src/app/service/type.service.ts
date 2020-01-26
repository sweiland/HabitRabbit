/** ****************************************************************************
 * type.service.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get('/api/type/list');
  }

  deleteType(id: number) {
    return this.http.delete('/api/type/' + id + '/delete');
  }

  saveType(type: any) {
    return this.http.post('/api/type/create', type);

  }

  getType(id: string) {
    return this.http.get('/api/type/' + id + '/get');

  }

  updateType(type: any) {
    return this.http.patch('/api/type/' + type.id + '/update', type);

  }

}
