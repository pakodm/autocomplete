import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperAutocompleteComponent } from './helper-autocomplete.component';

describe('HelperAutocompleteComponent', () => {
  let component: HelperAutocompleteComponent;
  let fixture: ComponentFixture<HelperAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelperAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelperAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
