import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-membership-cards',
  templateUrl: './membership-cards.component.html',
  styleUrls: ['./membership-cards.component.scss']
})
export class MembershipCardsComponent implements OnInit {
  cardItems: any[] = [
    {
      title: "SILVER",
      price: "R500",
      textOne: "Get up to 40% discount on selected hotels in South Africa",
      textTwo: "The Silver Personal Card is for you and your immediate family.",
      matTip: "Sign in as silver",
      img: "silver.jpg"
    }, {
      title: "GOLD",
      price: "R700",
      textOne: "Get up to 50% discount on selected hotels in South Africa",
      textTwo: "The Gold Personal Card is for you and your immediate family.",
      matTip: "Sign in as Gold",
      img: "lightGold.webp"
    }, {
      title: "SILVER CORPORATE",
      price: "R2500",
      textOne: "Get up to 40% discount on selected hotels in South Africa",
      textTwo: "Corporate clients enjoy multiple bookings for their staff at hotels and conference venues.",
      matTip: "Sign in as silver corporate",
      img: "platinum.jpg"
    }, {
      title: "GOLD CORPORATE",
      price: "R3500",
      textOne: "Get up to 50% discount on selected hotels in South Africa",
      textTwo: "Corporate clients enjoy multiple bookings for their staff at hotels and conference venues.",
      matTip: "Sign in as gold corporate",
      img: "gold.jpg"
    }
  ];
  spinner: boolean = false;
  // dialog: any = MatDialog;

  constructor(private dialog: MatDialog, private api: ApiService, private snackbar: MatSnackBar,) { }

  ngOnInit(): void {
  }

  openDialog(title, img): void {
    this.dialog.open(DialogComponent, {
      width: '550px',
      disableClose: true,
      data: {
        title, img
      }
    }).afterClosed().subscribe(result => {
      this.spinner = true;
      if (result) {
        this.api.memberShipSignUp('members/memberShipCard', result).subscribe(
          (res) => {
            this.spinner = false;
            this.snackbar.open("Request sent Successfully", 'Dismiss', {
              duration: 4000,
              panelClass: ['greenBackground', 'whiteColor'],
            });
            setTimeout(() => {
              window.location.reload();
            }, 7000);
          },
          (err) => {
            this.spinner = false;
            this.snackbar.open('Error Sending Message', 'Dismiss', {
              duration: 2500,
            });
          }
        );
      }else{
        return false
      }

    });
  }

}



