import { Component, OnInit } from '@angular/core';

import { ApiService as ApiService_Propostas } from '../services/api-propostas.service';
import { Contribuições, Link } from '../interfaces/contribuições';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalhes-proposta',
  imports: [CommonModule, HttpClientModule],
  providers: [ApiService_Propostas],
  templateUrl: './detalhes-proposta.component.html',
  styleUrl: './detalhes-proposta.component.css'
})
export class DetalhesPropostaComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private ApiService_Propostas: ApiService_Propostas
  ) { }

  proposta !: Contribuições

  loading = true;
  errorMessage = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ApiService_Propostas.solicitarPropostaPorId(id).subscribe({
        next: (proposta: Contribuições) => {
          this.proposta = proposta;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = 'Erro ao carregar a proposta. Tente novamente!';
          this.loading = false;
        }
      });
    }
  }

  voltar() {
    history.back();
  }
}
