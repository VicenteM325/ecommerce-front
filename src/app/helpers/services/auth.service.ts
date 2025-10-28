import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginUser } from '../models/login-user';
import { HttpClient } from '@angular/common/http';
import { NewUser } from '../models/new-user';
import { Observable, BehaviorSubject, tap, map, catchError, of } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';

interface LoginResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isInitialized = false;

  currentUser$ = this.currentUserSubject.asObservable();

  // rol del login
  login(loginUser: LoginUser): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}auth/login`, loginUser, {
      withCredentials: true,
    })
  }

  register(newUser: NewUser): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/register`, newUser, {
      withCredentials: true,
    });
  }

  // Obtener detalles del usuario solo cuando sea necesario
  getDetails(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}auth/user/details`, {
      withCredentials: true,
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.setCurrentUser(user);
        this.isInitialized = true;
      })
    );
  }

  // Redirigir basado en el rol
  private redirectByRole(roleName: string): void {
    switch (roleName) {
      case 'ROLE_ADMIN': 
        this.router.navigateByUrl('/admin/dashboard'); 
        break;
      case 'ROLE_COMMON': 
        this.router.navigateByUrl('/common/dashboard'); 
        break;
      case 'ROLE_LOGISTICS': 
        this.router.navigateByUrl('/logistics/dashboard'); 
        break;
      case 'ROLE_MODERATOR': 
        this.router.navigateByUrl('/moderator/dashboard'); 
        break;
      default: 
        this.router.navigateByUrl('/login'); 
        break;
    }
  }

  // Resto de métodos se mantienen igual...
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

  initializeAuth(): Observable<boolean> {
    if (this.isInitialized) {
      return of(!!this.currentUserSubject.value);
    }

    const storedUser = this.getStoredUser();
    
    if (!storedUser) {
      this.isInitialized = true;
      return of(false);
    }

    return this.getDetails().pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.isInitialized = true;
      }),
      map(() => true),
      catchError(error => {
        console.error('Session validation failed:', error);
        this.clearAuth();
        this.isInitialized = true;
        return of(false);
      })
    );
  }

  restoreSession(): Observable<User | null> {
    const storedUser = this.getStoredUser();
    if (!storedUser) {
      this.clearAuth();
      return of(null);
    }

    return this.getDetails().pipe(
      tap(user => this.setCurrentUser(user)),
      catchError(error => {
        console.error('No se pudo restaurar sesión:', error);
        this.clearAuth();
        return of(null);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}auth/logout`, {}, { 
      withCredentials: true 
    }).pipe(
      tap(() => {
        this.clearAuth();
      })
    );
  }

  private clearAuth(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    this.isInitialized = true;
  }

  getIsInitialized(): boolean {
    return this.isInitialized;
  }
}