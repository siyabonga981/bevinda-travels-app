import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';


export interface Invoice {
  name: String,
  contactNo: String,
  email: String,
  address: String,
  additionalDetails: String,
  paid: Boolean,
  items: any,
  doctor: String,
  blob: String,
  dateCreated: String,
  dateCleared: String,
  ref: String
}
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  dataSource: MatTableDataSource<Invoice>;
  spinner: boolean = false;
  mode: ProgressSpinnerMode = 'indeterminate';
  displayedColumns: string[] = [
    'client',
    'dateCreated',
    'dateCleared',
    'amount',
    'paid',
    'action'
  ];

  // displayedColumns: string[] = ['firstname', 'lastName', 'phone', 'address', 'actions'];
  invoices: Invoice[] = [  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('invoiceForm') invoiceForm: NgForm;
  allInvoices: any[] = [];
  constructor(private api: ApiService, private common: CommonService, private snackbar: MatSnackBar, private router: Router) {
    if(!this.common.getAgent()){
      this.router.navigate(['login']);
    }
    this.getAllInvoices();
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngOnInit(): void {

  }

  getAllInvoices(){
    this.spinner = true;
    this.api
          .getInvoices('invoices/getInvoices', {
            'doctor': this.common.getAgent().userDetails.username,
          })
          .subscribe((response) => {
    this.spinner = false;
            if (response.invoices.length) {
              this.allInvoices = response.invoices;
              this.dataSource = new MatTableDataSource(this.allInvoices);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.snackbar.open(response.msg, 'Close', {
                duration: 2500,
                panelClass: ['greenBackground', 'whiteColor'],
              });
            }
          }, (err) => {
    this.spinner = false;
            this.snackbar.open(err.error.msg, 'Close',
              {
                duration: 3000,
                panelClass: ['redBackground', 'whiteColor'],
              }
            );
          })
  }

  getTotal(row){
    let total = row.items.map(item => {
      return item.price * item.qty
    });
    return total.reduce((a, b) => a + b, 0);
  }

  passInvoiceData(action, invoiceData){
    console.log(action)
    sessionStorage.setItem('invoiceID', JSON.stringify(invoiceData._id));
    if(action == 'view'){
      this.router.navigate(['BevindaTravels/invoices/viewInvoice']);
    } else{
    sessionStorage.setItem('path', JSON.stringify('edit'));
      this.router.navigate(['BevindaTravels/invoices/editInvoice']);
    }
  }

}
