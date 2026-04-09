import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="hero-small">
        <h1>მედიკამენტები</h1>
      </div>
      <div class="filter-section">
        <button class="filter-pill active">ყველა</button>
        <button class="filter-pill">ანტიბიოტიკები</button>
        <button class="filter-pill">ვიტამინები</button>
        <button class="filter-pill">ტკივილგამაყუჩებლები</button>
      </div>
      <div class="content-grid">
        <div class="med-card" *ngFor="let med of medications">
          <div class="status-badge" [class.available]="med.available">{{ med.available ? 'მარაგშია' : 'ამოწურულია' }}</div>
          <div class="med-img"><i class="pi pi-box"></i></div>
          <div class="med-info">
            <h3>{{ med.name }}</h3>
            <p class="desc">{{ med.description }}</p>
            <div class="price-row">
              <span class="price">{{ med.price }} ₾</span>
              <button class="buy-btn"><i class="pi pi-shopping-cart"></i></button>
            </div>
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
      margin-bottom: 40px;
    }
    .hero-small h1 { color: white; font-size: 36px; font-weight: 500; }
    .filter-section {
      max-width: 1400px; margin: 0 auto 40px;
      display: flex; gap: 15px; padding: 0 40px; overflow-x: auto;
    }
    .filter-pill {
      padding: 10px 25px; border-radius: 25px;
      background: var(--bg-card); border: 1px solid var(--border-color);
      color: var(--text-main); font-weight: 500; white-space: nowrap;
    }
    .filter-pill.active { background: #053354; color: white; border-color: #053354; }
    .content-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px; max-width: 1400px; margin: 0 auto; padding: 0 40px;
    }
    .med-card {
      background: var(--bg-card); border-radius: 20px;
      border: 1px solid var(--border-color); position: relative;
      padding: 25px; box-shadow: var(--shadow);
    }
    .status-badge {
      position: absolute; top: 15px; left: 15px;
      font-size: 11px; padding: 4px 10px; border-radius: 10px;
      background: #fed7d7; color: #c53030;
    }
    .status-badge.available { background: #c6f6d5; color: #22543d; }
    .med-img {
      height: 120px; display: flex; align-items: center; justify-content: center;
      font-size: 50px; color: var(--text-accent); opacity: 0.3;
    }
    .med-info h3 { color: var(--text-main); font-size: 20px; margin-bottom: 10px; }
    .med-info .desc { font-size: 14px; color: var(--text-muted); height: 40px; overflow: hidden; margin-bottom: 20px; }
    .price-row { display: flex; justify-content: space-between; align-items: center; }
    .price { font-size: 22px; font-weight: 700; color: var(--text-accent); }
    .buy-btn {
      width: 45px; height: 45px; border-radius: 50%;
      background: #053354; color: white; border: none; cursor: pointer;
    }
  `]
})
export class MedicationsComponent {
  medications = [
    { name: 'პარაცეტამოლი', description: 'ტკივილგამაყუჩებელი და სიცხის დამწევი საშუალება', price: 5.50, available: true },
    { name: 'ვიტამინი C', description: 'იმუნიტეტის გასაძლიერებელი საკვები დანამატი', price: 12.00, available: true },
    { name: 'ამბროქსოლი', description: 'ხველის საწინააღმდეგო სიროფი', price: 8.40, available: false },
    { name: 'ნიმესილი', description: 'ანთების საწინააღმდეგო ფხვნილი', price: 1.20, available: true }
  ];
}
