import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { doctorregisteration } from '../useregisteration';
import { AuthserviceService } from '../shared/authservice.service';
import { data } from 'jquery';
declare var $: any;

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
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

  randomDoctor: doctorregisteration | undefined;
  unauthorizedMessageShown: boolean = false;
  messageToDoctor: boolean = false;
  doctor?: doctorregisteration ;
  doctorId: number | undefined; 
  appointmentCount: number = 0;
  doctorFirstName: string='';
  doctorIdNumber: string='';
  starIcons: string[] | undefined;


  constructor(private router: Router,public authservice:AuthserviceService, private route: ActivatedRoute,) {}
  
  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   this.doctorId = +params['id'];
    //   console.log('Doctor ID from route parameters:', this.doctorId);
      

    //   this.authservice.getDoctorById(this.doctorId).subscribe(
    //     (doctor: doctorregisteration) => {
    //       this.doctor = doctor;
    //       console.log(this.doctor);
    //       this.doctorFirstName = this.authservice.loginusername;
    //       this.doctorIdNumber = this.authservice.loginUser;
    //       loadData();
    //     },
    //     (error) => {
    //       console.error('Error fetching doctor data:', error);
    //     }
    //   );
    // });

    this.authservice.getalldoc().subscribe(
      (doctors: doctorregisteration[]) => {
        // Pick a random doctor from the list
        const randomIndex = Math.floor(Math.random() * doctors.length);
        this.randomDoctor = doctors[randomIndex];
        console.log('Random Doctor:', this.randomDoctor);
        this.doctor = this.randomDoctor;

          console.log(this.doctor);
          this.doctorFirstName = this.doctor.firstName;
          this.doctorIdNumber = this.doctor.idNumber;
          loadData();
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );

    $(document).ready( () => {
     
      $('.tdclick').on('click', (event: any) => {
        debugger;
        var clickedTd = $(event.target);
        console.log(clickedTd);
        var tdId = clickedTd.attr('id');
        console.log(tdId);
        var doctorName=this.doctorFirstName;
        var doctorIdNumber = this.doctorIdNumber;
        console.log(doctorName);

        if(doctorName!=""){
          debugger;
          console.log("here is doctor:" + doctorName);
  
            $('.tdclick:not(:has(.deletebutton))').prop('disabled', true);
            }else{
              alert("You cann't book with you visit! : )");
            }
            });
            $('.tdclick').on('click', '.deletebutton',  (event: any) => {
              debugger;
              const clickedDeleteButton = $(event.target);
              var tdId = clickedDeleteButton.closest('td').attr('id');
              const parentTdClick = clickedDeleteButton.closest('.tdclick');
              parentTdClick.removeClass('activated');
              parentTdClick.empty();

              var formData = {
                DoctorName: this.doctor?.firstName,
                IdNumber: this.doctor?.idNumber ||'Doctor',
                UniqueNumber: tdId,
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

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'registration') {
      this.router.navigate(['/admin-page/registration']);
    }
    if (tab === 'categories') {
      this.router.navigate(['/admin-page/category']);
    }

  }

  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum }, (_, index) => index);
  }


  setActiveRole(role: string) {
    this.activeRole = role;
  }
}
