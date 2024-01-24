// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from './shared/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthserviceService, private router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { token, userInfoForRole } = this.authService.getToken();
    const role = userInfoForRole && userInfoForRole['role'];
    const userId = userInfoForRole['UserId'];
  
    if (this.authService.isLoggedIn || this.authService.isAdministrator || this.authService.isDoctor) {
  
      if ((state.url.startsWith('/admin-page') || state.url.startsWith('/admin-page/category') || state.url.startsWith('/admin-page/registration')) && role !== 'admin') {
        this.router.navigate(['/home']);
        alert('You do not have permission to access Admins page, please login!');
        return false;
      }
  
      if (state.url.startsWith('/booking') && role !== 'client') {
        const userId = next.params['id']; // Assuming the parameter is named 'id'
        
        if (userId !== userInfoForRole['UserId']) {
          this.router.navigate(['/home']);
          alert('You do not have permission to access this page, please login!');
          return false;
        }
      }
      const doctorId = +next.params['id'];  // Convert to number if necessary
      if (state.url.startsWith('/doctor-page') && role !== 'doctor' && doctorId !== userId) {
          this.router.navigate(['/home']);
          alert('You do not have permission to access this page, please login!');
          return false;
      }
  
      return true;
    }
  
    alert('You do not have permission to access this page, please login!');
    this.router.navigate(['']);
    return false;
  }
  
  }
