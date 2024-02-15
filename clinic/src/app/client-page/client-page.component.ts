import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Useregisteration, doctorregisteration } from '../core/auth/useregisteration';
import { AuthserviceService } from '../core/auth/authservice.service';
import { data } from 'jquery';
import { MessageService } from 'primeng/api';
declare var $: any;

@Component({
  selector: 'app-client-page',
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.css']
})

export class ClientPageComponent implements OnInit{

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

  submissionSuccess: boolean = false;


  doctor?: doctorregisteration ;
  doctorId: number | undefined; 
  client?: Useregisteration;
  clientId: number | undefined; 
  patientFirstName: string = '';
  patientIdNumber: string = '';
  appointmentCount: number = 0;
  statusBook: string ="=";
  text: string = "";
  doctorName: string = "";
  tooltipBox: boolean = false;
  doctroImg: any;
  doctorLastName: string="";
  doctorCategory: string="";
  docId: number = 0;
  oldPassword: string="";
  newPassword: string="";

  constructor(private router: Router,public authservice:AuthserviceService, private route: ActivatedRoute, private messageService: MessageService) {}
  
  ngOnInit() {

    this.route.params.subscribe(params => {
      this.clientId = +params['id'];
      // console.log('Client ID from route parameters:', this.clientId);

      this.authservice.getUserById(this.clientId).subscribe(
        (client: Useregisteration) => {
          this.client = client;
          // console.log(this.client);
          this.patientFirstName = client.firstName;
          this.patientIdNumber =client.idNumber;
          loadData();
        },
        (error) => {
          console.error('Error fetching doctor data:', error);
        }
      );
    });

    

    $(document).ready( () => {
     
      $('.tdclick').on('click', (event: any) => {   
        debugger
        const clickedTd = $(event.target).closest('td');

        const tdId = clickedTd.attr('id');
        this.doctorName;
        this.statusBook;
        this.text;
        this.doctroImg;
        this.doctorLastName;
        this.doctorCategory;
        var patientIdNum = this.patientIdNumber;
        this.docId;

        this.tooltipBox = true;
        if (clickedTd.hasClass('disactivated')) {
          // Handle the case when the td is disactivated
          // alert('This time slot is not available.');
          this.messageService.add({severity:'error', summary:'Error', detail:'This time slot is not available.'});
          return;
        }
        if (tdId && patientIdNum) {
          this.tooltipBox = true;
          this.authservice.getClientDataByIdNumberAndTimeSlot(patientIdNum, tdId).subscribe(
            (response) => {
              const appointment = response.data[0];
          
              this.doctorName = appointment.doctorName;
              this.text = appointment.messageToDoctor;
              this.statusBook = appointment.status;
          
              this.authservice.getDoctorByIdNumber(appointment.idNumber).subscribe(
                (doctorResponse) => { 
                  debugger
                  this.doctroImg = doctorResponse.imageUrl; 
                  this.doctorLastName = doctorResponse.lastName;
                  this.doctorCategory = doctorResponse.category;
                  this.docId = doctorResponse.id;

                },
                (doctorError) => {
                  console.error('Error fetching doctor data:', doctorError);
                }
              );
            },
            (error) => {
              console.error('Error fetching client data:', error);
            }
          );
          
        }

            });
            $('.tdclick').on('click', '.deletebutton',  (event: any) => {
              debugger
              this.tooltipBox = false;
              var doctorName;
              var doctorIdNum;
              const clickedDeleteButton = $(event.target);
              var tdId = clickedDeleteButton.closest('td').attr('id');
              var patientName = this.patientFirstName;
              var patientIdNum = this.patientIdNumber;
          
              if (tdId && patientIdNum) {
                  this.authservice.getClientDataByIdNumberAndTimeSlot(patientIdNum, tdId).subscribe(
                      (response) => {
                          console.log('Client Data Response:', response);
          
                          const appointment = response.data[0];

                          doctorName = appointment.doctorName;
                          doctorIdNum = appointment.idNumber;
          
                          const parentTdClick = clickedDeleteButton.closest('.tdclick');
                          parentTdClick.removeClass('activated');
                          parentTdClick.empty();
          
                          var formData = {
                              DoctorName: doctorName,
                              IdNumber: doctorIdNum,
                              UniqueNumber: tdId,
                              PatientName: patientName,
                              ClientIdNumber: patientIdNum,
                              MessageToDoctor: 'თავის ტკივილი',
                              Status: 'Booked',
                          };
          
                          this.authservice.clientRemoveAppointment(formData).subscribe(
                              () => {
                                  // alert('Appointment Removed successfully!');
                                  this.messageService.add({severity:'success', summary:'Success', detail:'Appointment Removed successfully!'});
                              },
                              (error) => {
                                  console.error('Error removing appointment:', error);
                              }
                          );
                      },
                      (error) => {
                          console.error('Error fetching client data:', error);
                      }
                  );
              }
          });
          
      
    });

    const loadData = () => {
      debugger;
      const patientidNumber = this.patientIdNumber || 'Client';
    
      this.authservice.getClientDataByIdNumber(patientidNumber).subscribe(
        (data: any) => {
          const patientName = this.patientFirstName;
          const patientIdNumber = this.patientIdNumber;
          this.appointmentCount = data.count || 0;
    
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
                    align-items: center; justify-content: center; top: 4px; right: 5px; background-color: white; border: none; border-radius: 50%;">
                    <span class="delete-button" ><img src="../../assets/Group 3.png" alt=""></span>
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

  // password changer
  onSubmit() {
    const email = this.authservice.getToken().userInfo.email;
    this.changePassword(email, this.oldPassword, this.newPassword);
  }
  
  changePassword(email: string, oldPassword: string, newPassword: string) {
    debugger
    if (!oldPassword || !newPassword) {
      // alert('Old and new passwords are required.');
      this.messageService.add({severity:'error', summary:'Error', detail:'Old and new passwords are required.'});
      return;
    }
  
    this.authservice.changePassword(email, oldPassword, newPassword).subscribe(
      (response) => {
        this.messageService.add({severity:'success', summary:'Success', detail: response.message});
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.submissionSuccess = true;

      },
      (error) => {
        this.messageService.add({severity:'error', summary:'Error', detail: error.error.message});
        this.submissionSuccess = false;
      }
    );
  }
  

  onBookingClick(docId: number): void {
    console.log(docId);
    // Use the router to navigate to the doctor's booking route
    this.router.navigate(['/booking', docId]);
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


