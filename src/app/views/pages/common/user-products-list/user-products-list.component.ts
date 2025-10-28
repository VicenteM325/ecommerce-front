import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProductService } from '../../../../helpers/services/user-product.service';
import { AuthService } from '../../../../helpers/services/auth.service';
import { UserProduct } from '../../../../helpers/models/user-product';

@Component({
  selector: 'app-user-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-products-list.component.html',
})
export class UserProductsListComponent implements OnInit {
  userProducts: UserProduct[] = [];
  userId: string = '';

  // Inyecciones
  private userProductService = inject(UserProductService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user?.userId) {
        this.userId = user.userId;
        this.loadUserProducts();
      } else {
        console.warn('No hay usuario logueado todavía');
        this.userProducts = [];
      }
    });
  }

  loadUserProducts() {
    if (!this.userId) return;
    this.userProductService.getByUser(this.userId).subscribe({
      next: (res) => (this.userProducts = res),
      error: (err) => console.error('Error al cargar productos del usuario', err)
    });
  }
}