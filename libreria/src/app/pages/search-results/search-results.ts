import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService, Libro } from '../../services/book';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css']
})
export class SearchResultsComponent implements OnInit {
  query: string = '';
  libros: Libro[] = [];
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query) {
        this.buscarLibros();
      }
    });
  }

  // En search-results.component.ts
  buscarLibros() {
    this.isLoading = true;
    this.bookService.searchBooks(this.query).subscribe({
      next: (libros) => {
        this.libros = libros;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error buscando libros:', err);
        this.libros = []; // Mostrar lista vacía si hay error
        this.isLoading = false;
        // Opcional: Mostrar mensaje al usuario
      }
    });
  }

  agregarAlCarrito(libro: Libro) {
    this.cartService.agregarItem(libro.id!).subscribe({
      next: () => {
        // Puedes agregar notificación aquí si lo deseas
        console.log(`${libro.title} agregado al carrito`);
      },
      error: (err) => {
        console.error('Error al agregar al carrito', err);
      }
    });
  }
}