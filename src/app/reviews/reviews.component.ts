import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  reviews = [
    {
      text: 'I made a last minute trip to Durban, Mandla managed to book a hotel for me.',
      name: 'Anonymous',
    },
    {
      text: 'My wife and I booked a weekend getaway to Hartes and the service was excellent. ',
      name: 'Zama',
    },
    {
      text: 'I travel a lot for business and Charles always has my back. ',
      name: 'Dr. Mdluli',
    },
    {
      text: 'We traveled to Cape Town for our anniversary and we got a sea view room in Camps Bay. ',
      name: 'Tracey',
    },
    {
      text: 'We booked our honeymoon to Zanzibar and it was magical. ',
      name: 'Anonymous',
    },
  ];
  activeReview: any;

  constructor() {}

  showReview(i){
    this.activeReview = this.reviews[i];
  }
  ngOnInit(): void {
    this.showReview(0);
  }
}
