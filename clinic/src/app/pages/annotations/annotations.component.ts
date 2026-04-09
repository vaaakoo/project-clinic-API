import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-annotations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="hero-small">
        <h1>სამედიცინო ანოტაციები</h1>
      </div>
      <div class="content">
        <div class="article-list">
          <div class="article-card" *ngFor="let article of articles">
            <div class="article-tag">{{ article.tag }}</div>
            <h3>{{ article.title }}</h3>
            <p>{{ article.excerpt }}</p>
            <div class="meta">
              <span><i class="pi pi-user"></i> {{ article.author }}</span>
              <span><i class="pi pi-clock"></i> {{ article.readTime }} წთ</span>
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
      margin-bottom: 60px;
    }
    .hero-small h1 { color: white; font-size: 36px; font-weight: 500; }
    .content { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
    .article-list { display: flex; flex-direction: column; gap: 40px; }
    .article-card { padding: 40px; background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border-color); box-shadow: var(--shadow); }
    .article-tag { display: inline-block; padding: 4px 12px; border-radius: 8px; background: rgba(24, 164, 225, 0.1); color: var(--text-accent); font-size: 12px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; }
    .article-card h3 { color: var(--text-main); font-size: 24px; margin-bottom: 15px; }
    .article-card p { color: var(--text-muted); line-height: 1.6; margin-bottom: 25px; }
    .meta { display: flex; gap: 20px; font-size: 13px; color: var(--text-muted); }
    .meta i { margin-right: 5px; color: var(--text-accent); }
  `]
})
export class AnnotationsComponent {
  articles = [
    { title: 'ჯანსაღი კვების მნიშვნელობა', tag: 'ჯანმრთელობა', excerpt: 'როგორ მოქმედებს სწორი კვება ჩვენს ყოველდღიურ ენერგიასა და განწყობაზე.', author: 'ექიმი ნინო ბერიძე', readTime: 5 },
    { title: 'როგორ დავიცვათ თავი სეზონური ვირუსებისგან', tag: 'პრევენცია', excerpt: 'მარტივი რჩევები იმუნიტეტის გასაძლიერებლად და ინფექციების თავიდან ასაცილებლად.', author: 'ექიმი დავით გეგიძე', readTime: 8 }
  ];
}
