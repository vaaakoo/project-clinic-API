// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from './authservice.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthserviceService, private router: Router, private messageService: MessageService) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { token, userInfoForRole } = this.authService.getToken();
    const role = userInfoForRole?.['role'];
    const userId = userInfoForRole?.['UserId'];
  
    if (this.authService.isLoggedIn || this.authService.isAdministrator || this.authService.isDoctor) {
  debugger
  // console.log('Current URL:', state.url);
      if ((state.url.startsWith('/admin-page') || state.url.startsWith('/admin-page/category') || state.url.startsWith('/admin-page/registration')) && role !== 'admin') {
        this.router.navigate(['/home']);
        // alert('You do not have permission to access Admins page, please login!');
        this.messageService.add({severity:'error', summary:'Error', detail:'You do not have permission to access Admins page, please login!'});

        return false;
      }
  
      if (state.url.startsWith('/client-page') ) {
        const id = next.params['id'];
        if (role !== "client") {
          this.router.navigate(['/home']);
          // alert('You do not have permission to access this page, please login!');
          this.messageService.add({severity:'error', summary:'Error', detail:'You do not have permission to access Client page, please login!'});
          return false;
        }

        if (id !== userId) {
          this.router.navigate(['/home']);
          // alert('You do not have permission to access this page, please login!');
          this.messageService.add({severity:'error', summary:'Error', detail:'You do not have permission to access Client page, please login!'});
          return false;
        }
      }
  
      if (state.url.startsWith('/doctor-page') ) {
        const id = next.params['id'];
        if (role !== "doctor") {
          this.router.navigate(['/home']);
          // alert('You do not have permission to access this page, please login!');
          this.messageService.add({severity:'error', summary:'Error', detail:'You do not have permission to access Doctor page, please login!'});
          return false;
        }

        if (id !== userId) {
          this.router.navigate(['/home']);
          // alert('You do not have permission to access this page, please login!');
          this.messageService.add({severity:'error', summary:'Error', detail:'You do not have permission to access Doctor page, please login!'});
          return false;
        }
      }
  
      return true;
    }
  
    // alert('You do not have permission to access this page, please login!');
    this.messageService.add({severity:'error', summary:'Error', detail:'You do not have permission to access this page, please login!'});
    this.router.navigate(['']);
    return false;
  }
  
  
  }
