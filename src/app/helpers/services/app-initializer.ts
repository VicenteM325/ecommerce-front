import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { AuthService } from './auth.service';

export function initApp(authService: AuthService) {
  return () => authService.restoreSession().toPromise();
}

export const appInitializerProvider: FactoryProvider = {
  provide: APP_INITIALIZER,
  useFactory: initApp,
  deps: [AuthService],
  multi: true
};
