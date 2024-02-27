import { Component } from '@angular/core';
import { Useregisteration, doctorregisteration } from 'src/app/core/auth/useregisteration';

@Component({
  selector: 'app-base-page',
  templateUrl: './base-page.component.html',
  styleUrl: './base-page.component.css'
})

export class BasePageComponent {
  unauthorizedMessageShown: boolean = false;
  messageToDoctor: boolean = false;
  client?: Useregisteration;
  doctor?: doctorregisteration;
  doctorId: number | undefined;
  appointmentCount: number = 0;
  text: string = "";
  clientName: string = "";
  tooltipBox: boolean = false;
  clientLastName: string = "";
  clientIdNumber: string = "";
  oldPassword: string = "";
  newPassword: string = "";
  submissionSuccess: boolean = false;
  clientId: number | undefined; 
  patientFirstName: string = '';
  patientIdNumber: string = '';
  statusBook: string ="=";
  doctorName: string = "";
  doctroImg: any;
  doctorLastName: string="";
  doctorCategory: string="";
  docId: number = 0;
  doctorFirstName: string='';
  doctorIdNumber: string='';

}