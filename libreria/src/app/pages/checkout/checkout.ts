import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DecimalPipe],
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: any[] = [];
  shippingCost = 0;
  isProcessing = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      paymentMethod: ['tarjeta', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateShipping();
  }

  loadCartItems(): void {
    this.cartService.obtenerItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        if (this.cartItems.length === 0) {
          this.router.navigate(['/']);
        }
      },
      error: (err) => console.error('Error loading cart items', err)
    });
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  }

  calculateShipping(): void {
    const subtotal = this.calculateSubtotal();
    this.shippingCost = subtotal >= 500 ? 0 : 50;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.shippingCost;
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid || this.cartItems.length === 0) {
      return;
    }

    this.isProcessing = true;

    const orderData = {
      shipping_address: `${this.checkoutForm.value.address}, ${this.checkoutForm.value.city}, ${this.checkoutForm.value.state} ${this.checkoutForm.value.zipCode}`,
      payment_method: this.checkoutForm.value.paymentMethod
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.router.navigate(['/order-confirmation', response.order_id]);
      },
      error: (err) => {
        console.error('Error creating order', err);
        this.isProcessing = false;
      }
    });
  }
  // Agrega este método a la clase CheckoutComponent
  cancelCheckout(): void {
    if (confirm('¿Estás seguro de que deseas cancelar el proceso de compra?')) {
      this.router.navigate(['/']);
    }
  }
}