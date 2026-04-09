import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/auth/category-list.service';
import { FilterService } from '../../core/services/filter.service';
import { AuthserviceService } from '../../core/auth/authservice.service';

@Component({
  selector: 'app-category-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-field.component.html',
  styleUrl: './category-field.component.css'
})
export class CategoryFieldComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly filterService = inject(FilterService);
  private readonly authService = inject(AuthserviceService);

  // Selected category tracked in global filter service
  readonly selectedCategory = this.filterService.selectedCategory;
  
  // Local list of categories from service
  readonly categories = signal<string[]>([]);
  
  // All doctors fetched to calculate counts
  private readonly allDoctors = signal<any[]>([]);

  // Computed map of categories to their doctor counts
  readonly categoryCounts = computed(() => {
    const counts: Record<string, number> = {};
    this.allDoctors().forEach(doc => {
      if (doc.category) {
        counts[doc.category] = (counts[doc.category] || 0) + 1;
      }
    });
    return counts;
  });

  ngOnInit() {
    this.categories.set(this.categoryService.getCategoryList());
    this.fetchDoctorCounts();
  }

  private fetchDoctorCounts() {
    this.authService.getallDoctor().subscribe({
      next: (data) => this.allDoctors.set(data),
      error: (err) => console.error('[CategoryField] Error fetching counts:', err)
    });
  }

  onCategoryClick(category: string) {
    this.filterService.setCategory(category);
  }

  getDoctorCount(category: string): number {
    return this.categoryCounts()[category] || 0;
  }
}
