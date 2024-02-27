import { Component , OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { Useregisteration, doctorregisteration } from '../../core/auth/useregisteration';
import { data } from 'jquery';
import { MessageService } from 'primeng/api';
import { TableDataService } from '../../core/auth/table-data-service.service';
import { BasePageComponent } from '../base-page/base-page.component';
declare var $: any;

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent extends BasePageComponent implements OnInit{

  visitConfirmation: string = '';
  textToDoctor: string='';

  patient?: Useregisteration;
  patientIdNum?: string='';
  

  constructor(private router: Router,public authservice:AuthserviceService, private route: ActivatedRoute, private messageService: MessageService, public tableDataService: TableDataService) {
    super();
  }
  
  submitForm() {
    // console.log('Form submitted with:', this.visitConfirmation);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.doctorId = +params['id'];
   
      this.authservice.getDoctorById(this.doctorId).subscribe(
        (doctor: doctorregisteration) => {
          this.doctor = doctor;
          this.patient = this.authservice.getToken().userInfo;
          this.patientFirstName = this.authservice.getToken().userInfo.firstName;
          this.patientIdNum = this.authservice.getToken().userInfo.idNumber
          loadData();
        },
        (error) => {
          console.error('Error fetching doctor data:', error);
          this.messageService.add({severity:'error', summary:'Error', detail:'Error fetching appointment data:' + error });
        }
      );
    });

    $(document).ready( () => {
      let modalConfirmCallback: ((textToDoctor: string) => void) | undefined;
      $('.tdclick').on('click', (event: any) => {

        var clickedTd = $(event.target);

        if (clickedTd.hasClass('disactivated')) {
          // alert('This time slot is not available.');
          this.messageService.add({severity:'error', summary:'Error', detail:'This time slot is not available.' });
          return;
        }

        debugger;
        $('#myModal').css('display', 'block');

        var tdId = clickedTd.attr('id');
        var patientName=this.patientFirstName;
        var patientIdNum = this.patientIdNum;
       

        modalConfirmCallback = (textToDoctor) => {
          console.log('Message to Doctor:', textToDoctor);
        if(patientIdNum!="" && patientName !=""){
          debugger;
          this.unauthorizedMessageShown = false;
          // this.messageToDoctor = true;
          clickedTd.addClass('activated');
          const htmlContent = `
          <span class="activated-text" style="font-weight: bold;
          color: #3ACF99;
          text-align: center;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          word-wrap: break-word;">
            <p>ჩემი <br />ჯავშანი </p>
            <span class="deletebutton" style="position: absolute; width: 18px; height: 18px; display: flex;
            align-items: center; top: 4px; right: 5px; background-color: white; border: none; border-radius: 50%;">
            <span class="delete-button" style="padding: 5px;"><img src="../../assets/Group 3.png" alt=""></span>
          </span>
            `;
          clickedTd.html(htmlContent);
          var formData = {
            DoctorName: this.doctor?.firstName,
            IdNumber: this.doctor?.idNumber ||'Doctor',
            UniqueNumber: tdId,
            PatientName:patientName,
            ClientIdNumber: patientIdNum,
            MessageToDoctor: textToDoctor,
            Status: 'available',
          };
  
          this.authservice.clientBookAppointment(formData).subscribe(
            () => {
              // alert('Appointment Booked successfully!');
              this.messageService.add({severity:'success', summary:'Success', detail:'Appointment Booked successfully!'});
              this.messageToDoctor = false;
            },
            (error) => {
              // console.error('Error booking appointment:', error);
              this.messageService.add({severity:'error', summary:'Error', detail:'Error booking appointment:' + error });
            }
          );
            debugger;
            $('.tdclick:not(:has(.deletebutton))').prop('disabled', true);
            }else{
              // alert("First Login Yourself To Book Appointment");
              this.messageService.add({severity:'error', summary:'Error', detail:'First Login Yourself To Book Appointment!' });
              this.unauthorizedMessageShown = true;
            }
          };
            // Handle the confirm button click
            $('#confirmMessage').on('click', () => {
              const messageToDoctor = $('#messageToDoctor').val() as string;
              $('#myModal').css('display', 'none');
              modalConfirmCallback?.(messageToDoctor);
            });
        
            $('.close').on('click', () => {
              modalConfirmCallback = undefined;
              $('#myModal').css('display', 'none');
            });
            });
            
      $('.tdclick').on('click', '.deletebutton',  (event: any) => {
              debugger;
              const clickedDeleteButton = $(event.target);
              var tdId = clickedDeleteButton.closest('td').attr('id');
              var patientName=this.patientFirstName;
              var patientIdNum = this.patientIdNum;
              var doctorName = this.doctor?.firstName;
              var doctorIdNum = this.doctor?.idNumber;
              var tdId = tdId;

              const parentTdClick = clickedDeleteButton.closest('.tdclick');
              parentTdClick.removeClass('activated');
              parentTdClick.empty();

              var formData = {
                DoctorName: doctorName,
                IdNumber: doctorIdNum,
                UniqueNumber: tdId,
                PatientName:patientName,
                ClientIdNumber: patientIdNum,
                MessageToDoctor: "თავის ტკივილი",
                Status: 'Booked',
              };      

          this.authservice.clientRemoveAppointment(formData).subscribe(
          () => {
            alert('Appointment Removed successfully!');
            this.messageService.add({severity:'success', summary:'Success', detail:'Appointment Removed successfully!'});
          },
          (error) => {
            console.error('Error removing appointment:', error);
            this.messageService.add({severity:'error', summary:'Error', detail:'Error removing appointment'});
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
    
          if (data.data.length > 0) {
            data.data.forEach((appointment: any) => {
              const element = $('#' + appointment.uniqueNumber);
    
              if (appointment.status === 'Unavailable' || appointment.clientIdNumber !== patientIdNumber) {
                element.addClass('disactivated');
                const htmlContent = `
                    <span class="activated-text">
                    
                    </span>
                `;
                element.html(htmlContent);
                $('.tdclick.disactivated').prop('disabled', true);
              } else if (appointment.clientIdNumber === patientIdNumber) {
                element.addClass('activated');
                const htmlContent = `
                <span class="activated-text" style="font-weight: bold;
                  color: #3ACF99;
                  text-align: center;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: normal;
                  word-wrap: break-word;">
                    <p>ჩემი <br />ჯავშანი </p>
                    <span class="deletebutton" style="position: absolute; width: 18px; height: 18px; display: flex;
                    align-items: center; top: 4px; right: 5px; background-color: white; border: none; border-radius: 50%;">
                    <span class="delete-button" style="padding: 5px;"><img src="../../assets/Group 3.png" alt=""></span>
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
    
  }

  

  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum }, (_, index) => index);
  }
}