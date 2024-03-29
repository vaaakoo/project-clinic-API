import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './pages/home/home.component';
import { ClientRegistrationComponent } from './helpers/client-registration/client-registration.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './pages/category/category.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ClientPageComponent } from './pages/client-page/client-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { DoctorPageComponent } from './pages/doctor-page/doctor-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthserviceService } from './core/auth/authservice.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardComponent } from './helpers/card/card.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { CategoryFieldComponent } from './helpers/category-field/category-field.component';
import { CustomTableComponent } from './helpers/custom-table/custom-table.component';
import { BasePageComponent } from './pages/base-page/base-page.component';
import { PasswordChangeModalComponent } from './helpers/password-change-modal/password-change-modal.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';




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
    CustomTableComponent,
    BasePageComponent,
    PasswordChangeModalComponent
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
    RatingModule,
    ProgressSpinnerModule
  ],
  providers: [
    AuthserviceService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
