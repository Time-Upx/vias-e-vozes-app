import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meu-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './meu-perfil.component.html',
  styleUrl: './meu-perfil.component.css'
})
export class MeuPerfilComponent {
  profileData = {
    profileImage: "", // URL ou base64 da imagem de perfil
    fullName: '',
    displayName: '',
    age: null,
    address: '',
    publishedContributions: 0, // Exemplo inicial
    savedContributions: 0 // Exemplo inicial
  };

  isModified: boolean = false; // Controla se há modificações no perfil

  // Manipula o upload de imagem
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profileData.profileImage = reader.result as string;
        this.markAsModified();
      };
      reader.readAsDataURL(file);
    }
  }

  // Marca o perfil como modificado
  markAsModified(): void {
    this.isModified = true;
  }

  // Salva as alterações
  saveProfile(): void {
    console.log('Dados do perfil salvos:', this.profileData);
    alert('Perfil salvo com sucesso!');
    this.isModified = false; // Reseta o estado de modificado após salvar
  }
}