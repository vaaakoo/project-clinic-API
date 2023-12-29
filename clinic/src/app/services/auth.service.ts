import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = 'http://localhost:5100/api/User/';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient, private router: Router) {}

  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  signUp(userObj: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  signIn(loginObj: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);
  }
  

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}getUser`);
  }

  setAuthenticationStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
}
