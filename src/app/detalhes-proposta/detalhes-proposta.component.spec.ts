import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesPropostaComponent } from './detalhes-proposta.component';

describe('DetalhesPropostaComponent', () => {
  let component: DetalhesPropostaComponent;
  let fixture: ComponentFixture<DetalhesPropostaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesPropostaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
