import { Component, inject } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgStyle, NgIf } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../helpers/services/auth.service';
import { NewUser } from '../../../helpers/models/new-user';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, NgIf,ContainerComponent, RouterModule, RowComponent, ColComponent, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, ReactiveFormsModule]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
  this.authService.restoreSession().subscribe(user => {
    if (user) {
      const roleName = user.role?.name || '';
      switch (roleName) {
        case 'ROLE_ADMIN': this.router.navigateByUrl('/admin/dashboard'); break;
        case 'ROLE_COMMON': this.router.navigateByUrl('/common/dashboard'); break;
        case 'ROLE_LOGISTICS': this.router.navigateByUrl('/logistics/dashboard'); break;
        case 'ROLE_MODERATOR': this.router.navigateByUrl('/moderator/dashboard'); break;
      }
    }
  });
}

  loading = false;
  errorMessage = '';

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    emailAddress: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    address: ['', [Validators.required]],
    dpi: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(13), Validators.maxLength(13)]],
  });

  register(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    const formValue = this.registerForm.value;
    const newUser: NewUser = {
      name: formValue.name as string,
      emailAddress: formValue.emailAddress as string,
      password: formValue.password as string,
      address: formValue.address as string,
      dpi: Number(formValue.dpi),
    };

    this.authService.register(newUser).subscribe({
      next: (res) => {
        console.log('Usuario registrado correctamente', res);
        this.loading = false;
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Error al registrar usuario';
      },
    });
  }
}
