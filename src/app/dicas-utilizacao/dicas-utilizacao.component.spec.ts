import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DicasUtilizacaoComponent } from './dicas-utilizacao.component';

describe('DicasUtilizacaoComponent', () => {
  let component: DicasUtilizacaoComponent;
  let fixture: ComponentFixture<DicasUtilizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DicasUtilizacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DicasUtilizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
