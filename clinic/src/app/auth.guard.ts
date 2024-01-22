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
    const tokenInfo = this.authService.getToken();
    const role = tokenInfo.userInfo['role'];

    if (this.authService.isLoggedIn || this.authService.isAdministrator || this.authService.isDoctor) {
      return true;
    }
  
    // Check the route and restrict access based on the user's role
    if (state.url.startsWith('/admin-page') && role !== 'admin') {
      this.router.navigate(['/home']);
      return false;
    }
  
    if (state.url.startsWith('/admin-page/category') && role !== 'admin') {
      this.router.navigate(['/home']);
      return false;
    }
  
    if (state.url.startsWith('/admin-page/registration') && role !== 'admin') {
      this.router.navigate(['/home']);
      return false;
    }
  
    if (state.url.startsWith('/booking' || '/booking:id') && role !== 'client') {
      this.router.navigate(['/home']);
      alert('You do not have permission to access this page, please login!.');
      return false;
    }
  
    if (state.url.startsWith('/doctor-page' || '/doctor-page:id') && role !== 'doctor') {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
  

  }
