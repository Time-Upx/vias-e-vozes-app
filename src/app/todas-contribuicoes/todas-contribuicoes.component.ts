import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService as ApiService_Propostas } from '../services/api-propostas.service';
import { ApiService as ApiService_Usuarios } from '../services/api-usuarios.service';
import { Contribution_OnDetailedRequest, Contribution_OnRequest, PageableContribution } from '../interfaces/contribuicoes';
import { Usuario_OnDetailedRequest } from '../interfaces/usuarios';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-todas-contribuicoes',
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [ApiService_Propostas, ApiService_Usuarios],
  templateUrl: './todas-contribuicoes.component.html',
  styleUrl: './todas-contribuicoes.component.css'
})
export class TodasContribuicoesComponent implements OnInit {
  contributions: Contribution_OnRequest[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedContributions: Contribution_OnRequest[] = [];
  totalPages: number = 0;
  pages: number[] = [];
  sortKey: keyof Contribution_OnRequest = 'timeOfCreation';
  sortDirection: 'asc' | 'desc' = 'desc';
  filteredContributions: Contribution_OnRequest[] = [];


  constructor(
    private ApiService_Propostas: ApiService_Propostas,
    private ApiService_Usuarios: ApiService_Usuarios
  ) { }

  ngOnInit(): void {
    this.ApiService_Propostas.listarContribuicoes().subscribe({
      next: (data: PageableContribution) => {
        this.contributions = data.content;
        this.totalPages = data.totalPages;
        this.fetchContributionDetails(); // Atualizado para buscar detalhes individuais
        this.applyFiltersAndSorting();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao obter as contribuições:', error);
      }
    });
  }

  fetchContributionDetails(): void {
    this.contributions.forEach((contribution) => {
      this.ApiService_Propostas.listarDetalhesContribuicao(contribution.id).subscribe({
        next: (details: Contribution_OnDetailedRequest) => {
          contribution.imageContent = details.image;
          contribution.quantityOfLikes = details.quantityOfLikes;

          // Constrói a URL da imagem se existir conteúdo
          console.log(details);
          if (contribution.imageContent && contribution.imageContent.content) {
            contribution['imageUrl'] = `data:image/${contribution.imageContent.extension};base64,${contribution.imageContent.content}`;
          } else {
            contribution['imageUrl'] = 'assets/ImagePlaceholder.jpg'; // Imagem padrão caso não tenha
          }
        },
        error: () => {
          contribution['imageUrl'] = 'assets/ImagePlaceholder.jpg'; // Fallback caso a requisição falhe
        }
      });
    });
  }

  getSortIcon(key: keyof Contribution_OnRequest): string {
    if (this.sortKey !== key) return 'bi-filter'; // Ícone padrão se não for o filtro ativo
    return this.sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  getTranslatedType(type: string): string {
    const translations: { [key: string]: string } = {
      "IMPROVEMENT": "Melhoria",
      "COMPLAINT": "Reclamação"
    };
    return translations[type] || type; // Caso o valor seja inesperado, mantém o original
  }

  getTranslatedStatus(status: string): string {
    const translations: { [key: string]: string } = {
      "ANALYSING": "Em análise"
    };
    return translations[status] || status;
  }

  fetchAuthors(): void {
    this.contributions.forEach((contribution) => {
      this.ApiService_Usuarios.listarDetalheUsuario(contribution.author.id).subscribe({
        next: (userData: Usuario_OnDetailedRequest) => {
          contribution['authorName'] = userData.name;
        },
        error: () => {
          contribution['authorName'] = 'Usuário desconhecido';
        }
      });
    });
  }

  sortContributions(): void {
    this.contributions.sort((a, b) => {
      const valueA = a[this.sortKey];
      const valueB = b[this.sortKey];

      if (this.sortKey === 'author') {
        return this.sortDirection === 'asc' ? a.author.id - b.author.id : b.author.id - a.author.id;
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return this.sortDirection === 'asc' ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
      return 0;
    });

    this.calculatePagination();
  }

  applyFiltersAndSorting(): void {
    let filtered = this.contributions;

    if (this.searchQuery.trim()) {
      filtered = this.contributions.filter(contribution =>
        contribution.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const valueA = a[this.sortKey];
      const valueB = b[this.sortKey];

      if (this.sortKey === 'author') {
        return this.sortDirection === 'asc' ? a.author.id - b.author.id : b.author.id - a.author.id;
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return this.sortDirection === 'asc' ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
      return 0;
    });

    this.filteredContributions = filtered;
    this.calculatePagination();
  }

  filterContributions(): void {
    this.applyFiltersAndSorting();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredContributions.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginatedContributions = this.filteredContributions.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.calculatePagination();
  }

  changeSorting(key: keyof Contribution_OnRequest): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSorting();
  }

}