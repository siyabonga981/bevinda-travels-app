import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContainerComponent } from './container/container.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material/material.module';
import { ChartsModule } from 'ng2-charts';
import { ClientsComponent } from './clients/clients.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { RewardsComponent } from './rewards/rewards.component';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    HomeComponent,
    LoginComponent,
    ClientsComponent,
    ReservationsComponent,
    InvoicesComponent,
    RewardsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
