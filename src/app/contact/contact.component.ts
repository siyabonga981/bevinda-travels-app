import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  bookingForm: FormGroup;
  showMessage: boolean = false;
  spinner: boolean = false;
  mode: ProgressSpinnerMode = 'indeterminate';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private snackbar: MatSnackBar,
    public router: Router
  ) {
    this.createBookingForm();
  }

  ngOnInit(): void {}

  createBookingForm() {
    this.bookingForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      phone: [''],
      email: [''],
      message: [''],
    });
    return this.bookingForm;
  }

  sendEmail(form) {
    this.spinner = true;
    this.api.sendContactEmail('bookings/sendEmail', form.value).subscribe(
      (res) => {
        this.spinner = false;
        this.snackbar.open("Message Sent Successfully", 'Dismiss', {
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

        this.showMessage = false;
        this.snackbar.open('Error Sending Message', 'Dismiss', {
          duration: 2500,
        });
      }
    );
  }
}
