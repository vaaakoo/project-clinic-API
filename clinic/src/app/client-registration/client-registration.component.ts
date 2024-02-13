import { Component, ViewChild } from '@angular/core';
import { AuthserviceService } from '../core/auth/authservice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.css'],
})
export class ClientRegistrationComponent {
  isbuttondsiabed: boolean = false;
  public activationmessage: string = '';
  @ViewChild('userForm') userForm: any;
  timerMinutes: number = 2;
  timerSeconds: number = 0;
  timerRunning: boolean = false;
  timerText: string = '2:00';
  private intervalId: any;
  buttontext: string = 'რეგისტრაცია';
  constructor(private authserviceService: AuthserviceService, private messageService: MessageService) {}
  user = {
    id: 0, 
    firstName: '',
    lastName: '',
    email: '',
    idNumber: '',
    activationCode: '',
    password: '',
  };

  sendactivationcode(email: string) {
    debugger
    if (email == null || email == '') {
      this.activationmessage = 'Please Enter Email Address';
    } else {
      this.activationmessage = 'Please Wait...';
      this.authserviceService.sendactivationcode(email).subscribe(
        (response) => {
          this.timerMinutes = 2;
          this.timerSeconds = 0;
          this.startTimer();
        },
        (error) => {
          console.error('Error:', error);
          this.activationmessage = 'Error Email';
          
          if (error && error.includes('Bad Request')) {
            // Display an alert for bad request
            this.messageService.add({severity:'error', summary:'Error', detail:'მეილი უკვე გამოყენებულია, გთხოვთ შეცვალოთ მეილი.'});

          }
        }
      );
    }
  }


  startTimer() {
    this.timerRunning = true;

    this.intervalId = setInterval(() => {
      if (this.timerMinutes === 0 && this.timerSeconds === 0) {
        this.stopTimer();
      } else {
        this.updateTimer();
      }
    }, 1000); 
  }

  updateTimer() {
    if (this.timerSeconds === 0) {
      this.timerMinutes--;
      this.timerSeconds = 59;
    } else {
      this.timerSeconds--;
    }
    this.activationmessage = `${
      this.timerMinutes
    }:${this.timerSeconds < 10 ? '0' : ''}${this.timerSeconds} წთ`;
  }
  resendactivationcode(email: string) {
    if (this.activationmessage == 'Resend') {
      if (email == null || email == '') {
        this.activationmessage = 'Please Enter Email Address';
      } else {
        this.activationmessage = 'Please Wait...';
        debugger;
        this.authserviceService.sendactivationcode(email).subscribe(
          (response) => {
            this.timerMinutes = 2;
            this.timerSeconds = 0;
            this.startTimer();
          },
          (error) => {
            this.activationmessage = error;
          }
        );
      }
    }
  }
  stopTimer() {
    clearInterval(this.intervalId);
    this.timerRunning = false;
    this.activationmessage = 'Resend';
  }

  onSubmit() {
    // debugger;
    this.buttontext = 'Wait..';
    this.isbuttondsiabed = true;
    this.authserviceService.registerUser(this.user).subscribe(
      (response) => {
        this.userForm.resetForm();
        this.buttontext = 'რეგისტრაცია';
        this.isbuttondsiabed = false;
        this.stopTimer();
        this.activationmessage = '';
        // alert('Successfully saved the Record');
        this.messageService.add({severity:'success', summary:'Success', detail:'რეგისტრაცია გავლილია, გთხოვთ გაიაროთ ავტორიზაცია!'});
      },
      (error: HttpErrorResponse) => {
        this.buttontext = 'რეგისტრაცია';
        this.isbuttondsiabed = false;
        this.stopTimer();
        this.activationmessage = '';
        // alert(
        //   error.error.message
        // );
        this.messageService.add({severity:'error', summary:'Error', detail: error.error.message});

      }
    );
  }
}
