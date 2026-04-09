import { Component, ViewChild, signal, computed, inject, OnDestroy } from '@angular/core';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-client-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.css'],
})
export class ClientRegistrationComponent implements OnDestroy {
  private readonly authService = inject(AuthserviceService);
  private readonly notificationService = inject(NotificationService);

  @ViewChild('userForm') userForm!: NgForm;

  // Signals for state
  readonly isButtonDisabled = signal(false);
  readonly activationMessage = signal('');
  readonly buttonText = signal('რეგისტრაცია');
  readonly timerRunning = signal(false);
  
  readonly user = signal({
    id: 0, 
    firstName: '',
    lastName: '',
    email: '',
    idNumber: '',
    ActivationCode: '',
    password: '',
  });

  private intervalId: any;
  private timerMinutes = 10;
  private timerSeconds = 0;

  ngOnDestroy() {
    this.stopTimer();
  }

  updateUserField(field: string, value: any) {
    this.user.update(prev => ({ ...prev, [field]: value }));
  }

  sendactivationcode(email: string) {
    if (!email) {
      this.activationMessage.set('მიუთითეთ ელ.ფოსტა');
      return;
    }

    this.activationMessage.set('გთხოვთ დაელოდოთ...');
    this.authService.sendactivationcode(email).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('წარმატება', response.message);
        this.resetTimer();
        this.startTimer();
      },
      error: (error) => {
        this.notificationService.showError('შეცდომა', error.error?.message || 'შეცდომა');
        this.activationMessage.set('შეცდომა');
      }
    });
  }

  private resetTimer() {
    this.timerMinutes = 10;
    this.timerSeconds = 0;
  }

  private startTimer() {
    this.stopTimer();
    this.timerRunning.set(true);

    this.intervalId = setInterval(() => {
      if (this.timerMinutes === 0 && this.timerSeconds === 0) {
        this.stopTimer();
        this.activationMessage.set('Resend');
      } else {
        this.updateTimer();
      }
    }, 1000); 
  }

  private updateTimer() {
    if (this.timerSeconds === 0) {
      this.timerMinutes--;
      this.timerSeconds = 59;
    } else {
      this.timerSeconds--;
    }
    const sec = this.timerSeconds < 10 ? '0' + this.timerSeconds : this.timerSeconds;
    this.activationMessage.set(`${this.timerMinutes}:${sec} წთ`);
  }

  resendactivationcode(email: string) {
    if (this.activationMessage() === 'Resend') {
      this.sendactivationcode(email);
    }
  }

  private stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.timerRunning.set(false);
  }

  onSubmit() {
    this.buttonText.set('გთხოვთ დაელოდოთ...');
    this.isButtonDisabled.set(true);

    this.authService.registerUser(this.user()).subscribe({
      next: (response) => {
        this.userForm.resetForm();
        this.buttonText.set('რეგისტრაცია');
        this.isButtonDisabled.set(false);
        this.stopTimer();
        this.activationMessage.set('');
        this.notificationService.showSuccess('წარმატება', response.message);
        
        // Navigate home and refresh
        setTimeout(() => {
          window.location.href = '/home';
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        this.buttonText.set('რეგისტრაცია');
        this.isButtonDisabled.set(false);
        this.notificationService.showError('შეცდომა', error.error?.message || 'რეგისტრაცია ვერ მოხერხდა');
      }
    });
  }
}
