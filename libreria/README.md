## Proyecto Angular: Gestión de Librería

proyecto generado utilizando [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.


## Integrantes del equipo

Martínez López Fátima

Guzmán Jiménez Alary


## Descripción

Esta aplicación web está diseñada para una librería en línea donde usuarios normales (clientes) pueden navegar, buscar y comprar libros fácilmente, y administradores pueden gestionar el catálogo y las operaciones internas. La interfaz es intuitiva, moderna y responsiva para ofrecer la mejor experiencia de usuario.

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

## Notas finales

Esta aplicación está diseñada para brindar una experiencia completa tanto a clientes como a administradores, con funcionalidades pensadas para cubrir el ciclo completo de compra y gestión en una librería online. La interfaz es intuitiva para el usuario final, mientras que las herramientas administrativas permiten un control eficiente y seguro del sistema.

---

## Contacto

Para más información, dudas o sugerencias, puedes contactarnos en: contacto@milibreria.com

