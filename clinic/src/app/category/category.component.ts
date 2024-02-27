import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../core/auth/authservice.service';
import { doctorregisteration } from '../core/auth/useregisteration';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../core/auth/category-list.service';
import { MessageService } from 'primeng/api';

declare var $: any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  constructor(public authservice: AuthserviceService, private route: ActivatedRoute, private router: Router, private categoryService: CategoryService, private messageService: MessageService) {
    
  }

  alldoctor: doctorregisteration[] = [];
  selectedDoctor: doctorregisteration | null = null;
  doctor?: doctorregisteration ;
  submissionSuccess: boolean = false;
  doctorfirstName: string = "";
  doctorLastName: string = "";
  doctorEmail: string = "";
  doctorCategory: string = "";
  doctorIdNumber: string ="";
  doctorPassword: string = "";
  displayModal: boolean = false;
  categories: string[] | undefined;
  doctorRating: number = 1;



  ngOnInit() {
    this.loadDoctorData();

    // Move this part inside ngOnInit
    this.route.params.subscribe(params => {
      const doctorId = params['id'];
      // console.log('Doctor ID from route parameters:', doctorId);
    });
    this.categories = this.categoryService.getCategoryList();
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
    this.selectedDoctor = doctor;
    this.displayModal = true;
    console.log(this.selectedDoctor);
  }


  changeDoctorData() {
    debugger;
    if (!this.isFormValid()) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Please fill at least one field.'});
      return; // Exit the method early if the form data is invalid
    }
  
    if (this.selectedDoctor) {
      this.selectedDoctor.firstName = this.doctorfirstName;
      this.selectedDoctor.lastName = this.doctorLastName;
      this.selectedDoctor.email = this.doctorEmail;
      this.selectedDoctor.category = this.doctorCategory;
      this.selectedDoctor.idNumber = this.doctorIdNumber;
      this.selectedDoctor.password = this.doctorPassword;
      this.selectedDoctor.starNum = this.doctorRating;
  
      this.authservice.updateDoctor(this.selectedDoctor).subscribe({
        next: (result) => {
          console.log(result);
          this.loadDoctorData();
          this.displayModal = false;
          this.messageService.add({severity:'success', summary:'Success', detail:'goooooood!'});
        },
        error: (error) => {
          console.error('Error updating doctor:', error);
          this.messageService.add({severity:'error', summary:'Error', detail:'An error occurred while updating the doctor.'});
        }
      });
    }
  }
  
  isFormValid(): boolean {
    return (
      this.doctorfirstName.trim() !== '' ||
      this.doctorLastName.trim() !== '' ||
      this.doctorEmail.trim() !== '' ||
      this.doctorCategory.trim() !== '' ||
      this.doctorIdNumber.trim() !== '' ||
      this.doctorPassword.trim() !== '' 
    );
  }
  
  

  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum }, (_, index) => index);
  }

}
