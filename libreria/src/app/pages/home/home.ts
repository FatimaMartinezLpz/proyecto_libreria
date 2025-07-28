import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService, Libro } from '../../services/book';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth';
import { FilterBySubcategoryPipe } from '../../pipes/filterBySubcategory';

interface Categoria {
  nombre: string;
  subcategorias: string[];
  abierto: boolean;
  seleccionada: boolean;
}

interface CarruselImagen {
  url: string;
  alt: string;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterBySubcategoryPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css']

})
export class HomeComponent implements OnInit, OnDestroy {
  busqueda = '';
  cantidadEnCarrito = 0;
  mostrarBolsa = false;
  carrito: (Libro & { cantidad: number })[] = [];
  resultadosBusqueda: Libro[] = [];
  busquedaTimer: any;

  filtroActivo: string | null = null;
  // Agrega estas propiedades
  mostrandoResultadosBusqueda = false;
  librosFiltrados: Libro[] = [];
  // Categorías desplegables
  categoriasPrincipales: Categoria[] = [
    {
      nombre: 'Literatura',
      subcategorias: ['Novela', 'Poesía', 'Teatro', 'Ensayo'],
      abierto: false,
      seleccionada: false
    },
    {
      nombre: 'Ciencias',
      subcategorias: ['Matemáticas', 'Física', 'Química', 'Biología'],
      abierto: false,
      seleccionada: false
    },
    {
      nombre: 'Juvenil',
      subcategorias: ['Fantasía', 'Ciencia ficción', 'Romance', 'Misterio'],
      abierto: false,
      seleccionada: false
    }
  ];

  // Carrusel principal
  carruselImagenes: CarruselImagen[] = [
    {
      url: 'assets/img/frase1.jpg',
      alt: 'Promoción de verano',
      titulo: 'Viaja ligero, abre un libro',
      descripcion: 'Del 1 al 31 de julio encuentra nuestras promociones para este verano.'
    },
    {
      url: 'assets/img/preventa.png',
      alt: 'Novedades',
      titulo: 'Las novedades del mes',
      descripcion: 'Descubre los libros más esperados del año.'
    },
    {
      url: 'assets/img/img2.jpg',
      alt: 'Clásicos',
      titulo: 'Los clásicos nunca pasan de moda',
      descripcion: 'Ediciones especiales de tus libros favoritos.'
    }
  ];

  imagenActual = 0;
  intervaloCarrusel: any;

  // Libros destacados
  librosDestacados: Libro[] = [];
  ultimosLanzamientos: Libro[] = [];

  // Control de carruseles
  currentIndexDestacados1 = 0;
  currentIndexDestacados2 = 0;
  librosPorSlide = 4;

  librosOriginales: Libro[] = [];

  // Usuario y cuenta
  usuario: { nombre: string; email: string } | null = null;
  cuentaAbierta = false;

