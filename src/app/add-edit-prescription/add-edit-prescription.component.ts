import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { CommonService } from '../services/common.service';
@Component({
  selector: 'app-add-edit-prescription',
  templateUrl: './add-edit-prescription.component.html',
  styleUrls: ['./add-edit-prescription.component.scss'],
})
export class AddEditPrescriptionComponent implements OnInit {
  reward: FormGroup;
  spinner: boolean = false;
  currPatient: any = {};
  patients: any[] = [];
  illnesses: any[] = [];
  showSelect: boolean = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private snackbar: MatSnackBar,
    private common: CommonService
  ) {
    this.createRewardsForm();
  }

  ngOnInit(): void {
    this.getAgent();
    if (this.data) {
      this.patchRewardsForm();
    }
  }

  createRewardsForm() {
    this.reward = this.formBuilder.group({
      referrer: [''],
      friend: [''],
      dateOfReferral: [''],
      dateOfBooking: [''],
      redeemedStatus: [false],
    });
  }

  saveReward(reward) {
    this.api.addReward('rewards/newReward', reward.value).subscribe(
      (res) => {
        this.snackbar.open(res.msg, 'Dismiss', {
          duration: 3000,
          panelClass: ['greenBackground', 'whiteColor'],
        });
        this.router.navigate(['BevindaTravels/rewards']);
      },
      (err) => {
        this.snackbar.open(err.error, 'Dismiss', {
          duration: 3000,
          panelClass: ['redBackground', 'whiteColor'],
        });
      }
    );
  }

  getAgent() {
    this.spinner = true;
    this.api.getAgent('patients/getAgent', {}).subscribe((res) => {
      this.spinner = false;
      if (!this.data?.patch) {
        this.patients = res;
      }
    });
  }

  patchRewardsForm() {
    this.reward.patchValue({
      referrer: this.data.referrer,
      friend: this.data.friend,
      dateOfReferral: this.data.dateOfReferral,
      dateOfBooking: this.data.dateOfBooking,
      redeemedStatus: this.data.redeemedStatus,
    });
    this.reward.get('idNumber').disable();
  }

  getRewardsFromAPI() {
    this.spinner = true;
    if (this.data?.title !== 'Edit Prescription') {
      this.api
        .getRewards('rewards/getRewards', {
          doctor: this.common.getAgent().userDetails.username,
        })
        .subscribe(
          (res) => {
            this.patients = res.prescriptions;
            this.spinner = false;
            if (!this.router.url.includes('addPrescription')) {
              this.snackbar.open(res.msg, 'Dismiss', {
                duration: 3000,
                panelClass: ['greenBackground', 'whiteColor'],
              });
            } else {
            }
          },
          (err) => {
            this.spinner = false;
          }
        );
    }
  }
  getPatientFromAPI(idNum) {
    if (!this.data?.patch) {
      let idNumber = idNum.value.personalDetails.idNumber;
      if (idNumber && idNumber.length === 13) {

        this.api
          .getAgent('patients/getPatient', {
            'personalDetails.idNumber': idNumber,
          })
          .subscribe(
            (response) => {
              if (response.length) {
                this.reward.get('illnesses').enable();
                this.reward.get('symptoms').enable();
                this.reward.get('diagnosis').enable();
                this.reward.get('notes').enable();
                this.currPatient = response[0];
                this.reward.get('illnesses').patchValue(null);
                this.illnesses = response[0].healthDetails.illnesses;
                this.reward.patchValue({
                  idNumber: this.currPatient.personalDetails.idNumber,
                });
                this.snackbar.open(
                  'Patient details fetched successfully',
                  'Dismiss',
                  {
                    duration: 3500,
                    panelClass: ['greenBackground', 'whiteColor'],
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
      } else {
        this.reward.patchValue({
          idNumber: null,
        });
        this.reward.get('illnesses').disable();
        this.reward.get('symptoms').disable();
        this.reward.get('diagnosis').disable();
        this.reward.get('notes').disable();
        this.snackbar.open('Patient with that ID does not exist', 'Dismiss', {
          duration: 3500,
          panelClass: ['redBackground', 'whiteColor'],
        });
        return false;
      }
    }
  }

}
