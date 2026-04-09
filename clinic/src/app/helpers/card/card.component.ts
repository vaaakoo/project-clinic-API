import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { AuthserviceService } from '../../core/auth/authservice.service';
import { doctorregisteration } from '../../core/auth/useregisteration';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FilterService } from '../../core/services/filter.service';

import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, SkeletonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0, transform: 'translateY(10px)' }), animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))]),
    ]),
  ],
})
export class CardComponent implements OnInit {
  private readonly authservice = inject(AuthserviceService);
  public readonly filterService = inject(FilterService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Raw data from API
  // UI State
  readonly isLoading = signal(true);
  readonly alldoctors = signal<doctorregisteration[]>([]);
  readonly maxVisibleDoctors = signal(6);
  readonly skeletonItems = Array(6).fill(0);

  // Filter signals from global service
  private readonly selectedCategory = this.filterService.selectedCategory;
  private readonly searchTerm = this.filterService.searchTerm;

  // Computed signal for filtered results
  readonly filteredDoctors = computed(() => {
    let doctors = this.alldoctors();
    const category = this.selectedCategory();
    const term = this.searchTerm().toLowerCase();

    if (category) {
      doctors = doctors.filter(d => d.category === category);
    }

    if (term) {
      doctors = doctors.filter(d => 
        d.firstName.toLowerCase().includes(term) || 
        d.lastName.toLowerCase().includes(term) ||
        d.category?.toLowerCase().includes(term)
      );
    }

    return doctors;
  });

  // Final slice for pagination/see more
  readonly visibleDoctors = computed(() => 
    this.filteredDoctors().slice(0, this.maxVisibleDoctors())
  );

  ngOnInit() {
    this.fetchDoctors();
  }

  private fetchDoctors() {
    this.isLoading.set(true);
    this.authservice.getallDoctor().subscribe({
      next: (data) => {
        this.alldoctors.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[CardComponent] Error:', err);
        this.isLoading.set(false);
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
    return Array.from({ length: starNum || 0 }, (_, index) => index);
  }
}
