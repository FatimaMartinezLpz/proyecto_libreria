import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService, Libro } from '../../services/book';
import { CartService } from '../../services/cart.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './libro-detalle.html',
  styleUrls: ['./libro-detalle.css']
})
export class LibroDetalleComponent implements OnInit {
  libro: Libro | null = null;
  librosRelacionados: Libro[] = [];
  cantidad: number = 1;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private bookService: BookService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cargarLibro(parseInt(id));
      } else {
        this.error = 'ID de libro no proporcionado';
        this.isLoading = false;
      }
    });
  }

  cargarLibro(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.bookService.getLibroById(id).subscribe({
      next: (libro) => {
        this.libro = libro;
        this.cargarLibrosRelacionados(libro.category);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando libro:', err);
        this.error = 'Error al cargar el libro. Intente nuevamente.';
        this.isLoading = false;
      }
    });
  }

  cargarLibrosRelacionados(categoria: string): void {
    this.bookService.getLibros().subscribe({
      next: (libros) => {
        this.librosRelacionados = libros
          .filter(l => l.category === categoria && l.id !== this.libro?.id)
          .slice(0, 4); // Mostrar máximo 4 libros relacionados
      },
      error: (err) => {
        console.error('Error cargando libros relacionados:', err);
      }
    });
  }

  agregarAlCarrito(): void {
    if (!this.libro) return;

    // Primero agregar el item (solo con ID)
    this.cartService.agregarItem(this.libro.id!).subscribe({
      next: () => {
        console.log(`${this.libro?.title} agregado al carrito`);

        // Si necesitas actualizar la cantidad, hacerlo después
        if (this.cantidad > 1) {
          this.actualizarCantidadItem();
        } else {
          this.router.navigate(['/carrito']);
        }
      },
      error: (err) => {
        console.error('Error al agregar al carrito:', err);
        this.error = 'Error al agregar al carrito. Intente nuevamente.';
      }
    });
  }

  private actualizarCantidadItem(): void {
    if (!this.libro) return;

    // Asumiendo que el cartService tiene un método para actualizar cantidad
    // Si no lo tiene, necesitaríamos implementar esta lógica
    for (let i = 1; i < this.cantidad; i++) {
      this.cartService.agregarItem(this.libro.id!).subscribe({
        next: () => {
          if (i === this.cantidad - 1) {
            this.router.navigate(['/carrito']);
          }
        },
        error: (err) => {
          console.error('Error al actualizar cantidad:', err);
          this.error = 'Error al actualizar la cantidad. Verifique su carrito.';
        }
      });
    }
  }

  aumentarCantidad(): void {
    if (this.cantidad < 10) {
      this.cantidad++;
    }
  }

  disminuirCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }
}
