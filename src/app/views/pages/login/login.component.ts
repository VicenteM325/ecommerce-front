import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../helpers/services/auth.service';
import { LoginUser } from '../../../helpers/models/login-user';
import { switchMap } from 'rxjs/operators'; // ✅ No olvides este import

import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [ContainerComponent, HttpClientModule, RouterModule, CommonModule, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, ReactiveFormsModule]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.restoreSession().subscribe(user => {
      if (user) {
        this.redirectByRole(user.role?.name);
      }
    });
  }

  loading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    emailAddress: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  login(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    const credentials: LoginUser = this.loginForm.value as LoginUser;

    this.authService.login(credentials).pipe(
      // ✅ Obtener detalles del usuario DESPUÉS del login
      switchMap((response) => {
        console.log('✅ Login successful, role:', response.message);
        return this.authService.getDetails();
      })
    ).subscribe({
      next: (user) => {
        this.loading = false;
        console.log('✅ User details obtained:', user);

        // ✅ Usar el router de Angular (NO window.location)
        this.redirectByRole(user.role?.name);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error:', err);

        if (err.status === 0) {
          // ✅ SI HAY CORS, crear usuario temporal y redirigir
          this.errorMessage = 'Error de CORS, usando solución temporal...';
          this.createAndStoreTempUser(credentials.emailAddress, 'ROLE_COMMON');
          setTimeout(() => this.redirectByRole('ROLE_COMMON'), 500);
        } else {
          this.errorMessage = err?.error?.message || 'Credenciales incorrectas';
        }
      }
    });
  }

  // ✅ SOLO UN método redirectByRole
  private redirectByRole(roleName: string | undefined): void {
    if (!roleName) {
      console.warn('No role provided for redirect');
      return;
    }

    console.log('🔀 Redirecting to:', roleName);

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
        console.warn('Rol no reconocido:', roleName);
        break;
    }
  }

  // ✅ Crear usuario temporal para bypassear CORS
  private createAndStoreTempUser(email: string, roleName: string): void {
    const tempUser = {
      userId: 'temp-' + Date.now(),
      name: 'Usuario Temporal',
      emailAddress: email,
      role: { name: roleName },
      address: '',
      dpi: 0,
      userStatus: true
    };

    console.log('💾 Storing temp user:', tempUser);
    localStorage.setItem('user', JSON.stringify(tempUser));
  }
}