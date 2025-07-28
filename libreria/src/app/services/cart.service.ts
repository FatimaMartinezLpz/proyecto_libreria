import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from './book';

export interface CartItem {
    id: number;
    user_id: number;
    book_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    book: Libro;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly API_URL = 'http://127.0.0.1:8000/api/cart';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    obtenerItems(): Observable<CartItem[]> {
        return this.http.get<CartItem[]>(this.API_URL, { headers: this.getHeaders() });
    }

    agregarItem(bookId: number): Observable<CartItem> {
        return this.http.post<CartItem>(this.API_URL, { book_id: bookId }, {
            headers: this.getHeaders()
        });
    }

    aumentarCantidad(id: number): Observable<CartItem> {
        return this.http.put<CartItem>(`${this.API_URL}/${id}`, {}, {
            headers: this.getHeaders()
        });
    }

    disminuirCantidad(id: number): Observable<any> {
        return this.http.put(`${this.API_URL}/${id}/decrease`, {}, {
            headers: this.getHeaders()
        });
    }

    eliminarItem(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`, {
            headers: this.getHeaders()
        });
    }
}
