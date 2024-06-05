import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot,} from '@angular/router';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) =>
  {
    const router: Router  = inject(Router)
    if (state.url == "/login") {
      return true;
    }

    let token = sessionStorage.getItem('token');

    if (!token) {
      return router.parseUrl('/login')
    }

    return true;
  };
