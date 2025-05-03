import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ApiService as ApiService_Propostas } from '../services/api-propostas.service';
import { Contribuições, Link } from '../interfaces/contribuições';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-adicionar-proposta',
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [ApiService_Propostas],
  templateUrl: './adicionar-proposta.component.html',
  styleUrls: ['./adicionar-proposta.component.css']
})
export class AdicionarPropostaComponent {
  constructor(private ApiService_Propostas: ApiService_Propostas) { }

  imagePreview: string | null = null;

  proposalData: Contribuições = {
    name: "",
    description: "",
    type: "melhoria",
    links: [],
    authorId: 0,
    isAnonymous: true,
    address: {
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      CEP: ""
    }
  };

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

  formatarCEP(event: any): void {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen após o quinto dígito
    }
    event.target.value = valor; // Atualiza o valor do campo
  }

  addLink(): void {
    this.proposalData.links.push({ titulo: '', url: '' }); // Adiciona um objeto com título e URL
  }

  removeLink(index: number): void {
    this.proposalData.links.splice(index, 1); // Remove o link pelo índice
  }

  trackByFn(index: number, item: Link): number {
    return index;
  }

  clearForm(form: NgForm): void {
    this.proposalData = {
      name: "",
      description: "",
      type: "melhoria",
      links: [],
      authorId: 0,
      isAnonymous: true,
      address: {
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        CEP: ""
      }
    };

    const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    console.log('Proposta enviada:', this.proposalData);

    // Chama o método salvarProposta do serviço
    this.ApiService_Propostas.salvarProposta(this.proposalData).subscribe({
      next: (response: Contribuições) => {
        // Caso de sucesso
        console.log('Proposta salva com sucesso:', response);
        alert('Proposta enviada com sucesso!');

        this.clearForm(form);
      },
      error: (err: HttpErrorResponse) => {
        // Caso de erro
        console.error('Erro ao enviar proposta:', err);
        alert('Falha ao enviar a proposta. Tente novamente!');
      }
    });
  }
}