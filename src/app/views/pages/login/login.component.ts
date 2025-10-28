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

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login successful, role:', response.message);
        this.redirectByRole(response.message);
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Credenciales incorrectas';
      }
    });
  }

  private redirectByRole(roleName: string | undefined): void {
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
        break;
    }
  }
}