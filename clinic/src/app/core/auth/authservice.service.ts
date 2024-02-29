import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Useregisteration, doctorregisteration } from './useregisteration';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  constructor(private http: HttpClient, private messageService: MessageService) {}

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private apiUrl: string = environment.apiUrl + '/User';
  private bookUrl: string = environment.apiUrl + '/Booking';
  private apiUrl1: string = environment.apiUrl + '/Authentication';

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
    // console.log(this.authToken);
    localStorage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  clearAuthenticationToken(): void {
    this.authToken = '';
    // console.log(this.authToken);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    this.isAuthenticatedSubject.next(false);
  }

  logout(): void {
    this.clearAuthenticationToken();
    // alert("you can not logout, please login! ")
    // this.messageService.add({severity:'error', summary:'Error', detail:'you can not logout, please login!'});
  }

  getToken(): { token: string, userInfo: any, userInfoForRole: any } {
    const token = localStorage.getItem('authToken') || '';
    const userInfoForRole = this.getUserInfoForRole(token);
    
    const userInfo = this.getUserInfo();
    // console.log(userInfo);
    return { token, userInfo, userInfoForRole };
  }

  // 
  setUserInfo(user: any): void {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }
  
  getUserInfoForRole(token: string): any {
    let userInfo = {};
  
    try {
      if (token) {
        userInfo = jwtDecode(token) || {};
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  
    return userInfo;
  }

  getUserInfo(): any {
    // Retrieve user information from localStorage
    const userInfoString = localStorage.getItem('userInfo');
    return userInfoString ? JSON.parse(userInfoString) : null;
  }
  

  // 
  login(user: Useregisteration): Observable<any> {
    return this.http.post<any>(`${this.apiUrl1}/login`, user)
      .pipe(
        tap(response => {
          this.setAuthenticationToken(response.token);
          const user = response.user;
          this.setUserInfo(user);
        })
      );
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

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/change-password`;
    const body = {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    return this.http.post(url, body);
  }
  

  registerdoctor(user: doctorregisteration): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/doctor-register`, user);
  }

  getallDoctor(): Observable<doctorregisteration[]> {
    return this.http.get<doctorregisteration[]>(`${this.apiUrl}/getDoctor`);
  }

  getDoctorById(id: number): Observable<doctorregisteration> {
    return this.http.get<doctorregisteration>(`${this.apiUrl}/getDoctor/${id}`);
  }

  getDoctorByIdNumber(idNumber: number): Observable<doctorregisteration> {
    return this.http.get<doctorregisteration>(`${this.apiUrl}/getDoctorByIdNumber?IdNumber=${idNumber}`);
  }

  getClientByIdNumber(idNumber: number): Observable<Useregisteration> {
    return this.http.get<Useregisteration>(`${this.apiUrl}/getClientByIdNumber?IdNumber=${idNumber}`);
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

  getClientDataByIdNumberAndTimeSlot(clientIdNumber: string, tdId: string): Observable<any> {
    const url = `${this.bookUrl}/getdataBytdid?ClientIdNumber=${clientIdNumber}&tdId=${tdId}`;
    return this.http.get<any>(url);
}

getBookDataByDoctorsIdNumberAndTimeSlot(idNumber: string, tdId: string): Observable<any> {
  const url = `${this.bookUrl}/getDoctordataBytdid?IdNumber=${idNumber}&tdId=${tdId}`;
  return this.http.get<any>(url);
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
