import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const roleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole'];
  let user = authService.getCurrentUser();

  try {
    if (!user) {
      const restoredUser = await firstValueFrom(authService.getDetails());
      if (!restoredUser) {
        await router.navigate(['/login']);
        return false;
      }
      user = restoredUser;
    }

    const userRole = user.role?.name;

    const hasAccess = Array.isArray(expectedRole)
      ? expectedRole.includes(userRole)
      : userRole === expectedRole;

    if (hasAccess) {
      return true;
    } else {
      await router.navigate(['/404']);
      return false;
    }

  } catch (error) {
    await router.navigate(['/login']);
    return false;
  }
};
