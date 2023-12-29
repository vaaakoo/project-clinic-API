import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Useregisteration, doctorregisteration } from '../useregisteration';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  constructor(private http: HttpClient) {}

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private apiUrl: string = 'http://localhost:5100/api/User';
  private bookUrl: string = 'http://localhost:5100/api/Booking';
  alldoctor: doctorregisteration[] = [];
  doctor:doctorregisteration=new doctorregisteration();
  logindata:Useregisteration=new Useregisteration();
  loginusername:any="";


  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  sendactivationcode(email: string): Observable<any> {
    const apiUrl = `${this.apiUrl}/send-code/${email}`;
    return this.http.get(apiUrl);
  }

  registerUser(user: Useregisteration): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }


  AuthenticateUser(user: Useregisteration): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AuthenticateUser`, user);
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

  getDoctorDataByName(doctorName: string): Observable<any> {
    return this.http.get<any>(`${this.bookUrl}/getclient?Client=${doctorName}`);
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
