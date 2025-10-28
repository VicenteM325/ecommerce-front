import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUserService } from '../../../../../helpers/services/admin-user.service';
import { User } from '../../../../../helpers/models/user';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../helpers/services/auth.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  private userService = inject(AdminUserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  users: User[] = [];
  loading = true;
  error: string | null = null;

  showForm = false;
  selectedUser?: User;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.filter(user => {
          const roleName = user.role?.name;
          return roleName === 'ROLE_ADMIN' || roleName === 'ROLE_LOGISTICS' || roleName === 'ROLE_MODERATOR';
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  deleteUser(userId: string) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => this.loadUsers(),
        error: (err) => alert('No se pudo eliminar el usuario: ' + err.message)
      });
    }
  }

  newUser() {
    this.selectedUser = undefined;;
    this.showForm = true;
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.selectedUser = undefined;
  }

  reloadAfterSave() {
    this.closeForm();
    this.loadUsers();
  }
}
