import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { doctorregisteration } from '../../core/auth/useregisteration';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { data } from 'jquery';
import { MessageService } from 'primeng/api';
import { TableDataService } from 'src/app/core/auth/table-data-service.service';
import { BasePageComponent } from '../base-page/base-page.component';
declare var $: any;

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent extends BasePageComponent implements OnInit {
  activeTab: string = 'doctors';
  activeRole: string = 'doctor';

  randomDoctor: doctorregisteration | undefined;

  starIcons: string[] | undefined;


  constructor(private router: Router,public authservice:AuthserviceService, private route: ActivatedRoute, private messageService: MessageService, public tableDataService: TableDataService) {
    super();
  }
  
  ngOnInit() {

    this.authservice.getallDoctor().subscribe(
      (doctors: doctorregisteration[]) => {
        // Pick a random doctor from the list
        const randomIndex = Math.floor(Math.random() * doctors.length);
        this.randomDoctor = doctors[randomIndex];
        // console.log('Random Doctor:', this.randomDoctor);
        this.doctor = this.randomDoctor;

          // console.log(this.doctor);
          this.doctorFirstName = this.doctor.firstName;
          this.doctorIdNumber = this.doctor.idNumber;
          loadData();
      },
      (error) => {
        console.error('Error fetching doctors:', error);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to fetch doctors. Please try again later.'});
      }
    );

    $(document).ready( () => {
     
      $('.tdclick').on('click', (event: any) => {
        
            });
            $('.tdclick').on('click', '.deletebutton',  (event: any) => {
              
      });
      
    });

    const loadData = () => {
      // debugger;
      const IdNumber = this.doctor?.idNumber || 'Doctor';
    
      this.authservice.getAppointmentData(IdNumber).subscribe(
        (data: any) => {
          // debugger;
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
                `;
                element.html(htmlContent);
              }
            });
    
            $('.tdclick:not(:has(.deletebutton))').prop('disabled', true);
          }
        },
        (error) => {
          console.error('Error fetching appointment data:', error);
          this.messageService.add({severity:'error', summary:'Error', detail:'Error fetching appointment data:' + error });
        }
      );
    };
    
  }


  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'registration') {
      this.router.navigate(['/admin-page/registration']);
    }
    if (tab === 'categories') {
      this.router.navigate(['/admin-page/category']);
    }
    if (tab === 'doctors') {
      window.location.reload();
    }

  }

  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum }, (_, index) => index);
  }


  setActiveRole(role: string) {
    this.activeRole = role;
  }
}
