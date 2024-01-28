import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { doctorregisteration } from '../useregisteration';
import { AuthserviceService } from '../shared/authservice.service';
import { data } from 'jquery';
declare var $: any;

@Component({
  selector: 'app-doctor-page',
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.css'],
})
export class DoctorPageComponent implements OnInit{

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


  unauthorizedMessageShown: boolean = false;
  messageToDoctor: boolean = false;
  doctor?: doctorregisteration ;
  doctorId: number | undefined; 
  appointmentCount: number = 0;
  doctorFirstName: string='';
  doctorIdNumber: string='';
  text: string = "";
  clientName: string = "";
  tooltipBox: boolean = false;
  clientLastName: string="";
  clientIdNumber: string="";

  constructor(private router: Router,public authservice:AuthserviceService, private route: ActivatedRoute,) {}
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.doctorId = +params['id'];
      // console.log('Doctor ID from route parameters:', this.doctorId);
      

      this.authservice.getDoctorById(this.doctorId).subscribe(
        (doctor: doctorregisteration) => {
          this.doctor = doctor;
          this.doctorFirstName = doctor.firstName;
          this.doctorIdNumber = doctor.idNumber;
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
        this.clientName;
        this.text;
        this.clientLastName;
        this.clientIdNumber;
        this.doctorIdNumber;

        if (clickedTd.hasClass('disactivated')) {
          // Handle the case when the td is disactivated
          alert('This time slot is not available.');
          return;
        }
        if (tdId && this.doctorIdNumber) {
          this.tooltipBox = true;
          this.authservice.getBookDataByDoctorsIdNumberAndTimeSlot(this.doctorIdNumber, tdId).subscribe(
            (response) => {
              const appointment = response.data[0];
              this.clientName = appointment.patientName;
              this.text = appointment.messageToDoctor;
              this.clientIdNumber = appointment.clientIdNumber;
          
              this.authservice.getClientByIdNumber(appointment.idNumber).subscribe(
                (clientResponse) => { 
                  debugger
                  this.clientLastName = clientResponse.lastName;
                  this.clientIdNumber = clientResponse.idNumber;

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
              debugger;
              var doctorName = this.doctorFirstName;
              var doctorIdNum = this.doctorIdNumber;
              const clickedDeleteButton = $(event.target);
              var tdId = clickedDeleteButton.closest('td').attr('id');
              var patientName = this.clientName;
              var patientIdNum = this.clientIdNumber;

              if (tdId && doctorIdNum) {
                this.authservice.getBookDataByDoctorsIdNumberAndTimeSlot(doctorIdNum, tdId).subscribe(
                    (response) => {
                        console.log('Client Data Response:', response);
        
                        const appointment = response.data[0];

                        patientName = appointment.patientName;
                        patientIdNum = appointment.clientIdNumber;
        
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
                                alert('Appointment Removed successfully!');
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
      const IdNumber = this.doctor?.idNumber || 'Doctor';
    
      this.authservice.getAppointmentData(IdNumber).subscribe(
        (data: any) => {
          debugger;
          this.appointmentCount = data.count || 0;
          const doctorIdNumber = IdNumber;
    
          if (data.data.length > 0) {
            data.data.forEach((appointment: any) => {
              
              const element = $('#' + appointment.uniqueNumber);
              if (appointment.status === 'Unavailable' || appointment.idNumber !== doctorIdNumber) {
                element.addClass('disactivated');
                const htmlContent = `
                    <span class="activated-text">
                    <p>Not <br /> Available</p>
                    </span>
                `;
                element.html(htmlContent);
                $('.tdclick.disactivated').prop('disabled', true);
              } else if (appointment.idNumber === doctorIdNumber) {
                element.addClass('activated');
                const htmlContent = `
                  <span class="activated-text">
                    <p style="font-weight: bold;
                    color: #3ACF99;
                    text-align: center;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    word-wrap: break-word;"> დაჯავშნილია </p>
                    <span class="deletebutton" style="position: absolute; width: 18px; height: 18px; display: flex;
                    align-items: center; justify-content: center; top: 4px; right: 5px; background-color: white; border: none; border-radius: 50%;">
                    <span class="delete-button"><img src="../../assets/Group 3.png" alt=""></span>
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

  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum }, (_, index) => index);
  }

}
