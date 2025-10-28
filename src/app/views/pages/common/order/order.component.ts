import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { OrderService } from '../../../../helpers/services/order/order.service';
import { OrderResponse } from '../../../../helpers/models/orders/order-response';
import { AuthService } from '../../../../helpers/services/auth.service';
import { catchError, of, tap } from 'rxjs';
import { CardModule } from '@coreui/angular';

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  imports: [CommonModule, NgFor, NgIf, CardModule]
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  userId: string = '';
  orders$ = of<OrderResponse[] | null>(null);

  ngOnInit(): void {
    console.log('OrdersComponent iniciado');
    this.authService.currentUser$.pipe(
      tap(user => console.log('Usuario actual desde AuthService:', user)),
      catchError(err => {
        console.error('Error al obtener usuario:', err);
        return of(null);
      })
    ).subscribe(user => {
      if (user?.userId) {
        this.userId = user.userId;
        console.log('UserId detectado:', this.userId);
        this.loadOrders();
      } else {
        console.warn('No hay usuario logueado todavía');
      }
    });
  }

  loadOrders() {
    console.log('Cargando órdenes para userId:', this.userId);
    this.orders$ = this.orderService.getOrdersByUser(this.userId).pipe(
      tap(orders => console.log('Órdenes recibidas:', orders)),
      catchError(err => {
        console.error('Error cargando órdenes:', err);
        return of(null);
      })
    );
  }
}
