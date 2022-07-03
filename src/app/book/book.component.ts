import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  spinner: boolean = false;
  mode: ProgressSpinnerMode = 'indeterminate';
  bookingForm: FormGroup;
  showMessage: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private snackbar: MatSnackBar,
    public router: Router
  ) {
    this.createBookingForm()
   }

  ngOnInit(): void {
  }

  createBookingForm() {
    this.bookingForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      phone: [''],
      noOfAdults: [''],
      travelingTo: [''],
      checkInDate: [''],
      noOfNights: [''],
    });
    return this.bookingForm;
  }

  saveBooking(form){
    this.spinner = true;
    form.value.requestDate = new Date();
    this.api.addBooking('bookings/addBooking', form.value).subscribe(res => {
    this.spinner = false;
        this.snackbar.open("Booking Added Successfully", 'Dismiss', {
          duration: 4000,
          panelClass: ['greenBackground', 'whiteColor'],
        });
        this.showMessage = true;
        setTimeout(() => {
          window.location.reload();
        }, 7000);
      },
      (err) => {
    this.spinner = false;
        this.snackbar.open(err.error, 'Dismiss', {
          duration: 3000,
          panelClass: ['redBackground', 'whiteColor'],
        });
      })
  }
}
