/** ****************************************************************************
 * faq.service.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FaqItem} from '../faq/faq.item';

@Injectable({
  providedIn: 'root'
})
export class FAQService {
  emitter: EventEmitter<FaqItem> = new EventEmitter<FaqItem>();

  constructor(private http: HttpClient) {
  }

  getFAQs() {
    return this.http.get('/api/faq/list');
  }

  saveFAQ(faqItem: FaqItem) {
    return this.http.post('/api/faq/create', faqItem);
  }

  deleteFaq(id: string) {
    return this.http.delete('/api/faq/' + id + '/delete');
  }

  emitFaq(faq: FaqItem) {
    return this.emitter.emit(faq);
  }

  updateFAQ(faqItem: FaqItem) {
    return this.http.patch('/api/faq/' + faqItem.id + '/update', faqItem);
  }
}
