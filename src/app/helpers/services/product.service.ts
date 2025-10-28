import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../../environments/environment';
import { NewProduct } from '../models/new-product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}api/products`;

    create(product: NewProduct): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, { withCredentials: true });
  }

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl, { withCredentials: true });
    }
    getApproved(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/approved`, { withCredentials: true });
    }

    getById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`, { withCredentials: true });
    }

    getByCategory(categoryId: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`, { withCredentials: true });
    }

}
