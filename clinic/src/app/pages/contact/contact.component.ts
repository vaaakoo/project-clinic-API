import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="hero-small">
        <h1>კონტაქტი</h1>
      </div>
      <div class="contact-content">
        <div class="contact-info">
          <h2>დაგვიკავშირდით</h2>
          <div class="info-box">
            <div class="info-item">
              <div class="icon-wrap"><i class="pi pi-phone"></i></div>
              <div class="text-wrap">
                <label>ტელეფონი</label>
                <p>032 2 100 100</p>
              </div>
            </div>
            <div class="info-item">
              <div class="icon-wrap"><i class="pi pi-envelope"></i></div>
              <div class="text-wrap">
                <label>ელ-ფოსტა</label>
                <p>info&#64;vaks-clinic.ge</p>
              </div>
            </div>
            <div class="info-item">
              <div class="icon-wrap"><i class="pi pi-map-marker"></i></div>
              <div class="text-wrap">
                <label>მისამართი</label>
                <p>იაკობ ნიკოლაძე №10, თბილისი</p>
              </div>
            </div>
          </div>
        </div>
        <div class="contact-form">
          <form #contactForm="ngForm">
            <div class="form-group">
              <input type="text" placeholder="სახელი" name="name" ngModel required>
            </div>
            <div class="form-group">
              <input type="email" placeholder="ელ-ფოსტა" name="email" ngModel required>
            </div>
            <div class="form-group">
              <textarea placeholder="შეტყობინება" name="message" ngModel required rows="5"></textarea>
            </div>
            <button class="submit-btn" type="submit">გაგზავნა</button>
          </form>
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
      margin-bottom: 80px;
    }
    .hero-small h1 { color: white; font-size: 36px; font-weight: 500; }
    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
    }
    .contact-info h2 { color: var(--text-accent); margin-bottom: 30px; font-size: 28px; }
    .info-box { display: flex; flex-direction: column; gap: 30px; }
    .info-item { display: flex; align-items: center; gap: 20px; }
    .icon-wrap {
      width: 60px; height: 60px;
      background: var(--bg-card);
      border-radius: 15px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-accent);
      font-size: 24px;
      box-shadow: var(--shadow);
    }
    .text-wrap label { display: block; font-size: 14px; opacity: 0.6; margin-bottom: 4px; color: var(--text-main); }
    .text-wrap p { font-size: 18px; font-weight: 600; color: var(--text-main); }
    .contact-form form { display: flex; flex-direction: column; gap: 20px; }
    .form-group input, .form-group textarea {
      width: 100%; padding: 15px 20px;
      border-radius: 25px;
      border: 1px solid var(--border-color);
      background: var(--input-bg);
      color: var(--text-main);
    }
    .form-group textarea { border-radius: 15px; }
    .submit-btn {
      height: 55px; border-radius: 50px;
      background: #053354; color: white;
      border: none; cursor: pointer; font-size: 18px; font-weight: 500;
    }
    @media (max-width: 992px) {
      .contact-content { grid-template-columns: 1fr; gap: 60px; }
    }
  `]
})
export class ContactComponent { }
