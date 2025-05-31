import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService as ApiService_Propostas } from '../services/api-propostas.service';
import { Contribution_OnRequest, PageableContribution } from '../interfaces/contribuicoes';

@Component({
  selector: 'app-minhas-contribuicoes',
  imports: [CommonModule, FormsModule],
  templateUrl: './minhas-contribuicoes.component.html',
  styleUrl: './minhas-contribuicoes.component.css'
})
export class MinhasContribuicoesComponent implements OnInit {
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedContributions: Contribution_OnRequest[] = [];
  totalPages: number = 0;
  pages: number[] = [];
  contributions: Contribution_OnRequest[] = [];
  usuarioLogadoId: number | null = null;
  errorMessage = '';

  constructor(private router: Router, private ApiService_Propostas: ApiService_Propostas) { }

  ngOnInit(): void {
    const usuarioLogadoString = localStorage.getItem('usuarioLogado');
    if (usuarioLogadoString) {
      const usuarioLogado = JSON.parse(usuarioLogadoString);
      this.usuarioLogadoId = usuarioLogado.id;
      this.buscarMinhasContribuicoes();
    } else {
      this.errorMessage = '⚠️ Você precisa estar logado para visualizar suas contribuições.';
    }
  }

  buscarMinhasContribuicoes(): void {
    this.ApiService_Propostas.listarContribuicoes().subscribe({
      next: (data: PageableContribution) => {
        console.log(this.usuarioLogadoId)
        console.log('Contribuições carregadas:', data);
        this.contributions = data.content.filter(contrib => contrib.author.id === this.usuarioLogadoId);
        this.carregarDetalhesDasContribuicoes();
      },
      error: () => this.errorMessage = 'Erro ao carregar suas contribuições.'
    });
  }

  carregarDetalhesDasContribuicoes(): void {
    this.contributions.forEach(contribuicao => {
      this.ApiService_Propostas.listarDetalhesContribuicao(contribuicao.id).subscribe({
        next: (detalhes) => {
          contribuicao.imageUrl = detalhes.image?.content
            ? `data:image/${detalhes.image.extension};base64,${detalhes.image.content}`
            : 'assets/DefaultImage.png';

          contribuicao.description = detalhes.description;
        },
        error: () => {
          contribuicao.imageUrl = 'assets/DefaultImage.png';
          contribuicao.description = 'Descrição não disponível.';
        }
      });
    });
    this.calculatePagination();
  }

  filterContributions(): void {
    const filtered = this.contributions.filter(contrib =>
      contrib.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.calculatePagination(filtered);
  }

  calculatePagination(data = this.contributions): void {
    this.totalPages = Math.ceil(data.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginatedContributions = data.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.calculatePagination();
  }

  navigateToAddContribution(): void {
    this.router.navigate(['/adicionar-proposta']);
  }

  navigateToDetails(contribId: number): void {
    this.router.navigate(['/detalhes-proposta', contribId]);
  }
}