import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contribuições } from '../interfaces/contribuições';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Método GET para obter dados
  solicitarPropostas(): Observable<Contribuições[]> {
    return this.http.get<Contribuições[]>(`${this.apiUrl}/propostas`);
  }

  // Método GET para obter uma proposta específica pelo ID
  solicitarPropostaPorId(id: string): Observable<Contribuições> {
    return this.http.get<Contribuições>(`${this.apiUrl}/propostas/${id}`);
  }

  // Método POST para enviar dados
  salvarProposta(proposta: Contribuições): Observable<Contribuições> {
    return this.http.post<Contribuições>(`${this.apiUrl}/propostas`, JSON.stringify(proposta));
  }
}