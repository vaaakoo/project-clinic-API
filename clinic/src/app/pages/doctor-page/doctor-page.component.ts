import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { doctorregisteration, Useregisteration } from '../../core/auth/useregisteration';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { MessageService } from 'primeng/api';
import { TableDataService, TableCell } from '../../core/auth/table-data-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AppCustomTableComponent } from '../../helpers/custom-table/custom-table.component';
import { PasswordChangeModalComponent } from '../../helpers/password-change-modal/password-change-modal.component';
import { CategoryFieldComponent } from '../../helpers/category-field/category-field.component';

@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    AppCustomTableComponent, 
    PasswordChangeModalComponent,
    CategoryFieldComponent
  ],
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.css'],
})
export class DoctorPageComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthserviceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  public readonly tableDataService = inject(TableDataService);
  
  private destroy$ = new Subject<void>();

  // State Signals
  readonly doctor = signal<doctorregisteration | null>(null);
  readonly appointmentCount = signal(0);
  readonly tooltipBox = signal(false);
  
  // Tooltip/Selected Patient Data
  readonly selectedPatient = signal<{
    name: string;
    lastName: string;
    idNumber: string;
    message: string;
  } | null>(null);

  // Password Change State
  oldPassword = '';
  newPassword = '';
  submissionSuccess = false;

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
        this.loadAppointments(doctor.idNumber);
      },
      error: (err: any) => console.error('Error fetching doctor data:', err)
    });
  }

  private loadAppointments(doctorIdNumber: string) {
    this.tableDataService.resetTable();
    this.authService.getAppointmentData(doctorIdNumber).subscribe({
      next: (data: any) => {
        this.appointmentCount.set(data.count || 0);
        this.updateTableWithAppointments(data.data, doctorIdNumber);
      },
      error: (err: any) => console.error('Error fetching appointment data:', err)
    });
  }

  private updateTableWithAppointments(appointments: any[], doctorIdNumber: string) {
    const currentData = this.tableDataService.tableData();
    const updatedData = currentData.map(row => ({
      cols: row.cols.map(cell => {
        const appointment = appointments.find(a => a.uniqueNumber === cell.uniqueNumber);
        if (appointment) {
          if (appointment.status === 'Unavailable' || appointment.idNumber !== doctorIdNumber) {
            return { ...cell, status: 'unavailable' as const };
          } else {
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
      this.messageService.add({ severity: 'error', summary: 'შეცდომა', detail: 'ეს დრო მიუწვდომელია' });
      return;
    }

    const doc = this.doctor();
    if (cell.status === 'booked' && doc) {
      this.authService.getBookDataByDoctorsIdNumberAndTimeSlot(doc.idNumber, cell.uniqueNumber).subscribe({
        next: (response: any) => {
          const app = response.data[0];
          this.authService.getClientByIdNumber(app.clientIdNumber).subscribe({
            next: (client: Useregisteration) => {
              this.selectedPatient.set({
                name: app.patientName,
                lastName: client.lastName,
                idNumber: client.idNumber,
                message: app.messageToDoctor
              });
              this.tooltipBox.set(true);
            }
          });
        }
      });
    }
  }

  onDeleteClick(data: {event: MouseEvent, cell: TableCell}) {
    const { cell } = data;
    const doc = this.doctor();
    if (!doc) return;

    this.authService.getBookDataByDoctorsIdNumberAndTimeSlot(doc.idNumber, cell.uniqueNumber).subscribe({
      next: (response: any) => {
        const app = response.data[0];
        const formData = {
          DoctorName: doc.firstName,
          IdNumber: doc.idNumber,
          UniqueNumber: cell.uniqueNumber,
          PatientName: app.patientName,
          ClientIdNumber: app.clientIdNumber,
          MessageToDoctor: 'Removed by Doctor',
          Status: 'Booked',
        };

        this.authService.clientRemoveAppointment(formData).subscribe({
          next: (res: any) => {
            this.messageService.add({ severity: 'success', summary: 'წარმატება', detail: res.message });
            this.loadAppointments(doc.idNumber);
            this.tooltipBox.set(false);
          },
          error: (err: any) => console.error('Error removing appointment:', err)
        });
      }
    });
  }

  onPasswordSubmit() {
    const user = this.authService.currentUser();
    if (user && this.oldPassword && this.newPassword) {
      this.authService.changePassword(user.email, this.oldPassword, this.newPassword).subscribe({
        next: (res: any) => {
          this.messageService.add({ severity: 'success', summary: 'წარმატება', detail: res.message });
          this.submissionSuccess = true;
        },
        error: (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'შეცდომა', detail: err.error?.message });
        }
      });
    }
  }

  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum || 0 }, (_, index) => index);
  }
}
