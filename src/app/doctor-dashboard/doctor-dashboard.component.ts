import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss'],
})
export class DoctorDashboardComponent implements OnInit {
  spinner: boolean = false;
  prescriptions: any[] = [];
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  constructor(
    private common: CommonService,
    private api: ApiService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    if(!this.common.getAgent()){
      this.router.navigate(['login']);
    }
    // this.getPrescriptionsFromAPI();
    this.getClients();
    // this.getAppointmentsFromAPI();
    // this.getAllInvoices();
  }
  dashboardCards = [
    {
      icon: 'person',
      name: 'Clients',
      class: 'blueBackground',
      color: 'blueColor',
      value: 0,
      route: '../clients',
    },
    {
      icon: 'book_online',
      name: 'Appointments',
      class: 'greenBackground',
      color: 'greenColor',
      value: 0,
      route: '../appointments',
    },
    {
      icon: 'hotel',
      name: 'Reservations',
      class: 'orangeBackground',
      color: 'orangeColor',
      value: 0,
      route: '../reservations',
    },
    {
      icon: 'savings',
      name: 'Invoices',
      class: 'redBackground',
      color: 'redColor',
      value: 0,
      route: '../invoices',
    },
  ];
  ngOnInit(): void {
  }


  getClients() {
    this.spinner = true;
    this.api.getClients('clients/getClients', {}).subscribe((res) => {
      this.spinner = false;
      this.dashboardCards[0].value = res.length;;
    },
    (err) => {
      console.log(err);
    });
  }


  getAllInvoices() {
    this.spinner = true;
    this.api
      .getInvoices('invoices/getInvoices', {})
      .subscribe(
        (response) => {
          this.spinner = false;
          let paidInvoices = [];
          if (response?.invoices?.length) {
            response.invoices.filter((invoice) =>
              invoice.paid == false ? paidInvoices.push(invoice) : false
            );
          }
          this.dashboardCards[3].value = paidInvoices.length;
        },
        (err) => {
          this.spinner = false;
          console.log(err.error.msg);
          this.snackbar.open(err.error.msg, 'Close', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      );
  }
}
