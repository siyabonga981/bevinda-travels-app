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
import { AddEditPrescriptionComponent } from '../add-edit-prescription/add-edit-prescription.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../services/common.service';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss'],
})
export class PrescriptionsComponent
  implements OnInit, AfterViewInit, AfterContentChecked
{
  spinner: boolean = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  rewards: any[] = [];
  showTitle: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private api: ApiService,
    private common: CommonService
  ) {
    if(!this.common.getAgent()){
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.getRewardsFromAPI();
  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  deleteRewardFromDB(obj) {
    this.dialog.open(ConfirmActionComponent, {data: 'Delete this Reward?'}).afterClosed().subscribe(res => {
      if(res){
        this.api
        .deleteReward('rewards/deleteReward/' + obj._id, { _id: obj._id })
        .subscribe(
          (res) => {
            if(res){
              this.getRewardsFromAPI();
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
  editPrescription(reward){
    reward.title = 'Edit Reward';
    reward.patch = true;
    this.dialog.open(AddEditPrescriptionComponent, {
      data: reward, disableClose: true
    }).afterClosed().subscribe(res => {
      if(res){
        res._id = reward._id;
      this.updateRewardFromAPI(res);
      }
    })
}

updateRewardFromAPI(updatedReward) {
  this.api
    .updatePrescription(
      'rewards/updateReward/' + updatedReward._id,
      updatedReward
    )
    .subscribe(
      (response) => {
        this.snackbar.open(response.msg, 'Dismiss', {
          duration: 3000, panelClass: ['greenBackground', 'whiteColor']
        })
        this.getRewardsFromAPI();
      },
      (err) => {
        this.snackbar.open(err.error, 'Dismiss', {
          duration: 3000, panelClass: ['redBackground', 'whiteColor']
        })
      }
    );
}
  getRewardsFromAPI() {
    this.spinner = true;
    this.api.getRewards('rewards/getRewards', {}).subscribe(
      (res) => {
        this.spinner = false;
        this.rewards = res.rewards;
        if (this.rewards.length) {
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
