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
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    
  const { token, userInfo } = this.authService.getToken();

if (token) {
    // Token is available
    console.log('Token:', token);
    console.log('User Info:', userInfo);

    // You can access user roles like userInfo.role
} else {
    // Token is not available
    console.log('No token available');
}

    if (localStorage.getItem("authToken")) {
      return true;
    } else {
      // Redirect to the login page or handle unauthorized access
      this.router.navigate(['/home']);
      return false;
    }
  }
}
