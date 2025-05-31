import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { AdicionarPropostaComponent } from './adicionar-proposta/adicionar-proposta.component';
import { ContribuicoesSalvasComponent } from './contribuicoes-salvas/contribuicoes-salvas.component';
import { DicasUtilizacaoComponent } from './dicas-utilizacao/dicas-utilizacao.component';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { MinhasContribuicoesComponent } from './minhas-contribuicoes/minhas-contribuicoes.component';
import { TodasContribuicoesComponent } from './todas-contribuicoes/todas-contribuicoes.component';
import { DetalhesPropostaComponent } from './detalhes-proposta/detalhes-proposta.component';

import { AuthGuardService } from './services/auth-guard.service';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
    { path: 'adicionar-proposta', component: AdicionarPropostaComponent, canActivate: [AuthGuardService] },
    { path: 'contribuicoes-salvas', component: ContribuicoesSalvasComponent, canActivate: [AuthGuardService] },
    { path: 'dicas-utilizacao', component: DicasUtilizacaoComponent },
    { path: 'meu-perfil', component: MeuPerfilComponent, canActivate: [AuthGuardService] },
    { path: 'minhas-contribuicoes', component: MinhasContribuicoesComponent, canActivate: [AuthGuardService] },
    { path: 'todas-contribuicoes', component: TodasContribuicoesComponent },
    { path: 'detalhes-proposta/:id', component: DetalhesPropostaComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'login', component: LoginComponent },

    { path: '**', redirectTo: '/inicio' }
];