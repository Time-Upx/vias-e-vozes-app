import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesSalvasComponent } from './contribuicoes-salvas.component';

describe('ContribuicoesSalvasComponent', () => {
  let component: ContribuicoesSalvasComponent;
  let fixture: ComponentFixture<ContribuicoesSalvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContribuicoesSalvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContribuicoesSalvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
