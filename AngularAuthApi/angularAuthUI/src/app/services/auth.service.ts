import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signIn(value: any) {
    throw new Error('Method not implemented.');
  }

  private baseUrl: string = "http://localhost:5106/api/User/"
  constructor(private http : HttpClient) { }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj)
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj)
  }
}
