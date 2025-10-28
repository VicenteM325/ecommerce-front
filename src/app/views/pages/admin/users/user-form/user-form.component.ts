import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../../../../helpers/services/admin-user.service';
import { User } from '../../../../../helpers/models/user';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './user-form.component.html'
})
export class UserFormComponent {
    @Input() user?: User;
    @Output() formSubmit = new EventEmitter<void>();
    @Output() formSaved = new EventEmitter<void>();
    @Output() formCancelled = new EventEmitter<void>();

    formData = {
        name: '',
        emailAddress: '',
        password: '',
        address: '',
        dpi: 0,
        userStatus: 'ACTIVO',
        role: 'ROLE_MODERATOR'
    };

    loading = false;
    errorMessage = '';
    successMessage = '';

    constructor(private userService: AdminUserService) { }

    ngOnInit() {
        if (this.user) {
            this.formData.name = this.user.name;
            this.formData.emailAddress = this.user.emailAddress;
            this.formData.address = this.user.address || '';
            this.formData.dpi = this.user.dpi || 0;
            this.formData.userStatus = this.user.userStatus || 'ACTIVO';
            this.formData.role = this.user.role?.name || 'ROLE_MODERATOR';
        }
    }

    onSubmit() {
        this.loading = true;
        this.errorMessage = '';

        const request$ = this.user
            ? this.userService.updateUser(this.user.userId!, this.formData)
            : this.userService.createUser(this.formData);

        request$.subscribe({
            next: (res) => {
                this.loading = false;
                this.formSubmit.emit();
                if (res && res.message) {
                    this.successMessage = res.message;
                } else {
                    this.successMessage = this.user
                        ? 'Usuario actualizado correctamente'
                        : 'Usuario creado correctamente';
                }
            },
            error: (err) => {
                this.loading = false;
                if (err.error && err.error.message) {
                    this.errorMessage = err.error.message;
                } else if (err.message) {
                    this.errorMessage = 'Error de conexión con el servidor.';
                } else {
                    this.errorMessage = 'Ocurrió un error inesperado.';
                }
            }
        });
    }

    cancel() {
        this.formCancelled.emit();
    }
}
