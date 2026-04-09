import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clinics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="hero-small">
        <h1>ჩვენი კლინიკები</h1>
      </div>
      <div class="content-grid">
        <div class="clinic-card" *ngFor="let clinic of clinics">
          <div class="clinic-img">
            <img [src]="clinic.image" alt="clinic">
          </div>
          <div class="clinic-info">
            <h3>{{ clinic.name }}</h3>
            <p><i class="pi pi-map-marker"></i> {{ clinic.address }}</p>
            <p><i class="pi pi-phone"></i> {{ clinic.phone }}</p>
            <button class="view-btn">დეტალურად</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding-bottom: 100px;
    }
    .hero-small {
      height: 250px;
      background: linear-gradient(rgba(5, 51, 84, 0.7), rgba(5, 51, 84, 0.7)), url('/assets/Rectangle30.png');
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 60px;
    }
    .hero-small h1 {
      color: white;
      font-size: 36px;
      font-weight: 500;
    }
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 40px;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .clinic-card {
      background: var(--bg-card);
      border-radius: 15px;
      overflow: hidden;
      box-shadow: var(--shadow);
      border: 1px solid var(--border-color);
    }
    .clinic-img img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .clinic-info {
      padding: 25px;
    }
    .clinic-info h3 {
      color: var(--text-accent);
      margin-bottom: 15px;
    }
    .clinic-info p {
      margin-bottom: 10px;
      color: var(--text-main);
      opacity: 0.8;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .view-btn {
      margin-top: 15px;
      width: 100%;
      height: 45px;
      border-radius: 50px;
      background: #053354;
      color: white;
      border: none;
      cursor: pointer;
    }
  `]
})
export class ClinicsComponent {
  clinics = [
    { name: 'Vaks Precision - ცენტრალური', address: 'იაკობ ნიკოლაძე №10', phone: '032 2 100 100', image: '/assets/Rectangle30.png' },
    { name: 'Vaks Precision - საბურთალო', address: 'ვაჟა-ფშაველას გამზირი №5', phone: '032 2 100 101', image: '/assets/Rectangle30.png' },
    { name: 'Vaks Precision - ვაკე', address: 'ჭავჭავაძის გამზირი №12', phone: '032 2 100 102', image: '/assets/Rectangle30.png' }
  ];
}
