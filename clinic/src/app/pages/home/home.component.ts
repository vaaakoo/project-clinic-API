import { Component } from '@angular/core';
import { CategoryFieldComponent } from '../../helpers/category-field/category-field.component';
import { CardComponent } from '../../helpers/card/card.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CategoryFieldComponent,
    CardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
