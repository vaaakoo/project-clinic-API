import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClientRegistrationComponent } from './client-registration/client-registration.component';
import { CategoryComponent } from './category/category.component';
import { RegistrationComponent } from './registration/registration.component';
import { DoctorPageComponent } from './doctor-page/doctor-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { ClientPageComponent } from './client-page/client-page.component';
import { BookingPageComponent } from './booking-page/booking-page.component';



const routes: Routes = [
  {path: 'admin-page/category', component: CategoryComponent},
  { path: 'client-reg', component: ClientRegistrationComponent },
  { path: 'admin-page/registration', component: RegistrationComponent },
  {path: 'doctor-page/:id', component: DoctorPageComponent},
  {path: 'booking/:id', component: BookingPageComponent},
  {path: 'admin-page', component: AdminPageComponent},
  {path: 'client-page/:id', component: ClientPageComponent},
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path:'booking',component:BookingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
