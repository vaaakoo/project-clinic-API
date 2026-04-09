import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ClientRegistrationComponent } from './helpers/client-registration/client-registration.component';
import { CategoryComponent } from './pages/category/category.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { DoctorPageComponent } from './pages/doctor-page/doctor-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ClientPageComponent } from './pages/client-page/client-page.component';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { ClinicsComponent } from './pages/clinics/clinics.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MedicationsComponent } from './pages/medications/medications.component';
import { ServicesComponent } from './pages/services/services.component';
import { OffersComponent } from './pages/offers/offers.component';
import { AnnotationsComponent } from './pages/annotations/annotations.component';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'clinics', component: ClinicsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'medications', component: MedicationsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'annotations', component: AnnotationsComponent },
  { path: 'client-reg', component: ClientRegistrationComponent },
  { path: 'admin-page/category', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'admin-page/registration', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'admin-page', component: AdminPageComponent, canActivate: [AuthGuard] },
  { path: 'doctor-page/:id', component: DoctorPageComponent, canActivate: [AuthGuard] },
  { path: 'client-page/:id', component: ClientPageComponent, canActivate: [AuthGuard] },
  { path: 'booking/:id', component: BookingPageComponent },
  { path: 'booking', component: BookingPageComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];
