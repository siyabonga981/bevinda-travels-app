import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  bookingForm: FormGroup;
  showMessage: boolean = false;
  spinner: boolean = false;
  mode: ProgressSpinnerMode = 'indeterminate';

  constructor( private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: Data ) {
    this.createBookingForm();
   }

  ngOnInit(): void {
  }

  createBookingForm() {
    this.bookingForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      phone: [''],
      email: [''],
      cardType: [this.data.title],
    });
    return this.bookingForm;
  }

}
