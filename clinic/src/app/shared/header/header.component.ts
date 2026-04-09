import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { Useregisteration } from '../../core/auth/useregisteration';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  readonly authservice = inject(AuthserviceService);

  // Use Signals from Authservice
  readonly isLoggedIn = this.authservice.isAuthenticated;
  readonly isDoctor = this.authservice.isDoctor;
  readonly isAdministrator = this.authservice.isAdmin;
  readonly authUser = this.authservice.currentUser;

  loginData: Useregisteration = new Useregisteration();
  submissionSuccess = false;

  onSubmit() {
    if (this.loginData.email && this.loginData.password) {
      this.authservice.login(this.loginData).subscribe({
        next: (response: any) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'წარმატება', 
            detail: 'ავტორიზაცია წარმატებით დასრულდა' 
          });
          this.submissionSuccess = true;
        },
        error: (error: any) => {
          const detail = error.status === 401 
            ? 'მეილი ან პაროლი არასწორია' 
            : 'მოხდა გაუთვალისწინებელი შეცდომა';
          this.messageService.add({ severity: 'error', summary: 'შეცდომა', detail });
        }
      });
    }
  }

  navigateToRegistration() {
    this.router.navigate(['/client-reg']);
  }

  navigateAdmin() {
    this.router.navigate(['/admin-page']);
  }

  navigateClient() {
    const user = this.authUser();
    if (user) this.router.navigate(['/client-page', user.id]);
  }

  navigateDoctor() {
    const user = this.authUser();
    if (user) this.router.navigate(['/doctor-page', user.id]);
  }

  navigatebooking() {
    this.router.navigate(['/booking']);
  }

  onLogoutClick(): void {
    this.authservice.logout();
    this.router.navigate(['/home']);
  }

  sendResetCode() {
    if (this.loginData.email) {
      this.authservice.sendResetCode(this.loginData.email).subscribe({
        next: (response: any) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'წარმატება', 
            detail: 'პაროლის აღდგენის კოდი გაიგზავნა: ' + this.loginData.email 
          });
        },
        error: (error: any) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'შეცდომა', 
            detail: error.error?.message || 'შეცდომა კოდის გაგზავნისას' 
          });
        }
      });
    } else {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'შეცდომა', 
        detail: 'გთხოვთ მიუთითოთ მეილი' 
      });
    }
  }
}
