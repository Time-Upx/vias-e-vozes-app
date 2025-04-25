import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodasContribuicoesComponent } from './todas-contribuicoes.component';

describe('TodasContribuicoesComponent', () => {
  let component: TodasContribuicoesComponent;
  let fixture: ComponentFixture<TodasContribuicoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodasContribuicoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodasContribuicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
