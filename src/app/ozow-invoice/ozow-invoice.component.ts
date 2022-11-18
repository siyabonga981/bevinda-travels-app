import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-ozow-invoice',
  templateUrl: './ozow-invoice.component.html',
  styleUrls: ['./ozow-invoice.component.scss']
})
export class OzowInvoiceComponent implements OnInit {
  ozowForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<OzowInvoiceComponent>,
    private snackbar: MatSnackBar, private api: ApiService
  ) { }

  ngOnInit(): void {
    this.createReservationForm();
  }

  createReservationForm() {
    this.ozowForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      reference: ['', Validators.required],
      amount: ['', Validators.required],
    });
    return this.ozowForm;
  }

  closeDialog(form) {
    if (form && form?.valid) {
      this.dialogRef.close(form.value);
      form.value['amount'] = form.value['amount'].toString();
      console.log(form.value)
      this.api
        .createOzowLink(
          'ozow/createInvoice', form.value
        )
        .subscribe(
          (response) => {
            this.snackbar.open(response.msg || "Invoice Sent", 'Dismiss', {
              duration: 3000,
              panelClass: ['greenBackground', 'whiteColor'],
            });
          },
          (err) => {
            console.log(err);
            this.snackbar.open("Error sending invoice", 'Dismiss', {
              duration: 3000,
              panelClass: ['redBackground', 'whiteColor'],
            });
          }
        );
    } else {
      this.snackbar.open("All fields are required!", 'Dismiss', {
        duration: 3000,
        panelClass: ['redBackground', 'whiteColor'],
      });
    }
  }
}
