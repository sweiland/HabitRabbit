import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FaqItem} from '@angular-material-extensions/faq';

@Injectable({
  providedIn: 'root'
})
export class FAQService {

  constructor(private http: HttpClient) {
  }

  getFAQs() {
    return this.http.get('/api/faq/list');
  }

  saveFAQ(faqItem: FaqItem) {
    return this.http.post('/api/faq/create', faqItem);
  }
}
