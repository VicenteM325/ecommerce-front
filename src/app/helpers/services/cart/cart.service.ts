import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cart } from '../../models/carts/cart';
import { NewCartItem } from '../../models/carts/new-cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/cart`;

  getCart(userId: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${userId}`, { withCredentials: true });
  }

  addItem(userId: string, newItem: NewCartItem): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/${userId}/add`, newItem, { withCredentials: true });
  }

  removeItem(userId: string, productId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${userId}/remove/${productId}`, { withCredentials: true });
  }

  clearCart(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/clear`, { withCredentials: true });
  }
}
