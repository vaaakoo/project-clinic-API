import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../shared/authservice.service';
import { doctorregisteration } from '../useregisteration';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})


export class HomeComponent implements OnInit {
  alldoctor: doctorregisteration[] = [];
  maxVisibleDoctors = 6;


constructor(public authservice:AuthserviceService, private route: ActivatedRoute, private router: Router){}

ngOnInit() {
  this.authservice.getalldoc().subscribe(
    (data: doctorregisteration[]) => {
      this.alldoctor = data;
      console.log('Received data:', this.alldoctor);
    },
    (error) => {
      console.error('Error fetching doctor data:', error);
    }
  );

  // Move this part inside ngOnInit
  this.route.params.subscribe(params => {
    const doctorId = params['id'];
    console.log('Doctor ID from route parameters:', doctorId);
  });
}

onBookingClick(doctor: doctorregisteration) {
  console.log('Clicked on booking button. Doctor data:', doctor);

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
