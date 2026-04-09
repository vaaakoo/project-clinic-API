import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) { }

  showSuccess(summary: string, detail: string = '') {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: detail,
      life: 5000
    });
  }

  showError(summary: string, detail: string = '') {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: 6000
    });
  }

  showInfo(summary: string, detail: string = '') {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: detail,
      life: 4000
    });
  }

  showWarning(summary: string, detail: string = '') {
    this.messageService.add({
      severity: 'warn',
      summary: summary,
      detail: detail,
      life: 5000
    });
  }
}
