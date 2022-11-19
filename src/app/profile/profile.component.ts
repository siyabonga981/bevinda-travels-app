import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  doctorForm: FormGroup;
  address: FormGroup;
  office: FormGroup;
  role: FormGroup;
  userDetails: FormGroup;
  profilePic: any;
  doctor: any = {};
  spinner: boolean = false;
  mode: ProgressSpinnerMode = 'indeterminate';
  constructor(private formbuilder: FormBuilder,public sanitizer: DomSanitizer, private common: CommonService, private api: ApiService, private snackbar: MatSnackBar, private dialog: MatDialog, private router: Router) {
    if(!this.common.getAgent()){
      this.router.navigate(['login']);
    }
    this.createDoctorForm();
  }

  ngOnInit(): void {
    this.doctor = this.common.getAgent();
    this.patchDoctorForm();
  }
  createDoctorForm() {
    this.userDetails = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.address = this.formbuilder.group({
      street: ['', [Validators.required]],
      town: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      code: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
    });
    this.office = this.formbuilder.group({
      address: this.address
    });
    this.role = this.formbuilder.group({
      id: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
      specialty: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    });
    this.doctorForm = this.formbuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
      role: this.role,
      office: this.office,
      userDetails: this.userDetails,
    });
  }
  patchDoctorForm() {
    this.doctorForm.patchValue({
      firstName: this.doctor['firstName'],
      lastName: this.doctor['lastName'],
      office: this.doctor['office'],
      role: this.doctor['role'],
      userDetails: this.doctor['userDetails'],
    });
  }

  updateAgent(form){
    this.spinner = true;
    this.dialog.open(ConfirmActionComponent, {data: 'Are you sure you want to update your details?'}).afterClosed().subscribe(res => {
      if(res){
        form._id = this.doctor._id;
        this.saveUpdatedAgent(form);
      }
    })

  }
  sanitizeImg(img): SafeUrl{
    return this.sanitizer.bypassSecurityTrustUrl(img);
  }

  saveUpdatedAgent(updatedAgent){
    this.api.updateAgent('agents/updateAgent/' + updatedAgent._id, updatedAgent).subscribe(res => {
      this.snackbar.open(res.msg, 'Close', {
        duration: 2500,
        panelClass: ['greenBackground', 'whiteColor'],
      });
      this.common.setAgent(res.doc);
      this.common.getAgent();
    },
    (err) => {
      this.spinner = false;
      this.snackbar.open(err.msg, 'Close', {
        duration: 3000,
        panelClass: ['redBackground', 'whiteColor'],
      });
    });
  }
  changeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file:File = inputValue.files[0];
    let myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.doctor.profilePic = myReader.result;
      this.sanitizeImg(this.doctor.profilePic);
    }
    myReader.readAsDataURL(file);
  }
}
