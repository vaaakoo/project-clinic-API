import { Component, ViewChild } from '@angular/core';
import { AuthserviceService } from '../shared/authservice.service';
import { HttpErrorResponse } from '@angular/common/http';
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
  constructor(private authserviceService: AuthserviceService) {}
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
          this.activationmessage = error;
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
    }, 1000); // Update every 1 second
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
        alert('Successfully saved the Record');
      },
      (error: HttpErrorResponse) => {
        this.buttontext = 'რეგისტრაცია';
        this.isbuttondsiabed = false;
        this.stopTimer();
        this.activationmessage = '';
        alert(
          error.error.message
        );
      }
    );
  }
}
