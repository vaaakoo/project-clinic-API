import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { Useregisteration, doctorregisteration } from '../../core/auth/useregisteration';
import { MessageService } from 'primeng/api';
import { TableDataService, TableCell } from '../../core/auth/table-data-service.service';
import { CommonModule } from '@angular/common';
import { AppCustomTableComponent } from '../../helpers/custom-table/custom-table.component';
import { CategoryFieldComponent } from '../../helpers/category-field/category-field.component';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppCustomTableComponent,
    CategoryFieldComponent
  ],
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthserviceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  public readonly tableDataService = inject(TableDataService);

  private destroy$ = new Subject<void>();

  // State Signals
  readonly doctor = signal<doctorregisteration | null>(null);
  readonly patient = signal<Useregisteration | null>(null);
  readonly unauthorizedMessageShown = signal(false);
  readonly isModalOpen = signal(false);
  readonly messageToDoctor = signal('');
  
  private selectedCard: TableCell | null = null;

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const doctorId = +params['id'];
      this.loadDoctorData(doctorId);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDoctorData(id: number) {
    this.authService.getDoctorById(id).subscribe({
      next: (doctor) => {
        this.doctor.set(doctor);
        const currentUser = this.authService.currentUser();
        this.patient.set(currentUser);
        this.loadAppointments(doctor.idNumber);
      },
      error: (err: any) => {
        console.error('Error fetching doctor data:', err);
        this.notificationService.showError('შეცდომა', 'ექიმის მონაცემების ჩატვირთვა ვერ მოხერხდა');
      }
    });
  }

  private loadAppointments(doctorIdNumber: string) {
    this.tableDataService.resetTable();
    const patient = this.patient();
    const patientIdNumber = patient?.idNumber || '';

    this.authService.getAppointmentData(doctorIdNumber).subscribe({
      next: (data: any) => {
        this.updateTableWithAppointments(data.data, patientIdNumber);
      },
      error: (err: any) => console.error('Error fetching appointment data:', err)
    });
  }

  private updateTableWithAppointments(appointments: any[], patientIdNumber: string) {
    const currentData = this.tableDataService.tableData();
    const updatedData = currentData.map(row => ({
      cols: row.cols.map(cell => {
        const appointment = appointments.find(a => a.uniqueNumber === cell.uniqueNumber);
        if (appointment) {
          if (appointment.status === 'Unavailable' || (patientIdNumber && appointment.clientIdNumber !== patientIdNumber)) {
            return { ...cell, status: 'unavailable' as const };
          } else if (patientIdNumber && appointment.clientIdNumber === patientIdNumber) {
            return { ...cell, status: 'booked' as const };
          }
        }
        return cell;
      })
    }));
    this.tableDataService.tableData.set(updatedData);
  }

  onCellClick(cell: TableCell) {
    if (cell.status === 'unavailable') {
      this.notificationService.showError('შეცდომა', 'ეს დრო მიუწვდომელია');
      return;
    }

    if (cell.status === 'booked') {
      return; // Already booked by current user (handled by updateTableWithAppointments)
    }

    const patient = this.patient();
    if (!patient) {
      this.unauthorizedMessageShown.set(true);
      this.notificationService.showWarning('ავტორიზაცია', 'ვიზიტის დასაჯავშნად საჭიროა ავტორიზაცია');
      return;
    }

    this.selectedCard = cell;
    this.isModalOpen.set(true);
  }

  confirmBooking() {
    const doc = this.doctor();
    const pat = this.patient();
    const cell = this.selectedCard;

    if (!doc || !pat || !cell) return;

    const formData = {
      DoctorName: doc.firstName,
      IdNumber: doc.idNumber,
      UniqueNumber: cell.uniqueNumber,
      PatientName: pat.firstName,
      ClientIdNumber: pat.idNumber,
      MessageToDoctor: this.messageToDoctor(),
      Status: 'available', // available means "I want to book this available slot" in backend logic
    };

    this.authService.clientBookAppointment(formData).subscribe({
      next: (res) => {
        this.notificationService.showSuccess('წარმატება', 'ვიზიტი დაჯავშნილია');
        this.isModalOpen.set(false);
        this.messageToDoctor.set('');
        this.loadAppointments(doc.idNumber);
      },
      error: (err: any) => {
        this.notificationService.showError('შეცდომა', 'დაჯავშნა ვერ მოხერხდა');
      }
    });
  }

  onDeleteClick(data: {event: MouseEvent, cell: TableCell}) {
    const { cell } = data;
    const doc = this.doctor();
    const pat = this.patient();
    if (!doc || !pat) return;

    this.authService.getClientDataByIdNumberAndTimeSlot(pat.idNumber, cell.uniqueNumber).subscribe({
      next: (response: any) => {
        const app = response.data[0];
        const formData = {
          DoctorName: doc.firstName,
          IdNumber: doc.idNumber,
          UniqueNumber: cell.uniqueNumber,
          PatientName: pat.firstName,
          ClientIdNumber: pat.idNumber,
          MessageToDoctor: app.messageToDoctor,
          Status: 'Booked', // status used by backend remove logic
        };

        this.authService.clientRemoveAppointment(formData).subscribe({
          next: () => {
            this.notificationService.showSuccess('წარმატება', 'ჯავშანი წაშლილია');
            this.loadAppointments(doc.idNumber);
          },
          error: (err: any) => console.error('Error removing appointment:', err)
        });
      }
    });
  }

  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum || 0 }, (_, index) => index);
  }
}