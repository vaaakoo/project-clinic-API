import { Component , OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../shared/authservice.service';
import { doctorregisteration } from '../useregisteration';
declare var $: any;

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit{
  activeTab: string = 'doctors';
  activeRole: string = 'doctor';
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
  doctorId: number | undefined; // Variable to store the doctor ID
  

  constructor(private router: Router,public authservice:AuthserviceService, private route: ActivatedRoute,) {}
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.doctorId = +params['id'];
      console.log('Doctor ID from route parameters:', this.doctorId);

      this.authservice.getDoctorById(this.doctorId).subscribe(
        (doctor: doctorregisteration) => {
          this.doctor = doctor;
          loadData(); // Call loadData after fetching the doctor's information
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
        var tdId = clickedTd.attr('id');
        var patientName=$('#patientname').text();
        console.log(patientName);
        if(patientName!=""){
          debugger;
          this.unauthorizedMessageShown = false;
          this.messageToDoctor = false;
          clickedTd.addClass('activated');
          const htmlContent = `
            <span class="activated-text">
                <p>My <br />Booking </p>
                <span class="deletebutton" style="position: absolute; top: 0; right: 0; background-color: white; border: none; border-radius: 50%; padding: 10px;"></span>
            </span>
            `;
          clickedTd.html(htmlContent);
          var formData = {
            DoctorName: this.doctor?.firstName ||'Doctor',
            UniqueNumber: tdId,
            PatientName:patientName,
            Status: 'available',
          };
  
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5100/api/Booking/ClientBookAppointment',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function () {
              alert('Appointment Booked successfully!');
            },
            error: function () {},
          });
          $('.tdclick:not(:has(.deletebutton))').prop('disabled', true);
        }else{
          alert("First Login Yourself To Book Appointment");
          this.unauthorizedMessageShown = true;
        }
      });
      $('.tdclick').on('click', '.deletebutton', function (event: any) {
        debugger;
        const clickedDeleteButton = $(event.target);
        var tdId = clickedDeleteButton.closest('td').attr('id');
        var patientName=$('#patientname').text();
        const parentTdClick = clickedDeleteButton.closest('.tdclick');
        parentTdClick.removeClass('activated');
        parentTdClick.empty();
        var formData = {
          DoctorName: 'Doctor',
          UniqueNumber: tdId,
          PatientName:patientName,
          Status: 'Booked',
        };

        $.ajax({
          type: 'POST',
          url: 'http://localhost:5100/api/Booking/ClientRemoveAppointment',
          contentType: 'application/json',
          data: JSON.stringify(formData),
          success: function () {
            alert('Appointment Removed successfully!');
          },
          error: function () {},
        });
      });
      
    });

    const loadData = () => {
     var doctorName = this.doctor?.firstName || 'Doctor';
      ;
      debugger;
      $.ajax({
        type: 'GET',
        url:
          'http://localhost:5100/api/Booking/getclient?Client=' +
          doctorName,
        contentType: 'application/json',
        success: function (data: any) {
          // debugger;
          var Patientname=$('#patientname').text();
          if (data.length > 0) {
            $.each(data, function (index: any, appointment: any) {
              if(appointment.status=="Unavailable" || appointment.patientName!=Patientname){
                $('#'+appointment.uniqueNumber).addClass('disactivated');
                const htmlContent = `
                <span class="activated-text">
                    <p>Not <br /> Available</p>
                </span>
                `;
                $('#'+appointment.uniqueNumber).html(htmlContent);
                $('.tdclick.disactivated').prop('disabled', true);
              }else if(appointment.patientName==Patientname){
                $('#'+appointment.uniqueNumber).addClass('activated');
                const htmlContent = `
                <span class="activated-text">
                    <p>My <br /> Booking</p>
                    <span class="deletebutton" style="position: absolute; top: 0; right: 0; background-color: white; border: none; border-radius: 50%; padding: 10px;"></span>
                </span>
                `;
                $('#'+appointment.uniqueNumber).html(htmlContent);
              }
             
              
            });
            $('.tdclick:not(:has(.deletebutton))').prop('disabled', true);
          }
        },
        error: function () {
          
        },
      });
    }
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