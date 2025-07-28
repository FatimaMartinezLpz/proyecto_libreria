import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    const usuario = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (usuario?.role === 'admin') {
      return true;
    }

    this.router.navigate(['/auth']);
    return false;
  }
}

