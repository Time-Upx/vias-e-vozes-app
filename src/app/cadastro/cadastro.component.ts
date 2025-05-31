import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService as ApiService_Usuarios } from '../services/api-usuarios.service';
import { HttpClientModule } from '@angular/common/http';
import { Usuario_OnSave } from '../interfaces/usuarios';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService_Usuarios],
  templateUrl: './cadastro.component.html',
})
export class CadastroComponent {
  formulario: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private ApiService_Usuarios: ApiService_Usuarios) {
    this.formulario = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      preferAnonymous: [false]
    }, { validators: this.validarSenha });
  }

  validarSenha(group: FormGroup) {
    const senha = group.get('password')?.value;
    const confirmarSenha = group.get('confirmPassword')?.value;
    return senha === confirmarSenha ? null : { senhaDiferente: true };
  }

  cadastrar() {
    if (this.formulario.valid) {
      const dadosCadastro: Usuario_OnSave = {
        ...this.formulario.value,
        picturePlaceholder: `Imagem de Perfil - ${this.formulario.value.name}`,
        role: "CONTRIBUTOR"
      };

      this.ApiService_Usuarios.salvarUsuario(dadosCadastro).subscribe({
        next: () => {
          alert('✅ Cadastro realizado com sucesso! Faça login para acessar sua conta.');
          this.router.navigate(['/login']); // Redirecionando para a página de login
        },
        error: () => {
          alert('❌ Erro ao realizar cadastro. Verifique os dados e tente novamente.');
          console.error('Erro ao cadastrar usuário');
        }
      });
    } else {
      alert('⚠️ Preencha todos os campos corretamente antes de continuar.');
    }
  }
}