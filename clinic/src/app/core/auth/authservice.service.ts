import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { Useregisteration, doctorregisteration } from './useregisteration';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  private readonly apiUrl = `${environment.apiUrl}/User`;
  private readonly authUrl = `${environment.apiUrl}/Authentication`;
  private readonly tokenUrl = `${environment.apiUrl}/Token`;
  private readonly bookUrl = `${environment.apiUrl}/Booking`;

  // Signals for state management (Modern Angular)
  readonly currentUser = signal<any>(this.getUserFromStorage());
  readonly accessToken = signal<string | null>(this.getSafeLocalStorage('accessToken'));
  readonly refreshToken = signal<string | null>(this.getSafeLocalStorage('refreshToken'));

  private getSafeLocalStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[AuthService] Potentially blocked access to localStorage for key: ${key}`, e);
      return null;
    }
  }
  
  readonly isAuthenticated = computed(() => !!this.accessToken());
  readonly userRole = computed(() => this.currentUser()?.role || '');
  
  readonly isDoctor = computed(() => this.userRole() === 'doctor');
  readonly isClient = computed(() => this.userRole() === 'client');
  readonly isAdmin = computed(() => this.userRole() === 'admin');

  constructor(private http: HttpClient) {}

  login(credentials: Useregisteration): Observable<any> {
    console.log(`[AuthService] Attempting login at ${this.authUrl}/login`);
    return this.http.post<any>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('[AuthService] Login successful', response);
        this.saveAuthData(response.accessToken, response.refreshToken, response.user);
      }),
      catchError((err: any) => {
        console.error('[AuthService] Login failed', err);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.currentUser.set(null);
  }

  refreshUserToken(): Observable<any> {
    const data = {
      accessToken: this.accessToken(),
      refreshToken: this.refreshToken()
    };

    return this.http.post<any>(`${this.tokenUrl}/refresh`, data).pipe(
      tap(response => {
        this.saveAuthData(response.accessToken, response.refreshToken, response.user);
      }),
      catchError((err: any) => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  private saveAuthData(accessToken: string, refreshToken: string, user: any) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userInfo', JSON.stringify(user));
    
    this.accessToken.set(accessToken);
    this.refreshToken.set(refreshToken);
    this.currentUser.set(user);
  }

  private getUserFromStorage(): any {
    const user = localStorage.getItem('userInfo');
    return user ? JSON.parse(user) : null;
  }

  // Legacy compatibility / Helper methods
  getToken() {
    return { 
      token: this.accessToken() || '', 
      userInfo: this.currentUser(),
      userInfoForRole: this.accessToken() ? jwtDecode(this.accessToken()!) : {}
    };
  }

  // --- API Methods ---
  sendactivationcode(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/send-code/${email}`);
  }

  registerUser(user: Useregisteration): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  sendResetCode(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/send-reset-code/${email}`);
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { email, oldPassword, newPassword });
  }

  registerdoctor(user: doctorregisteration): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/doctor-register`, user);
  }

  getallDoctor(): Observable<doctorregisteration[]> {
    console.log(`[AuthService] Fetching all doctors from ${this.apiUrl}/getDoctor`);
    return this.http.get<doctorregisteration[]>(`${this.apiUrl}/getDoctor`).pipe(
      tap(data => console.log(`[AuthService] Fetched ${data?.length} doctors`)),
      catchError(err => {
        console.error('[AuthService] Failed to fetch doctors', err);
        return throwError(() => err);
      })
    );
  }

  getDoctorById(id: number): Observable<doctorregisteration> {
    return this.http.get<doctorregisteration>(`${this.apiUrl}/getDoctor/${id}`);
  }

  getUserById(id: number): Observable<Useregisteration> {
    return this.http.get<Useregisteration>(`${this.apiUrl}/getUser/${id}`);
  }

  getDoctorByIdNumber(idNumber: string): Observable<doctorregisteration> {
    return this.http.get<doctorregisteration>(`${this.apiUrl}/getDoctorByIdNumber?IdNumber=${idNumber}`);
  }

  getClientByIdNumber(idNumber: string): Observable<Useregisteration> {
    return this.http.get<Useregisteration>(`${this.apiUrl}/getClientByIdNumber?IdNumber=${idNumber}`);
  }

  getAppointmentData(idNumber: string): Observable<any> {
    return this.http.get<any>(`${this.bookUrl}/getclient?IdNumber=${idNumber}`);
  }

  getDoctorDataByIdNumber(idNumber: string): Observable<any> {
    return this.getAppointmentData(idNumber);
  }

  getClientDataByIdNumber(clientidNumber: string): Observable<any> {
    return this.http.get<any>(`${this.bookUrl}/getdata?ClientIdNumber=${clientidNumber}`);
  }

  getClientDataByIdNumberAndTimeSlot(clientIdNumber: string, tdId: string): Observable<any> {
    return this.http.get<any>(`${this.bookUrl}/getdataBytdid?ClientIdNumber=${clientIdNumber}&tdId=${tdId}`);
  }

  getBookDataByDoctorsIdNumberAndTimeSlot(idNumber: string, tdId: string): Observable<any> {
    return this.http.get<any>(`${this.bookUrl}/getDoctordataBytdid?IdNumber=${idNumber}&tdId=${tdId}`);
  }

  clientBookAppointment(formData: any): Observable<any> {
    return this.http.post<any>(`${this.bookUrl}/ClientBookAppointment`, formData);
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
}
