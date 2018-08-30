import { TestBed, inject } from '@angular/core/testing';

import { HelperAutocompleteService } from './helper-autocomplete.service';

describe('HelperAutocompleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HelperAutocompleteService]
    });
  });

  it('should be created', inject([HelperAutocompleteService], (service: HelperAutocompleteService) => {
    expect(service).toBeTruthy();
  }));
});
