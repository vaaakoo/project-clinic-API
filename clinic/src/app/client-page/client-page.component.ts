import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Useregisteration, doctorregisteration } from '../useregisteration';
import { AuthserviceService } from '../shared/authservice.service';
import { data } from 'jquery';
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

  doctor?: doctorregisteration ;
  doctorId: number | undefined; 
  client?: Useregisteration;
  clientId: number | undefined; 
  patientFirstName: string = '';
  patientIdNumber: string = '';
  appointmentCount: number = 0;


  constructor(private router: Router,public authservice:AuthserviceService, private route: ActivatedRoute,) {}
  
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
     
     
            $('.tdclick').on('click', '.deletebutton',  (event: any) => {
              debugger;
              const clickedDeleteButton = $(event.target);
              var tdId = clickedDeleteButton.closest('td').attr('id');
              var patientName=this.patientFirstName;
              var patientIdNum =this.patientIdNumber;
              const parentTdClick = clickedDeleteButton.closest('.tdclick');
              parentTdClick.removeClass('activated');
              parentTdClick.empty();

              var formData = {
                DoctorName: this.doctor?.firstName,
                IdNumber: this.doctor?.idNumber ||'Doctor',
                UniqueNumber: tdId,
                PatientName:patientName,
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
      });
      
    });

    const loadData = () => {
      debugger;
      const patientidNumber = this.patientIdNumber || 'Client';
    
      this.authservice.getClientDataByIdNumber(patientidNumber).subscribe(
        (data: any) => {
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
                  <span class="activated-text">
                  <p class="activated-text-p" style="font-weight: bold; color: #3ACF99; text-align: center; font-size: 12px; font-style: normal; font-weight: 400; line-height: normal; word-wrap: break-word;">
                  ჩემი <br />ჯავშანი
                </p>
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

  changePassword(user: Useregisteration) {
    debugger
    const newPassword = window.prompt('Enter the new password:');
    
    if (newPassword !== null) {
      // Update the user's password
      user.password = newPassword;
  
      this.authservice.updateUser(user).subscribe(
        (result) => {
          alert('Password changed successfully');
        },
        (error) => {
          console.error('Error updating user password:', error);
          // Handle the error as needed
        }
      );
    }
  }
  

  handleCellClick(col: any) {
    if (col.activated && col.status === 'available' && col.appointment) {
      const formData = {
        DoctorName: col.appointment.doctorName,
        IdNumber: col.appointment.doctorIdNumber || 'Doctor',
        UniqueNumber: col.value,
        PatientName: col.appointment.patientName,
        ClientIdNumber: col.appointment.clientIdNumber,
        MessageToDoctor: 'თავის ტკივილი',
        Status: 'available',
      };
  
      console.log(formData)
      // Call the function to display the details (e.g., showDetailsModal)
      this.showDetailsModal(formData);
    }
  }
  
  showDetailsModal(formData: any) {
    // Implement your logic to display appointment details.
    // You can use a modal, alert, or any other method based on your UI design.
    console.log('Appointment Details:', formData);
    // Example: Show details in an alert
    alert(`Appointment Details:\nDoctor: ${formData.DoctorName}\nPatient: ${formData.PatientName}`);
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


