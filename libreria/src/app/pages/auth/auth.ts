import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class Auth {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isRegisterActive = false;
  loginError: string | null = null;
  registerError: string | null = null;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  showLoginPassword = false; 
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user'] // ← por defecto
    });

  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.markFormAsTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.loginError = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        const user = this.authService.getCurrentUser();
        const role = user?.role;

        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.loginError = err?.error?.message || 'Error al iniciar sesión';
        this.isLoading = false;
      }
    });
  }



  onRegister() {
    if (this.registerForm.invalid) {
      this.markFormAsTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.registerError = null;

    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: () => {
        this.setRegister(false); // Cambia al formulario de login
        this.loginForm.patchValue({
          email: formData.email,
          password: formData.password
        });
        this.registerForm.reset({ role: 'user' }); // ← mantenemos el role oculto
        this.loginError = '¡Registro exitoso! Ya puedes iniciar sesión.';
        this.isLoading = false;
      },
      error: (err) => {
        this.registerError = err?.error?.message || 'Error al registrarse. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }



  getRegisterErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);

    if (!control) return 'Campo inválido';
    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('email')) return 'Email no válido';
    if (control.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength']?.requiredLength} caracteres`;
    }

    return '';
  }
  private markFormAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  setRegister(active: boolean) {
    this.isRegisterActive = active;
    this.loginError = null;
    this.registerError = null;
  }
}

export { AuthService };
