import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { HomeComponent } from './home/home.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { LoginComponent } from './login/login.component';
import { RewardsComponent } from './rewards/rewards.component';

const routes: Routes = [
  {
    path: 'home',component: HomeComponent
  },
  {
    path: '', redirectTo: 'bevindatravels/home', pathMatch: 'full'
  },
  {
    path: 'admin', component: LoginComponent
  },
  {
    path: 'bevindatravels',
    component: ContainerComponent,
      children: [
        {
          path: '', redirectTo: 'home', pathMatch: 'full'
        },
        {
          path: 'home',
          component: HomeComponent,
        },
        {
          path: 'home',
          component: HomeComponent,
        },
        {
          path: 'home',
          component: HomeComponent,
        },
        {
          path: 'Invoices',
          component: InvoicesComponent,
        },
        {
          path: 'rewards',
          component: RewardsComponent,
        },
      ]
  },
  // {
  //   path: 'bevindatravels', component: ContainerComponent, children: [
  //     {
  //       path: 'home', component: HomeComponent
  //     }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
