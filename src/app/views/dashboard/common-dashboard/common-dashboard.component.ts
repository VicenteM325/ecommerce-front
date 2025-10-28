import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, AsyncPipe } from '@angular/common';
import { ProductService } from '../../../helpers/services/product.service';
import { Product } from '../../../helpers/models/product';
import { catchError, of } from 'rxjs';
import { CardModule, ButtonDirective, BadgeModule } from '@coreui/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-common-dashboard',
  standalone: true,
  templateUrl: './common-dashboard.component.html',
  imports: [CommonModule, NgFor, AsyncPipe, CardModule, ButtonDirective, BadgeModule, RouterModule]
})
export class CommonDashboardComponent implements OnInit {
  private productService = inject(ProductService);

  products$ = this.productService.getApproved().pipe(
    catchError(err => {
      console.error('Error fetching products:', err);
      return of([]);
    })
  );

  ngOnInit(): void {
    console.log('[UserDashboard] Loading available products...');
  }
}