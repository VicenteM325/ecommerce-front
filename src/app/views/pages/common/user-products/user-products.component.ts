import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, AsyncPipe } from '@angular/common';
import { UserProductService } from '../../../../helpers/services/user-product.service';
import { ProductService } from '../../../../helpers/services/product.service';
import { catchError, of } from 'rxjs';
import { CardModule, ButtonDirective, BadgeModule } from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../helpers/services/category.service';
import { StateService } from '../../../../helpers/services/state.service';
import { NewProduct } from '../../../../helpers/models/new-product';

@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-products.component.html',
})
export class ProductCreateComponent implements OnInit {
  newProduct: NewProduct = {
    name: '',
    description: '',
    picture: '',
    price: 0,
    stock: 0,
    categoryId: null,
    stateId: null
  };
  serverMessage: string = '';
  categories: { id: number; name: string }[] = [];
  states: { id: number; name: string }[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private stateService: StateService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadStates();
  }

  loadCategories() {
  this.categoryService.getAll().subscribe(res => {
    this.categories = res.map(c => ({ id: c.categoryId, name: c.name }));
  });
}

  loadStates() {
  this.stateService.getAll().subscribe(res => {
    this.states = res.map(s => ({ id: s.stateId, name: s.name }));
  });
}

  submit() {
  this.productService.create(this.newProduct).subscribe({
    next: (res: any) => {
      this.serverMessage = res.message || 'Producto creado correctamente';
      
      setTimeout(() => {
        this.serverMessage = '';
        this.newProduct = {
          name: '',
          description: '',
          picture: '',
          price: 0,
          stock: 0,
          categoryId: null,
          stateId: null
        };
      }, 5000);
    },
    error: (err) => {
      this.serverMessage = err.error?.message || 'Error al crear el producto';
      setTimeout(() => (this.serverMessage = ''), 5000);
    },
  });
}

}
