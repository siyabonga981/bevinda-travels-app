import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  navItems: any[] = [
    {
      name: 'HOME',
      route: ''
    },
    {
      name: 'BOOK A HOTEL',
      route: '../book'
    }, {
      name: 'REVIEWS',
      route: '../reviews'
    }, {
      name: 'ABOUT US',
      route: '../about'
    }, {
      name: 'REWARDS',
      route: '../rewards'
    },
    {
      name: 'MEMBERSHIP CARDS',
      route: '../membership-cards'
    },
    {
      name: 'CONTACT US',
      route: '../contact'
    },
  ];
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

}
