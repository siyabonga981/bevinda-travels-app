import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './login/login.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { BillingComponent } from './billing/billing.component';
import { PatientsComponent } from './patients/patients.component';
import { AddEditPatientComponent } from './add-edit-patient/add-edit-patient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditPrescriptionComponent } from './add-edit-prescription/add-edit-prescription.component';
import { CreateEditInvoiceComponent } from './create-edit-invoice/create-edit-invoice.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { ContainerComponent } from './container/container.component';
import { ConfirmActionComponent } from './confirm-action/confirm-action.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { LandingComponent } from './landing/landing.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { AboutComponent } from './about/about.component';
import { RewardsComponent } from './rewards/rewards.component';
import { ContactComponent } from './contact/contact.component';
import { BookComponent } from './book/book.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { AddEditReservationComponent } from './add-edit-reservation/add-edit-reservation.component';
import { AddEditReservationNewComponent } from './add-edit-reservation-new/add-edit-reservation-new.component';
import { ReservationNewComponent } from './reservation-new/reservation-new.component';
import { OzowInvoiceComponent } from './ozow-invoice/ozow-invoice.component';
import { MembershipCardsComponent } from './membership-cards/membership-cards.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DoctorDashboardComponent,
    ProfileComponent,
    AppointmentsComponent,
    PrescriptionsComponent,
    BillingComponent,
    PatientsComponent,
    AddEditPatientComponent,
    AddEditPrescriptionComponent,
    CreateEditInvoiceComponent,
    NotFoundComponent,
    ContainerComponent,
    ConfirmActionComponent,
    LandingComponent,
    ReviewsComponent,
    AboutComponent,
    RewardsComponent,
    ContactComponent,
    BookComponent,
    ToolbarComponent,
    ReservationsComponent,
    AddEditReservationComponent,
    AddEditReservationNewComponent,
    ReservationNewComponent,
    OzowInvoiceComponent,
    MembershipCardsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
