import { Component, ViewChild, signal, inject, OnInit } from '@angular/core';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CategoryService } from '../../core/auth/category-list.service';
import { FormsModule, NgForm } from '@angular/forms';
import { doctorregisteration } from '../../core/auth/useregisteration';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  private readonly authService = inject(AuthserviceService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly categoryService = inject(CategoryService);

  @ViewChild('userForm') userForm!: NgForm;

  readonly doctor = signal<doctorregisteration>(new doctorregisteration());
  readonly userImage = signal<string | null>(null);
  readonly buttonText = signal('რეგისტრაცია');
  readonly isButtonDisabled = signal(false);
  readonly categoryList = signal<string[]>([]);
  readonly starNumList = [1, 2, 3, 4, 5];

  ngOnInit() {
    this.loadCategories();
  }

  updateDoctorField(field: string, value: any) {
    this.doctor.update(prev => ({ ...prev, [field]: value }));
  }

  loadCategories() {
    // Simulated delay as in original code
    setTimeout(() => {
      this.categoryList.set(this.categoryService.getCategoryList());
    }, 500); 
  }

  onSubmit() {
    this.buttonText.set('გთხოვთ დაელოდოთ...');
    this.isButtonDisabled.set(true);
    
    const docData = this.doctor();
    docData.imageUrl = this.userImage() || '';

    this.authService.registerdoctor(docData).subscribe({
      next: (response) => {
        this.userForm.resetForm();
        this.userImage.set(null);
        this.buttonText.set('რეგისტრაცია');
        this.isButtonDisabled.set(false);
        this.messageService.add({ severity: 'success', summary: 'წარმატება', detail: 'რეგისტრაცია გავლილია!' });
        this.router.navigate(['/admin-page/category']);
      },
      error: (error: HttpErrorResponse) => {
        this.buttonText.set('რეგისტრაცია');
        this.isButtonDisabled.set(false);
        this.messageService.add({ severity: 'error', summary: 'შეცდომა', detail: error.error?.message || 'შეცდომა' });
      }
    });
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.userImage.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Invalid file type. Please select an image.');
    }
  }
}
