import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario_OnRequest, Comentario_OnSave, Pageable_Comentarios } from '../interfaces/comentarios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  listarComentariosContribuicao(id: number): Observable<Pageable_Comentarios> {
    return this.http.get<Pageable_Comentarios>(`${this.apiUrl}/contribution/${id}/comments`);
  }

  listarTodosComentarios(): Observable<Pageable_Comentarios> {
    return this.http.get<Pageable_Comentarios>(`${this.apiUrl}/comment`);
  }

  salvarComentarioContribuicao(comentario: Comentario_OnSave): Observable<Comentario_OnRequest> {
    return this.http.post<Comentario_OnRequest>(`${this.apiUrl}/comment`, comentario);
  }

  editarComentarioContribuicao(comentarioId: number, comentario: string): Observable<Comentario_OnRequest> {
    return this.http.patch<Comentario_OnRequest>(`${this.apiUrl}/comment/${comentarioId}/edit`, { "body": comentario });
  }

  pegarDetalhesComentarioContribuicao(comentarioId: number): Observable<Comentario_OnRequest> {
    return this.http.get<Comentario_OnRequest>(`${this.apiUrl}/comment/${comentarioId}`);
  }

  removerComentarioContribuicao(comentarioId: number): Observable<Comentario_OnRequest> {
    return this.http.delete<Comentario_OnRequest>(`${this.apiUrl}/comment/${comentarioId}/remove`);
  }

  desativarComentarioContribuicao(comentarioId: number): Observable<Comentario_OnRequest> {
    return this.http.delete<Comentario_OnRequest>(`${this.apiUrl}/comment/${comentarioId}`);
  }

  ativarComentarioContribuicao(comentarioId: number): Observable<Comentario_OnRequest> {
    return this.http.patch<Comentario_OnRequest>(`${this.apiUrl}/comment/${comentarioId}`, {});
  }

  adicionarCurtidaComentarioContribuicao(comentarioId: number): Observable<Comentario_OnRequest> {
    return this.http.post<Comentario_OnRequest>(`${this.apiUrl}/comment/${comentarioId}/like`, {});
  }

  removerCurtidaComentarioContribuicao(comentarioId: number): Observable<Comentario_OnRequest> {
    return this.http.delete<Comentario_OnRequest>(`${this.apiUrl}/comment/${comentarioId}/like`);
  }
}