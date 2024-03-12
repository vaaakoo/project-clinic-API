import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ClientRegistrationComponent } from './helpers/client-registration/client-registration.component';
import { CategoryComponent } from './pages/category/category.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { DoctorPageComponent } from './pages/doctor-page/doctor-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ClientPageComponent } from './pages/client-page/client-page.component';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { AuthGuard } from './core/auth/auth.guard';



const routes: Routes = [
  {path: 'admin-page/category', component: CategoryComponent, canActivate: [AuthGuard]},
  { path: 'doctor-page', component: DoctorPageComponent, canActivate: [AuthGuard] },
  { path: 'client-reg', component: ClientRegistrationComponent },
  { path: 'admin-page/registration', component: RegistrationComponent, canActivate: [AuthGuard] },
  {path: 'booking', component: BookingPageComponent, canActivate: [AuthGuard]},
  {path: 'booking/:id', component: BookingPageComponent},
  { path: 'admin-page', component: AdminPageComponent, canActivate: [AuthGuard] },
  { path: 'doctor-page/:id', component: DoctorPageComponent, canActivate: [AuthGuard] },
  {path: 'client-page/:id', component: ClientPageComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
