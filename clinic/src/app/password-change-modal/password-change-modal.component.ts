import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthserviceService } from '../core/auth/authservice.service';
import { BasePageComponent } from '../pages/base-page/base-page.component';

@Component({
  selector: 'app-password-change-modal',
  templateUrl: './password-change-modal.component.html',
  styleUrls: ['./password-change-modal.component.css']
})
export class PasswordChangeModalComponent extends BasePageComponent implements OnInit {


  constructor(public authservice:AuthserviceService, private messageService: MessageService) {
    super();
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const email = this.authservice.getToken().userInfo.email;
    this.changePassword(email, this.oldPassword, this.newPassword);
  }

  changePassword(email: string, oldPassword: string, newPassword: string) {
    if (!oldPassword || !newPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Old and new passwords are required.' });
      return;
    }

    this.authservice.changePassword(email, oldPassword, newPassword).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.submissionSuccess = true;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        this.submissionSuccess = false;
      }
    );
  }
}
