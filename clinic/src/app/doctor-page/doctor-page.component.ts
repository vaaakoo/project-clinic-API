import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { doctorregisteration } from '../useregisteration';
import { AuthserviceService } from '../shared/authservice.service';
declare var $: any;
@Component({
  selector: 'app-doctor-page',
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.css'],
})
export class DoctorPageComponent {
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

  doctor?: doctorregisteration ;
  doctorId: number | undefined; // Variable to store the doctor ID

  constructor(private router: Router,public authservice:AuthserviceService, private route: ActivatedRoute) {}

  ngOnInit() {

    this.route.params.subscribe((params) => {
      this.doctorId = +params['id'];
      console.log('Doctor ID from route parameters:', this.doctorId);

      this.authservice.getDoctorById(this.doctorId).subscribe(
        (doctor: doctorregisteration) => {
          this.doctor = doctor;
          // Call loadData after fetching the doctor's information
          loadData();
        },
        (error) => {
          console.error('Error fetching doctor data:', error);
        }
      );
    });
      
      const loadData = () => {
        var doctorName = this.doctor?.firstName || 'Doctor';
         debugger;
         $.ajax({
          type: 'GET',
          url:
            'http://localhost:5100/api/Booking/getdata?DoctorName=' +
            doctorName,
          contentType: 'application/json',
          success: function (data: any) {
            // debugger;
            if (data.length > 0) {
              $.each(data, function (index: any, appointment: any) {
                if(appointment.status=="Unavailable"){
                  $('#'+appointment.uniqueNumber).addClass('disactivated');
                  const htmlContent = `
                  <span class="activated-text">
                      <p>Not <br /> Available</p>
                      <span class="deletebutton" style="position: absolute; top: 0; right: 0; background-color: white; border: none; border-radius: 50%; padding: 10px;"></span>
                  </span>
                  `;
                  $('#'+appointment.uniqueNumber).html(htmlContent);
                }else{
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
            } else {
              
            }
          },
          error: function () {
            alert('Error fetching data. Please try again.');
          },
        });
       }

    $(document).ready(function () {
      $('.tdclick').on('click', (event: any) => {
        var clickedTd = $(event.target);
        var tdId = clickedTd.attr('id');
        // debugger;
        clickedTd.addClass('disactivated');
        const htmlContent = `
          <span class="activated-text">
              <p>Not <br />Available </p>
              <span class="deletebutton" style="position: absolute; top: 0; right: 0; background-color: white; border: none; border-radius: 50%; padding: 10px;"></span>
          </span>
          `;
        clickedTd.html(htmlContent);
        var formData = {
          DoctorName: 'Doctor',
          UniqueNumber: tdId,
          Status: 'Unavailable',
        };

        $.ajax({
          type: 'POST',
          url: 'http://localhost:5100/api/Booking/BookAppointment',
          contentType: 'application/json',
          data: JSON.stringify(formData),
          success: function () {
            alert('Appointment Not Available successfully!');
          },
          error: function () {},
        });
        $('.tdclick:not(:has(.deletebutton))').prop('disabled', true);
      });
      $('.tdclick').on('click', '.deletebutton', function (event: any) {
        // debugger;
        const clickedDeleteButton = $(event.target);
        var tdId = clickedDeleteButton.closest('td').attr('id');
        const parentTdClick = clickedDeleteButton.closest('.tdclick');
        parentTdClick.removeClass('activated');
        parentTdClick.removeClass('disactivated');
        parentTdClick.empty();
        var formData = {
          DoctorName: 'Doctor',
          UniqueNumber: tdId,
          Status: 'Booked',
        };

        $.ajax({
          type: 'POST',
          url: 'http://localhost:5100/api/Booking/RemoveAppointment',
          contentType: 'application/json',
          data: JSON.stringify(formData),
          success: function () {
            alert('Appointment Removed successfully!');
          },
          error: function () {},
        });
      });

    });

    for (let i = 1; i <= 9; i++) {
      const row = { cols: [] as { value: string; activated: boolean }[] };
      for (let j = 1; j <= 7; j++) {
        row.cols.push({ value: `${i}-${j}`, activated: false });
      }
      this.tableData.push(row);
    }
  }

  toggleCellActivation(rowIndex: number, colIndex: number) {
    const isLastTwoColumns = colIndex >= 5;
    if (!isLastTwoColumns) {
      this.tableData[rowIndex].cols[colIndex].activated =
        !this.tableData[rowIndex].cols[colIndex].activated;
    }
  }

  deleteCell(rowIndex: number, colIndex: number) {
    !this.tableData[rowIndex].cols[colIndex].activated;
  }

  getTimeRange(rowNumber: number): string {
    const startTime = 9;
    const endTime = 18;
    const timeSlot = 1;

    const startHour = startTime + rowNumber * timeSlot;
    const endHour = startHour + timeSlot;

    return `${startHour}:00 - ${endHour}:00`;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'registration') {
      this.router.navigate(['/admin-page/registration']);
    }
    if (tab === 'categories') {
      this.router.navigate(['/admin-page/category']);
    }
  }

  setActiveRole(role: string) {
    this.activeRole = role;
  }
}
