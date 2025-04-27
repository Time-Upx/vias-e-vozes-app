import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meu-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css']
})
export class MeuPerfilComponent {
  profileData = {
    profileImage: "", // URL ou base64
    fullName: '',
    displayName: '',
    role: 'Contribuidor', // Valor estático
    birthDate: '',
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

  // Manipula upload de imagem
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileData.profileImage = reader.result as string;
        this.markAsModified();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Marca o formulário como modificado
  markAsModified(): void {
    this.isModified = true;
  }

  // Salva as alterações do perfil
  saveProfile(): void {
    console.log('Dados do perfil salvos:', this.profileData);
    alert('Perfil salvo com sucesso!');
    this.isModified = false;
  }

  // Alterna a exibição dos campos de redefinição de senha
  togglePasswordReset(): void {
    this.showPasswordReset = !this.showPasswordReset;
    if (!this.showPasswordReset) {
      this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    }
  }

  // Confirma a redefinição de senha
  confirmPasswordReset(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('A nova senha e a confirmação não coincidem!');
      return;
    }
    console.log('Senha redefinida com sucesso:', this.passwordData);
    alert('Senha redefinida com sucesso!');
    this.togglePasswordReset();
  }
}