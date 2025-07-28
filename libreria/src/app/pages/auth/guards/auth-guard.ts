import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, private authService: AuthService) { }

  // canActivate(): boolean {
  //   const usuario = JSON.parse(localStorage.getItem('currentUser') || 'null');
  //   if (usuario?.role === 'user') return true;
  //   this.router.navigate(['/auth']);
  //   return false;
  // }


  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/auth'], {
      queryParams: { returnUrl: route.url.join('/') }
    });
    return false;
  }
}

