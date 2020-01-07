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
    },
    {
      question: 'What does FAQ stand for?',
      answer: 'Frequently Asked Questions, so you came to the right place.'
    },
    {
      question: 'What is this application about?',
      answer: 'HabitRabbit™ is a revolutionary online habit building tool, based on state-of-the-art gamification technologies, ' +
        'designed to help its users build new, positive habits easily and quickly.'
    }

  ];

  constructor() {
  }

  onNewFaqItem(faqItem: FaqItem) {
    this.list.splice(0, 0, faqItem);
  }

  ngOnInit() {
  }

}
