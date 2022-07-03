import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommonService } from '../app/services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  doctor: any = {};
  sidenavItems: any[] = [
    {icon: 'home', name: 'Home', class: 'whiteColor', route: 'home'},
    {icon: 'account_circle', name: 'Profile', class: 'whiteColor', route: 'profile'},
    {icon: 'book_online', name: 'Appointments', class: 'whiteColor', route: 'appointments'},
    {icon: 'medication', name: 'Prescriptions', class: 'whiteColor', route: 'prescriptions'},
    {icon: 'savings', name: 'Invoices', class: 'whiteColor', route: 'billing'},
    {icon: 'groups', name: 'Patients', class: 'whiteColor', route: 'patients'},
  ];

  constructor(private common: CommonService, public sanitizer: DomSanitizer, private router: Router){
    this.doctor = this.common.getAgent();
  }
  sanitizeImg(img): SafeUrl{
    return this.sanitizer.bypassSecurityTrustUrl(img);
  }

  logout(){
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['login'])
  }
}
