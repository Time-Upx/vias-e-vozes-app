import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService as ApiService_Usuarios } from '../services/api-usuarios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  usuarioLogado: any = null;
  usuarioDetalhado: any = null;
  profileImageSrc: string = 'assets/DefaultProfileImage.png'; // Default Placeholder

  constructor(private router: Router, private apiService: ApiService_Usuarios) { }

  ngOnInit() {
    this.verificarUsuarioLogado();
  }

  verificarUsuarioLogado() {
    const usuarioStorage = localStorage.getItem('usuarioLogado');
    if (usuarioStorage) {
      this.usuarioLogado = JSON.parse(usuarioStorage);
      this.carregarDetalhesUsuario(this.usuarioLogado.id);
    }
  }

  carregarDetalhesUsuario(id: number) {
    this.apiService.listarDetalheUsuario(id).subscribe({
      next: (data) => {
        this.usuarioDetalhado = data;
        this.profileImageSrc = data.profilePicture?.content
          ? `data:image/${data.profilePicture.extension};base64,${data.profilePicture.content}`
          : 'assets/DefaultProfileImage.png';
      },
      error: () => {
        console.error('Erro ao buscar detalhes do usuário.');
      }
    });
  }

  redirecionarParaInicio() {
    this.router.navigate(['/']);
  }

  redirecionarParaMeuPerfil() {
    this.router.navigate(['/meu-perfil']);
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('curtidasComentarios');
    localStorage.removeItem('curtidasContribuicoes');

    this.usuarioLogado = null;
    this.usuarioDetalhado = null;
    this.profileImageSrc = 'assets/DefaultProfileImage.png'; // Reset to default
    alert('✅ Logout realizado com sucesso! Redirecionando...');
    this.router.navigate(['/inicio']);
  }
}