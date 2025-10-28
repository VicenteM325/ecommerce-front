import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProduct } from '../models/user-product';
import { NewProduct } from '../models/new-product';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class UserProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/user-products`;

  getAll(): Observable<UserProduct[]> {
    return this.http.get<UserProduct[]>(this.apiUrl, { withCredentials: true });
  }

  // Obtener productos de un usuario específico
  getByUser(userId: string): Observable<UserProduct[]> {
    return this.http.get<UserProduct[]>(`${this.apiUrl}/user/${userId}`, { withCredentials: true });
  }

  getPending(): Observable<UserProduct[]> {
  return this.http.get<UserProduct[]>(`${this.apiUrl}/pending`, {
    withCredentials: true
  });
}

  update(id: string, product: NewProduct): Observable<UserProduct> {
    return this.http.put<UserProduct>(`${this.apiUrl}/${id}`, product, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  moderate(id: string, state: string, comment?: string): Observable<UserProduct> {
  return this.http.put<UserProduct>(`${this.apiUrl}/${id}/moderate`, null, {
    params: { state, comment: comment || '' },
    withCredentials: true
  });
}

}
