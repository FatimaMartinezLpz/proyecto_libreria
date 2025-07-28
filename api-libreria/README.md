# 📚 Proyecto Librería API - Laravel + Sanctum

Este es el backend de una aplicación de librería desarrollado con **Laravel 10**. Permite gestionar libros, usuarios, carritos de compra, pedidos, y autenticación con roles diferenciados (`admin`, `user`). Se utiliza **Laravel Sanctum** para la autenticación vía tokens, ideal para consumir esta API desde un frontend como Angular.

---

## 🚀 Características principales

- 📖 Gestión de libros (CRUD completo para administradores).
- 👤 Autenticación y registro con Laravel Sanctum.
- 🛒 Carrito de compras por usuario autenticado.
- 🧾 Generación de pedidos y control de stock.
- 🛡️ Control de acceso por roles (`admin`, `user`, `editor`).
- 🔍 Búsqueda y visualización de libros sin necesidad de login.
- 📦 Integración lista para frontend Angular.

---

## 🏗️ Estructura de base de datos

### 📘 Books
- `title`, `author`, `description`, `category`, `price`, `stock`, `cover_url`

### 👤 Users
- `name`, `email`, `password`, `role (admin | user)`

### 🛒 CartItems
- `user_id`, `book_id`, `quantity`, `unit_price`, `total_price`

### 📦 Orders & OrderItems
- Orders: `user_id`, `total`, `status`, `shipping_address`, `payment_method`
- OrderItems: `order_id`, `book_id`, `quantity`, `unit_price`, `total_price`

---

## 🛡️ Roles

- **admin**: acceso completo a usuarios y libros.
- **editor**: acceso parcial a la gestión de libros.
- **user**: puede comprar, ver libros y administrar su carrito.

---

## 🔑 Autenticación

Se utiliza **Laravel Sanctum** para generar tokens de sesión:

```http
POST /api/register
POST /api/login
POST /api/logout (requiere token)

