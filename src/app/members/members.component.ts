import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  showMessage: boolean = false;
  spinner: boolean = false;

  constructor( private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: Data ) {
    this.createHistoryForm();
    this.createrewardForm();
   }

  ngOnInit(): void {
    console.log("M :",this.data)
    this.historyForm.patchValue(this.data.data)
    this.rewardForm.patchValue(this.data.data)
  }

  createHistoryForm() {
    this.historyForm = this.formBuilder.group({
      traveledFrom: [''],
      to: [''],
      travelDate: [''],
      returnDate: [''],
    });
    return this.historyForm;
  }

  createrewardForm() {
    this.rewardForm = this.formBuilder.group({
      refered: [''],
      givenReward: [''],
      referedDate: ['']
    });
    return this.rewardForm;
  }

}
