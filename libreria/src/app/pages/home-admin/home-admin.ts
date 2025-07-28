import { Component, HostListener, ElementRef, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService, Libro as LibroAPI } from '../../services/book';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth';
import { provideAnimations } from '@angular/platform-browser/animations';

interface LibroExtendido extends LibroAPI {
  seleccionado: boolean;
  cantidad: number;
}
interface GrupoAutor {
  autor: string;
  libros: LibroExtendido[];
}
// Registra todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [provideAnimations()],
  templateUrl: './home-admin.html',
  styleUrls: ['./home-admin.css']
})
export class HomeAdmin {
  librosDestacados: LibroExtendido[] = [];
  librosFiltrados: LibroExtendido[] = [];
  librosMostrados: LibroExtendido[] = [];
  librosAgrupadosPorAutor: GrupoAutor[] = [];
  libroEnEdicion: LibroExtendido | null = null;
  libroSeleccionado: LibroExtendido | null = null;
  @ViewChild('graficaGeneros', { static: false }) graficaRef!: ElementRef;

  mostrarReportes = false;
  totalLibros = 0;
  generoMasLibros = '';
  grafica?: Chart;

  // Propiedades para filtros y paginación
  filtroActual: 'todos' | 'autores' | 'novedades' = 'todos';
  terminoBusqueda: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  // Gestión de usuarios
  mostrarUsuarios = false;
  mostrarFormularioUsuario = false;
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  terminoBusquedaUsuarios = '';
  usuarioEditando: any = null;
  nuevoUsuario: any = {
    name: '',
    email: '',
    password: '',
    role: 'user'
  };

  nuevoLibro: LibroAPI = {
    title: '',
    author: '',
    category: '',
    description: '',
    price: 0,
    stock: 1,
    cover_url: ''
  };

  mostrarFormulario = false;

