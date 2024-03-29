import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { doctorregisteration } from '../../core/auth/useregisteration';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { data } from 'jquery';
import { MessageService } from 'primeng/api';
import { TableDataService } from '../../core/auth/table-data-service.service';
import { BasePageComponent } from '../base-page/base-page.component';
declare var $: any;

@Component({
  selector: 'app-doctor-page',
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.css'],
})
export class DoctorPageComponent extends BasePageComponent implements OnInit{





  constructor(private router: Router,public authservice:AuthserviceService, private route: ActivatedRoute, private messageService: MessageService, public tableDataService: TableDataService) {
    super();
  }
  
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
          this.messageService.add({severity:'error', summary:'Error', detail:'This time slot is not available.'});
          return;
        }
        if (tdId && this.doctorIdNumber) {
          debugger;
          this.tooltipBox = true;
          this.authservice.getBookDataByDoctorsIdNumberAndTimeSlot(this.doctorIdNumber, tdId).subscribe(
            (response) => {
              const appointment = response.data[0];
              this.clientName = appointment.patientName;
              // console.log(appointment)
              this.text = appointment.messageToDoctor;
              this.clientIdNumber = appointment.clientIdNumber;
          
              this.authservice.getClientByIdNumber(appointment.clientIdNumber).subscribe(
                (clientResponse) => { 
                  debugger
                  // console.log(clientResponse)
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
                        // console.log('Client Data Response:', response);
        
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
                            (response) => {
                                // alert('Appointment Removed successfully!');
                                this.messageService.add({severity:'success', summary:'Success', detail: response.message });
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
      
  }

    // password changer
    onSubmit() {
      const email = this.authservice.getToken().userInfo.email;
      this.changePassword(email, this.oldPassword, this.newPassword);
    }
    
    changePassword(email: string, oldPassword: string, newPassword: string) {
      if (!oldPassword || !newPassword) {
        // alert('Old and new passwords are required.');
        this.messageService.add({severity:'error', summary:'Error', detail:'Old and new passwords are required.'});
        return;
      }
    
      this.authservice.changePassword(email, oldPassword, newPassword).subscribe(
        (response) => {
          // alert('Password changed successfully:');
          this.messageService.add({severity:'success', summary:'Success', detail: response.message});
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          this.submissionSuccess = true;
  
        },
        (error) => {
          // alert('Error changing password:');
          this.messageService.add({severity:'error', summary:'Error', detail: error.error.message});
          this.submissionSuccess = false;
  
        }
      );
    }
  
  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum }, (_, index) => index);
  }

}
