import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { doctorregisteration } from '../../core/auth/useregisteration';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class CardComponent implements OnInit {
  private readonly authservice = inject(AuthserviceService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Signals for senior-level state management
  readonly alldoctors = signal<doctorregisteration[]>([]);
  readonly maxVisibleDoctors = signal(6);

  // Computed signal for the slice of doctors being shown
  readonly visibleDoctors = computed(() => 
    this.alldoctors().slice(0, this.maxVisibleDoctors())
  );

  ngOnInit() {
    this.fetchDoctors();
  
    this.route.params.subscribe(params => {
      const doctorId = params['id'];
    });
  }

  private fetchDoctors() {
    console.log('[CardComponent] Initiating doctors fetch...');
    this.authservice.getallDoctor().subscribe({
      next: (data) => {
        console.log(`[CardComponent] Received ${data?.length} doctors`);
        this.alldoctors.set(data);
      },
      error: (err) => {
        console.error('[CardComponent] Error during doctors fetch:', err);
      }
    });
  }

  onBookingClick(doctor: doctorregisteration) {
    this.router.navigate(['/booking', doctor.id]);
  }

  toggleSeeMore() {
    this.maxVisibleDoctors.update(n => n + 3);
  }

  getStarArray(starNum: number): number[] {
    return Array.from({ length: starNum }, (_, index) => index);
  }
}
