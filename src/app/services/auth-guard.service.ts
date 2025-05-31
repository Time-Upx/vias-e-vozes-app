import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario_OnLoginValidation, Usuario_OnLoginResponse } from '../interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  private apiUrl = 'http://localhost:8080';

  constructor(private router: Router, private http: HttpClient) { }

  canActivate(): boolean {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  validarLogin(loginData: Usuario_OnLoginValidation): Observable<Usuario_OnLoginResponse> {
    return this.http.post<Usuario_OnLoginResponse>(`${this.apiUrl}/user/loggin`, loginData);
  }
}