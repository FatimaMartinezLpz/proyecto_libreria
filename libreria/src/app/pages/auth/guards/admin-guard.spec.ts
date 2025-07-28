import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminGuard } from './admin-guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: Router, useValue: spy }
      ]
    });

    guard = TestBed.inject(AdminGuard);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debería permitir el acceso si el usuario es admin', () => {
    localStorage.setItem('usuario', JSON.stringify({ rol: 'admin' }));
    expect(guard.canActivate()).toBeTrue();
  });

  it('debería redirigir si el usuario no es admin', () => {
    localStorage.setItem('usuario', JSON.stringify({ rol: 'user' }));
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth']);
  });
});

