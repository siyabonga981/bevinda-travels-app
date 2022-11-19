import { COMMA, ENTER, O } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersComponent } from '../members/members.component';

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
  user: any = {};
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private snackbar: MatSnackBar,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.createClientForm();
    this.patchData(this.user);

  }

  ngOnInit(): void {
    this.personalDetails.disable()
    this.getUser();

  }

  createClientForm() {
    this.personalDetails = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      phone: [''],
      email: [''],
      expiryDate: [null],
      signUpDate: [null],
      cardType: [''],
      address: this.formBuilder.group({
        street: [''],
        suburb: [''],
        town: [''],
        code: [''],
      }),
    });
  }

  patchData(data: any) {
    this.personalDetails.patchValue(data);

  }

  deleteTravelHistory(index) {
    this.user.travelHistory.splice(index, 1);
    this.updateUserFromAPI(this.user);
  }

  deleteTravelReward(index) {
    this.user.rewards.splice(index, 1);
    this.updateUserFromAPI(this.user);
  }

  genericEdit(data: any, index: number, type: string) {
    let dialogData = {
      data: data,
      index: index,
      type: type
    }
    dialogData['title'] = type == 'history' ? 'Edit Travel History' : 'Edit Rewards';
    this.dialog
      .open(MembersComponent, {
        data: dialogData,
        disableClose: true,
        width: '450px'
      }).afterClosed().subscribe(res => {
        if (res) {
          if (type == 'history') {
            this.user.travelHistory[index] = res;
          } else {
            this.user.rewards[index] = res;
          }
          this.updateUserFromAPI(this.user);
        }

      });
  }

  updateUserFromAPI(updatedUser) {
    this.api
      .updateUser(
        'users/updateUser/' + updatedUser['_id'],
        updatedUser
      )
      .subscribe(
        (response) => {
          this.snackbar.open(response['msg'], 'Dismiss', {
            duration: 3000,
            panelClass: ['greenBackground', 'whiteColor'],
          });
        },
        (err) => {
          this.snackbar.open(err['error'], 'Dismiss', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      );
  }

  getUser() {
    this.activatedRoute.params.subscribe(params => {
      this.api.getUser(`users/getUser/${params.id}`).subscribe(user => {
        this.user = user.user;
        this.patchData(this.user);
      }, err => {
        {
          this.snackbar.open(err['error'] || err['err'], 'Dismiss', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      })
    })

  }

  addGenericMemberDetails(type: any){
    let dialogData = {
      type: type
    }
    dialogData['title'] = type == 'history' ? 'Add Travel History' : 'Add Rewards';
    this.dialog
      .open(MembersComponent, {
        data: dialogData,
        disableClose: true,
        width: '450px'
      }).afterClosed().subscribe(res => {
        if (res) {
          if (type == 'history') {
            this.user.travelHistory.push(res);
          } else {
            this.user.rewards.push(res);
          }
          this.updateUserFromAPI(this.user);
        }

      });
  }

}
