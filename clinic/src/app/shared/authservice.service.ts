import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Useregisteration, doctorregisteration } from '../useregisteration';

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
    return this.isAuthenticatedSubject.asObservable();
  }

  setAuthenticationToken(token: string): void {
    this.authToken = token;
    console.log(this.authToken);
    // You can also store the token in localStorage for persistence
    localStorage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string {
    // You can retrieve the token from localStorage or any other storage mechanism
    return this.authToken || localStorage.getItem('authToken') || '';
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
