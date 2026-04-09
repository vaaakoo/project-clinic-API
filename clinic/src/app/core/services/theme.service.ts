import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly isDarkMode = signal<boolean>(this.loadTheme());

  constructor() {
    // Automatically apply class to body when signal changes
    effect(() => {
      const mode = this.isDarkMode();
      if (mode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      localStorage.setItem('theme', mode ? 'dark' : 'light');
    });
  }

  toggleTheme() {
    this.isDarkMode.update(prev => !prev);
  }

  private loadTheme(): boolean {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    
    // Default to system preference if no saved setting
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
