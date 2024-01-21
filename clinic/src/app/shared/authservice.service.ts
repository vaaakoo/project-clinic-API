import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Useregisteration, doctorregisteration } from '../useregisteration';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  constructor(private http: HttpClient) {}

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private apiUrl: string = 'http://localhost:5100/api/User';
  private bookUrl: string = 'http://localhost:5100/api/Booking';
  private apiUrl1: string = 'http://localhost:5100/api/Authentication';
  alldoctor: doctorregisteration[] = [];
  doctor:doctorregisteration=new doctorregisteration();
  logindata:Useregisteration=new Useregisteration();
  loginusername:any="";
  loginUser: any="";
  private authToken: string = '';



  get isAuthenticated(): Observable<boolean> {
    debugger;
    const authent = this.isAuthenticatedSubject.asObservable()
    console.log(authent);
    return this.isAuthenticatedSubject.asObservable();

    
  }

  setAuthenticationToken(token: string): void {
    this.authToken = token;
    console.log(this.authToken);
    // You can also store the token in localStorage for persistence
    localStorage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  clearAuthenticationToken(): void {
    this.authToken = '';
    console.log(this.authToken);
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }

  logout(): void {
    // Call this method when you want to log the user out
    this.clearAuthenticationToken();
    // You can also perform additional logout logic if needed
  }

  getToken(): { token: string, userInfo: any } {
    const token = localStorage.getItem('authToken') || '';
    let userInfo = {};
  
    try {
      if (token) {
        userInfo = jwtDecode(token) || {};
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  
    console.log(userInfo);
    return { token, userInfo };
  }

  get isDoctor(): boolean {
    const { userInfo } = this.getToken();
    return userInfo && userInfo.role === 'doctor';
  }

  get isLoggedIn(): boolean {
    const { userInfo } = this.getToken();
    return userInfo && userInfo.role === 'client';
  }

  get isAdministrator(): boolean {
    const { userInfo } = this.getToken();
    return userInfo && userInfo.role === 'admin';
  }


  

  sendactivationcode(email: string): Observable<any> {
    const apiUrl = `${this.apiUrl}/send-code/${email}`;
    return this.http.get(apiUrl);
  }

  registerUser(user: Useregisteration): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  sendResetCode(email: string): Observable<any> {
    const apiUrl = `${this.apiUrl}/send-reset-code/${email}`;
    return this.http.get(apiUrl);
  }

  login(user: Useregisteration): Observable<any> {
    return this.http.post<any>(`${this.apiUrl1}/login`, user)
    .pipe(
      // Assuming the token is in the "token" field of the response
      tap(response => this.setAuthenticationToken(response.token))
    );;
  }

  registerdoctor(user: doctorregisteration): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/doctor-register`, user);
  }

  getalldoc(): Observable<doctorregisteration[]> {
    return this.http.get<doctorregisteration[]>(`${this.apiUrl}/getDoctor`);
  }

  getDoctorById(id: number): Observable<doctorregisteration> {
    return this.http.get<doctorregisteration>(`${this.apiUrl}/getDoctor/${id}`);
  }

  getUserById(id: number): Observable<Useregisteration> {
    return this.http.get<Useregisteration>(`${this.apiUrl}/getUser/${id}`);
  }


  getDoctorDataByIdNumber(idNumber: string): Observable<any> {
    return this.http.get<any>(`${this.bookUrl}/getclient?IdNumber=${idNumber}`);
  }

  getClientDataByIdNumber(clientidNumber: string): Observable<any> {
    return this.http.get<any>(`${this.bookUrl}/getdata?ClientIdNumber=${clientidNumber}`);
  }

  clientBookAppointment(formData: any): Observable<any> {
    return this.http.post<any>(`${this.bookUrl}/ClientBookAppointment`, formData);
  }

  getAppointmentData(idNumber: string): Observable<any> {
    return this.http.get<any>(`${this.bookUrl}/getclient?IdNumber=${idNumber}`);
  }

  clientRemoveAppointment(formData: any): Observable<any> {
    return this.http.post<any>(`${this.bookUrl}/ClientRemoveAppointment`, formData);
  }

  updateDoctor(doctor: doctorregisteration): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateDoctor/${doctor.id}`, doctor);
  }
  deleteDoctor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteDoctor/${id}`);
  }
  setAuthenticationStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

}
