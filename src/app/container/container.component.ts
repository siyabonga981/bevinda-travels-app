import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit {
  agent: any = {};
  sidenavItems: any[] = [
    {
      icon: 'home',
      name: 'Home',
      class: 'whiteColor',
      route: 'home',
    },
    {
      icon: 'account_circle',
      name: 'Profile',
      class: 'whiteColor',
      route: 'profile',
    },
    {
      icon: 'groups',
      name: 'Clients',
      class: 'whiteColor',
      route: 'clients',
    },
    {
      icon: 'event',
      name: 'Booking Requests',
      class: 'whiteColor',
      route: 'bookingRequests',
    },
    {
      icon: 'apartment',
      name: 'Reservations',
      class: 'whiteColor',
      route: 'reservations',
    },
    {
      icon: 'paid',
      name: 'Invoices',
      class: 'whiteColor',
      route: 'invoices',
    },
    {
      icon: 'emoji_events',
      name: 'Rewards',
      class: 'whiteColor',
      route: 'rewards',
    },
    // {
    //   icon: 'emoji_events',
    //   name: 'Appointments',
    //   class: 'whiteColor',
    //   route: 'appointments',
    // },
  ];

  constructor(
    private common: CommonService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private api: ApiService,
    private snackbar: MatSnackBar
  ) {
    this.agent = this.common.getAgent();
  }
  ngOnInit(): void {}
  sanitizeImg(img): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(img);
  }
  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.agent.profilePic = myReader.result;
      this.sanitizeImg(this.agent.profilePic);
      this.updateProfilePic(this.agent.profilePic);
    };
    myReader.readAsDataURL(file);
  }

  updateProfilePic(base64) {
    this.api
      .updateProfilePic('agents/updateProfilePic/' + this.agent._id, {
        profilePic: base64,
      })
      .subscribe(
        (res) => {
          if (res) {
            this.common.setAgent(res);
            this.snackbar.open(
              'Profile Image Updated Successfully',
              'Dismiss',
              { duration: 3000, panelClass: ['greenBackground', 'whiteColor'] }
            );
          }
        },
        (err) => {
          this.snackbar.open('Error Updating Profile Image', 'Dismiss', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
