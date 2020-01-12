/*
 * faq.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {FaqItem} from '@angular-material-extensions/faq';
import {FAQService} from '../service/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  list: FaqItem[] = [];

  constructor(private faqService: FAQService) {
  }

  onNewFaqItem(faqItem: FaqItem) {
    this.faqService.saveFAQ(faqItem).subscribe(() => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.list = [];
    this.faqService.getFAQs().subscribe((res: FaqItem[]) => {
      res.forEach((i) => {
        this.list.push({question: i.question, answer: i.answer});
      });
    });
  }

}
