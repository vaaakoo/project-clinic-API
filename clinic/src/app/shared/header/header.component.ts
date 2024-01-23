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
  authUser: any;

  constructor(
    private router: Router,
    public authservice: AuthserviceService
  ) {}
  
  ngOnInit(): void {
    // Use AuthService properties
    this.isDoctor = this.authservice.isDoctor;
    this.isLoggedIn = this.authservice.isLoggedIn;
    this.isAdministrator = this.authservice.isAdministrator;
    this.authUser = this.authservice.getToken().userInfo;
    
  }

  onSubmit() {
    // Perform your authentication logic here
    if (this.authservice.logindata.email !== '' && this.authservice.logindata.password !== null) {
      this.authservice.login(this.authservice.logindata).subscribe(
        (response) => {
          // console.log(response);
          this.authservice.loginusername = response.user.firstName;
          this.authservice.loginUser = response.user;
          this.authUser = this.authservice.getToken().userInfo; // Update authUser here
          console.log(this.authUser.role);
  
          switch (true) {
            case response.user.isAdmin:
              this.isAdministrator = true;
              break;
            case this.authservice.loginUser.role === 'doctor':
              this.isDoctor = true;
              break;
            default:
              this.isLoggedIn = true;
              this.authservice.setAuthenticationStatus(true);
              break;
          }
          alert("You are authenticated successfully");
          this.submissionSuccess = true;
          window.location.reload();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  

  navigateToRegistration() {
    this.router.navigate(['/client-reg']);
  }
  navigateAdmin() {
    this.router.navigate(['/admin-page']);
  }
  navigateClient() {
    this.router.navigate(['/client-page', this.authUser.id]);
  }
  navigateDoctor() {
    this.router.navigate(['/doctor-page', this.authUser.id]);
  }
  navigatebooking() {
    this.router.navigate(['/booking']);
  }


  

  onLogoutClick(): void {
    this.authservice.logout();
    this.isLoggedIn = false;
    this.isAdministrator = false;
    this.isDoctor = false;
    window.location.reload();
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
