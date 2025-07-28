import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth';
interface StockVerificationItem {
    id: number;
    quantity: number;
}

interface StockVerificationResponse {
    success: boolean;
    message?: string;
    book_id?: number;
    available_stock?: number;
}
export interface Libro {
    id?: number;
    title: string;
    author: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    cover_url?: string;
}



@Injectable({
    providedIn: 'root'
})
export class BookService {
    private readonly API_URL = 'http://127.0.0.1:8000/api/books';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken(); // Usamos el método del AuthService
        if (!token) {
            console.error('No se encontró token de autenticación');
            throw new Error('Usuario no autenticado');
        }
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    getLibros(): Observable<Libro[]> {
        return this.http.get<Libro[]>(this.API_URL);
    }

    addLibro(libro: Libro): Observable<Libro> {
        return this.http.post<Libro>(this.API_URL, libro, {
            headers: this.getHeaders()
        });
    }

    deleteLibro(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`, {
            headers: this.getHeaders()
        });
    }

    updateLibro(id: number, libro: Libro): Observable<Libro> {
        return this.http.put<Libro>(`${this.API_URL}/${id}`, libro, {
            headers: this.getHeaders()
        });
    }
    verifyStock(cartItems: any[]): Observable<StockVerificationResponse> {
        try {
            // Validación básica
            if (!Array.isArray(cartItems)) {
                throw new Error('El carrito debe ser un array');
            }

            if (cartItems.length === 0) {
                throw new Error('El carrito está vacío');
            }

            // Preparar datos
            const itemsToVerify = cartItems.map(item => {
                // Caso 1: Estructura {book: {id: X}, quantity: Y}
                if (item?.book?.id && item?.quantity) {
                    return {
                        id: item.book.id,
                        quantity: item.quantity
                    };
                }
                // Caso 2: Estructura directa {id: X, cantidad: Y}
                else if (item?.id) {
                    return {
                        id: item.id,
                        quantity: item.cantidad || 1 // Default 1 si no hay cantidad
                    };
                }
                throw new Error(`Item inválido: ${JSON.stringify(item)}`);
            });

            return this.http.post<StockVerificationResponse>(
                `${this.API_URL}/verify-stock`,
                { items: itemsToVerify },
                { headers: this.getHeaders() }
            ).pipe(
                catchError(error => {
                    console.error('Error en verifyStock:', error);
                    if (error.status === 401) {
                        throw new Error('Sesión expirada. Por favor vuelve a iniciar sesión');
                    }
                    throw new Error(error.error?.message || 'Error al verificar el stock');
                })
            );

        } catch (error) {
            return throwError(() => error);
        }
    }
    // En book.service.ts
    searchBooks(query: string): Observable<Libro[]> {
        return this.http.get<Libro[]>(`${this.API_URL}/books/search?q=${query}`).pipe(
            catchError(error => {
                console.error('Error en búsqueda:', error);
                return throwError(() => new Error('Error al buscar libros'));
            })
        );
    }

    getLibroById(id: number): Observable<Libro> {
        return this.http.get<Libro>(`${this.API_URL}/${id}`).pipe(
            catchError(error => {
                console.error('Error obteniendo libro:', error);
                return throwError(() => new Error('Error al obtener libro'));
            })
        );
    }
}
