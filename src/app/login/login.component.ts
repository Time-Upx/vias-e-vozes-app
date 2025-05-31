import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from '../services/auth-guard.service';
import { Usuario_OnLoginValidation } from '../interfaces/usuarios';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, HttpClientModule, ReactiveFormsModule],
  providers: [AuthGuardService],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  formulario: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private AuthGuardService: AuthGuardService) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  entrar() {
    if (this.formulario.valid) {
      const { email, password } = this.formulario.value;
      const loginData: Usuario_OnLoginValidation = {
        id: undefined,
        email: email,
        password: password
      };

      this.AuthGuardService.validarLogin(loginData).subscribe({
        next: (usuario) => {
          if (usuario.result && usuario.user) {
            loginData['id'] = usuario.user.id;

            console.log(loginData);

            alert('✅ Login realizado com sucesso! Redirecionando para sua conta...');
            localStorage.setItem('usuarioLogado', JSON.stringify(loginData));
            this.router.navigate(['/inicio']).then(() => {
              window.location.reload();
            });
          } else {
            alert('❌ Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
            console.error('Usuário não encontrado ou credenciais inválidas.');
          }
        },
        error: () => {
          alert('⚠️ Erro ao tentar fazer login. Por favor, tente novamente mais tarde.');
          console.error('Erro ao validar login');
        }
      });
    } else {
      alert('⚠️ Preencha todos os campos corretamente antes de continuar.');
    }
  }
}