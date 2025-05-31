import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService as ApiService_Propostas } from '../services/api-propostas.service';
import { Contribution_OnDetailedRequest, Contribution_OnSave } from '../interfaces/contribuicoes';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Link } from '../interfaces/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adicionar-proposta',
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [ApiService_Propostas],
  templateUrl: './adicionar-proposta.component.html',
  styleUrls: ['./adicionar-proposta.component.css']
})
export class AdicionarPropostaComponent {
  constructor(private router: Router, private ApiService_Propostas: ApiService_Propostas) { }

  imageFile: File | null = null;
  imagePreview: string | null = null;

  proposalData: Contribution_OnSave = {
    title: "",
    imagePlaceholder: "",
    description: "",
    type: "IMPROVEMENT",
    links: [],
    authorId: this.getUserId(), // Preenchendo automaticamente com o ID do usuário logado
    isAnonymous: false,
    address: {
      street: "",
      number: null,
      neighborhood: "",
      city: "",
      state: "",
      complement: "",
      cep: null
    }
  };

  getUserId(): number {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    return usuarioLogado ? JSON.parse(usuarioLogado).id : 0; // Retorna o ID do usuário ou 0 (caso não encontrado)
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.imageFile = input.files[0]; // Armazena o arquivo para posterior envio
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  formatarCEP(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    event.target.value = valor;
  }

  addLink(): void {
    this.proposalData.links.push({ display: '', url: '' });
  }

  removeLink(index: number): void {
    this.proposalData.links.splice(index, 1);
  }

  trackByFn(index: number, item: Link): number {
    return index;
  }

  clearForm(form: NgForm): void {
    this.proposalData = {
      title: "",
      imagePlaceholder: "",
      description: "",
      type: "IMPROVEMENT",
      links: [],
      authorId: this.getUserId(),
      isAnonymous: true,
      address: {
        street: "",
        number: null,
        neighborhood: "",
        city: "",
        state: "",
        complement: "",
        cep: null
      }
    };

    const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    this.imagePreview = null;
    this.imageFile = null;
  }

  isAddressValid(): boolean {
    return !!(
      this.proposalData.address.street &&
      this.proposalData.address.number &&
      this.proposalData.address.neighborhood &&
      this.proposalData.address.city &&
      this.proposalData.address.state &&
      this.proposalData.address.cep
    );
  }

  isValidUrl(url: string): boolean {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // Protocolo
      '((([a-zA-Z0-9-_]+)\\.)+[a-zA-Z]{2,})' + // Domínio
      '(\\/[\\w\\-\\.\\?\\=]*)*$', // Path opcional
      'i'
    );
    return urlPattern.test(url);
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.proposalData.title ||
      !this.proposalData.description || !this.proposalData.address.street
      || !this.proposalData.address.city || !this.proposalData.address.state) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    if (!this.isAddressValid()) {
      alert('O endereço informado não é válido. Preencha corretamente antes de enviar.');
      return;
    }

    if (this.proposalData.links.some(link => !this.isValidUrl(link.url))) {
      alert('Um ou mais links inseridos não são válidos. Verifique e tente novamente!');
      return;
    }

    console.log('Proposta enviada:', this.proposalData);

    this.proposalData.imagePlaceholder = `Imagem de Contribuição - ${this.proposalData.title}`;

    // Enviar a proposta primeiro
    this.ApiService_Propostas.salvarContribuicao(this.proposalData).subscribe({
      next: (response: Contribution_OnDetailedRequest) => {
        console.log('Proposta salva com sucesso:', response);
        alert('Proposta enviada com sucesso!');

        // Se houver uma imagem selecionada, enviá-la separadamente
        if (this.imageFile) {
          this.uploadImage(response.id);
        }

        // Redirecionando para a página de detalhes da proposta
        this.router.navigate(['/detalhes-proposta', response.id]);

      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao enviar proposta:', err);
        alert('Falha ao enviar a proposta. Tente novamente!');
      }
    });
  }

  uploadImage(proposalId: number): void {
    if (!this.imageFile) return;

    const placeholder = `Imagem de Contribuição - ${this.proposalData.title}`;

    this.ApiService_Propostas.uploadImagemContribuicao(proposalId, this.imageFile, placeholder).subscribe({
      next: (result: Contribution_OnDetailedRequest) => {
        console.log('Imagem enviada com sucesso!');
        console.log(result);
        alert('Imagem anexada à proposta!');

        window.location.reload(); // Recarrega a página para mostrar a imagem atualizada
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao enviar imagem:', err);
        alert('Falha ao enviar imagem. Tente novamente!');
      }
    });
  }
}