import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-password-change-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-change-modal.component.html',
  styleUrls: ['./password-change-modal.component.css']
})
export class PasswordChangeModalComponent {
  private readonly authService = inject(AuthserviceService);
  private readonly notificationService = inject(NotificationService);

  readonly oldPassword = signal('');
  readonly newPassword = signal('');
  readonly submissionSuccess = signal(false);

  onSubmit() {
    const user = this.authService.currentUser();
    if (!user) return;

    const oldPass = this.oldPassword();
    const newPass = this.newPassword();

    if (!oldPass || !newPass) {
      this.notificationService.showError('შეცდომა', 'ორივე პაროლი სავალდებულოა');
      return;
    }

    this.authService.changePassword(user.email, oldPass, newPass).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('წარმატება', response.message);
        this.submissionSuccess.set(true);
      },
      error: (error) => {
        this.notificationService.showError('შეცდომა', error.error?.message || 'შეცდომა პაროლის შეცვლისას');
        this.submissionSuccess.set(false);
      }
    });
  }
}
