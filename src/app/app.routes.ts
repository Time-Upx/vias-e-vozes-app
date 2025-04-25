import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { AdicionarPropostaComponent } from './adicionar-proposta/adicionar-proposta.component';
import { ContribuicoesSalvasComponent } from './contribuicoes-salvas/contribuicoes-salvas.component';
import { DicasUtilizacaoComponent } from './dicas-utilizacao/dicas-utilizacao.component';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { MinhasContribuicoesComponent } from './minhas-contribuicoes/minhas-contribuicoes.component';
import { TodasContribuicoesComponent } from './todas-contribuicoes/todas-contribuicoes.component';

export const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
    { path: 'adicionar-proposta', component: AdicionarPropostaComponent },
    { path: 'contribuicoes-salvas', component: ContribuicoesSalvasComponent },
    { path: 'dicas-utilizacao', component: DicasUtilizacaoComponent },
    { path: 'meu-perfil', component: MeuPerfilComponent },
    { path: 'minhas-contribuicoes', component: MinhasContribuicoesComponent },
    { path: 'todas-contribuicoes', component: TodasContribuicoesComponent },
    { path: '**', redirectTo: '/inicio' }
];