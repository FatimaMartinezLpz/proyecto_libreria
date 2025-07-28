import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

// Si sigue dando error con environment, usa esta solución temporal:
const API_URL = 'http://127.0.0.1:8000/api/orders';

// O si prefieres usar environment (la forma correcta):
// import { environment } from 'src/environments/environment';
// const API_URL = `${environment.apiUrl}/orders`;

export interface Order {
    order_id: any;
    id?: number;
    user_id: number;
    total: number;
    status: 'pendiente' | 'pagado' | 'cancelado';
    shipping_address: string;
    payment_method: string;
    created_at?: string;
    updated_at?: string;
}

export interface OrderItem {
    id?: number;
    order_id: number;
    book_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly API_URL = 'http://127.0.0.1:8000/api';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    createOrder(orderData: any): Observable<any> {
        return this.http.post(`${this.API_URL}/orders`, orderData, { // Ahora será /api/orders
            headers: this.getHeaders()
        })
    }

    getOrderDetails(orderId: number): Observable<Order & { items: OrderItem[] }> {
        return this.http.get<Order & { items: OrderItem[] }>(`${this.API_URL}/orders/${orderId}`, {
            headers: this.getHeaders()
        });
    }

    getUserOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.API_URL}/user`, {
            headers: this.getHeaders()
        });
    }

}