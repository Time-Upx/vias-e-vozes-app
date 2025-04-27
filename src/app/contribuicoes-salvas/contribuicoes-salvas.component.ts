import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contribuicoes-salvas',
  imports: [CommonModule, FormsModule],
  templateUrl: './contribuicoes-salvas.component.html',
  styleUrl: './contribuicoes-salvas.component.css'
})
export class ContribuicoesSalvasComponent implements OnInit {
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4; // Quantidade de contribuições por página
  paginatedContributions: any[] = [];
  totalPages: number = 0;
  pages: number[] = [];

  contributions: any[] = [
    { title: 'Contribuição 1', description: 'Descrição da contribuição 1', image: "https://placehold.co/300x300" },
    { title: 'Contribuição 2', description: 'Descrição da contribuição 2', image: "https://placehold.co/300x300" },
    { title: 'Contribuição 3', description: 'Descrição da contribuição 3', image: "https://placehold.co/300x300" },
    { title: 'Contribuição 4', description: 'Descrição da contribuição 4', image: "https://placehold.co/300x300" },
    { title: 'Contribuição 5', description: 'Descrição da contribuição 5', image: "https://placehold.co/300x300" }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.calculatePagination();
  }

  filterContributions(): void {
    const filtered = this.contributions.filter((contribution) =>
      contribution.title.toLowerCase().includes(this.searchQuery.toLowerCase())
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
}