import { Component, OnInit, inject } from '@angular/core';
import { UserProductService } from '../../../helpers/services/user-product.service';
import { UserProduct } from '../../../helpers/models/user-product';
import { catchError, of } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, ButtonModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moderator-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalModule, ButtonModule],
  templateUrl: './moderator-dashboard.component.html',
  styleUrls: ['./moderator-dashboard.component.scss']
})
export class ModeratorDashboardComponent implements OnInit {
  private userProductService = inject(UserProductService);
  private fb = inject(FormBuilder);
  serverMessage: string = '';

  pendingList: UserProduct[] = [];
  selectedItem: UserProduct | null = null;
  rejectForm!: FormGroup;

  modalsVisibility: { [key: string]: boolean } = {};

  ngOnInit() {
    this.rejectForm = this.fb.group({
      comment: ['']
    });
    this.loadPending();
  }

  loadPending() {
    this.userProductService.getPending().pipe(
      catchError(err => {
        console.error('Error al cargar pendientes', err);
        return of([]);
      })
    ).subscribe(data => this.pendingList = data);
  }

  approve(item: UserProduct) {
    this.userProductService.moderate(item.userProductId, 'ACEPTADO').subscribe({
      next: (res: any) => {
        this.serverMessage = res.message || 'Producto aprobado correctamente';
        this.loadPending();
        setTimeout(() => this.serverMessage = '', 5000);
      },
      error: (err) => {
        this.serverMessage = err.error?.message || 'Error al aprobar';
        setTimeout(() => this.serverMessage = '', 5000);
      }
    });
  }

  openRejectModal(item: UserProduct, modalId: string) {
    this.selectedItem = item;
    this.modalsVisibility[modalId] = true;
  }



  reject(modalId: string) {
    const comment = this.rejectForm.value.comment;
    if (this.selectedItem) {
      this.userProductService
        .moderate(this.selectedItem.userProductId, 'RECHAZADO', comment)
        .subscribe({
          next: (res: any) => {
            this.serverMessage = res.message || 'Producto rechazado correctamente';
            this.modalsVisibility[modalId] = false;
            this.loadPending();
            this.selectedItem = null;
            this.rejectForm.reset();
            setTimeout(() => this.serverMessage = '', 5000);
          },
          error: (err) => {
            this.serverMessage = err.error?.message || 'Error al rechazar';
            setTimeout(() => this.serverMessage = '', 5000);
          }
        });
    }
  }

  closeRejectModal(modalId: string) {
    this.modalsVisibility[modalId] = false;
  }
}
