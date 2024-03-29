import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { Useregisteration, doctorregisteration } from 'src/app/core/auth/useregisteration';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';



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
    public authservice: AuthserviceService,
    private messageService: MessageService
  ) {}
  
  ngOnInit(): void {
    // Use AuthService properties
    this.isDoctor = this.authservice.isDoctor;
    this.isLoggedIn = this.authservice.isLoggedIn;
    this.isAdministrator = this.authservice.isAdministrator;
    this.authUser = this.authservice.getToken().userInfo;
    
  }

  onSubmit() {
    debugger
    // Perform your authentication logic here
    if (this.authservice.logindata.email !== '' && this.authservice.logindata.password !== null) {
      this.authservice.login(this.authservice.logindata).subscribe(
        (response) => {
          // console.log(response);
          this.authservice.loginusername = response.user.firstName;
          this.authservice.loginUser = response.user;
          this.authUser = this.authservice.getToken().userInfo; // Update authUser here
  
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
          this.messageService.add({severity:'success', summary:'Success', detail:'You are authenticated successfully'});
          this.submissionSuccess = true;
          // window.location.reload();
        },
        (error) => {
          if (error.status === 401) {
            this.messageService.add({severity:'error', summary:'Error', detail:'Authentication failed. Please check your email and password.'});
          } else {
            this.messageService.add({severity:'error', summary:'Error', detail:'An unexpected error occurred. Please try again later.'});
          }
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
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  

  // reset code option
  sendResetCode() {
    if (this.authservice.logindata.email !== '') {
      this.authservice.sendResetCode(this.authservice.logindata.email).subscribe(
        (response) => {
          // console.log(response);
          // alert('Reset code sent successfully to ' + this.authservice.logindata.email);
          this.messageService.add({severity:'success', summary:'Success', detail: response.message + this.authservice.logindata.email });
        },
        (error) => {
          console.error(error);
          // alert('Error sending reset code');
          this.messageService.add({severity:'error', summary:'Error', detail:error.error.message });
        }
      );
    } else {
      // alert('Please provide a valid email address.');
      this.messageService.add({severity:'error', summary:'Error', detail:'Please provide a valid email address.' });
    }
  }
}
