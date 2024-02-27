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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BookingPageComponent } from './booking-page/booking-page.component';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthserviceService } from './core/auth/authservice.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardComponent } from './card/card.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { CategoryFieldComponent } from './category-field/category-field.component';
import { CustomTableComponent } from './custom-table/custom-table.component';




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
    BookingPageComponent,
    CardComponent,
    CategoryFieldComponent,
    CustomTableComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastModule,
    DialogModule,
    DropdownModule,
    RatingModule
  ],
  providers: [
    AuthserviceService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
