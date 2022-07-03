import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  sidenavItems: any[] = [
    {icon: 'home', name: 'Dashboard', class: 'primaryColour', route: 'home'},
    {icon: 'groups', name: 'Clients', class: 'primaryColour', route: 'clients'},
    {icon: 'event', name: 'Reservations', class: 'primaryColour', route: 'profile'},
    {icon: 'paid', name: 'Invoices', class: 'primaryColour', route: 'bookings'},
    {icon: 'emoji_events', name: 'Rewards', class: 'primaryColour', route: 'wishlist'}
  ];

  menuItems: any[] = [
    {icon: 'account_circle', name: 'Profile'},
    {icon: 'notifications', name: 'Notifications'},
    {icon: 'event_note', name: 'Bookings'},
    {icon: 'power_settings_new', name: 'Logout'}
  ];

  constructor(public router: Router) { }

  ngOnInit(): void {
  }
  redirect(page: string){
    if(page == 'Logout'){
      sessionStorage.clear();
      this.router.navigate(['login']);
    }
  }
}
