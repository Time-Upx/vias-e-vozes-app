import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adicionar-proposta',
  imports: [CommonModule, FormsModule],
  templateUrl: './adicionar-proposta.component.html',
  styleUrl: './adicionar-proposta.component.css'
})
export class AdicionarPropostaComponent {
  imagePreview: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  clearForm(form: any): void {
    form.resetForm();
    this.imagePreview = null;
    const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  onSubmit(): void {
    console.log('Formulário enviado com sucesso!');
  }
}