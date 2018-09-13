import { TestBed, inject } from '@angular/core/testing';

import { OrderModalService } from './order-modal.service';

describe('OrderModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderModalService]
    });
  });

  it('should be created', inject([OrderModalService], (service: OrderModalService) => {
    expect(service).toBeTruthy();
  }));
});
