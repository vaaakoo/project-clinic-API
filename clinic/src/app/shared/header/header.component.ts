import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { Useregisteration } from '../../core/auth/useregisteration';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { FilterService } from '../../core/services/filter.service';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly filterService = inject(FilterService);
  public readonly themeService = inject(ThemeService);
  readonly authservice = inject(AuthserviceService);
  readonly isDarkMode = this.themeService.isDarkMode;

  // Use Signals from Authservice
  readonly isLoggedIn = this.authservice.isAuthenticated;
  readonly isDoctor = this.authservice.isDoctor;
  readonly isAdministrator = this.authservice.isAdmin;
  readonly authUser = this.authservice.currentUser;

  // Search signal
  readonly searchTerm = signal('');

  loginData: Useregisteration = new Useregisteration();
  submissionSuccess = false;

  onSearchChange(term: string) {
    this.filterService.setSearchTerm(term);
    // If not on home page, navigate to home to show results
    if (this.router.url !== '/home' && this.router.url !== '/') {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    if (this.loginData.email && this.loginData.password) {
      this.authservice.login(this.loginData).subscribe({
        next: (response: any) => {
          this.notificationService.showSuccess('წარმატება', 'ავტორიზაცია წარმატებით დასრულდა');
          this.submissionSuccess = true;

          // Close modal and refresh after a short delay
          setTimeout(() => {
            const closeBtn = document.querySelector('#exampleModal .close') as HTMLElement;
            closeBtn?.click();
            window.location.reload();
          }, 1500);
        },
        error: (error: any) => {
          const detail = error.status === 401
            ? 'მეილი ან პაროლი არასწორია'
            : 'მოხდა გაუთვალისწინებელი შეცდომა';
          this.notificationService.showError('შეცდომა', detail);
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
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  sendResetCode() {
    if (this.loginData.email) {
      this.authservice.sendResetCode(this.loginData.email).subscribe({
        next: (response: any) => {
          this.notificationService.showSuccess('წარმატება', 'პაროლის აღდგენის კოდი გაიგზავნა: ' + this.loginData.email);
        },
        error: (error: any) => {
          this.notificationService.showError('შეცდომა', error.error?.message || 'შეცდომა კოდის გაგზავნისას');
        }
      });
    } else {
      this.notificationService.showError('შეცდომა', 'გთხოვთ მიუთითოთ მეილი');
    }
  }
}
