import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginUser } from '../models/login-user';
import { HttpClient } from '@angular/common/http';
import { NewUser } from '../models/new-user';
import { Observable, BehaviorSubject, tap, map, catchError, of } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private router = inject(Router);

  // Iniciar la sesion
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isInitialized = false;

  currentUser$ = this.currentUserSubject.asObservable();

  // Método para inicializar la autenticación de forma controlada
  initializeAuth(): Observable<boolean> {
    if (this.isInitialized) {
      return of(!!this.currentUserSubject.value);
    }

    const storedUser = this.getStoredUser();
    
    if (!storedUser) {
      this.isInitialized = true;
      return of(false);
    }

    // Si hay usuario en localStorage, validar con el backend
    return this.getDetails().pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.isInitialized = true;
      }),
      map(() => true),
      catchError(error => {
        console.error('Session validation failed:', error);
        // Si hay error (como CORS), limpiar la sesión inválida
        this.clearAuth();
        this.isInitialized = true;
        return of(false);
      })
    );
  }

  login(loginUser: LoginUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}auth/login`, loginUser, {
      withCredentials: true,
    }).pipe(
      tap(user => {
        this.setCurrentUser(user);
        this.isInitialized = true;
      })
    );
  }

  register(newUser: NewUser) {
    return this.http.post(`${this.apiUrl}auth/register`, newUser, {
      withCredentials: true,
    });
  }

  getDetails(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}auth/user/details`, {
      withCredentials: true,
    }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Método mejorado para restaurar sesión
  restoreSession(): Observable<User | null> {
    return this.getDetails().pipe(
      tap(user => this.setCurrentUser(user)),
      catchError(error => {
        this.clearAuth();
        return of(null);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.clearAuth();
        })
      );
  }

  // Limpiar autenticación
  private clearAuth(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    this.isInitialized = true;
  }

  // Verificar si ya está inicializado
  getIsInitialized(): boolean {
    return this.isInitialized;
  }
}