  // Referencias a los contenedores de carrusel
  @ViewChild('destacados1', { static: false }) destacados1!: ElementRef<HTMLElement>;
  @ViewChild('destacados2', { static: false }) destacados2!: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private bookService: BookService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    this.cantidadEnCarrito = this.carrito.reduce((total, item) => total + (item.cantidad || 1), 0);
    this.iniciarCarrusel();
    this.obtenerUsuario();
    this.cargarLibros();
    this.obtenerCarrito();
  }

  cargarLibros(): void {
    this.bookService.getLibros().subscribe({
      next: libros => {
        this.librosOriginales = libros; // Guarda la lista original
        // Duplicamos solo para el efecto del carrusel
        this.librosDestacados = [...libros.slice(0, 6), ...libros.slice(0, 6)];
        this.ultimosLanzamientos = [...libros.slice(-6).reverse(), ...libros.slice(-6).reverse()];
      },
      error: err => console.error('Error cargando libros', err)
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervaloCarrusel);
  }

  // Métodos para el carrusel principal
  toggleDropdown(categoria: Categoria, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Cerrar otras categorías
    this.categoriasPrincipales.forEach(c => {
      c.abierto = c.nombre === categoria.nombre ? !c.abierto : false;
      c.seleccionada = c.nombre === categoria.nombre && c.abierto;
    });

    // Si la categoría está abierta, mostramos todos los libros de esa categoría
    if (categoria.abierto) {
      this.filtrarPorCategoria(categoria.nombre);
      this.filtroActivo = categoria.nombre;
    } else {
      this.limpiarFiltros();
    }
  }

  filtrarPorCategoria(categoria: string): void {
    this.mostrandoResultadosBusqueda = true;
    this.librosFiltrados = this.librosOriginales.filter(libro =>
      libro.category?.toLowerCase() === categoria.toLowerCase()
    );
  }

  filtrarPorSubcategoria(subcategoria: string): void {
    this.mostrandoResultadosBusqueda = true;
    this.filtroActivo = subcategoria;

    // Filtramos los libros que coincidan con la subcategoría (que en realidad es una categoría)
    this.librosFiltrados = this.librosOriginales.filter(libro =>
      libro.category?.toLowerCase() === subcategoria.toLowerCase()
    );
  }

  limpiarFiltros(): void {
    this.mostrandoResultadosBusqueda = false;
    this.librosFiltrados = [];
    this.filtroActivo = null;
    this.categoriasPrincipales.forEach(c => {
      c.abierto = false;
      c.seleccionada = false;
    });
  }
  iniciarCarrusel(): void {
    this.intervaloCarrusel = setInterval(() => {
      this.siguiente();
    }, 5000);
  }

  siguiente(): void {
    this.imagenActual = (this.imagenActual + 1) % this.carruselImagenes.length;
    this.reiniciarIntervalo();
  }

  anterior(): void {
    this.imagenActual = (this.imagenActual - 1 + this.carruselImagenes.length) % this.carruselImagenes.length;
    this.reiniciarIntervalo();
  }

  cambiarImagen(index: number): void {
    this.imagenActual = index;
    this.reiniciarIntervalo();
  }

  reiniciarIntervalo(): void {
    clearInterval(this.intervaloCarrusel);
    this.iniciarCarrusel();
  }

  // Métodos para los carruseles de libros
  // Método modificado para el carrusel infinito
  moverCarrusel(direction: string, carruselId: string): void {
    const carrusel = this[carruselId === 'destacados1' ? 'destacados1' : 'destacados2'] as ElementRef;
    const libros = carruselId === 'destacados1' ? this.librosDestacados : this.ultimosLanzamientos;
    const totalLibros = libros.length;

    // Actualizar el índice
    if (direction === 'prev') {
      this[carruselId === 'destacados1' ? 'currentIndexDestacados1' : 'currentIndexDestacados2'] =
        (this[carruselId === 'destacados1' ? 'currentIndexDestacados1' : 'currentIndexDestacados2'] - 1 + totalLibros) % totalLibros;
    } else {
      this[carruselId === 'destacados1' ? 'currentIndexDestacados1' : 'currentIndexDestacados2'] =
        (this[carruselId === 'destacados1' ? 'currentIndexDestacados1' : 'currentIndexDestacados2'] + 1) % totalLibros;
    }

    // Calcular el desplazamiento (220px por libro + 25px de gap)
    const desplazamiento = -this[carruselId === 'destacados1' ? 'currentIndexDestacados1' : 'currentIndexDestacados2'] * (220 + 25);
    carrusel.nativeElement.style.transform = `translateX(${desplazamiento}px)`;

    // Efecto infinito: si llegamos al final, hacemos un salto suave al principio
    if (this[carruselId === 'destacados1' ? 'currentIndexDestacados1' : 'currentIndexDestacados2'] >= totalLibros - this.librosPorSlide) {
      setTimeout(() => {
        this[carruselId === 'destacados1' ? 'currentIndexDestacados1' : 'currentIndexDestacados2'] = 0;
        carrusel.nativeElement.style.transition = 'none';
        carrusel.nativeElement.style.transform = `translateX(0)`;
        setTimeout(() => {
          carrusel.nativeElement.style.transition = 'transform 0.5s ease';
        }, 50);
      }, 500);
    }
  }



  // Métodos del carrito
  toggleBolsa(): void {
    this.mostrarBolsa = !this.mostrarBolsa;
  }

  agregarAlCarrito(libro: Libro): void {
    this.cartService.agregarItem(libro.id!).subscribe({
      next: () => {
        this.obtenerCarrito();
        this.mostrarNotificacion(`${libro.title} agregado al carrito`);
        this.mostrarBolsa = true;
      },
      error: err => {
        console.error('Error al agregar al carrito', err);
        alert('Error al agregar el libro al carrito.');
      }
    });
  }

  obtenerCarrito(): void {
    this.cartService.obtenerItems().subscribe({
      next: (items) => {
        this.carrito = items.map(item => ({
          ...item.book,
          cantidad: item.quantity,
          idItem: item.id // usamos esto si quieres acceder al ID del CartItem
        }));
        this.cantidadEnCarrito = this.carrito.reduce((total, item) => total + item.cantidad, 0);
      },
      error: err => {
        console.error('Error al obtener carrito', err);
      }
    });
  }




  private mostrarNotificacion(mensaje: string): void {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-carrito';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
      notificacion.classList.add('mostrar');
    }, 10);

    setTimeout(() => {
      notificacion.classList.remove('mostrar');
      setTimeout(() => {
        document.body.removeChild(notificacion);
      }, 300);
    }, 3000);
  }

  aumentarCantidad(item: any): void {
    this.cartService.aumentarCantidad(item.idItem).subscribe({
      next: (updatedItem) => {
        item.cantidad = updatedItem.quantity;
        this.actualizarCarrito();
      },
      error: err => {
        console.error('Error al aumentar cantidad', err);
      }
    });
  }


  disminuirCantidad(item: any): void {
    if (item.cantidad <= 1) {
      this.eliminarDelCarrito(item);
      return;
    }

    this.cartService.disminuirCantidad(item.idItem).subscribe({
      next: (updatedItem) => {
        item.cantidad = updatedItem.quantity;
        this.actualizarCarrito();
      },
      error: err => {
        console.error('Error al disminuir cantidad', err);
      }
    });
  }


  eliminarDelCarrito(item: any): void {
    this.cartService.eliminarItem(item.idItem).subscribe({
      next: () => {
        this.obtenerCarrito();
      },
      error: err => {
        console.error('Error al eliminar del carrito', err);
      }
    });
  }


  actualizarCarrito(): void {
    this.cantidadEnCarrito = this.carrito.reduce((t, i) => t + i.cantidad, 0);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + (item.price * item.cantidad), 0);
  }

  // En tu HomeComponent
  // En tu home.component.ts
  async procederAlPago(): Promise<void> {
    // 1. Validar carrito no vacío
    if (!this.carrito?.length) {
      alert('Tu bolsa está vacía');
      return;
    }

    // 2. Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      const confirmLogin = confirm('Debes iniciar sesión para proceder al pago. ¿Deseas iniciar sesión ahora?');
      if (confirmLogin) {
        this.router.navigate(['/auth'], {
          state: { returnUrl: '/checkout' }
        });
      }
      return;
    }

    try {
      // 3. Preparar items para verificación de stock
      const itemsToVerify = this.carrito.map(item => ({
        id: item.id!,
        quantity: item.cantidad
      }));

      // 4. Verificar stock
      const stockResponse = await this.bookService.verifyStock(itemsToVerify).toPromise();

      if (stockResponse?.success) {
        // 5. Guardar datos temporalmente para el checkout
        const checkoutData = {
          items: this.carrito,
          total: this.calcularTotal(),
          timestamp: Date.now()
        };

        // 6. Redirigir al checkout
        this.router.navigate(['/checkout'], {
          state: { checkoutData }
        });
      } else {
        this.handleStockError(stockResponse);
      }
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      this.handlePaymentError(error);
    }
  }

  private handleStockError(response: any): void {
    let errorMessage = 'Hubo un problema con tu pedido: ';

    if (response?.book_id && response?.available_stock !== undefined) {
      const book = this.carrito.find(item => item.id === response.book_id);
      const bookTitle = book?.title || 'un producto';

      errorMessage += response.available_stock > 0
        ? `Solo quedan ${response.available_stock} unidades de "${bookTitle}".`
        : `"${bookTitle}" está agotado.`;
    } else {
      errorMessage += response?.message || 'No hay suficiente stock disponible.';
    }

    alert(errorMessage);
    this.obtenerCarrito(); // Refrescar carrito
  }

  private handlePaymentError(error: any): void {
    if (error?.status === 401) {
      this.authService.logout();
      this.usuario = null;
      alert('Tu sesión ha expirado. Serás redirigido para iniciar sesión.');
      this.router.navigate(['/auth']);
    } else {
      alert('Error al procesar tu pago: ' + (error.error?.message || 'Intenta nuevamente más tarde.'));
    }
  }


  // Métodos de usuario
  obtenerUsuario(): void {
    const usuarioData = this.authService.getCurrentUser();
    if (usuarioData) {
      this.usuario = {
        nombre: usuarioData.name,
        email: usuarioData.email
      };
    } else {
      this.usuario = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.cuentaAbierta = false;
      this.categoriasPrincipales.forEach(c => c.abierto = false);
    }
  }

  toggleCuenta(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.cuentaAbierta = !this.cuentaAbierta;
  }

  cerrarSesion(event: Event): void {
    event.stopPropagation();
    localStorage.removeItem('usuario');
    localStorage.removeItem('carrito');
    this.router.navigate(['/auth']);
  }

  buscarLibro(): void {
    if (this.busqueda.trim()) {
      this.router.navigate(['/busqueda'], { queryParams: { q: this.busqueda } });
    }
  }

  // Método para manejar el redimensionamiento de la ventana
  @HostListener('window:resize')
  onResize(): void {
    // Ajustar el número de libros visibles según el ancho de la pantalla
    const anchoPantalla = window.innerWidth;
    if (anchoPantalla < 768) {
      this.librosPorSlide = 1;
    } else if (anchoPantalla < 1024) {
      this.librosPorSlide = 2;
    } else {
      this.librosPorSlide = 4;
    }

    // Recalcular posiciones
    if (this.destacados1) {
      const desplazamiento1 = -this.currentIndexDestacados1 * (220 + 25);
      this.destacados1.nativeElement.style.transform = `translateX(${desplazamiento1}px)`;
    }

    if (this.destacados2) {
      const desplazamiento2 = -this.currentIndexDestacados2 * (220 + 25);
      this.destacados2.nativeElement.style.transform = `translateX(${desplazamiento2}px)`;
    }
  }
  obtenerInicialUsuario(): string {
    if (!this.usuario?.nombre) return '?';
    return this.usuario.nombre.charAt(0).toUpperCase();
  }
  trackByLibroId(index: number, libro: Libro): number {
    return libro.id!;
  }

  // Modifica buscarLibros()
  buscarLibros() {
    clearTimeout(this.busquedaTimer);

    if (this.busqueda.trim().length > 0) { // Cambiado de > 2 a > 0
      this.busquedaTimer = setTimeout(() => {
        // Filtramos sobre la lista original (librosOriginales)
        this.librosFiltrados = this.librosOriginales.filter(libro =>
          libro.title.toLowerCase().includes(this.busqueda.toLowerCase()) ||
          libro.author.toLowerCase().includes(this.busqueda.toLowerCase())
        );

        this.mostrandoResultadosBusqueda = true;
        this.resultadosBusqueda = this.librosFiltrados.slice(0, 5); // Para el dropdown
      }, 300);
    } else {
      this.mostrandoResultadosBusqueda = false;
      this.librosFiltrados = [];
      this.resultadosBusqueda = [];
    }
  }
  // Método para limpiar búsqueda
  limpiarBusqueda() {
    this.busqueda = '';
    this.mostrandoResultadosBusqueda = false;
    this.librosFiltrados = [];
    this.resultadosBusqueda = [];
  }

  // Modifica realizarBusqueda() para que no redirija
  realizarBusqueda() {
    if (this.busqueda.trim()) {
      this.mostrandoResultadosBusqueda = true;
      this.buscarLibros(); // Esto actualizará librosFiltrados
    } else {
      this.mostrandoResultadosBusqueda = false;
      this.librosFiltrados = [];
    }
  }
  verDetalleLibro(libro: Libro) {
    this.router.navigate(['/libro', libro.id]);
    this.resultadosBusqueda = [];
    this.busqueda = '';
  }
}