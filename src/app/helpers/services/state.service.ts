import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../models/state';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/product-states`;

  getAll(): Observable<State[]> {
    return this.http.get<State[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<State> {
    return this.http.get<State>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(state: { name: string }): Observable<State> {
    return this.http.post<State>(this.apiUrl, state, { withCredentials: true });
  }

  update(id: number, state: { name: string }): Observable<State> {
    return this.http.put<State>(`${this.apiUrl}/${id}`, state, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
