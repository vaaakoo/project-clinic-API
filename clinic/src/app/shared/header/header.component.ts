import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { Useregisteration, doctorregisteration } from 'src/app/useregisteration';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})



export class HeaderComponent implements OnInit {
  client: Useregisteration = new Useregisteration();
  doctor: doctorregisteration = new doctorregisteration();
  isDoctor: boolean = false;
  isLoggedIn: boolean = false;
  isAdministrator: boolean = false; 
  submissionSuccess: boolean = false;

  constructor(
    private router: Router,
    public authservice: AuthserviceService
  ) {}
  
  navigateToRegistration() {
    this.router.navigate(['/client-reg']);
  }
  navigateAdmin() {
    this.router.navigate(['/admin-page']);
  }
  navigateClient() {
    this.router.navigate(['/client-page', this.client.id]);
  }
  navigateDoctor() {
    this.router.navigate(['/doctor-page', this.doctor.id]);
  }
  navigatebooking() {
    this.router.navigate(['/booking']);
  }
  navigatetoregisteration() {
    debugger;
    if (this.authservice.logindata.email != '' && this.authservice.logindata.password != null) {

      this.authservice.login(this.authservice.logindata).subscribe(
        (response) => {
          // debugger;
        //  console.log(response);
         this.authservice.loginUser = response.user;
          this.authservice.loginusername = response.user.firstName;
          // this.router.navigate(['/registration']);
          alert("you are authenticated sucessfull");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  onSubmit() {
    // Perform your authentication logic here
    if (this.authservice.logindata.email !== '' && this.authservice.logindata.password !== null) {
      this.authservice.login(this.authservice.logindata).subscribe(
        (response) => {
          console.log(response);
          this.authservice.loginusername = response.user.firstName;
          this.authservice.loginUser = response.user;
          console.log(this.authservice.loginUser);

          
          switch (true) {
            case response.user.isAdmin:
              this.isAdministrator = true;
              break;
            case response.user.role === 'doctor':
              this.isDoctor = true;
              this.doctor.id = response.user.id;
              this.doctor.firstName = response.user.firstName;
              this.doctor.lastName = response.user.lastName;
              this.doctor.imageUrl = response.user.imageUrl;
              this.router.navigate(['/doctor-page', this.doctor.id]);
              break;
            default:
              this.isLoggedIn = true;
              this.client.id = response.user.id;
              this.client.firstName = response.user.firstName;
              this.client.lastName = response.user.lastName;
              this.authservice.setAuthenticationStatus(true);
              break;
          }
          
          console.log(this.doctor.firstName);
          console.log(this.client.firstName + "id" + this.client.id);
          console.log("isAdministrator" + ":" + this.isAdministrator);
          console.log("isLoggedIn" + ":" + this.isLoggedIn);
          alert("You are authenticated successfully");
          this.submissionSuccess = true;
        //  if (response.user.role === 'doctor') {
        //     this.router.navigate(['/doctor-page']);
        //   }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  onLogoutClick(): void {
    this.authservice.logout();
    this.isLoggedIn = false;
    this.isAdministrator = false;
    this.isDoctor = false;
  }
  ngOnInit(): void {
    // Use AuthService properties
    this.isDoctor = this.authservice.isDoctor;
    this.isLoggedIn = this.authservice.isLoggedIn;
    this.isAdministrator = this.authservice.isAdministrator;
  }

  // reset code option
  sendResetCode() {
    if (this.authservice.logindata.email !== '') {
      this.authservice.sendResetCode(this.authservice.logindata.email).subscribe(
        (response) => {
          // console.log(response);
          alert('Reset code sent successfully to ' + this.authservice.logindata.email);
        },
        (error) => {
          console.error(error);
          alert('Error sending reset code');
        }
      );
    } else {
      alert('Please provide a valid email address.');
    }
  }
}
