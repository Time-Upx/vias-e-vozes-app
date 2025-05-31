import { TestBed } from '@angular/core/testing';

import { ApiService } from './api-usuarios.service';

describe('ApiUsuariosService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
