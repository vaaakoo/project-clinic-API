import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { doctorregisteration } from '../../core/auth/useregisteration';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../core/auth/category-list.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    RatingModule
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  private readonly authService = inject(AuthserviceService);
  private readonly categoryService = inject(CategoryService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);

  // State Signals
  readonly alldoctors = signal<doctorregisteration[]>([]);
  readonly displayModal = signal(false);
  readonly categories = signal<string[]>([]);
  
  // Form Signals
  readonly selectedDoctor = signal<doctorregisteration | null>(null);
  readonly formFirstName = signal('');
  readonly formLastName = signal('');
  readonly formEmail = signal('');
  readonly formCategory = signal('');
  readonly formIdNumber = signal('');
  readonly formPassword = signal('');
  readonly formRating = signal(1);

  ngOnInit() {
    this.loadDoctorData();
    this.categories.set(this.categoryService.getCategoryList());
  }

  loadDoctorData() {
    this.authService.getallDoctor().subscribe({
      next: (data) => this.alldoctors.set(data),
      error: (err: any) => console.error('Error fetching doctor data:', err)
    });
  }

  deleteDoctor(doctorId: number) {
    if (confirm('ნამდვილად გსურთ ექიმის წაშლა?')) {
      this.authService.deleteDoctor(doctorId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'წარმატება', detail: 'ექიმი წაიშალა' });
          this.loadDoctorData();
        },
        error: (err: any) => {
          console.error('Error deleting doctor:', err);
          this.messageService.add({ severity: 'error', summary: 'შეცდომა', detail: 'წაშლა ვერ მოხერხდა' });
        }
      });
    }
  }

  editDoctor(doctor: doctorregisteration) {
    this.selectedDoctor.set(doctor);
    this.formFirstName.set(doctor.firstName);
    this.formLastName.set(doctor.lastName);
    this.formEmail.set(doctor.email);
    this.formCategory.set(doctor.category);
    this.formIdNumber.set(doctor.idNumber);
    this.formPassword.set(doctor.password || '');
    this.formRating.set(doctor.starNum);
    this.displayModal.set(true);
  }

  changeDoctorData() {
    if (!this.isFormValid()) {
      this.messageService.add({ severity: 'error', summary: 'შეცდომა', detail: 'გთხოვთ შეავსოთ ყველა ველი' });
      return;
    }

    const currentDoc = this.selectedDoctor();
    if (currentDoc) {
      const updatedDoc: doctorregisteration = {
        ...currentDoc,
        firstName: this.formFirstName(),
        lastName: this.formLastName(),
        email: this.formEmail(),
        category: this.formCategory(),
        idNumber: this.formIdNumber(),
        password: this.formPassword(),
        starNum: this.formRating()
      };

      this.authService.updateDoctor(updatedDoc).subscribe({
        next: () => {
          this.loadDoctorData();
          this.displayModal.set(false);
          this.messageService.add({ severity: 'success', summary: 'წარმატება', detail: 'მონაცემები განახლდა' });
        },
        error: (err: any) => {
          console.error('Error updating doctor:', err);
          this.messageService.add({ severity: 'error', summary: 'შეცდომა', detail: 'განახლება ვერ მოხერხდა' });
        }
      });
    }
  }

  isFormValid(): boolean {
    return (
      this.formFirstName().trim() !== '' &&
      this.formLastName().trim() !== '' &&
      this.formEmail().trim() !== '' &&
      this.formCategory().trim() !== '' &&
      this.formIdNumber().trim() !== ''
    );
  }

  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum || 0 }, (_, index) => index);
  }
}
