import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './views/dashboard/admin-dashboard/admin-dashboard.component';
import { CommonDashboardComponent } from './views/dashboard/common-dashboard/common-dashboard.component';
import { LogisticsDashboardComponent } from './views/dashboard/logistics-dashboard/logistics-dashboard.component';
import { ModeratorDashboardComponent } from './views/dashboard/moderator-dashboard/moderator-dashboard.component';
import { UsersListComponent } from './views/pages/admin/users/users-list/users-list.component';
import { LoginComponent } from './views/pages/login/login.component';
import { roleGuard } from './helpers/guards/role.guard';
import { ProductDetailComponent } from './views/pages/common/product-detail/product-detail.component';

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/pages/register/register.component').then(m => m.RegisterComponent)
  },

  // Dashboards protegidos bajo layout principal
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    children: [
      { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [roleGuard], data: { expectedRole: 'ROLE_ADMIN' } },
      { path: 'admin/users', component: UsersListComponent, canActivate: [roleGuard], data: { expectedRole: 'ROLE_ADMIN' } },
      { path: 'profile', loadComponent: () => import('./views/profile/profile.component').then(m => m.ProfileComponent), canActivate: [roleGuard], data: { expectedRole: ['ROLE_ADMIN', 'ROLE_COMMON', 'ROLE_LOGISTICS', 'ROLE_MODERATOR'] } },
      { path: 'common/dashboard', component: CommonDashboardComponent, canActivate: [roleGuard], data: { expectedRole: 'ROLE_COMMON' } },
      { path: 'product/:id', component: ProductDetailComponent },
      { path: 'logistics/dashboard', component: LogisticsDashboardComponent, canActivate: [roleGuard], data: { expectedRole: 'ROLE_LOGISTICS' } },
      { path: 'moderator/dashboard', component: ModeratorDashboardComponent, canActivate: [roleGuard], data: { expectedRole: 'ROLE_MODERATOR' } },

      {
        path: 'products/create',
        loadComponent: () =>
          import('./views/pages/common/user-products/user-products.component').then(m => m.ProductCreateComponent),
        canActivate: [roleGuard],
        data: { expectedRole: ['ROLE_COMMON'] }
      },

      {
        path: 'products/view',
        loadComponent: () =>
          import('./views/pages/common/user-products-list/user-products-list.component').then(m => m.UserProductsListComponent),
        canActivate: [roleGuard],
        data: { expectedRole: ['ROLE_COMMON'] }
      },
      {
        path: 'cart',
        loadComponent: () => import('./views/pages/common/cart/cart.component').then(m => m.CartComponent), canActivate:[roleGuard], data: { expectedRole: ['ROLE_COMMON'] }
      },
      {
        path: 'order',
        loadComponent: () => import('./views/pages/common/order/order.component').then(m => m.OrdersComponent), canActivate:[roleGuard], data: { expectedRole: ['ROLE_COMMON'] }
      },
      // Lazy loading de módulos CoreUI
      { path: 'theme', loadChildren: () => import('./views/theme/routes').then(m => m.routes) },
      { path: 'base', loadChildren: () => import('./views/base/routes').then(m => m.routes) },
      { path: 'buttons', loadChildren: () => import('./views/buttons/routes').then(m => m.routes) },
      { path: 'forms', loadChildren: () => import('./views/forms/routes').then(m => m.routes) },
      { path: 'icons', loadChildren: () => import('./views/icons/routes').then(m => m.routes) },
      { path: 'notifications', loadChildren: () => import('./views/notifications/routes').then(m => m.routes) },
      { path: 'widgets', loadChildren: () => import('./views/widgets/routes').then(m => m.routes) },
      { path: 'charts', loadChildren: () => import('./views/charts/routes').then(m => m.routes) },
      { path: 'pages', loadChildren: () => import('./views/pages/routes').then(m => m.routes) }
    ]
  },


  // Rutas de error
  { path: '404', loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component) },
  { path: '500', loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component) },

  // Redirección raíz
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' }
];
