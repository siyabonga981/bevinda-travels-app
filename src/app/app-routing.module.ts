import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AddEditPatientComponent } from './add-edit-patient/add-edit-patient.component';
import { AddEditPrescriptionComponent } from './add-edit-prescription/add-edit-prescription.component';
import { AddEditReservationNewComponent } from './add-edit-reservation-new/add-edit-reservation-new.component';
import { AddEditReservationComponent } from './add-edit-reservation/add-edit-reservation.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { BillingComponent } from './billing/billing.component';
import { BookComponent } from './book/book.component';
import { ContactComponent } from './contact/contact.component';
import { ContainerComponent } from './container/container.component';
import { CreateEditInvoiceComponent } from './create-edit-invoice/create-edit-invoice.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PatientsComponent } from './patients/patients.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { ProfileComponent } from './profile/profile.component';
import { ReservationNewComponent } from './reservation-new/reservation-new.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { RewardsComponent } from './rewards/rewards.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'landing' },
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'book', component: BookComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'rewards', component: RewardsComponent },

  {
    path: 'BevindaTravels',
    component: ContainerComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DoctorDashboardComponent },
      {
        path: 'reservations',
        children: [
          { path: '', component: ReservationNewComponent},
          { path: 'newReservation', component: AddEditReservationNewComponent },
          { path: 'editReservation', component: AddEditReservationNewComponent },
        ],
      },
      {
        path: 'bookingRequests',
        children: [
          { path: '', component: ReservationsComponent },
          { path: 'newBookingRequest', component: AddEditReservationComponent },
          { path: 'editBookingRequest', component: AddEditReservationComponent },
        ],
      },
      {
        path: 'rewards',
        children: [
          { path: '', component: PrescriptionsComponent },
          { path: 'newReward', component: AddEditPrescriptionComponent },
          { path: 'editReward', component: AddEditPrescriptionComponent },
        ],
      },
      {
        path: 'profile',
        children: [
          { path: '', component: ProfileComponent },
          { path: 'editProfile', component: ProfileComponent },
        ],
      },
      {
        path: 'appointments',
        children: [
          { path: '', component: AppointmentsComponent },
          { path: 'addClient', component: AppointmentsComponent },
          { path: 'editPatient', component: AppointmentsComponent },
        ],
      },
      {
        path: 'clients',
        children: [
          { path: '', component: PatientsComponent },
          { path: 'addClient', component: AddEditPatientComponent },
          { path: 'editClient', component: AddEditPatientComponent },
        ],
      },
      {
        path: 'invoices',
        children: [
          { path: '', component: BillingComponent },
          { path: 'createInvoice', component: CreateEditInvoiceComponent },
          { path: 'viewInvoice', component: CreateEditInvoiceComponent },
          { path: 'editInvoice', component: CreateEditInvoiceComponent },
        ],
      },
      { path: '**', redirectTo: '**' },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
