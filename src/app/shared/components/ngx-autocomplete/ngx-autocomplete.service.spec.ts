/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NpAutocompleteService } from './np-autocomplete.service';

describe('Service: NpAutocomplete', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NpAutocompleteService]
    });
  });

  it('should ...', inject([NpAutocompleteService], (service: NpAutocompleteService) => {
    expect(service).toBeTruthy();
  }));
});
