import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects === '/auth') {
          document.body.classList.add('fondo-login');
        } else {
          document.body.classList.remove('fondo-login');
        }
      });
  }
}
