import {Component, OnInit} from '@angular/core';
import {FaqItem} from '@angular-material-extensions/faq';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  list: FaqItem[] = [
    {
      question: 'Why does it think the jQuery plugin is missing?',
      answer: 'Remember: load jQuery before AngularJS if you are using jQuery plugins!'
    },
    {
      question: 'How do I access the DOM from a controller?',
      answer: 'DO NOT perform DOM selection/traversal from the controller. The HTML hasn\'t rendered yet. Look up \'directives\'.'
    }
  ];

  constructor() {
  }

  onNewFaqItem(faqItem: FaqItem) {
    console.log('on new faqItem -> ', faqItem);
    this.list.splice(0, 0, faqItem);
  }

  ngOnInit() {
  }

}
