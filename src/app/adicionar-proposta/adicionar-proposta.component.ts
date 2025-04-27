import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

interface PropostaData {
  tipo: string; // Tipo da proposta (ex: melhoria, denuncia, etc.)
  titulo: string; // Título da proposta
  descricao: string; // Descrição da proposta
  endereco: string; // Endereço relacionado à proposta
  links: string[]; // Links adicionais relacionados à proposta
}

@Component({
  selector: 'app-adicionar-proposta',
  imports: [CommonModule, FormsModule],
  templateUrl: './adicionar-proposta.component.html',
  styleUrls: ['./adicionar-proposta.component.css']
})
export class AdicionarPropostaComponent {
  imagePreview: string | null = null;

  proposalData: PropostaData = {
    tipo: 'melhoria', // Valor padrão
    titulo: '',
    descricao: '',
    endereco: '',
    links: [] // Inicializa como uma array vazia
  };

  // Função para rastrear itens pelo índice
  trackByFn(index: number, item: string): number {
    return index;
  }

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

  addLink(): void {
    this.proposalData.links.push(''); // Adiciona um novo campo de link
  }

  removeLink(index: number): void {
    this.proposalData.links.splice(index, 1); // Remove o link pelo índice
  }

  clearForm(form: NgForm): void {
    form.resetForm();
    this.proposalData = {
      tipo: 'melhoria', // Reseta com valor padrão
      titulo: '',
      descricao: '',
      endereco: '',
      links: [] // Reseta como uma array vazia
    };
    const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }


  onSubmit(form: NgForm): void {
    console.log('Proposta enviada:', this.proposalData);
    alert('Proposta enviada com sucesso!');
  }
}