  // Usuario y cuenta
  usuario: { name: string; email: string, role?: string } | null = null;
  cuentaAbierta = false;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private bookService: BookService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
    this.cargarLibros();
  }

  // En la clase HomeAdmin
  // En la clase HomeAdmin
  obtenerUsuario(): void {
    // Cambiamos de 'usuario' a 'currentUser' que es donde realmente se guarda
    const usuarioData = localStorage.getItem('currentUser');

    if (usuarioData) {
      try {
        const usuario = JSON.parse(usuarioData);

        // Verificamos la estructura del usuario según el modelo de Laravel
        this.usuario = {
          name: usuario.name || 'Usuario',
          email: usuario.email || 'No especificado',
          role: usuario.role || 'user'
        };

        // No necesitamos guardar de vuelta en localStorage
        // ya que AuthService ya maneja la estructura correcta
      } catch (error) {
        console.error('Error al parsear datos del usuario', error);
        this.usuario = {
          name: 'Usuario',
          email: 'No especificado',
          role: 'user'
        };
      }
    } else {
      this.usuario = null;
    }
  }

  toggleCuenta(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.cuentaAbierta = !this.cuentaAbierta;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.cuentaAbierta = false;
    }
  }

  cerrarSesion(event: Event): void {
    event.stopPropagation();
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }

  cargarLibros(): void {
    this.bookService.getLibros().subscribe({
      next: (libros) => {
        // Convertimos los libros en extendidos con campos adicionales
        this.librosDestacados = libros.map(l => ({
          ...l,
          seleccionado: false,
          cantidad: l.stock ?? 1
        }));
        this.aplicarFiltro('todos'); // Aplicar filtro inicial después de cargar
      },
      error: (err) => console.error('Error cargando libros', err)
    });
  }
  aplicarFiltro(filtro: 'todos' | 'autores' | 'novedades'): void {
    this.filtroActual = filtro;
    this.paginaActual = 1;

    switch (filtro) {
      case 'todos':
        this.librosFiltrados = [...this.librosDestacados].sort((a, b) =>
          a.title.localeCompare(b.title));
        break;
      case 'autores':
        this.agruparPorAutores();
        break;
      case 'novedades':
        this.librosFiltrados = [...this.librosDestacados].reverse();
        break;
    }

    this.actualizarLibrosMostrados();
  }

  agruparPorAutores(): void {
    const grupos: { [key: string]: LibroExtendido[] } = {};

    this.librosDestacados.forEach(libro => {
      if (!grupos[libro.author]) {
        grupos[libro.author] = [];
      }
      grupos[libro.author].push(libro);
    });

    this.librosAgrupadosPorAutor = Object.keys(grupos).map(autor => ({
      autor,
      libros: grupos[autor].sort((a, b) => a.title.localeCompare(b.title))
    }));

    // Ordenar autores alfabéticamente
    this.librosAgrupadosPorAutor.sort((a, b) => a.autor.localeCompare(b.autor));
  }

  buscarLibros(): void {
    if (!this.terminoBusqueda) {
      this.aplicarFiltro(this.filtroActual);
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.librosFiltrados = this.librosDestacados.filter(libro =>
      libro.title.toLowerCase().includes(termino) ||
      libro.author.toLowerCase().includes(termino)
    );

    this.paginaActual = 1;
    this.actualizarLibrosMostrados();
  }

  actualizarLibrosMostrados(): void {
    if (this.filtroActual === 'autores') return;

    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.librosMostrados = this.librosFiltrados.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.librosFiltrados.length / this.itemsPorPagina);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarLibrosMostrados();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarLibrosMostrados();
    }
  }
  guardarCambiosLibro(): void {
    if (!this.nuevoLibro.title || !this.nuevoLibro.author || !this.nuevoLibro.category || !this.nuevoLibro.price) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (this.libroEnEdicion) {
      // Modo edición
      this.bookService.updateLibro(this.libroEnEdicion.id!, this.nuevoLibro).subscribe({
        next: (libroActualizado) => {
          const index = this.librosDestacados.findIndex(l => l.id === this.libroEnEdicion?.id);
          if (index !== -1) {
            this.librosDestacados[index] = {
              ...libroActualizado,
              seleccionado: false,
              cantidad: libroActualizado.stock ?? 1
            };
          }

          this.cancelarFormulario();
        },
        error: (err) => {
          console.error('Error al editar libro', err);
          alert('Error al editar el libro.');
        }
      });
    } else {
      // Modo agregar
      this.bookService.addLibro(this.nuevoLibro).subscribe({
        next: (libroCreado) => {
          this.librosDestacados = [
            ...this.librosDestacados,
            {
              ...libroCreado,
              seleccionado: false,
              cantidad: libroCreado.stock ?? 1
            }
          ];

          this.cancelarFormulario();
        },
        error: (err) => {
          console.error('Error al agregar libro', err);
          alert('Error al guardar el libro.');
        }
      });
    }
  }


  eliminarLibro(libro: LibroExtendido): void {
    if (!libro.id) return;
    if (!confirm(`¿Estás seguro de eliminar "${libro.title}"?`)) return;

    this.bookService.deleteLibro(libro.id).subscribe({
      next: () => {
        this.librosDestacados = this.librosDestacados.filter(l => l.id !== libro.id);
      },
      error: (err) => {
        console.error('Error al eliminar libro', err);
        alert('Error al eliminar el libro.');
      }
    });
  }

  editarLibro(libro: LibroExtendido): void {
    this.libroEnEdicion = libro;
    this.nuevoLibro = { ...libro };
    this.mostrarFormulario = true;
  }
  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.libroEnEdicion = null;
    this.nuevoLibro = {
      title: '',
      author: '',
      category: '',
      description: '',
      price: 0,
      stock: 1,
      cover_url: ''
    };
  }
  verDetalles(libro: LibroExtendido): void {
    this.libroSeleccionado = libro;
  }

  cerrarDetalles(): void {
    this.libroSeleccionado = null;
  }




  abrirReportes(): void {
    this.prepararDatosReporte();
    this.mostrarReportes = true;

    // Forzar la detección de cambios
    this.cdRef.detectChanges();

    // Intentar crear la gráfica después de un breve retraso
    setTimeout(() => {
      if (this.graficaRef?.nativeElement) {
        this.crearGrafica();
      } else {
        console.warn('Canvas no disponible, reintentando...');
        // Segundo intento con mayor retraso si es necesario
        setTimeout(() => {
          if (this.graficaRef?.nativeElement) {
            this.crearGrafica();
          } else {
            console.error('No se pudo acceder al elemento del gráfico después de múltiples intentos');
          }
        }, 200);
      }
    }, 50);
  }

  cerrarReportes(): void {
    this.mostrarReportes = false;
    if (this.grafica) {
      this.grafica.destroy();
      this.grafica = undefined;
    }
  }

  prepararDatosReporte(): void {
    const porCategoria = this.librosDestacados.reduce((acc: { [key: string]: number }, libro) => {
      const categoria = libro.category || 'Sin categoría';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {});

    this.totalLibros = this.librosDestacados.length;

    // Encontrar el género con más libros
    const [genero, cantidad] = Object.entries(porCategoria)
      .reduce((max, entry) => entry[1] > max[1] ? entry : max, ['', 0]);

    this.generoMasLibros = `${genero} (${cantidad})`;
  }

  crearGrafica(): void {
    if (!this.graficaRef?.nativeElement) {
      console.error('Elemento canvas no encontrado');
      return;
    }

    const ctx = this.graficaRef.nativeElement.getContext('2d');

    // Destruir gráfica anterior si existe
    if (this.grafica) {
      this.grafica.destroy();
    }

    const categorias = this.obtenerCategoriasConteo();

    this.grafica = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(categorias),
        datasets: [{
          label: 'Libros por género',
          data: Object.values(categorias),
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad de libros'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Géneros'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Distribución de libros por género',
            font: {
              size: 16
            }
          },
          legend: {
            display: false
          }
        }
      }
    });
  }

  private obtenerCategoriasConteo(): { [key: string]: number } {
    return this.librosDestacados.reduce((acc: { [key: string]: number }, libro) => {
      const categoria = libro.category || 'Sin categoría';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {});
  }
  copiarEmail(): void {
    if (this.usuario?.email) {
      navigator.clipboard.writeText(this.usuario.email);
      alert('Email copiado al portapapeles');
    } else {
      alert('No hay email disponible');
    }
  }

  verPerfil(): void {
    alert(`Perfil de usuario:\n\nNombre: ${this.usuario?.name}\nEmail: ${this.usuario?.email || 'No especificado'}`);
  }
  // Métodos para gestión de usuarios
  abrirGestionUsuarios(): void {
    this.mostrarUsuarios = true;
    this.cargarUsuarios();
  }

  cerrarGestionUsuarios(): void {
    this.mostrarUsuarios = false;
  }

  cargarUsuarios(): void {
    this.authService.getUsers().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = [...usuarios];
      },
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  filtrarUsuarios(): void {
    if (!this.terminoBusquedaUsuarios) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    const termino = this.terminoBusquedaUsuarios.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.name.toLowerCase().includes(termino) ||
      usuario.email.toLowerCase().includes(termino)
    );
  }

  editarUsuario(usuario: any): void {
    this.usuarioEditando = usuario;
    this.nuevoUsuario = { ...usuario, password: '' };
    this.mostrarFormularioUsuario = true;
  }

  eliminarUsuario(usuario: any): void {
    if (confirm(`¿Estás seguro de eliminar a ${usuario.name}?`)) {
      this.authService.deleteUser(usuario.id).subscribe({
        next: () => this.cargarUsuarios(),
        error: (err) => console.error('Error eliminando usuario', err)
      });
    }
  }

  abrirFormularioUsuario(): void {
    this.usuarioEditando = null;
    this.nuevoUsuario = { name: '', email: '', password: '', role: 'user' };
    this.mostrarFormularioUsuario = true;
  }

  cerrarFormularioUsuario(): void {
    this.mostrarFormularioUsuario = false;
    this.usuarioEditando = null;
  }

  guardarUsuario(): void {
    if (!this.nuevoUsuario.name || !this.nuevoUsuario.email || (!this.usuarioEditando && !this.nuevoUsuario.password)) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const operacion = this.usuarioEditando
      ? this.authService.updateUser(this.usuarioEditando.id, this.nuevoUsuario)
      : this.authService.createUser(this.nuevoUsuario);

    operacion.subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarFormularioUsuario();
      },
      error: (err) => console.error('Error guardando usuario', err)
    });
  }
}

