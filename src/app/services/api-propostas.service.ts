import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Contribution_OnSave,
  Contribution_OnUpdate,
  Contribution_OnDetailedRequest,
  PageableContribution,
} from '../interfaces/contribuicoes';
import { Usuario_OnRequest } from '../interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  salvarContribuicao(contribuicao: Contribution_OnSave): Observable<Contribution_OnDetailedRequest> {
    return this.http.post<Contribution_OnDetailedRequest>(`${this.apiUrl}/contribution`, contribuicao);
  }

  atualizarContribuicao(id: number, contribuicao: Contribution_OnUpdate): Observable<Contribution_OnDetailedRequest> {
    return this.http.put<Contribution_OnDetailedRequest>(`${this.apiUrl}/contribution/${id}`, contribuicao);
  }

  listarContribuicoes(): Observable<PageableContribution> {
    return this.http.get<PageableContribution>(`${this.apiUrl}/contribution`);
  }

  listarDetalhesContribuicao(id: number): Observable<Contribution_OnDetailedRequest> {
    return this.http.get<Contribution_OnDetailedRequest>(`${this.apiUrl}/contribution/${id}`);
  }

  desativarContribuicao(id: number): Observable<Contribution_OnDetailedRequest> {
    return this.http.delete<Contribution_OnDetailedRequest>(`${this.apiUrl}/contribution/${id}`);
  }

  ativarContribuicao(id: number): Observable<Contribution_OnDetailedRequest> {
    return this.http.patch<Contribution_OnDetailedRequest>(`${this.apiUrl}/contribution/${id}`, {});
  }

  adicionarCurtidaContribuicao(id: number): Observable<Contribution_OnDetailedRequest> {
    return this.http.post<Contribution_OnDetailedRequest>(`${this.apiUrl}/contribution/${id}/like`, {});
  }

  removerCurtidaContribuicao(id: number): Observable<Contribution_OnDetailedRequest> {
    return this.http.delete<Contribution_OnDetailedRequest>(`${this.apiUrl}/contribution/${id}/like`);
  }

  uploadImagemContribuicao(id: number, imageFile: File, placeholder: string): Observable<Contribution_OnDetailedRequest> {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('placeholder', placeholder);

    return this.http.patch<Contribution_OnDetailedRequest>(`${this.apiUrl}/contribution/${id}/image`, formData);
  }

  listarUsuariosFavoritadosContribucao(id: number): Observable<Usuario_OnRequest[]> {
    return this.http.get<Usuario_OnRequest[]>(`${this.apiUrl}/contribution/${id}/favorites`);
  }
}