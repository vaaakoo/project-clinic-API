import { Component, ViewChild } from '@angular/core';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CategoryService } from '../../core/auth/category-list.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  private imageFile: File | undefined;
  isbuttondsiabed: boolean = false;
  @ViewChild('userForm') userForm: any;
  userimage: string | null = null;
  buttontext: string = 'რეგისტრაცია';
  constructor(
    public authserviceService: AuthserviceService,
    private router: Router,
    private messageService: MessageService,
    private categoryService: CategoryService
  ) {
  }

  
  categoryList: string[] = [];
  ngOnInit() {
    this.showDropdown();
  }

  showDropdown() {
    setTimeout(() => {
      this.categoryList = this.categoryService.getCategoryList();
    }, 1000); 
  }

  onSubmit() {
    // debugger;
    this.buttontext = 'Wait..';
    this.isbuttondsiabed = true;
    this.authserviceService.doctor.imageUrl=this.userimage || "";
    this.authserviceService
      .registerdoctor(this.authserviceService.doctor)
      .subscribe(
        (response) => {
          this.userForm.resetForm();
          this.userimage="";
          this.buttontext = 'რეგისტრაცია';
          this.isbuttondsiabed = false;
          // alert('Successfully saved the Record');
          this.messageService.add({severity:'success', summary:'Success', detail:'რეგისტრაცია გავლილია!'});
          this.router.navigate(['/admin-page/category']);
        },
        (error: HttpErrorResponse) => {
          this.buttontext = 'რეგისტრაცია';
          this.isbuttondsiabed = false;
          // alert(error.error.message);
          this.messageService.add({severity:'error', summary:'Error', detail: error.error.message});
        }
      );
  }


  onImageChange(event: any): void {
    const file = event.target.files[0];
  
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = () => {
        this.userimage = reader.result as string;
      };
  
      reader.readAsDataURL(file);
    } else {
      // Handle the case where a non-image file is selected
      console.error('Invalid file type. Please select an image.');
    }
  }
}
