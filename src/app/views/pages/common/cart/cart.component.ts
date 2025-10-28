import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CartService } from '../../../../helpers/services/cart/cart.service';
import { Cart } from '../../../../helpers/models/carts/cart';
import { catchError, of } from 'rxjs';
import { CardModule, ButtonDirective } from '@coreui/angular';
import { AuthService } from '../../../../helpers/services/auth.service';
import { OrderService } from '../../../../helpers/services/order/order.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    templateUrl: './cart.component.html',
    imports: [CommonModule, NgFor, NgIf, CardModule, ButtonDirective]
})
export class CartComponent implements OnInit {
    private cartService = inject(CartService);
    private authService = inject(AuthService);
    private orderService = inject(OrderService);
    userId: string = '';
    orderMessage = '';
    cart$ = of<Cart | null>(null);


    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            if (user?.userId) {
                this.userId = user.userId;
                this.loadCart();
            } else {
                console.warn('No hay usuario logueado todavía');
            }});
        }

        loadCart() {
            this.cart$ = this.cartService.getCart(this.userId).pipe(
                catchError(err => {
                    console.error('Error cargando carrito:', err);
                    return of(null);
                })
            );
        }

        clearCart() {
            this.cartService.clearCart(this.userId).subscribe(() => this.loadCart());
        }

        //ordenes
        generateOrder(address: string) {
        if (!this.userId) return;

        this.orderService.createOrder({ userId: this.userId, address }).subscribe({
            next: (order) => {
                this.orderMessage = `Orden generada con éxito. Total: Q${order.amount}`;
                console.log('Orden creada:', order);
                this.loadCart(); 
            },
            error: (err) => {
                console.error('Error al generar orden:', err);
                this.orderMessage = 'Ocurrió un error al generar la orden';
            }
        });
    }
    }
