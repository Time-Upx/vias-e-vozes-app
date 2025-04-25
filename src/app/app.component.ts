import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MenuLateralComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'UPX_IV';
}
