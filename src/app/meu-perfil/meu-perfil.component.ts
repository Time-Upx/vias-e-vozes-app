import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService as ApiService_Usuarios } from '../services/api-usuarios.service';

@Component({
  selector: 'app-meu-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css']
})
export class MeuPerfilComponent implements OnInit {
  profileData = {
    profileImage: "", // URL ou base64
    fullName: '',
    role: 'Contribuidor', // Valor estático
    timeOfArrival: '', // Substituindo data de nascimento
    email: '',
    isAnonymous: false,
    publishedContributions: 0,
    savedContributions: 0
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  isModified: boolean = false;
  showPasswordReset: boolean = false;
  userId: number = 1; // Substituir pelo ID correto do usuário

  constructor(private apiService: ApiService_Usuarios) { }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.apiService.listarDetalheUsuario(this.userId).subscribe((user) => {
      this.profileData.fullName = user.name;
      this.profileData.role = user.role;

      this.profileData.email = user.email;
      this.profileData.isAnonymous = user.preferAnonymous;
      this.profileData.profileImage = user.profilePicture.content
        ? `data:image/${user.profilePicture.extension};base64,${user.profilePicture.content}`
        : 'assets/DefaultProfileImage.png';

      // Buscar a data de chegada pelo ID do usuário
      this.loadUserArrivalTime();
    });
  }

  loadUserArrivalTime(): void {
    this.apiService.listarUsuarios().subscribe((usuarios) => {
      const usuarioEncontrado = usuarios.content.find(user => user.id === this.userId);
      console.log(usuarioEncontrado);

      this.profileData.timeOfArrival = usuarioEncontrado?.timeOfArrival
        ? new Date(usuarioEncontrado.timeOfArrival).toISOString().split('T')[0]
        : 'Não informado';
    });
  }

  markAsModified(): void {
    this.isModified = true;
  }

  saveProfile(): void {
    const usuarioAtualizado: any = {
      name: this.profileData.fullName,
      role: this.profileData.role,
      email: this.profileData.email,
      preferAnonymous: this.profileData.isAnonymous
    };

    this.apiService.atualizarUsuario(this.userId, usuarioAtualizado).subscribe(() => {
      alert('Perfil salvo com sucesso!');
      this.isModified = false;
    });
  }

  togglePasswordReset(): void {
    this.showPasswordReset = !this.showPasswordReset;
    if (!this.showPasswordReset) {
      this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    }
  }

  confirmPasswordReset(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('A nova senha e a confirmação não coincidem!');
      return;
    }

    const senhaAtualizada = { password: this.passwordData.newPassword };

    this.apiService.atualizarUsuario(this.userId, senhaAtualizada).subscribe(() => {
      alert('Senha redefinida com sucesso!');
      this.togglePasswordReset();
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      this.apiService.uploadImagemUsuario(this.userId, file, `Imagem de Perfil - ${this.profileData.fullName}`).subscribe(() => {
        alert('Imagem atualizada com sucesso!');
        this.loadUserDetails();
      });
    }
  }
}