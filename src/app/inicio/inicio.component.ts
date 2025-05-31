import { Component, OnInit } from '@angular/core';
import { ApiService as ApiService_Propostas } from '../services/api-propostas.service';
import { Contribution_OnRequest, PageableContribution } from '../interfaces/contribuicoes';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  todasContribuicoes: Contribution_OnRequest[] = [];
  maisCurtidas: Contribution_OnRequest[] = [];
  ultimasContribuicoes: Contribution_OnRequest[] = [];
  errorMessage = '';

  constructor(private ApiService_Propostas: ApiService_Propostas) { }

  ngOnInit() {
    this.carregarContribuicoes();
  }

  carregarDetalhesContribuicao(contribuicao: Contribution_OnRequest) {
    this.ApiService_Propostas.listarDetalhesContribuicao(contribuicao.id).subscribe({
      next: (detalhes) => {
        contribuicao.imageUrl = detalhes.image?.content
          ? `data:image/${detalhes.image.extension};base64,${detalhes.image.content}`
          : 'assets/ImagePlaceholder.jpg';
      },
      error: () => {
        contribuicao.imageUrl = 'assets/ImagePlaceholder.jpg';
      }
    });
  }

  carregarContribuicoes() {
    this.ApiService_Propostas.listarContribuicoes().subscribe({
      next: (data: PageableContribution) => {
        this.todasContribuicoes = data.content;
        this.filtrarMaisCurtidas();
        this.filtrarUltimasContribuicoes();
      },
      error: () => this.errorMessage = "Erro ao carregar contribuições."
    });
  }

  filtrarMaisCurtidas() {
    this.maisCurtidas = [...this.todasContribuicoes]
      .sort((a, b) => (b.quantityOfLikes || 0) - (a.quantityOfLikes || 0))
      .slice(0, 4);

    // Buscar detalhes para cada uma e carregar imagem correta
    this.maisCurtidas.forEach(contribuicao => this.carregarDetalhesContribuicao(contribuicao));
  }

  filtrarUltimasContribuicoes() {
    this.ultimasContribuicoes = [...this.todasContribuicoes]
      .sort((a, b) => new Date(b.timeOfCreation).getTime() - new Date(a.timeOfCreation).getTime())
      .slice(0, 5);

    // Buscar detalhes para cada uma e carregar imagem correta
    this.ultimasContribuicoes.forEach(contribuicao => this.carregarDetalhesContribuicao(contribuicao));
  }
}