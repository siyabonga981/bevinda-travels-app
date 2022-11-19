import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  historyForm: FormGroup;
  rewardForm: FormGroup;
  memebersForm: FormGroup;
  showMessage: boolean = false;
  spinner: boolean = false;
  options: any = [
    "SILVER",
    "GOLD",
    "SILVER CORPORATE",
    "GOLD CORPORATE"

  ];
  options1: any = [
    "Pending",
    "Granted",
    "Revoked"
  ];

  constructor( private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: Data ) {
    this.createHistoryForm();
    this.createrewardForm();
    this.addingMemeberForm();
   }

  ngOnInit(): void {
    if(Object.keys(this.data).length > 3){
    this.historyForm.patchValue(this.data.data)
    this.rewardForm.patchValue(this.data.data)
    }
  }

  createHistoryForm() {
    this.historyForm = this.formBuilder.group({
      traveledFrom: ['',[Validators.required]],
      to: ['',[Validators.required]],
      travelDate: ['',[Validators.required]],
      returnDate: ['',[Validators.required]],
    });
    return this.historyForm;
  }

  createrewardForm() {
    this.rewardForm = this.formBuilder.group({
      refered: ['',[Validators.required]],
      givenReward: ['',[Validators.required]],
      referedDate: ['']
    });
    return this.rewardForm;
  }

  addingMemeberForm() {
    this.memebersForm = this.formBuilder.group({
      firstName:['',[Validators.required]],
      lastName: ['',[Validators.required]],
      email: ['',[Validators.required]],
      phone:['',[Validators.required]],
      signUpDate:['',[Validators.required]],
      expiryDate: ['',[Validators.required]],
      address: this.formBuilder.group({
        street: ['',[Validators.required]],
        suburb: ['',[Validators.required]],
        town: ['',[Validators.required]],
        code:['',[Validators.required]],
      }),
      cardType:['',[Validators.required]],
      rewards: [[]],
      travelHistory: [[]]
    });
    return this.memebersForm;
  }

}
