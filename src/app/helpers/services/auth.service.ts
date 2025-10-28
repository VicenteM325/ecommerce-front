import { Injectable, inject, APP_INITIALIZER } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginUser } from '../models/login-user';
import { HttpClient } from '@angular/common/http';
import { NewUser } from '../models/new-user';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  private router = inject(Router);



  currentUser$ = this.currentUserSubject.asObservable();

  login(loginUser: LoginUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}auth/login`, loginUser, {
      withCredentials: true,
    }).pipe(
      tap(user => {
        this.setCurrentUser(user);
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
      tap(user => this.currentUserSubject.next(user)));
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

  restoreSession(): Observable<User | null> {
  return this.getDetails().pipe(
    catchError(() => of(null))
  );
}


  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
          localStorage.removeItem('user');
        })
      );
  }
}