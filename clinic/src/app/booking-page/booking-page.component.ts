import { Component , OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../shared/authservice.service';
import { Useregisteration, doctorregisteration } from '../useregisteration';
import { data } from 'jquery';
declare var $: any;

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit{

  tableData: { cols: { value: string; activated: boolean }[] }[] = [];
 
  tableHeaders: { num: number; day: string }[] = [
    { num: 17, day: 'mon' },
    { num: 18, day: 'tue' },
    { num: 19, day: 'wed' },
    { num: 20, day: 'thu' },
    { num: 21, day: 'fri' },
    { num: 22, day: 'sat' },
    { num: 23, day: 'sun' },
  ];

  visitConfirmation: string = '';
  textToDoctor: string='';

  unauthorizedMessageShown: boolean = false;
  messageToDoctor: boolean = false;
  doctor?: doctorregisteration ;
  doctorId: number | undefined; 
  patientFirstName: string = '';
  patient?: Useregisteration;
  patientIdNum?: string='';
  

  constructor(private router: Router,public authservice:AuthserviceService, private route: ActivatedRoute,) {}
  
  submitForm() {
    console.log('Form submitted with:', this.visitConfirmation);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.doctorId = +params['id'];
      console.log('Doctor ID from route parameters:', this.doctorId);
      

      this.authservice.getDoctorById(this.doctorId).subscribe(
        (doctor: doctorregisteration) => {
          this.doctor = doctor;
          console.log(this.doctor);
          this.patient = this.authservice.loginUser;
          console.log(this.patient);
          this.patientFirstName = this.authservice.loginusername;
          console.log(this.patientFirstName);
          this.patientIdNum = this.patient?.idNumber
          loadData();
        },
        (error) => {
          console.error('Error fetching doctor data:', error);
        }
      );
    });

    $(document).ready( () => {
     
      $('.tdclick').on('click', (event: any) => {
        debugger;
        var clickedTd = $(event.target);
        console.log(clickedTd);
        var tdId = clickedTd.attr('id');
        console.log(tdId);
        var patientName=this.patientFirstName;
        var patientIdNum = this.patientIdNum;

        if(patientIdNum!="" && patientName !=""){
          debugger;
          this.unauthorizedMessageShown = false;
          this.messageToDoctor = true;
          clickedTd.addClass('activated');
          const htmlContent = `
            <span class="activated-text">
                <p>ჩემი <br />ჯავშანი </p>
                <span class="deletebutton" style="position: absolute; top: 0; right: 0; background-color: white; border: none; border-radius: 50%;">
                <span class="delete-button" style="padding: 6px;"><img src="../../assets/Group 3.png" alt=""></span>
            </span>
            `;
          clickedTd.html(htmlContent);
          var formData = {
            DoctorName: this.doctor?.firstName,
            IdNumber: this.doctor?.idNumber ||'Doctor',
            UniqueNumber: tdId,
            PatientName:patientName,
            ClientIdNumber: patientIdNum,
            MessageToDoctor: 'თავის ტკივილი',
            Status: 'available',
          };
  
          this.authservice.clientBookAppointment(formData).subscribe(
            () => {
              alert('Appointment Booked successfully!');
            },
            (error) => {
              console.error('Error booking appointment:', error);
            }
          );
            debugger;
            $('.tdclick:not(:has(.deletebutton))').prop('disabled', true);
            }else{
              alert("First Login Yourself To Book Appointment");
              this.unauthorizedMessageShown = true;
            }
            });
            $('.tdclick').on('click', '.deletebutton',  (event: any) => {
              debugger;
              const clickedDeleteButton = $(event.target);
              var tdId = clickedDeleteButton.closest('td').attr('id');
              var patientName=this.patientFirstName;
              var patientIdNum = this.patientIdNum;
              const parentTdClick = clickedDeleteButton.closest('.tdclick');
              parentTdClick.removeClass('activated');
              parentTdClick.empty();

              var formData = {
                DoctorName: this.doctor?.firstName,
                IdNumber: this.doctor?.idNumber ||'Doctor',
                UniqueNumber: tdId,
                PatientName:patientName,
                ClientIdNumber: patientIdNum,
                Status: 'Booked',
              };

          this.authservice.clientRemoveAppointment(formData).subscribe(
          () => {
            alert('Appointment Removed successfully!');
          },
          (error) => {
            console.error('Error removing appointment:', error);
          }
        );
      });
      
    });

    const loadData = () => {
      debugger;
      const IdNumber = this.doctor?.idNumber || 'Doctor';
      const clientIdNumber = this.patient?.idNumber || 'DefaultClientId';
    
      this.authservice.getAppointmentData(IdNumber).subscribe(
        (data: any) => {
          debugger;
          const patientIdNumber = clientIdNumber;
          // console.log(patientIdNumber)
    
          if (data.data.length > 0) {
            data.data.forEach((appointment: any) => {
              const element = $('#' + appointment.uniqueNumber);
    
              if (appointment.status === 'Unavailable' || appointment.clientIdNumber !== patientIdNumber) {
                element.addClass('disactivated');
                const htmlContent = `
                    <span class="activated-text">
                    <p>Not <br /> Available</p>
                    </span>
                `;
                element.html(htmlContent);
                $('.tdclick.disactivated').prop('disabled', true);
              } else if (appointment.clientIdNumber === patientIdNumber) {
                element.addClass('activated');
                const htmlContent = `
                  <span class="activated-text">
                    <p>ჩემი <br />ჯავშანი </p>
                    <span class="deletebutton" style="position: absolute; top: 0; right: 0; background-color: white; border: none; border-radius: 50%;">
                    <span class="delete-button" style="padding: 6px;"><img src="../../assets/Group 3.png" alt=""></span>
                  </span>
                `;
                element.html(htmlContent);
              }
            });
    
            $('.tdclick:not(:has(.deletebutton))').prop('disabled', true);
          }
        },
        (error) => {
          console.error('Error fetching appointment data:', error);
        }
      );
    };
    

    for (let i = 1; i <= 9; i++) {
      const row = { cols: [] as { value: string; activated: boolean }[] };
      for (let j = 1; j <= 7; j++) {
        row.cols.push({ value: `${i}-${j}`, activated: false });
      }
      this.tableData.push(row);
    }    
  }

  getTimeRange(rowNumber: number): string {
    const startTime = 9;
    const endTime = 18;
    const timeSlot = 1;

    const startHour = startTime + rowNumber * timeSlot;
    const endHour = startHour + timeSlot;

    return `${startHour}:00 - ${endHour}:00`;
  }

}