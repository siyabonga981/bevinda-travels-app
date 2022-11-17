import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-membership-cards',
  templateUrl: './membership-cards.component.html',
  styleUrls: ['./membership-cards.component.scss']
})
export class MembershipCardsComponent implements OnInit {
  cardItems: any[] = [
    {
      title: "SILVER",
      price: "R500",
      textOne: "Get up to 40% discount on selected hotels in South Africa",
      textTwo: "The Silver Personal Card is for you and your immediate family."
    }, {
      title: "GOLD",
      price: "R700",
      textOne: "Get up to 50% discount on selected hotels in South Africa",
      textTwo: "The Gold Personal Card is for you and your immediate family."
    }, {
      title: "SILVER CORPORATE",
      price: "R2500",
      textOne: "Get up to 40% discount on selected hotels in South Africa",
      textTwo: "Corporate clients enjoy multiple bookings for their staff at hotels and conference venues."
    }, {
      title: "GOLD CORPORATE",
      price: "R3500",
      textOne: "Get up to 50% discount on selected hotels in South Africa",
      textTwo: "Corporate clients enjoy multiple bookings for their staff at hotels and conference venues."
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
