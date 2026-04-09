import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Useregisteration, doctorregisteration } from '../../core/auth/useregisteration';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { MessageService } from 'primeng/api';
import { TableDataService, TableCell } from '../../core/auth/table-data-service.service';
import { CommonModule } from '@angular/common';
import { AppCustomTableComponent } from '../../helpers/custom-table/custom-table.component';
import { CategoryFieldComponent } from '../../helpers/category-field/category-field.component';
import { PasswordChangeModalComponent } from '../../helpers/password-change-modal/password-change-modal.component';
import { NotificationService } from '../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-client-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppCustomTableComponent,
    CategoryFieldComponent,
    PasswordChangeModalComponent
  ],
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.css']
})
export class ClientPageComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthserviceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  public readonly tableDataService = inject(TableDataService);

  private destroy$ = new Subject<void>();

  // State Signals
  readonly client = signal<Useregisteration | null>(null);
  readonly appointmentCount = signal(0);
  readonly tooltipBox = signal(false);

  // Selected Doctor for Tooltip
  readonly selectedDoctor = signal<{
    name: string;
    lastName: string;
    category: string;
    imageUrl: string;
    id: number;
    message: string;
  } | null>(null);

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const clientId = +params['id'];
      this.loadClientData(clientId);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadClientData(id: number) {
    this.authService.getUserById(id).subscribe({
      next: (client: any) => {
        this.client.set(client);
        this.loadAppointments(client.idNumber);
      },
      error: (err: any) => console.error('Error fetching client data:', err)
    });
  }

  private loadAppointments(patientIdNumber: string) {
    this.tableDataService.resetTable();
    this.authService.getClientDataByIdNumber(patientIdNumber).subscribe({
      next: (data: any) => {
        this.appointmentCount.set(data.count || 0);
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
          if (appointment.status === 'Unavailable' || appointment.clientIdNumber !== patientIdNumber) {
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
      this.notificationService.showError('შეცდომა', 'ეს დრო მიუწვდომელია');
      return;
    }

    const patient = this.client();
    if (cell.status === 'booked' && patient) {
      this.authService.getClientDataByIdNumberAndTimeSlot(patient.idNumber, cell.uniqueNumber).subscribe({
        next: (response: any) => {
          const app = response.data[0];
          this.authService.getDoctorByIdNumber(app.idNumber).subscribe({
            next: (doctor: doctorregisteration) => {
              this.selectedDoctor.set({
                name: app.doctorName,
                lastName: doctor.lastName,
                category: doctor.category,
                imageUrl: doctor.imageUrl,
                id: doctor.id,
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
    const patient = this.client();
    if (!patient) return;

    this.authService.getClientDataByIdNumberAndTimeSlot(patient.idNumber, cell.uniqueNumber).subscribe({
      next: (response: any) => {
        const app = response.data[0];
        const formData = {
          DoctorName: app.doctorName,
          IdNumber: app.idNumber,
          UniqueNumber: cell.uniqueNumber,
          PatientName: patient.firstName,
          ClientIdNumber: patient.idNumber,
          MessageToDoctor: 'Removed by Client',
          Status: 'Booked',
        };

        this.authService.clientRemoveAppointment(formData).subscribe({
          next: () => {
            this.notificationService.showSuccess('წარმატება', 'ჯავშანი წაიშალა');
            this.loadAppointments(patient.idNumber);
            this.tooltipBox.set(false);
          },
          error: (err: any) => console.error('Error removing appointment:', err)
        });
      }
    });
  }

  onBookingClick(docId: number): void {
    this.router.navigate(['/booking', docId]);
  }
}
