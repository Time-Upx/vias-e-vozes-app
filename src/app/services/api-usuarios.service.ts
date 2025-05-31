import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Usuario_OnSave,
  Usuario_OnUpdate,
  Usuario_OnRequest,
  Usuario_OnDetailedRequest,
  PageableUsuarios
} from '../interfaces/usuarios';
import { Contribution_OnRequest, PageableContribution } from '../interfaces/contribuicoes';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  salvarUsuario(usuario: Usuario_OnSave): Observable<Usuario_OnDetailedRequest> {
    return this.http.post<Usuario_OnDetailedRequest>(`${this.apiUrl}/user`, usuario);
  }

  atualizarUsuario(id: number, usuario: Usuario_OnUpdate): Observable<Usuario_OnDetailedRequest> {
    return this.http.put<Usuario_OnDetailedRequest>(`${this.apiUrl}/user/${id}`, usuario);
  }

  listarUsuarios(): Observable<PageableUsuarios> {
    return this.http.get<PageableUsuarios>(`${this.apiUrl}/user`);
  }

  listarDetalheUsuario(id: number): Observable<Usuario_OnDetailedRequest> {
    return this.http.get<Usuario_OnDetailedRequest>(`${this.apiUrl}/user/${id}`);
  }

  desativarUsuario(id: number): Observable<Usuario_OnDetailedRequest> {
    return this.http.delete<Usuario_OnDetailedRequest>(`${this.apiUrl}/user/${id}`);
  }

  ativarUsuario(id: number): Observable<Usuario_OnDetailedRequest> {
    return this.http.patch<Usuario_OnDetailedRequest>(`${this.apiUrl}/user/${id}`, {});
  }

  favoritarContribuicao(userId: number, contribId: number): Observable<Usuario_OnDetailedRequest> {
    return this.http.post<Usuario_OnDetailedRequest>(`${this.apiUrl}/user/${userId}/contribution/${contribId}`, {});
  }

  desfavoritarContribuicao(userId: number, contribId: number): Observable<Usuario_OnDetailedRequest> {
    return this.http.delete<Usuario_OnDetailedRequest>(`${this.apiUrl}/user/${userId}/contribution/${contribId}`);
  }

  uploadImagemUsuario(id: number, imageFile: File, placeholder: string): Observable<Usuario_OnDetailedRequest> {
    const formData = new FormData();
    formData.append('file', imageFile); // Nome do campo deve ser 'file' para corresponder ao parâmetro do Spring Boot
    formData.append('placeholder', placeholder);

    return this.http.patch<Usuario_OnDetailedRequest>(`${this.apiUrl}/user/${id}/image`, formData);
  }

  listarContribuicoesFavoritas(id: number): Observable<PageableContribution> {
    return this.http.get<PageableContribution>(`${this.apiUrl}/user/${id}/favorites`);
  }
}