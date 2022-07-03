import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
@Component({
  selector: 'app-add-edit-reservation-new',
  templateUrl: './add-edit-reservation-new.component.html',
  styleUrls: ['./add-edit-reservation-new.component.scss']
})
export class AddEditReservationNewComponent implements OnInit {
  spinner: boolean = false;
  showMessage: boolean = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  selectable = true;
  removable = true;
  addOnBlur = true;
  formSaved: boolean = false;
  agent: any = {};
  foundPatient: boolean = false;
  currentPatientObj: any = {};
  clients: any[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  allergies: any[] = [];
  illnesses: any[] = [];
  reservationForm: FormGroup;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private snackbar: MatSnackBar,
    public router: Router
  ) {
    if(!this.common.getAgent()){
      this.router.navigate(['login']);
    }
    this.createReservationForm();
  }

  ngOnInit(): void {
    this.agent = this.common.getAgent();
    if (this.data) {
      this.patchEditForm();
      console.log(this.data);
    }
  }

  createReservationForm() {
    this.reservationForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      phone: [''],
      noOfAdults: [''],
      travelingTo: [''],
      checkInDate: [''],
      checkOutDate: [''],
      noOfNights: [''],
      hotel: [''],
    });
    return this.reservationForm;
  }



  getClients() {
    this.api.getClient('clients/getClient', {}).subscribe((res) => {
      this.clients = res;
    });
  }

  async refreshPatient(clientToRefresh) {
    console.log(clientToRefresh);

    this.api
      .getClient('clients/getPatient', {
        'personalDetails.idNumber': clientToRefresh.personalDetails.idNumber,
      })
      .subscribe((res) => {
        console.log(res, 'From refresh function api');

        if (res.length) {
          this.currentPatientObj = res[0];
          console.log(this.currentPatientObj, 'curr obj');
        }
      });
  }


  saveProgress(newClient) {
    this.api.addClient('clients/addClient', newClient.value).subscribe(res => {
    this.formSaved = true;
      this.snackbar.open("Client Added Successfully", 'Dismiss', {
        duration: 3000,
        panelClass: ['greenBackground', 'whiteColor'],
      });
      this.getClients();
      this.router.navigate(['BevindaTravels/clients']);
    },
    (err) => {
      this.snackbar.open(err.error, 'Dismiss', {
        duration: 3000,
        panelClass: ['redBackground', 'whiteColor'],
      });
    })
  }


  patchEditForm() {
    this.reservationForm.patchValue({
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      phone: this.data.phone,
      noOfAdults: this.data.noOfAdults,
      travelingTo: this.data.travelingTo,
      checkInDate: this.data.checkInDate,
      noOfNights: this.data.noOfNights,
      checkOutDate: this.data.checkOutDate,
      hotel: this.data.hotel,
    });
  }

  // tslint:disable-next-line: typedef
  patchReservationForm() {
    this.reservationForm.patchValue({
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      phone: this.data.phone,
      noOfAdults: this.data.noOfAdults,
      travelingTo: this.data.travelingTo,
      checkInDate: this.data.checkInDate,
      noOfNights: this.data.noOfNights,
      checkOutDate: this.data.checkOutDate,
      hotel: this.data.hotel,
    });
  }

  // tslint:disable-next-line: typedef
  checkExisitingApplication(idNum) {
    console.log(idNum);
    if (idNum.length === 13) {
      this.api
        .getClient('clients/getPatient', {
          'personalDetails.idNumber': idNum,
        })
        .subscribe(
          (response) => {
            console.log(response);

            if (response.length) {
              this.currentPatientObj = response[0];
              this.reservationForm.patchValue({
                personalDetails: response[0].personalDetails,
                healthDetails: response[0].healthDetails,
                nextOfKinDetails: response[0].nextOfKinDetails,
              });
              this.snackbar.open(
                'Patient details fetched successfully',
                'Dismiss',
                {
                  duration: 3500,
                  panelClass: ['greenBackground', 'whiteColor'],
                }
              );
            } else {
              this.snackbar.open(
                'Patient with that ID does not exist',
                'Dismiss',
                {
                  duration: 3500,
                  panelClass: ['redBackground', 'whiteColor'],
                }
              );
            }
          },
          (err) => {
            this.snackbar.open(err.error, 'Dismiss', {
              duration: 3000,
              panelClass: ['redBackground', 'whiteColor'],
            });
          }
        );
    }
  }

  saveReservation(form){
    form.value.requestDate = new Date();
    this.api.addClient('reservations/addReservation', form.value).subscribe(res => {
        this.snackbar.open("Reservation Added Successfully", 'Dismiss', {
          duration: 3000,
          panelClass: ['greenBackground', 'whiteColor'],
        });
        this.router.navigate(['BevindaTravels/reservations'])
      },
      (err) => {
        this.snackbar.open(err.error, 'Dismiss', {
          duration: 3000,
          panelClass: ['redBackground', 'whiteColor'],
        });
      })
  }
}
