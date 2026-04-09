import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="hero-small">
        <h1>ჩვენი სერვისები</h1>
      </div>
      <div class="content-grid">
        <div class="service-card" *ngFor="let srv of services">
          <div class="icon-section">
            <i [class]="srv.icon"></i>
          </div>
          <div class="text-section">
            <h3>{{ srv.title }}</h3>
            <p>{{ srv.desc }}</p>
            <span class="price">დან {{ srv.price }} ₾</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding-bottom: 100px; }
    .hero-small {
      height: 250px;
      background: linear-gradient(rgba(5, 51, 84, 0.7), rgba(5, 51, 84, 0.7)), url('/assets/Rectangle30.png');
      background-size: cover;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 60px;
    }
    .hero-small h1 { color: white; font-size: 36px; font-weight: 500; }
    .content-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 30px; max-width: 1400px; margin: 0 auto; padding: 0 40px;
    }
    .service-card {
      display: flex; gap: 20px; padding: 30px;
      background: var(--bg-card); border-radius: 20px;
      border: 1px solid var(--border-color); box-shadow: var(--shadow);
      transition: transform 0.3s ease;
    }
    .service-card:hover { transform: translateY(-5px); }
    .icon-section {
      width: 70px; height: 70px; border-radius: 15px;
      background: rgba(24, 164, 225, 0.1);
      display: flex; align-items: center; justify-content: center;
      color: var(--text-accent); font-size: 30px; flex-shrink: 0;
    }
    .text-section h3 { color: var(--text-main); margin-bottom: 10px; font-size: 20px; }
    .text-section p { color: var(--text-muted); font-size: 14px; margin-bottom: 15px; }
    .price { font-weight: 700; color: var(--text-accent); font-size: 16px; }
  `]
})
export class ServicesComponent {
  services = [
    { title: 'ლაბორატორიული კვლევა', desc: 'სრული სისხლის ანალიზი და სხვა კლინიკური კვლევები.', icon: 'pi pi-compass', price: 25 },
    { title: 'ექოსკოპია', desc: 'შინაგანი ორგანოების ულტრაბგერითი დიაგნოსტიკა.', icon: 'pi pi-search-plus', price: 40 },
    { title: 'კარდიოგრამა', desc: 'გულის მუშაობის გრაფიკული ჩაწერა და ინტერპრეტაცია.', icon: 'pi pi-chart-line', price: 20 },
    { title: 'ვიზიტი ექიმთან', desc: 'კვალიფიციური ექიმის კონსულტაცია ნებისმიერ დროს.', icon: 'pi pi-user', price: 50 }
  ];
}
