import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    DatePipe, CommonModule],
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.html',
  styleUrls: ['./order-confirmation.css']

})
export class OrderConfirmationComponent implements OnInit {
  order: any = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (orderId) {
      this.orderService.getOrderDetails(orderId).subscribe({
        next: (order) => {
          this.order = order;
        },
        error: (err) => {
          console.error('Error loading order details', err);
        }
      });
    }
  }

  getPaymentMethodName(method: string): string {
    switch (method) {
      case 'tarjeta': return 'Tarjeta de Crédito/Débito';
      case 'paypal': return 'PayPal';
      case 'transferencia': return 'Transferencia Bancaria';
      default: return method;
    }
  }
  goToHome() {
    this.router.navigate(['/home']); // Navega a '/home' en lugar de '/'
  }
}