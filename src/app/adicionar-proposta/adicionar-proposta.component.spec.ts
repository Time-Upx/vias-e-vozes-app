import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarPropostaComponent } from './adicionar-proposta.component';

describe('AdicionarPropostaComponent', () => {
  let component: AdicionarPropostaComponent;
  let fixture: ComponentFixture<AdicionarPropostaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionarPropostaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
