import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const roleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['expectedRole'];

  console.log('🔐 === ROLE GUARD EXECUTING ===');
  console.log('🔐 Route:', state.url);
  console.log('🔐 Expected role:', expectedRole);
  console.log('🔐 Is initialized:', authService.getIsInitialized());

  // Verificar cookies
  console.log('🔐 Cookies:', document.cookie);
  console.log('🔐 JWT cookie present:', document.cookie.includes('jwt='));

  if (!authService.getIsInitialized()) {
    console.log('🔐 Initializing auth...');
    try {
      await firstValueFrom(authService.initializeAuth());
      console.log('🔐 Auth initialization completed');
    } catch (error) {
      console.error('🔐 Error during initialization:', error);
    }
  }

  let user = authService.getCurrentUser();
  console.log('🔐 Current user:', user);
  console.log('🔐 User role:', user?.role?.name);

  if (!user) {
    console.log('🔐 ❌ NO USER - Redirecting to login');
    await router.navigate(['/login']);
    return false;
  }

  const userRole = user.role?.name;
  const hasAccess = Array.isArray(expectedRole)
    ? expectedRole.includes(userRole)
    : userRole === expectedRole;

  console.log('🔐 Has access:', hasAccess);

  if (hasAccess) {
    console.log('🔐 ✅ ACCESS GRANTED');
    return true;
  } else {
    console.log('🔐 ❌ ACCESS DENIED - Redirecting to 404');
    await router.navigate(['/404']);
    return false;
  }
};