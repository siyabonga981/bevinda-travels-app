import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-edit-patient',
  templateUrl: './add-edit-patient.component.html',
  styleUrls: ['./add-edit-patient.component.scss'],
})
export class AddEditPatientComponent implements OnInit {
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
  personalDetails: FormGroup;
  clientAddress: FormGroup;
  clientForm: FormGroup;
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
    this.createClientForm();
  }

  ngOnInit(): void {
    this.agent = this.common.getAgent();
    if (this.data) {
      this.patchEditForm();
      console.log(this.data);
    }
  }

  createClientForm() {
    this.clientForm = this.formBuilder.group({
      personalDetails: this.createPersonalDetailsForm()
    });
  }
  createPersonalDetailsForm() {
    this.personalDetails = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      clientType: [''],
      dob: [''],
      gender: [''],
      nationality: [''],
      clientAddress: this.createPatientAddressForm(),
    });
    return this.personalDetails;
  }

  createPatientAddressForm() {
    this.clientAddress = this.formBuilder.group({
      street: [''],
      town: [''],
      code: [''],
      city: [''],
      email: [''],
      phone: [''],
    });
    return this.clientAddress;
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

  async getPatientFromAPI(formObj) {
    this.api
      .getClient('clients/getPatient', {
        'personalDetails.idNumber': formObj.personalDetails.idNumber,
      })
      .subscribe(
        (res) => {
          if (res.length) {
            formObj._id = res[0]._id;
            formObj.healthDetails.agent = this.agent.userDetails.username;
            this.updatePatientFromAPI(formObj);
            console.log('res.length');
            this.foundPatient = true;
            this.refreshPatient(formObj);
            this.getClients();
            return res;
          } else {
            formObj.healthDetails.agent = this.agent.userDetails.username;
            this.snackbar.open("Progress Saved Successfully", 'Dismiss', {
              duration: 3000,
              panelClass: ['greenBackground', 'whiteColor'],
            });
            this.sendPatientToAPI(formObj);
            this.refreshPatient(formObj);
            this.getClients();
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

  updatePatientFromAPI(updatedPatient) {
    this.api
      .updateAgent(
        'clients/updatePatient/' + updatedPatient._id,
        updatedPatient
      )
      .subscribe(
        (response) => {
          this.currentPatientObj = response;
          this.snackbar.open("Patient Updated Successfully", 'Dismiss', {
            duration: 3000,
            panelClass: ['greenBackground', 'whiteColor'],
          });
          this.getClients();
        },
        (err) => {
          this.snackbar.open(err.error, 'Dismiss', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      );
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

  sendPatientToAPI(newClient) {
    console.log(newClient);
    return;
    // this.api.addAgent('clients/addClient', newPatient).subscribe(
    //   (response) => {
    //     if (response) {
    //       this.snackbar.open(response.msg, 'Dismiss', {
    //         duration: 3000,
    //         panelClass: ['greenBackground', 'whiteColor'],
    //       });
    //       this.currentPatientObj = response;
    //       console.log('Patient saved');
    //       this.getClients();
    //     }
    //   },
    //   (err) => {
    //     this.snackbar.open(err.error, 'Dismiss', {
    //       duration: 3000,
    //       panelClass: ['redBackground', 'whiteColor'],
    //     });
    //   }
    // );
  }

  // saveHealthDetails(){

  // }
  patchEditForm() {
    this.clientForm.patchValue({
      personalDetails: this.data.personalDetails,
      healthDetails: this.data.healthDetails,
      nextOfKinDetails: this.data.nextOfKinDetails,
    });
  }

  // tslint:disable-next-line: typedef
  patchclientForm() {
    this.clientForm.patchValue({
      personalDetails: this.createPersonalDetailsForm()
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
              this.clientForm.patchValue({
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
}
