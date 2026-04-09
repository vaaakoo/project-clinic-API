import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="hero-small">
        <h1>სპეციალური აქციები</h1>
      </div>
      <div class="offers-list">
        <div class="offer-card" *ngFor="let offer of offers">
          <div class="percentage">{{ offer.discount }}%</div>
          <div class="details">
            <h3>{{ offer.title }}</h3>
            <p>{{ offer.desc }}</p>
            <span class="expiry"><i class="pi pi-calendar"></i> ძალაშია {{ offer.expiry }}-მდე</span>
          </div>
          <button class="claim-btn">გააქტიურება</button>
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
    .offers-list {
      display: flex; flex-direction: column; gap: 30px;
      max-width: 1000px; margin: 0 auto; padding: 0 20px;
    }
    .offer-card {
      display: flex; align-items: center; gap: 30px; padding: 30px;
      background: var(--bg-card); border-radius: 20px;
      border: 1px solid var(--border-color); box-shadow: var(--shadow);
    }
    .percentage {
      font-size: 40px; font-weight: 800; color: var(--text-accent);
      min-width: 120px; height: 120px; border-radius: 50%;
      background: rgba(24, 164, 225, 0.1);
      display: flex; align-items: center; justify-content: center;
    }
    .details { flex: 1; }
    .details h3 { color: var(--text-main); margin-bottom: 8px; font-size: 22px; }
    .details p { color: var(--text-muted); margin-bottom: 15px; }
    .expiry { font-size: 13px; color: var(--text-accent); font-weight: 600; }
    .claim-btn {
      padding: 12px 30px; border-radius: 50px;
      background: #053354; color: white; border: none; cursor: pointer;
    }
    @media (max-width: 768px) {
      .offer-card { flex-direction: column; text-align: center; }
    }
  `]
})
export class OffersComponent {
  offers = [
    { title: 'გაზაფხულის სრული შემოწმება', desc: 'ისარგებლეთ 30%-იანი ფასდაკლებით სრულ კლინიკურ კვლევაზე.', discount: 30, expiry: '30 აპრილი' },
    { title: 'კბილების გათეთრება', desc: 'პროფესიონალური წმენდა და გათეთრება სპეციალურ ფასად.', discount: 20, expiry: '15 მაისი' },
    { title: 'უფასო კონსულტაცია', desc: 'პირველი ვიზიტი თერაპევტთან სრულიად უფასოდ.', discount: 100, expiry: '20 აპრილი' }
  ];
}
