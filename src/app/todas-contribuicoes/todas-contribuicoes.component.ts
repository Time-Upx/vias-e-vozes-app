import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todas-contribuicoes',
  imports: [CommonModule, FormsModule],
  templateUrl: './todas-contribuicoes.component.html',
  styleUrl: './todas-contribuicoes.component.css'
})
export class TodasContribuicoesComponent implements OnInit {
  contributions = [
    {
      name: 'João Silva', age: 28, title: 'Contribuição de Projeto', image: "https://placehold.co/300x300"
    },
    {
      name: 'Ana Martins', age: 34, title: 'Contribuição de Design', image: "https://placehold.co/300x300"
    },
    {
      name: 'Carlos Andrade', age: 25, title: 'Contribuição de Desenvolvimento', image: "https://placehold.co/300x300"
    },
    {
      name: 'Mariana Costa', age: 30, title: 'Contribuição de Teste', image: "https://placehold.co/300x300"
    },
    {
      name: 'Lucas Almeida', age: 22, title: 'Contribuição de Documentação', image: "https://placehold.co/300x300"
    },
    {
      name: 'Sofia Ferreira', age: 29, title: 'Contribuição de UX', image: "https://placehold.co/300x300"
    }
  ];

  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5; // Limite de contribuições por página
  paginatedContributions: any[] = [];
  totalPages: number = 0;
  pages: number[] = [];

  ngOnInit(): void {
    this.calculatePagination();
  }

  filterContributions(): void {
    const filtered = this.contributions.filter((contribution) =>
      contribution.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
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