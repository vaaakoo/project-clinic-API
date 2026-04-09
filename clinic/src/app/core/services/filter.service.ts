import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  // Signals for global filtering state
  readonly selectedCategory = signal<string | null>(null);
  readonly searchTerm = signal<string>('');

  setCategory(category: string | null) {
    // If the same category is clicked again, we toggle it off (deselect)
    this.selectedCategory.update(current => current === category ? null : category);
  }

  setSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  clearFilters() {
    this.selectedCategory.set(null);
    this.searchTerm.set('');
  }
}
