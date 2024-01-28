import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../shared/authservice.service';
import { doctorregisteration } from '../useregisteration';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  constructor(public authservice: AuthserviceService, private route: ActivatedRoute, private router: Router) {}

  alldoctor: doctorregisteration[] = [];
  selectedDoctor: doctorregisteration | null = null;
  doctor?: doctorregisteration ;


  ngOnInit() {
    this.loadDoctorData();

    // Move this part inside ngOnInit
    this.route.params.subscribe(params => {
      const doctorId = params['id'];
      // console.log('Doctor ID from route parameters:', doctorId);
    });
  }

  loadDoctorData() {
    this.authservice.getalldoc().subscribe(
      (data: doctorregisteration[]) => {
        this.alldoctor = data;
        // console.log('Received data:', this.alldoctor);
      },
      (error) => {
        console.error('Error fetching doctor data:', error);
      }
    );
  }

  deleteDoctor(doctorId: number) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.authservice.deleteDoctor(doctorId).subscribe(
        () => {
          // Update the list of doctors after deletion
          this.loadDoctorData();
        },
        (error) => {
          console.error('Error deleting doctor:', error);
        }
      );
    }
  }

  editDoctor(doctor: doctorregisteration) {
    const updatedInfo = window.prompt('Enter the updated information (FirstName, LastName, Category):', `${doctor.firstName}, ${doctor.lastName}, ${doctor.category}`);
    
    if (updatedInfo !== null) {
      const [updatedFirstName, updatedLastName, updatedCategory] = updatedInfo.split(',').map(item => item.trim());

      // Update the doctor's information
      doctor.firstName = updatedFirstName;
      doctor.lastName = updatedLastName;
      doctor.category = updatedCategory;
      debugger
      this.authservice.updateDoctor(doctor).subscribe(
        (result) => {
          this.loadDoctorData();
        },
        (error) => {
          console.error('Error updating doctor:', error);
        }
      );
    }
  }

  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum }, (_, index) => index);
  }
}
