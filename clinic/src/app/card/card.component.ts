import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../core/auth/authservice.service';
import { doctorregisteration } from '../core/auth/useregisteration';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
  


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class CardComponent implements OnInit {
  alldoctor: doctorregisteration[] = [];
  maxVisibleDoctors = 6;

  constructor(public authservice:AuthserviceService, private route: ActivatedRoute, private router: Router, private messageService: MessageService){}

  ngOnInit() {
    this.authservice.getallDoctor().subscribe(
      (data: doctorregisteration[]) => {
        this.alldoctor = data;
      },
      (error) => {
        console.error('Error fetching doctor data:', error);
      }
    );
  
    // Move this part inside ngOnInit
    this.route.params.subscribe(params => {
      const doctorId = params['id'];
    });
  }
  
  onBookingClick(doctor: doctorregisteration) {
    this.router.navigate(['/booking', doctor.id]);
  }
  
  // გაზრდა ქარდების
  toggleSeeMore() {
    this.maxVisibleDoctors += 3; 
  }
  
  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum }, (_, index) => index);
  }

}
