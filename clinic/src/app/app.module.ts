import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { ClientRegistrationComponent } from './client-registration/client-registration.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './category/category.component';
import { RegistrationComponent } from './registration/registration.component';
import { ClientPageComponent } from './client-page/client-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { DoctorPageComponent } from './doctor-page/doctor-page.component';
import { HttpClientModule } from '@angular/common/http';
import { BookingPageComponent } from './booking-page/booking-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClientRegistrationComponent,
    FooterComponent,
    HeaderComponent,
    CategoryComponent,
    RegistrationComponent,
    ClientPageComponent,
    AdminPageComponent,
    DoctorPageComponent,
    BookingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
