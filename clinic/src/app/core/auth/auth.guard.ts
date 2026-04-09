import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from './authservice.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthserviceService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check authentication and roles using Signals for modern reactivity
    const isAuthenticated = this.authService.isAuthenticated();
    const isAdmin = this.authService.isAdmin();
    const isDoctor = this.authService.isDoctor();
    const currentUser = this.authService.currentUser();
    const role = currentUser?.role;
    const userId = currentUser?.id;

    if (isAuthenticated) {
      // Admin route protection
      if (state.url.startsWith('/admin-page')) {
        if (!isAdmin) {
          this.handleUnauthorized();
          return false;
        }
      }

      // Client route protection
      if (state.url.startsWith('/client-page')) {
        const routeId = +next.params['id'];
        if (role !== 'client' || routeId !== userId) {
          this.handleUnauthorized();
          return false;
        }
      }

      // Doctor route protection
      if (state.url.startsWith('/doctor-page')) {
        const routeId = +next.params['id'];
        if (role !== 'doctor' || routeId !== userId) {
          this.handleUnauthorized();
          return false;
        }
      }

      return true;
    }

    this.handleUnauthorized();
    return false;
  }

  private handleUnauthorized() {
    this.messageService.add({
      severity: 'error',
      summary: 'შეცდომა',
      detail: 'თქვენ არ გაქვთ დაშვება ამ გვერდზე, გთხოვთ გაიაროთ ავტორიზაცია!'
    });
    this.router.navigate(['/home']);
  }
}
