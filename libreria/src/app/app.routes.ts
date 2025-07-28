import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { HomeComponent } from './pages/home/home';
import { AuthGuard } from './pages/auth/guards/auth-guard';
import { AdminGuard } from './pages/auth/guards/admin-guard';
import { HomeAdmin } from './pages/home-admin/home-admin';
import { CarritoComponent } from './pages/carrito/carrito';
import { CheckoutComponent } from './pages/checkout/checkout';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation';
import { SearchResultsComponent } from './pages/search-results/search-results';
import { LibroDetalleComponent } from './pages/libro-detalle/libro-detalle';



export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth', component: Auth },
  { path: 'home', component: HomeComponent },
  { path: 'user', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: HomeAdmin, canActivate: [AdminGuard] },
  { path: 'carrito', component: CarritoComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchResultsComponent },
  { path: 'libro/:id', component: LibroDetalleComponent },
  { path: '**', redirectTo: 'auth' },

];