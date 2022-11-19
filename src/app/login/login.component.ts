import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  login: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private snackbar: MatSnackBar,
    private router: Router,
    private common: CommonService,
  ) {
    this.createLoginForm();
    this.checkIfLoggedIn();
  }

  ngOnInit(): void {
  }

  createLoginForm() {
    this.login = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  submitForm(form) {
    if (form.invalid) {
      return false;
    }
    this.api.loginAgent('agents/login', form.value).subscribe(
      (response) => {
        if (response) {
          localStorage.setItem('agent', JSON.stringify(response))
          this.snackbar.open('Logged in', 'Dismiss', {
            duration: 3000,
            panelClass: ['greenBackground', 'whiteColor'],
          });
          setTimeout(() => {
            this.router.navigate(['BevindaTravels']);
          }, 1500)
        }
      },
      (err) => {
        this.snackbar.open(`${err['error']}`, 'Dismiss', {
          duration: 3000,
          panelClass: ['redBackground', 'whiteColor'],
        });
      }
    );
  }

  checkIfLoggedIn(){
    if(this.common.getAgent()){
      this.router.navigateByUrl('BevindaTravels/home')
    }
  }
}
