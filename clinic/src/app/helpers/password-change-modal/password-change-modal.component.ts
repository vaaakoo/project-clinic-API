import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthserviceService } from '../../core/auth/authservice.service';

@Component({
  selector: 'app-password-change-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-change-modal.component.html',
  styleUrls: ['./password-change-modal.component.css']
})
export class PasswordChangeModalComponent {
  private readonly authService = inject(AuthserviceService);
  private readonly messageService = inject(MessageService);

  readonly oldPassword = signal('');
  readonly newPassword = signal('');
  readonly submissionSuccess = signal(false);

  onSubmit() {
    const user = this.authService.currentUser();
    if (!user) return;

    const oldPass = this.oldPassword();
    const newPass = this.newPassword();

    if (!oldPass || !newPass) {
      this.messageService.add({ severity: 'error', summary: 'შეცდომა', detail: 'ორივე პაროლი სავალდებულოა' });
      return;
    }

    this.authService.changePassword(user.email, oldPass, newPass).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'წარმატება', detail: response.message });
        this.submissionSuccess.set(true);
        // We could emit an event here to close the modal
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'შეცდომა', detail: error.error?.message || 'შეცდომა პაროლის შეცვლისას' });
        this.submissionSuccess.set(false);
      }
    });
  }
}
