import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { AuthService } from '../../helpers/services/auth.service';
import { User } from '../../helpers/models/user';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// ✅ Importa componentes standalone, no módulos
import {
  ButtonDirective,
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  AvatarComponent,
  BadgeComponent
} from '@coreui/angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  imports: [
    CommonModule,
    NgIf,
    AsyncPipe,
    CardComponent,
    AvatarComponent,
    BadgeComponent,
    ButtonDirective
  ]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);

  user$ = this.authService.currentUser$.pipe(
    tap(u => console.log('%c[ProfileComponent] Current user:', 'color: blue; font-weight: bold;', u)),
    catchError(err => {
      console.error('%c[ProfileComponent] Error fetching user:', 'color: red; font-weight: bold;', err);
      return of(null);
    })
  );

  debugMessage: string = '';

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: user => {
        console.log('%c[ProfileComponent] Subscribed user:', 'color: green;', user);
        this.debugMessage = `User loaded: ${user?.name || 'N/A'}`;
      },
      error: err => {
        console.error('%c[ProfileComponent] Subscription error:', 'color: red;', err);
        this.debugMessage = 'Error loading user!';
      },
      complete: () => console.log('%c[ProfileComponent] User observable complete', 'color: gray;')
    });
  }
}
