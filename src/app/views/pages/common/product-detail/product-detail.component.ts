import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../helpers/services/product.service';
import { Product } from '../../../../helpers/models/product';
import { catchError, of } from 'rxjs';
import { CardModule, ButtonDirective, BadgeModule, AvatarComponent } from '@coreui/angular';
import { CartService } from '../../../../helpers/services/cart/cart.service';
import { AuthService } from '../../../../helpers/services/auth.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    templateUrl: './product-detail.component.html',
    imports: [CommonModule, NgIf, AsyncPipe, CardModule, RouterModule, ButtonDirective, BadgeModule, AvatarComponent]
})
export class ProductDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);
    private cartService = inject(CartService);
    private authService = inject(AuthService);
    userId: string = '';


    productId!: string;
    product$ = of<Product | null>(null);
    message = '';

    ngOnInit(): void {
        this.authService.currentUser$.pipe(take(1)).subscribe(user => {
            if (user?.userId) {
                this.userId = user.userId;
            } else {
                console.warn('No hay usuario logueado todavía');
            }
        });
        this.productId = this.route.snapshot.paramMap.get('id')!;
        this.product$ = this.productService.getById(this.productId).pipe(
            catchError(err => {
                console.error('Error al obtener los detalles:', err);
                return of(null);
            })
        );
    }
    addToCart(product: Product) {
        if (!this.userId) {
            this.message = 'Debes iniciar sesión para agregar productos al carrito';
            return;
        }
        this.cartService.addItem(this.userId, { productId: product.productId, quantity: 1 })
            .subscribe({
                next: (cart) => {
                    this.message = `${product.name} fue agregado al carrito`;
                    console.log('Carrito actualizado:', cart);
                },
                error: (err) => {
                    console.error('Error al agregar al carrito:', err);
                    this.message = 'Ocurrió un error al agregar el producto';
                }
            });
    }
}
