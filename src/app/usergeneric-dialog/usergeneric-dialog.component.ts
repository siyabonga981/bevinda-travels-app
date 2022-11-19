import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';

@Component({
  selector: 'app-usergeneric-dialog',
  templateUrl: './usergeneric-dialog.component.html',
  styleUrls: ['./usergeneric-dialog.component.scss']
})
export class UsergenericDialogComponent implements OnInit {
  bookingForm: FormGroup;
  showMessage: boolean = false;
  spinner: boolean = false;
  mode: ProgressSpinnerMode = 'indeterminate';
  options: any = [
    "SILVER",
    "GOLD",
    "SILVER CORPORATE",
    "GOLD CORPORATE"

  ];
  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: Data) {
    this.createBookingForm();
  }

  ngOnInit(): void {
    this.patchData(this.data);
  }

  patchData(data) {
    this.bookingForm.patchValue(data)
  }

  createBookingForm() {
    this.bookingForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      phone: [''],
      email: [''],
      expiryDate:[null],
      signUpDate:[null],
      cardType: [''],
      address: this.formBuilder.group({
        street: [''],
        suburb: [''],
        town: [''],
        code: [''],
      }), 
      rewards:[this.data.rewards],
      travelHistory: [this.data.travelHistory],
    });
    return this.bookingForm;
  }

}
