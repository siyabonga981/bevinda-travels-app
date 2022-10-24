import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ozow-invoice',
  templateUrl: './ozow-invoice.component.html',
  styleUrls: ['./ozow-invoice.component.scss']
})
export class OzowInvoiceComponent implements OnInit {
  ozowForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<OzowInvoiceComponent>,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.createReservationForm();
  }

  createReservationForm() {
    this.ozowForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required],
      amount: ['', Validators.required],
    });
    return this.ozowForm;
  }

  closeDialog(form) {
    if (form && form?.valid) {
      this.dialogRef.close(form.value);
    } else {
      this.snackbar.open("All fields are required!", 'Dismiss', {
        duration: 3000,
        panelClass: ['redBackground', 'whiteColor'],
      });
    }
  }
}
