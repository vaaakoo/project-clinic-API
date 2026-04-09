import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { doctorregisteration } from '../../core/auth/useregisteration';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { MessageService } from 'primeng/api';
import { TableDataService } from '../../core/auth/table-data-service.service';
import { CommonModule } from '@angular/common';
import { AppCustomTableComponent } from '../../helpers/custom-table/custom-table.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppCustomTableComponent
  ],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthserviceService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  public readonly tableDataService = inject(TableDataService);

  private destroy$ = new Subject<void>();

  // State Signals
  readonly activeTab = signal('doctors');
  readonly activeRole = signal('doctor');
  readonly currentDoctor = signal<doctorregisteration | null>(null);
  readonly appointmentCount = signal(0);

  ngOnInit() {
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInitialData() {
    this.authService.getallDoctor().pipe(takeUntil(this.destroy$)).subscribe({
      next: (doctors) => {
        if (doctors && doctors.length > 0) {
          const randomIndex = Math.floor(Math.random() * doctors.length);
          const doc = doctors[randomIndex];
          this.currentDoctor.set(doc);
          this.loadAppointments(doc.idNumber);
        }
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'შეცდომა', detail: 'ექიმების ჩატვირთვა ვერ მოხერხდა' });
      }
    });
  }

  private loadAppointments(doctorIdNumber: string) {
    this.tableDataService.resetTable();
    this.authService.getAppointmentData(doctorIdNumber).subscribe({
      next: (data: any) => {
        this.appointmentCount.set(data.count || 0);
        this.updateTableWithAppointments(data.data, doctorIdNumber);
      },
      error: (err: any) => console.error('Error fetching client data:', err)
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

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
    switch (tab) {
      case 'registration':
        this.router.navigate(['/admin-page/registration']);
        break;
      case 'categories':
        this.router.navigate(['/admin-page/category']);
        break;
      case 'doctors':
        // No reload, just reload data
        this.loadInitialData();
        break;
    }
  }

  setActiveRole(role: string) {
    this.activeRole.set(role);
  }

  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum || 0 }, (_, index) => index);
  }
}
