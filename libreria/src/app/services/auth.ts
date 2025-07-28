import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://127.0.0.1:8000/api'; // Laravel local


  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.user));
      }),
      catchError(err => throwError(() => err))
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.user));
      }),
      catchError(err => throwError(() => err))
    );
  }

  logout(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(`${this.API_URL}/logout`, {}, { headers }).subscribe();

    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth']);
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Verificación básica - puedes añadir lógica para verificar expiración
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  // Métodos para gestión de usuarios
  getUsers(): Observable<any> {
    const token = this.getToken();
    console.log('Token siendo enviado:', token); // ← Verifica esto

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.get(`${this.API_URL}/test-token`, { headers }).pipe(
      tap(response => console.log('Respuesta test-token:', response)),
      switchMap(() => this.http.get(`${this.API_URL}/users`, { headers })),
      catchError(error => {
        console.error('Error completo:', error);
        if (error.status === 401) {
          console.error('Token inválido/expirado');
        } else if (error.status === 403) {
          console.error('Falta rol admin');
        }
        return throwError(() => error);
      })
    );
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/users`, userData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    });
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/users/${id}`, userData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/users/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    });
  }
}
