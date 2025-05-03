import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService as ApiService_Propostas } from '../services/api-propostas.service';
import { Contribuições } from '../interfaces/contribuições';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-todas-contribuicoes',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  providers: [ApiService_Propostas],
  templateUrl: './todas-contribuicoes.component.html',
  styleUrl: './todas-contribuicoes.component.css'
})
export class TodasContribuicoesComponent implements OnInit {
  constructor(
    private router: Router,
    private ApiService_Propostas: ApiService_Propostas
  ) { }
  contributions: Contribuições[] = [];

  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5; // Limite de contribuições por página
  paginatedContributions: any[] = [];
  totalPages: number = 0;
  pages: number[] = [];

  ngOnInit(): void {
    this.ApiService_Propostas.solicitarPropostas().subscribe(
      {
        next: (data: Contribuições[]) => {
          this.contributions = data;
          console.log('Contribuições recebidas:', this.contributions);
          this.calculatePagination(this.contributions);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao obter as contribuições:', error);
        }
      }
    );
  }

  filterContributions(): void {
    const filtered = this.contributions.filter((contribution) =>
      contribution.name.toLowerCase().includes(this.searchQuery.toLowerCase())
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
}