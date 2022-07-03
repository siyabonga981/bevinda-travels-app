import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AddEditPatientComponent } from '../add-edit-patient/add-edit-patient.component';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
import { CommonService } from '../services/common.service';

export interface Client {
  personalDetails: { type: Object };
  healthDetails: { type: Object };
  nextOfKinDetails: { type: Object };
}
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Client>;
  spinner: boolean = false;
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'address',
    'clientType',
    'phone',
    'action',
  ];
  mode: ProgressSpinnerMode = 'indeterminate';
  // displayedColumns: string[] = ['firstname', 'lastName', 'phone', 'address', 'actions'];
  clients: Client[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterValue = 'Corporate';
  constructor(
    private api: ApiService,
    public router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private common: CommonService
  ) {
    if(!this.common.getAgent()){
      this.router.navigate(['login']);
    }
    this.getClients();
  }

  ngOnInit(): void {
    this.filterClients(this.filterValue);
  }
  ngAfterViewInit() {}

  getClients() {
    this.spinner = true;
    this.api.getClients('clients/getClients', {}).subscribe((res) => {
      this.spinner = false;
      this.clients = res;
      this.dataSource = new MatTableDataSource(this.clients);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  refreshClients() {
    this.api.getClients('clients/getClients', {}).subscribe((res) => {
      console.log(res, 'refreshed');
    });
  }
  deleteClientFromDB(obj) {
    console.log(obj._id);

    this.dialog
      .open(ConfirmActionComponent, { data: 'Delete this client?' })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.api
            .deleteClient('clients/deleteClient/' + obj._id, {
              _id: obj._id,
            })
            .subscribe(
              (res) => {
                this.snackbar.open(res['msg'], 'Dismiss', {
                  duration: 3000,
                  panelClass: ['greenBackground', 'whiteColor'],
                });
                this.getClients();
              },
              (err) => {
                this.snackbar.open(err['error'], 'Dismiss', {
                  duration: 3000,
                  panelClass: ['redBackground', 'whiteColor'],
                });
              }
            );
        } else {
          this.snackbar.open('Deletion cancelled', 'Okay', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      });
  }
  editClient(clientToUpdate) {
    clientToUpdate['title'] = 'Edit Client';
    clientToUpdate['edit'] = true;
    this.dialog
      .open(AddEditPatientComponent, {
        data: clientToUpdate,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          res['_id'] = clientToUpdate['_id'];
          this.updateClientFromAPI(res);
        }
      });
  }
  updateClientFromAPI(updatedClient) {
    this.api
      .updateClient(
        'clients/updateClient/' + updatedClient['_id'],
        updatedClient
      )
      .subscribe(
        (response) => {
          this.snackbar.open(response['msg'], 'Dismiss', {
            duration: 3000,
            panelClass: ['greenBackground', 'whiteColor'],
          });
          this.getClients();
        },
        (err) => {
          this.snackbar.open(err['error'], 'Dismiss', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      );
  }
  addNewClient() {
    if (this.router.url.includes('home')) {
      this.dialog
        .open(AddEditPatientComponent, {
          disableClose: true,
        })
        .afterClosed()
        .subscribe((res) => {
          console.log(res);
        });
    } else {
      this.router.navigate(['BevindaTravels/clients/addClient']);
    }
  }

  filterClients(ev) {
    this.spinner = true;
    this.filterValue = ev.value ? ev.value : this.filterValue;
    this.api
      .filterClients('clients/filterClients/', {
        'personalDetails.clientType': this.filterValue,
      })
      .subscribe(
        (res) => {
          this.clients = res;
          this.spinner = false;
        },
        (err) => {
          this.spinner = false;
          this.snackbar.open(err['error'], 'Dismiss', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      );
  }
}
