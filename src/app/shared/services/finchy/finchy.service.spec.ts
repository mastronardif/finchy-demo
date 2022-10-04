import { TestBed } from '@angular/core/testing';

import { FinchyService } from './finchy.service';

describe('FinchyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FinchyService = TestBed.get(FinchyService);
    expect(service).toBeTruthy();
  });
});
