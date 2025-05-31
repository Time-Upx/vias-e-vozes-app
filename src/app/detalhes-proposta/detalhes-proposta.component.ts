import { Component, OnInit } from '@angular/core';

import { ApiService as ApiService_Propostas } from '../services/api-propostas.service';
import { ApiService as ApiService_Comentarios } from '../services/api-comentarios.service';
import { ApiService as ApiService_Usuarios } from '../services/api-usuarios.service';
import { Contribution_OnDetailedRequest, Contribution_OnRequest, PageableContribution } from '../interfaces/contribuicoes';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Comentario_OnRequest, Comentario_OnSave, Pageable_Comentarios } from '../interfaces/comentarios';

import { FormsModule } from '@angular/forms';
import { Usuario_OnDetailedRequest, Usuario_OnRequest } from '../interfaces/usuarios';

@Component({
  selector: 'app-detalhes-proposta',
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [ApiService_Propostas],
  templateUrl: './detalhes-proposta.component.html',
  styleUrl: './detalhes-proposta.component.css'
})
export class DetalhesPropostaComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ApiService_Propostas: ApiService_Propostas,
    private ApiService_Comentarios: ApiService_Comentarios,
    private ApiService_Usuarios: ApiService_Usuarios
  ) { }

  proposta !: Contribution_OnDetailedRequest

  loadingComentarios = true;
  loading = true;
  errorMessage = '';

  comentarios: Comentario_OnRequest[] = [];
  novoComentario = '';
  selectedFile: File | null = null;

  usuarioLogadoId = null;
  contribuicoesFavoritas: PageableContribution = {
    content: [],
    empty: true,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    pageable: {
      offset: 0,
      pageNumber: 0,
      pageSize: 0,
      paged: false,
      sort: {
        sorted: false,
        unsorted: false,
        empty: false
      },
      unpaged: false
    },
    size: 0,
    sort: {
      sorted: false,
      unsorted: false,
      empty: false
    },
    totalElements: 0,
    totalPages: 0
  };

  profileImages: { [key: number]: string } = {};

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Conversão para número

    // Recuperar usuário logado do localStorage
    const usuarioLogadoString = localStorage.getItem('usuarioLogado');
    if (usuarioLogadoString) {
      const usuarioLogado = JSON.parse(usuarioLogadoString);
      this.usuarioLogadoId = usuarioLogado.id; // Pegando ID do usuário logado
    } else {
      console.error('Usuário não encontrado no localStorage.');
      this.usuarioLogadoId = null; // Define como null para evitar erros
    }


    if (id) {
      this.ApiService_Propostas.listarDetalhesContribuicao(id).subscribe({
        next: (proposta: Contribution_OnDetailedRequest) => {
          this.proposta = proposta;
          this.loading = false;

          console.log('Proposta carregada:', this.proposta);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = 'Erro ao carregar a proposta. Tente novamente!';
          this.loading = false;
        }
      });

      this.listarComentarios(id);
      this.listarContribuicoesFavoritas();
    }
  }

  getTranslatedType(type: string): string {
    const translations: { [key: string]: string } = {
      "IMPROVEMENT": "Melhoria",
      "COMPLAINT": "Reclamação"
    };
    return translations[type] || type;
  }

  getTranslatedStatus(status: string): string {
    const translations: { [key: string]: string } = {
      "ANALYSING": "Em análise"
    };
    return translations[status] || status;
  }

  voltar() {
    history.back();
  }

  getProfileImage(authorId: number): void {
    this.ApiService_Usuarios.listarDetalheUsuario(authorId).subscribe({
      next: (usuarioDetalhado) => {
        this.profileImages[authorId] = usuarioDetalhado.profilePicture?.content
          ? `data:image/${usuarioDetalhado.profilePicture.extension};base64,${usuarioDetalhado.profilePicture.content}`
          : 'assets/DefaultProfileImage.png';
      },
      error: () => {
        this.profileImages[authorId] = 'assets/DefaultProfileImage.png';
      }
    });
  }

  listarComentarios(id: number) {
    this.ApiService_Comentarios.listarComentariosContribuicao(id).subscribe({
      next: (data: Pageable_Comentarios) => {
        this.comentarios = data.content.sort((a, b) =>
          new Date(b.timeOfComment).getTime() - new Date(a.timeOfComment).getTime()
        );

        // Carregar imagens de perfil
        this.comentarios.forEach(comentario => this.getProfileImage(comentario.author.id));

        this.loadingComentarios = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar comentários.';
        this.loadingComentarios = false;
      }
    });
  }

  adicionarComentario() {
    if (!this.novoComentario.trim()) return;

    const comentario: Comentario_OnSave = {
      body: this.novoComentario,
      authorId: 1, // ID fictício do usuário logado (substituir com usuário real)
      contributionId: Number(this.route.snapshot.paramMap.get('id'))
    };

    this.ApiService_Comentarios.salvarComentarioContribuicao(comentario).subscribe({
      next: (data) => {
        this.comentarios.unshift(data);
        this.novoComentario = '';
      },
      error: () => {
        this.errorMessage = 'Erro ao adicionar comentário.';
      }
    });
  }

  deletarComentario(comentarioId: number) {
    this.ApiService_Comentarios.removerComentarioContribuicao(comentarioId).subscribe({
      next: () => {
        this.comentarios = this.comentarios.filter(c => c.id !== comentarioId);
      },
      error: () => {
        this.errorMessage = 'Erro ao remover comentário.';
      }
    });
  }

  isLiked(comentarioId: number): boolean {
    const curtidasSalvas = JSON.parse(localStorage.getItem('curtidasComentarios') || '[]');
    return curtidasSalvas.includes(comentarioId);
  }

  alternarCurtida(comentarioId: number) {
    const curtidasSalvas: [number] = JSON.parse(localStorage.getItem('curtidasComentarios') || '[]');

    if (curtidasSalvas.includes(comentarioId)) {
      this.ApiService_Comentarios.removerCurtidaComentarioContribuicao(comentarioId).subscribe({
        next: () => {
          const comentario = this.comentarios.find(c => c.id === comentarioId);
          if (comentario) comentario.quantityOfLikes--;
          localStorage.setItem('curtidasComentarios', JSON.stringify(curtidasSalvas.filter(id => id !== comentarioId)));
        },
        error: () => {
          this.errorMessage = 'Erro ao remover curtida.';
        }
      });
    } else {
      this.ApiService_Comentarios.adicionarCurtidaComentarioContribuicao(comentarioId).subscribe({
        next: () => {
          const comentario = this.comentarios.find(c => c.id === comentarioId);
          if (comentario) comentario.quantityOfLikes++;
          curtidasSalvas.push(comentarioId);
          localStorage.setItem('curtidasComentarios', JSON.stringify(curtidasSalvas));
        },
        error: () => {
          this.errorMessage = 'Erro ao curtir comentário.';
        }
      });
    }
  }

  podeEditarComentario(comentario: Comentario_OnRequest): boolean {
    const agora = new Date();
    const horaDoComentario = new Date(comentario.timeOfComment);
    const diferencaEmMinutos = (agora.getTime() - horaDoComentario.getTime()) / (1000 * 60);

    return diferencaEmMinutos <= 60; // Permite edição apenas na primeira hora
  }

  editarComentario(comentario: Comentario_OnRequest, novoTexto: string) {
    if (!this.podeEditarComentario(comentario)) {
      this.errorMessage = "Você só pode editar o comentário na primeira hora após a publicação.";
      return;
    }

    this.ApiService_Comentarios.editarComentarioContribuicao(comentario.id, novoTexto).subscribe({
      next: (data) => {
        comentario.body = data.body;
        comentario.editando = false; // Volta ao estado normal após edição
      },
      error: () => {
        this.errorMessage = "Erro ao editar comentário.";
      }
    });
  }

  cancelarEdicao(comentario: Comentario_OnRequest) {
    comentario.editando = false;
    comentario.novoTexto = comentario.body; // Restaura o texto original
  }

  isLikedContribuicao(): boolean {
    const curtidasSalvas = JSON.parse(localStorage.getItem('curtidasContribuicoes') || '[]');
    return curtidasSalvas.includes(this.proposta.id);
  }

  alternarCurtidaContribuicao() {
    if (!this.usuarioLogadoId) {
      this.redirecionarParaLogin();
      return;
    }

    const curtidasSalvas: [number] = JSON.parse(localStorage.getItem('curtidasContribuicoes') || '[]');

    if (curtidasSalvas.includes(this.proposta.id)) {
      this.ApiService_Propostas.removerCurtidaContribuicao(this.proposta.id).subscribe(() => {
        this.proposta.quantityOfLikes--;
        localStorage.setItem('curtidasContribuicoes', JSON.stringify(curtidasSalvas.filter(id => id !== this.proposta.id)));
      });
    } else {
      this.ApiService_Propostas.adicionarCurtidaContribuicao(this.proposta.id).subscribe(() => {
        this.proposta.quantityOfLikes++;
        curtidasSalvas.push(this.proposta.id);
        localStorage.setItem('curtidasContribuicoes', JSON.stringify(curtidasSalvas));
      });
    }
  }


  isFavoritaContribuicao(): boolean {
    if (!this.contribuicoesFavoritas) {
      if (this.usuarioLogadoId) {
        this.listarContribuicoesFavoritas(); // Carrega as contribuições favoritas se ainda não estiverem carregadas
      } else return false;
    }
    return this.contribuicoesFavoritas.content.some(contribuicao => contribuicao.id === this.proposta.id);
  }

  listarContribuicoesFavoritas() {
    if (!this.usuarioLogadoId) return;

    this.ApiService_Usuarios.listarContribuicoesFavoritas(this.usuarioLogadoId).subscribe({
      next: (favoritas) => {
        this.contribuicoesFavoritas = favoritas;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar contribuições favoritas.';
      }
    });
  }

  alternarFavoritoContribuicao() {
    if (!this.usuarioLogadoId) {
      this.redirecionarParaLogin();
      return;
    }

    console.log("Alternando favorito para a contribuição:", this.proposta.id);

    if (this.isFavoritaContribuicao()) {
      console.log("Contribuição já está favoritada, desfavoritando...");
      this.ApiService_Usuarios.desfavoritarContribuicao(this.usuarioLogadoId, this.proposta.id).subscribe({
        next: () => {
          this.contribuicoesFavoritas.content = this.contribuicoesFavoritas.content.filter(c => c.id !== this.proposta.id);
        },
        error: (err) => {
          console.error('Erro ao desfavoritar contribuição:', err);
          this.errorMessage = 'Não foi possível desfavoritar a contribuição. Tente novamente!';
        }
      });
    } else {
      const contribuicaoRequest: Contribution_OnRequest = {
        id: this.proposta.id,
        title: this.proposta.title,
        type: this.proposta.type,
        author: this.proposta.author,
        timeOfCreation: this.proposta.timeOfCreation,
        isAnonymous: this.proposta.isAnonymous,
        status: this.proposta.status,
        authorName: this.proposta.isAnonymous ? undefined : this.proposta.author.name,
        imageContent: this.proposta.image,
        quantityOfLikes: this.proposta.quantityOfLikes
      };

      this.ApiService_Usuarios.favoritarContribuicao(this.usuarioLogadoId, this.proposta.id).subscribe({
        next: () => {
          console.log("Contribuição favoritada com sucesso!");
          this.contribuicoesFavoritas.content.push(contribuicaoRequest);
        },
        error: (err) => {
          console.error('Erro ao favoritar contribuição:', err);
          this.errorMessage = 'Não foi possível favoritar a contribuição. Tente novamente!';
        }
      });
    }
  }

  confirmarExclusao(contribId: number) {
    const confirmacao = confirm('Tem certeza que deseja excluir esta contribuição? Esta ação não pode ser desfeita.');

    if (confirmacao) {
      this.desativarContribuicao(contribId);
    }
  }

  desativarContribuicao(id: number) {
    this.ApiService_Propostas.desativarContribuicao(id).subscribe({
      next: () => {
        alert('✅ Contribuição excluída com sucesso!');
        this.router.navigate(['/minhas-contribuicoes']);
      },
      error: () => {
        alert('❌ Erro ao excluir a contribuição. Tente novamente.');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  atualizarImagemContribuicao(): void {
    if (!this.selectedFile) {
      alert('Por favor, selecione uma imagem antes de atualizar.');
      return;
    }

    this.ApiService_Propostas.uploadImagemContribuicao(this.proposta.id, this.selectedFile, "Imagem da Proposta").subscribe({
      next: () => {
        alert('✅ Imagem da contribuição atualizada com sucesso!');
        window.location.reload();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao atualizar imagem:', err);
        alert('❌ Erro ao atualizar a imagem. Tente novamente.');
      }
    });
  }

  redirecionarParaLogin() {
    window.location.href = "/login";
  }
}
