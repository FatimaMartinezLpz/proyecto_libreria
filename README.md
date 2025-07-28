## P📚 Proyecto Mi Librería - Angular + Laravel

proyecto generado utilizando [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.


## Integrantes del equipo

Martínez López Fátima

Guzmán Jiménez Alary


## Descripción

Proyecto de aplicación web para una librería en línea, donde usuarios pueden buscar y comprar libros, mientras que administradores gestionan el inventario, usuarios y pedidos. La aplicación está dividida en:

Frontend Angular: Interfaz de usuario interactiva, búsqueda, carrito y checkout.

Backend Laravel: API RESTful para gestión, autenticación y control de datos.
---

## Estructura del proyecto

![Inicio](src/assets/capturas/inicio.png)

![Inicio](src/assets/capturas/inicio.png)

---

## Frontend Angular

 **Características principales**  

Página principal con carrusel, libros destacados y últimos lanzamientos.

Sistema de búsqueda en tiempo real con filtro por categorías y subcategorías.

Visualización detallada de cada libro con imagen, descripción, stock y precio.

Carrito de compras flotante con gestión de cantidades y total actualizado.

Proceso de checkout con formulario para dirección, método de pago y resumen de compra.

Autenticación y registro de usuarios con validaciones.

Panel de administración para usuarios con rol admin (desde frontend y backend).


---

## Funcionalidades para Usuario Normal (Cliente)

- **Navegación sencilla y clara:**  
  El usuario puede navegar por la librería con un menú de categorías desplegables, barra de búsqueda con sugerencias en tiempo real y acceso rápido a su carrito de compras.

- **Búsqueda avanzada:**  
  Búsqueda por título, autor o palabra clave, con resultados instantáneos que muestran portada, autor, precio y calificación.

- **Visualización de libros:**  
  Los libros se presentan en tarjetas con imagen, título, autor, precio, calificación y botón para agregar al carrito.

- **Carrito de compras flotante:**  
  El usuario puede agregar libros al carrito, modificar cantidades, ver el total actualizado y proceder al pago. Además, se muestra un mensaje de envío gratuito si el monto supera un límite.

- **Cuenta de usuario:**  
  Inicio de sesión para acceder a información personalizada, ver su nombre y correo, y cerrar sesión de forma segura.

- **Carruseles de destacados y últimos lanzamientos:**  
  Se exhiben libros recomendados y novedades mediante carruseles con navegación sencilla.

- **Detalle de libro:**  
  Página individual con información completa del libro, descripción, disponibilidad, precio y opción para agregar al carrito.

- **Checkout y pago:**  
  Formulario para capturar datos de envío y método de pago, resumen del pedido con precios detallados y confirmación.

- **Mensajes y estados claros:**  
  Indicadores de carga, mensajes amigables cuando no hay resultados o stock agotado.

---

## Funcionalidades para Administrador

- **Gestión de catálogo:**  
  Creación, edición y eliminación de libros, incluyendo detalles como título, autor, categoría, precio, stock y descripción.

- **Control de inventario:**  
  Visualización y actualización del stock disponible para cada libro.

- **Gestión de usuarios:**  
  Administración de cuentas de clientes y otros administradores, control de acceso y roles.

- **Visualización de pedidos:**  
  Consulta y seguimiento de pedidos realizados por los clientes, incluyendo estado y detalles.

- **Reportes y estadísticas:**  
  Análisis de ventas, libros más vendidos, y otras métricas para la toma de decisiones.

- **Configuración de la tienda:**  
  Ajustes generales como categorías, políticas de envío, métodos de pago y otras preferencias.

---

## Estructura General del Proyecto

- **Componentes principales:**  
  - `home.component`: Página principal con carruseles y listados.  
  - `libro-detalle.component`: Vista detallada de un libro.  
  - `search-results.component`: Resultados de búsqueda y filtros.  
  - `checkout.component`: Proceso de finalización de compra.  
  - `carrito-flotante.component`: Bolsa de compras accesible desde cualquier página.

- **Servicios:**  
  - Gestión de libros, usuarios, carrito y pedidos.  
  - Comunicación con backend para datos persistentes.

- **Rutas:**  
  Navegación entre páginas principales y funcionales.

- **Estilos y diseño:**  
  Uso de CSS moderno con diseño responsivo y experiencia de usuario optimizada.

---

## Tecnologías usadas

- Angular (TypeScript, HTML, CSS)  
- RxJS para manejo reactivo de datos  
- Formularios reactivos para validación  
- Pipes para formatos de moneda y números  
- Directivas estructurales (`*ngIf`, `*ngFor`) para control de vistas  
- Servicios e inyección de dependencias para lógica compartida

---

## Cómo usar esta aplicación

1. Clonar el repositorio  
2. Ejecutar `npm install` para instalar dependencias  
3. Ejecutar `ng serve` para correr la aplicación en modo desarrollo  
4. Abrir `http://localhost:4200` en el navegador  
5. Navegar como usuario normal para explorar y comprar libros  
6. Iniciar sesión con cuenta de administrador para gestionar la tienda

---

## 🖼️ Capturas de Pantalla

### 🔐 Login y Registro

Pantallas simples y funcionales para iniciar sesión o crear una cuenta nueva.

![Login](src/assets/capturas/login.png)  
![Registro](src/assets/capturas/registro.png)

---

### 🏠 Página de Inicio

Vista principal con el carrusel de libros destacados y últimos lanzamientos.

![Inicio](src/assets/capturas/inicio.png)

---

### 🔍 Búsqueda de Libros

Búsqueda por título, autor o palabra clave con resultados inmediatos.

![Búsqueda](src/assets/capturas/busqueda.png)

---

### 📖 Detalle del Libro

Información completa del libro, stock, descripción y botón para agregar al carrito.

![Detalle del Libro](src/assets/capturas/detalle-libro.png)

---

### 🛒 Carrito de Compras

Bolsa de compras flotante con control de cantidades, subtotal y botón de pagar.

![Carrito](src/assets/capturas/carrito.png)

---

### 💳 Checkout

Formulario para dirección de envío, selección de método de pago y revisión del pedido.

![Checkout](src/assets/capturas/checkout.png)

---

### 🔐 Vista del Administrador (opcional)

Espacio para que los administradores gestionen libros, pedidos y usuarios.

![Administrador](src/assets/capturas/administrador.png)

---

### 📱 Interfaz Responsiva

Diseño adaptable para móviles y tablets.

![Responsivo](src/assets/capturas/responsivo.png)

---
