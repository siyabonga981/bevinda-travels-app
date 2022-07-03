import {
  AfterViewInit,
  Component,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../services/common.service';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddEditReservationNewComponent } from '../add-edit-reservation-new/add-edit-reservation-new.component';
@Component({
  selector: 'app-reservation-new',
  templateUrl: './reservation-new.component.html',
  styleUrls: ['./reservation-new.component.scss']
})
export class ReservationNewComponent implements OnInit {
  spinner: boolean = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  reservations: any[] = [];
  showTitle: boolean = false;
  reservationForm: FormGroup
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  showMessage: boolean = false;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private api: ApiService,
    private common: CommonService,
    private formBuilder: FormBuilder,
  ) {
    if(!this.common.getAgent()){
      this.router.navigate(['login']);
    }
    this.createReservationForm();
  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.getReservationsFromAPI();
  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  createReservationForm() {
    this.reservationForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      phone: [''],
      noOfAdults: [''],
      travelingTo: [''],
      checkInDate: [''],
      noOfNights: [''],
    });
    return this.reservationForm;
  }

  saveReservation(form){
    form.value.requestDate = new Date();
    this.api.addClient('reservations/addReservation', form.value).subscribe(res => {
        this.snackbar.open("Reservation Added Successfully", 'Dismiss', {
          duration: 3000,
          panelClass: ['greenBackground', 'whiteColor'],
        });
        this.showMessage = true;
        setTimeout(() => {
          window.location.reload();
        }, 2800);
      },
      (err) => {
        this.snackbar.open(err.error, 'Dismiss', {
          duration: 3000,
          panelClass: ['redBackground', 'whiteColor'],
        });
      })
  }

  deleteReservationFromDB(obj) {
    this.dialog.open(ConfirmActionComponent, {data: 'Delete this Reservation?'}).afterClosed().subscribe(res => {
      if(res){
        this.api
        .deleteReservation('reservations/deleteReservation/' + obj._id, { _id: obj._id })
        .subscribe(
          (res) => {
            if(res){
              this.getReservationsFromAPI();
            }
            this.snackbar.open(res.msg, 'Dismiss', {
              duration: 5000,
              panelClass: ['greenBackground', 'whiteColor'],
            });
          },
          (err) => {
            this.snackbar.open(err.error, 'Dismiss', {
              duration: 3000,
              panelClass: ['redBackground', 'whiteColor'],
            });
          }
        );
      } else{
        this.snackbar.open('Deletion cancelled', 'Okay', {
          duration: 3000,
          panelClass: ['redBackground', 'whiteColor'],
        });
      }
    })
  }
  editReservation(reservation){
    reservation.title = 'Edit Reservation';
    reservation.patch = true;
    this.dialog.open(AddEditReservationNewComponent, {
      data: reservation, disableClose: true
    }).afterClosed().subscribe(res => {
      if(res){
        res._id = reservation._id;
      this.updateReservationFromAPI(res);
      }
    })
}

updateReservationFromAPI(updatedReservation) {
  this.api
    .updatePrescription(
      'reservations/updateReservation/' + updatedReservation._id,
      updatedReservation
    )
    .subscribe(
      (response) => {
        this.snackbar.open(response.msg, 'Dismiss', {
          duration: 3000, panelClass: ['greenBackground', 'whiteColor']
        })
        this.getReservationsFromAPI();
      },
      (err) => {
        this.snackbar.open(err.error, 'Dismiss', {
          duration: 3000, panelClass: ['redBackground', 'whiteColor']
        })
      }
    );
}
  getReservationsFromAPI() {
    this.spinner = true;
    this.api.getReservations('reservations/getReservations', {}).subscribe(
      (res) => {
        this.spinner = false;
        console.log(res);
        this.reservations = res.reservations;
        if (this.reservations.length) {
          if (!this.router.url.includes('addPrescription')) {
            this.snackbar.open(res.msg, 'Dismiss', {
              duration: 3000,
              panelClass: ['greenBackground', 'whiteColor'],
            });
          }
        } else {
          this.showTitle = true;
          this.snackbar.open('No results found', 'Dismiss', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      },
      (err) => {
        this.spinner = false;
        this.snackbar.open(err.error, 'Dismiss', {
          duration: 3000,
          panelClass: ['redBackground', 'whiteColor'],
        });
      }
    );
  }
}
